/**
 * NegotiationLog — Terminal-style collapsible log console for P2P events
 *
 * Uses its own internal state (logs[]) and a prevTickRef guard so it
 * only processes genuinely new ticks, not duplicate data snapshots.
 * Wrapped in React.memo.
 */
import { useState, useEffect, useRef, memo } from 'react';

function NegotiationLog({ data }) {
  const [collapsed, setCollapsed] = useState(false);
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
          text: `⚡ N${tx.from}→N${tx.to}: ${tx.kWh.toFixed(3)} kWh transferred`,
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
          text: `🧠 Node ${id} — Random Forest retrained`,
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
            text: `📉 N${node.id} SoC critical: ${node.soc.toFixed(0)}% — requesting energy`,
          });
        }
      });
    }

    if (newEntries.length > 0) {
      setLogs(prev => [...prev, ...newEntries].slice(-50));
    }
  }, [data]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !collapsed) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, collapsed]);

  return (
    <div className={`negotiation-log ${collapsed ? 'collapsed' : ''}`}>
      <div className="log-header" onClick={() => setCollapsed(c => !c)}>
        <span>{collapsed ? '▶' : '▼'} P2P Negotiation Log</span>
        <span className="log-count">{logs.length} events</span>
      </div>
      {!collapsed && (
        <div className="log-entries" ref={scrollRef}>
          {logs.length === 0 ? (
            <div className="log-empty">Waiting for P2P transactions...</div>
          ) : (
            logs.map((entry, i) => (
              <div key={i} className={`log-entry log-${entry.type}`}>
                <span className="log-tick">[{String(entry.tick).padStart(4, '0')}]</span>
                <span className="log-time">{entry.time?.split('T')[1]?.slice(0, 5) || ''}</span>
                <span className="log-text">{entry.text}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default memo(NegotiationLog);
