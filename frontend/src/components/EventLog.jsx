/**
 * EventLog — Terminal-style log console at the bottom
 */
import { useState, useEffect, useRef, memo } from 'react';

function EventLog({ data }) {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);
  const prevTickRef = useRef(null);

  useEffect(() => {
    if (!data || data.tick === prevTickRef.current) return;
    prevTickRef.current = data.tick;

    const newEntries = [];

    // Log P2P transactions
    if (data.transactions && data.transactions.length > 0) {
      data.transactions.forEach(tx => {
        newEntries.push({
          tick: data.tick,
          time: data.time,
          type: 'transfer',
          text: `⚡ P2P: Node ${tx.from} → Node ${tx.to} | ${tx.kWh.toFixed(3)} kWh`,
        });
      });
    }

    // Log ML training events
    if (data.ml_trained && data.ml_trained.length > 0) {
      data.ml_trained.forEach(id => {
        newEntries.push({
          tick: data.tick,
          time: data.time,
          type: 'ml',
          text: `🧠 Node ${id}: Random Forest retrained with latest data`,
        });
      });
    }

    // Log critical SoC events (nodes below 15%)
    if (data.nodes) {
      data.nodes.forEach(node => {
        if (node.soc < 15) {
          newEntries.push({
            tick: data.tick,
            time: data.time,
            type: 'bid',
            text: `📉 Warning: Node ${node.id} SoC critical (${node.soc.toFixed(0)}%)`,
          });
        }
        if (node.blackouts > 0) {
            newEntries.push({
                tick: data.tick,
                time: data.time,
                type: 'critical',
                text: `⚠ CRITICAL: Node ${node.id} experienced a blackout!`,
            });
        }
      });
    }

    if (newEntries.length > 0) {
      setLogs(prev => [...prev, ...newEntries].slice(-100)); // Keep last 100 entries
    }
  }, [data]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="event-log">
      <div className="event-log-header">
        <span className="event-log-title">Live Event Stream</span>
        <span className="event-log-count">{logs.length} Events</span>
      </div>
      <div className="event-log-entries" ref={scrollRef}>
        {logs.length === 0 ? (
          <div className="log-empty">System online. Waiting for network events...</div>
        ) : (
          logs.map((entry, i) => (
            <div key={`${entry.tick}-${i}`} className={`log-entry ${entry.type}`}>
              <span className="log-tick">[{String(entry.tick).padStart(4, '0')}]</span>
              <span className="log-text">{entry.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(EventLog);
