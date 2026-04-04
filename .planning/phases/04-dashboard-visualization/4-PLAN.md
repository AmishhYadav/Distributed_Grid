---
wave: 2
depends_on: [1]
files_modified: ["frontend/src/components/NodeDetailPanel.jsx", "frontend/src/App.css", "frontend/src/App.jsx"]
autonomous: true
requirements: [WEB-05]
---

# 4. Node Detail Panel — ML Prediction & Per-Node Stats

<objective>
Create a slide-out detail panel that appears when a user clicks on a node (either in the topology view or node cards grid). Shows expanded battery visualization, per-node generation vs demand, ML prediction info (Random Forest training count, latest prediction, model status), and that node's recent transaction history. WEB-05 requirement: View ML training/prediction health for individual nodes upon selection.
</objective>

## Tasks

### 4.1 Backend — Expose ML details in node snapshot

<read_first>backend/node.py, backend/engine.py</read_first>
<action>
Modify `backend/node.py` — in the `update()` method, add more ML-related fields to the returned state dict:

```python
state = {
    # ... existing fields ...
    "prediction": round(self.latest_prediction, 4),
    "blackouts": self.blackout_ticks,
    "train_count": self.train_count,
    "has_model": self.model is not None,
}
```

Add `"train_count"` and `"has_model"` to the returned dict. The `prediction` field already exists.
</action>
<acceptance_criteria>
- `backend/node.py` state dict contains `"train_count": self.train_count`
- `backend/node.py` state dict contains `"has_model": self.model is not None`
</acceptance_criteria>

### 4.2 Create NodeDetailPanel component

<read_first>frontend/src/App.jsx, frontend/src/App.css, .planning/phases/04-dashboard-visualization/04-UI-SPEC.md</read_first>
<action>
Create `frontend/src/components/NodeDetailPanel.jsx`:

Props: `{ node, transactions, history, onClose }`

Where `node` is the selected node's data object from the snapshot, `transactions` is filtered to only this node's transactions, `history` is the full simulation history (for per-node mini chart), and `onClose` closes the panel.

Structure:
```jsx
function NodeDetailPanel({ node, transactions, history, onClose }) {
  if (!node) return null;

  // Filter transactions involving this node
  const nodeTxns = (transactions || []).filter(
    tx => tx.from === node.id || tx.to === node.id
  );

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <h2>Node {node.id} — Details</h2>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>

        {/* Battery Section */}
        <div className="detail-section">
          <span className="detail-label">Battery</span>
          <div className="detail-battery-bar">
            <div className="detail-battery-fill" style={{ width: `${Math.min(100, node.soc)}%` }} />
          </div>
          <div className="detail-battery-stats">
            <span>{node.charge.toFixed(1)} / {node.capacity} kWh</span>
            <span className={`soc-badge ${node.soc > 60 ? 'high' : node.soc > 25 ? 'mid' : 'low'}`}>
              {node.soc.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Generation vs Demand */}
        <div className="detail-section">
          <span className="detail-label">Current Tick</span>
          <div className="detail-stats-row">
            <div className="detail-stat">
              <span className="detail-stat-label">☀ Generation</span>
              <span className="detail-stat-value">{node.generation.toFixed(3)} kW</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">⚡ Demand</span>
              <span className="detail-stat-value">{node.demand.toFixed(3)} kW</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Net</span>
              <span className={`detail-stat-value ${node.net > 0 ? 'positive' : 'negative'}`}>
                {node.net > 0 ? '+' : ''}{node.net.toFixed(3)} kW
              </span>
            </div>
          </div>
        </div>

        {/* ML Prediction Section */}
        <div className="detail-section">
          <span className="detail-label">🧠 Random Forest Model</span>
          {node.has_model ? (
            <div className="ml-details">
              <div className="ml-stat">
                <span>Status</span>
                <span className="ml-trained">Trained</span>
              </div>
              <div className="ml-stat">
                <span>Training Count</span>
                <span>{node.train_count}</span>
              </div>
              <div className="ml-stat">
                <span>Next-Tick Prediction</span>
                <span className={node.prediction > 0 ? 'positive' : 'negative'}>
                  {node.prediction > 0 ? '+' : ''}{node.prediction.toFixed(4)} kW
                </span>
              </div>
            </div>
          ) : (
            <div className="ml-untrained">Model training pending (need 30+ ticks)</div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="detail-section">
          <span className="detail-label">Recent Transactions</span>
          {nodeTxns.length > 0 ? (
            <div className="detail-txns">
              {nodeTxns.slice(-10).map((tx, i) => (
                <div key={i} className="detail-tx">
                  {tx.from === node.id
                    ? `→ Sent ${tx.kWh.toFixed(3)} kWh to Node ${tx.to}`
                    : `← Received ${tx.kWh.toFixed(3)} kWh from Node ${tx.from}`}
                </div>
              ))}
            </div>
          ) : (
            <div className="detail-tx-empty">No recent transactions</div>
          )}
        </div>

        {/* Blackouts */}
        {node.blackouts > 0 && (
          <div className="detail-blackout">
            ⚠ {node.blackouts} blackout(s) recorded
          </div>
        )}
      </div>
    </div>
  );
}
```
</action>
<acceptance_criteria>
- File `frontend/src/components/NodeDetailPanel.jsx` exists
- `NodeDetailPanel.jsx` contains `Node {node.id} — Details`
- `NodeDetailPanel.jsx` contains `Random Forest Model`
- `NodeDetailPanel.jsx` contains `train_count`
- `NodeDetailPanel.jsx` contains `has_model`
- `NodeDetailPanel.jsx` contains `Model training pending`
- `NodeDetailPanel.jsx` contains `prediction`
- `NodeDetailPanel.jsx` contains `onClose`
</acceptance_criteria>

### 4.3 Add detail panel CSS

<read_first>frontend/src/App.css</read_first>
<action>
Add to `frontend/src/App.css`:

```css
/* ── Node Detail Panel ──────────────────────────────────────────── */

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.detail-panel {
  width: 380px;
  max-width: 90vw;
  height: 100vh;
  background: var(--bg-primary);
  border-left: 1px solid var(--border);
  padding: 1.5rem;
  overflow-y: auto;
  transform: translateX(0);
  animation: panel-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes panel-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.detail-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

.detail-close {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.detail-close:hover {
  color: var(--text-primary);
  border-color: var(--accent-red);
}

.detail-section {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.detail-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.detail-battery-bar {
  width: 100%;
  height: 12px;
  background: var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.detail-battery-fill {
  height: 100%;
  background: var(--gradient-battery);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.detail-battery-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.detail-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
}

.detail-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.detail-stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.detail-stat-value.positive { color: var(--accent-green); }
.detail-stat-value.negative { color: var(--accent-red); }

/* ML Details */
.ml-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ml-stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.ml-trained {
  color: var(--accent-green);
  font-weight: 600;
}

.ml-untrained {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-style: italic;
}

.positive { color: var(--accent-green); }
.negative { color: var(--accent-red); }

/* Transaction list */
.detail-txns {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-tx {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 0.3rem 0;
  font-variant-numeric: tabular-nums;
}

.detail-tx-empty {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.detail-blackout {
  color: var(--accent-red);
  font-weight: 600;
  font-size: 0.85rem;
  margin-top: 1rem;
}
```
</action>
<acceptance_criteria>
- `App.css` contains `.detail-overlay`
- `App.css` contains `.detail-panel`
- `App.css` contains `@keyframes panel-slide-in`
- `App.css` contains `.ml-details`
- `App.css` contains `.ml-untrained`
- `App.css` contains `.detail-battery-fill`
</acceptance_criteria>

### 4.4 Integrate NodeDetailPanel into App.jsx

<read_first>frontend/src/App.jsx</read_first>
<action>
Modify `frontend/src/App.jsx`:

1. Import: `import NodeDetailPanel from './components/NodeDetailPanel';`
2. Get the selected node: `const selectedNode = selectedNodeId !== null ? data.nodes.find(n => n.id === selectedNodeId) : null;`
3. Add panel at the end of the component (before closing `</div>`):
```jsx
{selectedNode && (
  <NodeDetailPanel
    node={selectedNode}
    transactions={data.transactions || []}
    history={history}
    onClose={() => setSelectedNodeId(null)}
  />
)}
```
4. Make node cards in the grid also clickable — add `onClick={() => setSelectedNodeId(node.id)}` and `style={{ cursor: 'pointer' }}` to each `.node-card` div.
</action>
<acceptance_criteria>
- `App.jsx` contains `import NodeDetailPanel from './components/NodeDetailPanel'`
- `App.jsx` contains `<NodeDetailPanel`
- `App.jsx` contains `selectedNode`
- `App.jsx` contains `setSelectedNodeId(node.id)` in the node-card onClick
</acceptance_criteria>

## must_haves
- Clicking a node opens a slide-out detail panel
- Panel shows battery charge, generation, demand, and net energy
- Panel displays ML model status: trained/untrained, training count, latest prediction
- Panel lists recent P2P transactions for that node
- Panel closes on clicking overlay or × button
