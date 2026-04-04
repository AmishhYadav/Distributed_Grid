---
wave: 2
depends_on: [1]
files_modified: ["frontend/src/components/NegotiationLog.jsx", "frontend/src/App.css", "frontend/src/App.jsx"]
autonomous: true
requirements: [WEB-04]
---

# 5. P2P Negotiation Log Console

<objective>
Create a terminal-style collapsible log console that displays real-time P2P negotiation events. Shows bids, offers, completed transfers, and ML retraining events with color-coded entries. WEB-04 requirement: Display a console or log view of real-time P2P negotiations happening.
</objective>

## Tasks

### 5.1 Create NegotiationLog component

<read_first>frontend/src/App.jsx, frontend/src/App.css, .planning/phases/04-dashboard-visualization/04-UI-SPEC.md</read_first>
<action>
Create `frontend/src/components/NegotiationLog.jsx`:

Props: `{ data, history }`

The component maintains its own `logs` state array (max 50 entries) and appends new log entries each time `data` changes.

```jsx
import { useState, useEffect, useRef } from 'react';

function NegotiationLog({ data, history }) {
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

    // Log notable SoC events (nodes below 15% or above 90%)
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

export default NegotiationLog;
```
</action>
<acceptance_criteria>
- File `frontend/src/components/NegotiationLog.jsx` exists
- `NegotiationLog.jsx` contains `P2P Negotiation Log`
- `NegotiationLog.jsx` contains `log-entry`
- `NegotiationLog.jsx` contains `setCollapsed`
- `NegotiationLog.jsx` contains `slice(-50)` for max 50 entries
- `NegotiationLog.jsx` contains `scrollRef`
- `NegotiationLog.jsx` contains `Waiting for P2P transactions...`
</acceptance_criteria>

### 5.2 Add negotiation log CSS

<read_first>frontend/src/App.css</read_first>
<action>
Add to `frontend/src/App.css`:

```css
/* ── Negotiation Log Console ────────────────────────────────────── */

.negotiation-log {
  background: #050810;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  user-select: none;
  transition: background 0.2s ease;
}

.log-header:hover {
  background: rgba(255,255,255,0.03);
}

.log-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

.log-entries {
  max-height: 200px;
  overflow-y: auto;
  padding: 0 1.25rem 0.75rem;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 0.78rem;
  line-height: 1.6;
}

.log-entries::-webkit-scrollbar {
  width: 4px;
}

.log-entries::-webkit-scrollbar-track {
  background: transparent;
}

.log-entries::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.log-entry {
  display: flex;
  gap: 0.5rem;
  padding: 0.15rem 0;
  color: var(--text-muted);
  animation: log-appear 0.2s ease-out;
}

@keyframes log-appear {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.log-tick {
  color: var(--text-muted);
  opacity: 0.6;
  min-width: 48px;
}

.log-time {
  color: var(--text-muted);
  opacity: 0.5;
  min-width: 40px;
}

.log-transfer .log-text { color: var(--accent-purple); }
.log-ml .log-text { color: var(--accent-blue); }
.log-bid .log-text { color: var(--accent-yellow); }
.log-offer .log-text { color: var(--accent-green); }

.log-empty {
  color: var(--text-muted);
  font-style: italic;
  padding: 1rem 0;
  font-family: 'Inter', sans-serif;
}

.negotiation-log.collapsed .log-entries {
  display: none;
}
```
</action>
<acceptance_criteria>
- `App.css` contains `.negotiation-log`
- `App.css` contains `.log-header`
- `App.css` contains `.log-entries`
- `App.css` contains `@keyframes log-appear`
- `App.css` contains `.log-transfer .log-text`
- `App.css` contains `font-family: 'JetBrains Mono'`
- `App.css` contains `#050810` (dark console background)
</acceptance_criteria>

### 5.3 Integrate NegotiationLog into App.jsx

<read_first>frontend/src/App.jsx</read_first>
<action>
Modify `frontend/src/App.jsx`:

1. Import: `import NegotiationLog from './components/NegotiationLog';`
2. Replace the existing inline transactions display and ml-event div with the NegotiationLog component:
   - Remove the `{data.transactions && data.transactions.length > 0 && (...)}` block
   - Remove the `{data.ml_trained && data.ml_trained.length > 0 && (...)}` block
   - Add `<NegotiationLog data={data} history={history} />` at the bottom of the app layout (after the nodes-grid).
</action>
<acceptance_criteria>
- `App.jsx` contains `import NegotiationLog from './components/NegotiationLog'`
- `App.jsx` contains `<NegotiationLog`
- `App.jsx` does NOT contain the old inline `tx-line` rendering block
- `App.jsx` does NOT contain the old `ml-event` block
</acceptance_criteria>

## must_haves
- Console displays P2P transfers with color coding (purple)
- Console displays ML retraining events (blue)
- Console displays critical SoC bids (yellow)
- Console is collapsible with toggle
- Auto-scrolls to latest entries
- Max 50 entries retained in memory
- Monospace terminal aesthetic matching UI-SPEC
