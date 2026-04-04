import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://127.0.0.1:8000/ws/stream';
const RECONNECT_DELAY = 1000;
const CHART_UPDATE_INTERVAL = 3;

// Tiny logger to send browser errors/logs to our Python backend
function remoteLog(msg) {
  fetch('http://127.0.0.1:8000/remote_log?msg=' + encodeURIComponent(msg)).catch(() => {});
}

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
      remoteLog('CLOSING_EXISTING_WS');
      wsRef.current.close();
      wsRef.current = null;
    }

    remoteLog('CONNECTING_WS');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      remoteLog('WS_OPEN_SUCCESS');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const snapshot = JSON.parse(event.data);
        setData(snapshot);
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
        remoteLog('WS_PARSE_ERROR: ' + e.message);
      }
    };

    ws.onclose = (e) => {
      remoteLog(`WS_CLOSED (code: ${e.code}, reason: ${e.reason || 'none'}, wsRefMatch: ${wsRef.current === ws})`);
      if (wsRef.current !== ws) {
        return;
      }
      setIsConnected(false);
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = (err) => {
      remoteLog('WS_ERROR_EVENT');
    };
  }, []);

  const sendCommand = useCallback((cmd, payload = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ cmd, ...payload }));
    }
  }, []);

  useEffect(() => {
    remoteLog('HOOK_MOUNT');
    connect();
    
    return () => {
      remoteLog('HOOK_UNMOUNT_CLEANUP');
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        const socketToClose = wsRef.current;
        wsRef.current = null;
        socketToClose.close();
      }
    };
  }, [connect]);

  // Trap unhandled React/JS errors
  useEffect(() => {
    const handler = (e) => remoteLog('BROWSER_ERROR: ' + (e.message || e.reason));
    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', handler);
    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', handler);
    };
  }, []);

  return { data, isConnected, history, sendCommand };
}
