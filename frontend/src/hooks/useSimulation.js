import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://127.0.0.1:8000/ws/stream';
const RECONNECT_DELAY = 2000;
const CHART_UPDATE_INTERVAL = 3; // Only push to chart history every N ticks

/**
 * Custom hook to manage the WebSocket connection to the simulation backend.
 *
 * Key design decisions:
 *  - `mountedRef` prevents the onclose handler from scheduling reconnects
 *    after React StrictMode cleanup (which would create an infinite loop).
 *  - Chart history is throttled to every CHART_UPDATE_INTERVAL ticks to
 *    avoid re-rendering Recharts on every WebSocket message.
 */
export function useSimulation() {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const mountedRef = useRef(false);
  const pendingHistoryRef = useRef([]);
  const lastChartTick = useRef(0);

  const connect = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
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
      console.log('📡 WebSocket disconnected');
      setIsConnected(false);
      // Only auto-reconnect if the component is still mounted.
      // Without this guard, React StrictMode cleanup triggers onclose
      // which schedules a reconnect that outlives the cleanup, creating
      // an infinite connect → close → reconnect loop.
      if (mountedRef.current) {
        console.log('  ↻ Scheduling reconnect...');
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      }
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
    mountedRef.current = true;
    connect();
    return () => {
      // Mark unmounted BEFORE closing so onclose won't schedule a reconnect
      mountedRef.current = false;
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { data, isConnected, history, sendCommand };
}
