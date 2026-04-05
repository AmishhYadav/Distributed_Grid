/**
 * NodeInfoPanel — Left sidebar replacing NodeDetailPanel
 */
import { memo } from 'react';

function NodeInfoPanel({ node, transactions, onClose }) {
  if (!node) {
      return (
          <div className="node-info-panel">
               <div className="nip-placeholder">
                  <div className="nip-placeholder-icon">⬡</div>
                  <div className="nip-placeholder-text">Select a node on the locality map to view real-time diagnostics and ML state.</div>
               </div>
          </div>
      );
  }

  const nodeTxns = (transactions || []).filter(
    tx => tx.from === node.id || tx.to === node.id
  );

  const formatKW = (val) => Number(val).toFixed(2);
  const strokeDash = 200; // rough circumference
  const strokeOffset = strokeDash - (node.soc / 100) * strokeDash;

  return (
    <div className="node-info-panel">
      <div className="nip-header">
        <span className="nip-title">Node {node.id}</span>
        <button className="nip-close" onClick={onClose}>×</button>
      </div>

      <div className="nip-section">
        <span className="nip-label">Energy Storage</span>
        <div className="battery-ring-wrap">
          <svg width="100" height="100" viewBox="0 0 80 80" className="battery-ring-svg">
             <circle cx="40" cy="40" r="32" className="battery-ring-track" strokeWidth="6" />
             <circle 
                cx="40" cy="40" r="32" 
                className="battery-ring-fill" 
                strokeWidth="6" 
                stroke="url(#batGrad)"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 40 40)" 
             />
             <defs>
                 <linearGradient id="batGrad" x1="0" y1="1" x2="1" y2="0">
                     <stop offset="0%" stopColor="var(--accent-green)" />
                     <stop offset="100%" stopColor="var(--accent-cyan)" />
                 </linearGradient>
             </defs>
             <text x="40" y="36" className="battery-ring-text-val">{node.soc.toFixed(0)}%</text>
             <text x="40" y="52" className="battery-ring-text-lbl">Charge</text>
          </svg>
          <div className="battery-kWh">{node.charge.toFixed(2)} / {node.capacity} kWh</div>
        </div>
      </div>

      <div className="nip-section">
        <span className="nip-label">Live Diagnostics</span>
        <div className="nip-stats-grid">
            <div className="nip-stat">
                <span className="nip-stat-lbl">Generation</span>
                <span className="nip-stat-val">☀ {formatKW(node.generation)} kW</span>
            </div>
            <div className="nip-stat">
                <span className="nip-stat-lbl">Demand</span>
                <span className="nip-stat-val">⚡ {formatKW(node.demand)} kW</span>
            </div>
            <div className="nip-stat">
                <span className="nip-stat-lbl">Net Flux</span>
                <span className={`nip-stat-val ${node.net > 0 ? 'positive' : 'negative'}`}>
                    {node.net > 0 ? '+' : ''}{formatKW(node.net)} kW
                </span>
            </div>
            <div className="nip-stat">
                <span className="nip-stat-lbl">Status</span>
                <span className={`nip-stat-val ${node.soc < 15 ? 'negative' : 'positive'}`}>
                    {node.soc < 15 ? 'Critical' : 'Stable'}
                </span>
            </div>
        </div>
      </div>

      <div className="nip-section">
        <span className="nip-label">Machine Learning</span>
        <div className="ml-status-row">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Random Forest</span>
            <span className={`ml-badge ${node.has_model ? 'trained' : 'untrained'}`}>
                {node.has_model ? 'Active' : 'Pending'}
            </span>
        </div>
        {node.has_model && (
            <div className="ml-prediction-bar-wrap">
                <div className="ml-pred-label">
                    <span>Next Tick Demand Forecast</span>
                    <span className="ml-pred-val">{formatKW(node.prediction)} kW</span>
                </div>
            </div>
        )}
      </div>

      <div className="nip-section" style={{ borderBottom: 'none', flex: 1 }}>
        <span className="nip-label">Network Activity</span>
        {node.blackouts > 0 && (
            <div className="nip-blackout" style={{marginBottom: '0.75rem'}}>
                ⚠ Grid Failure: {node.blackouts} recorded
            </div>
        )}
        <div className="nip-txn-list">
             {nodeTxns.length > 0 ? (
                 nodeTxns.slice(-5).map((tx, i) => {
                     const isSent = tx.from === node.id;
                     return (
                         <div key={i} className={`nip-txn ${isSent ? 'sent' : 'received'}`}>
                             <span className="txn-icon">{isSent ? '↑' : '↓'}</span>
                             <span>{isSent ? `To ${tx.to}` : `From ${tx.from}`}</span>
                             <span style={{marginLeft: 'auto'}}>{tx.kWh.toFixed(2)} kWh</span>
                         </div>
                     );
                 })
             ) : (
                 <div className="nip-txn-empty">No recent peer transactions</div>
             )}
        </div>
      </div>

    </div>
  );
}

export default memo(NodeInfoPanel);
