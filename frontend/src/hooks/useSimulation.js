import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://127.0.0.1:8000/ws/stream';
const RECONNECT_DELAY = 2000;

/**
 * Custom hook to manage the WebSocket connection to the simulation backend.
 * Returns the latest tick data and connection status.
 */
export function useSimulation() {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('⚡ WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const snapshot = JSON.parse(event.data);
        setData(snapshot);
        setHistory((prev) => {
          const next = [...prev, snapshot];
          // Keep last 200 ticks in memory for charts
          return next.length > 200 ? next.slice(-200) : next;
        });
      } catch (e) {
        console.error('Failed to parse snapshot:', e);
      }
    };

    ws.onclose = () => {
      console.log('📡 WebSocket disconnected — reconnecting...');
      setIsConnected(false);
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };
  }, []);

  const sendCommand = useCallback((cmd, payload = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ cmd, ...payload }));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { data, isConnected, history, sendCommand };
}
