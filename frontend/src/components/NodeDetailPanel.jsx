/**
 * NodeDetailPanel — Slide-out panel for per-node ML prediction & stats
 */
function NodeDetailPanel({ node, transactions, onClose }) {
  if (!node) return null;

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
            <div
              className="detail-battery-fill"
              style={{ width: `${Math.min(100, node.soc)}%` }}
            />
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

export default NodeDetailPanel;
