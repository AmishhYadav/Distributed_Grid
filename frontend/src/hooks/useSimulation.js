import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://127.0.0.1:8000/ws/stream';
const RECONNECT_DELAY = 2000;
const CHART_UPDATE_INTERVAL = 3; // Only push to chart history every N ticks

/**
 * Custom hook to manage the WebSocket connection to the simulation backend.
 *
 * Separates live tick data (updated every message) from chart history
 * (batched at a lower cadence) to avoid over-rendering Recharts.
 */
export function useSimulation() {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const pendingHistoryRef = useRef([]);
  const lastChartTick = useRef(0);

  const connect = useCallback(() => {
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

        // Always update live data so metrics / nodes / topology stay current
        setData(snapshot);

        // Accumulate snapshots but only flush to chart state periodically
        pendingHistoryRef.current.push(snapshot);

        if (snapshot.tick - lastChartTick.current >= CHART_UPDATE_INTERVAL) {
          lastChartTick.current = snapshot.tick;
          const pending = pendingHistoryRef.current;
          pendingHistoryRef.current = [];
          setHistory((prev) => {
            const next = [...prev, ...pending];
            return next.length > 200 ? next.slice(-200) : next;
          });
        }
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
