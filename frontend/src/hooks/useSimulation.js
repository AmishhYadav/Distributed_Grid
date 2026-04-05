import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useSimulation — connects to ws://localhost:8000/ws/stream
 * Returns live snapshot data & control functions.
 */
export default function useSimulation() {
  const [snapshot, setSnapshot] = useState(null)
  const [connected, setConnected] = useState(false)
  const [transactions, setTransactions] = useState([])
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket('ws://localhost:8000/ws/stream')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('⚡ WebSocket connected')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setSnapshot(data)

        // Accumulate transaction log (keep last 50)
        if (data.transactions && data.transactions.length > 0) {
          setTransactions((prev) => {
            const withTick = data.transactions.map((tx) => ({
              ...tx,
              tick: data.tick,
              time: data.time,
            }))
            return [...withTick, ...prev].slice(0, 50)
          })
        }

        // Add ML training events to log
        if (data.ml_trained && data.ml_trained.length > 0) {
          setTransactions((prev) => {
            const events = data.ml_trained.map((nodeId) => ({
              type: 'ml_train',
              nodeId,
              tick: data.tick,
              time: data.time,
            }))
            return [...events, ...prev].slice(0, 50)
          })
        }
      } catch (e) {
        console.warn('Failed to parse WS message', e)
      }
    }

    ws.onclose = () => {
      console.log('📡 WebSocket disconnected, retrying...')
      setConnected(false)
      reconnectTimer.current = setTimeout(connect, 2000)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const sendCommand = useCallback((cmd) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd))
    }
  }, [])

  const pause = useCallback(() => sendCommand({ cmd: 'pause' }), [sendCommand])
  const resume = useCallback(() => sendCommand({ cmd: 'resume' }), [sendCommand])
  const setSpeed = useCallback((multiplier) => sendCommand({ cmd: 'set_speed', multiplier }), [sendCommand])
  const cloudShock = useCallback(() => sendCommand({ cmd: 'cloud_shock' }), [sendCommand])

  return {
    snapshot,
    connected,
    transactions,
    pause,
    resume,
    setSpeed,
    cloudShock,
  }
}
