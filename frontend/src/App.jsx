import { useState } from 'react';
import { useSimulation } from './hooks/useSimulation';
import SimControls from './components/SimControls';
import TopologyView from './components/TopologyView';
import HistoryChart from './components/HistoryChart';
import './App.css';

function App() {
  const { data, isConnected, history, sendCommand } = useSimulation();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  if (!isConnected) {
    return (
      <div className="connecting">
        <div className="pulse"></div>
        <p>Connecting to simulation engine...</p>
        <p className="hint">Make sure the backend is running: <code>uvicorn backend.server:app</code></p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="connecting">
        <div className="pulse"></div>
        <p>Waiting for first tick...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>⚡ Microgrid Simulation</h1>
        <SimControls
          paused={data.paused}
          speed={data.speed || 1}
          onTogglePause={() => sendCommand(data.paused ? 'resume' : 'pause')}
          onSetSpeed={(mult) => sendCommand('set_speed', { multiplier: mult })}
          onCloudShock={() => sendCommand('cloud_shock')}
        />
        <div className="status">
          <span className={`dot ${data.paused ? 'paused' : 'connected'}`}></span>
          <span>Tick {data.tick} — {data.time}</span>
        </div>
      </header>

      <div className="metrics-bar">
        <div className="metric">
          <span className="label">Solar</span>
          <span className="value">{(data.env_solar * 100).toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="label">Demand</span>
          <span className="value">{(data.env_demand * 100).toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="label">P2P Traded</span>
          <span className="value">{data.total_p2p_traded?.toFixed(2) ?? '0.00'} kWh</span>
        </div>
        <div className="metric">
          <span className="label">Transactions</span>
          <span className="value">{data.transactions?.length ?? 0}</span>
        </div>
      </div>

      <TopologyView
        nodes={data.nodes}
        transactions={data.transactions || []}
        onNodeClick={(id) => setSelectedNodeId(prev => prev === id ? null : id)}
        selectedNodeId={selectedNodeId}
      />

      <HistoryChart history={history} />

      <div className="nodes-grid">
        {data.nodes.map((node) => (
          <div
            key={node.id}
            className={`node-card ${selectedNodeId === node.id ? 'selected' : ''}`}
            onClick={() => setSelectedNodeId(prev => prev === node.id ? null : node.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="node-header">
              <span className="node-name">Node {node.id}</span>
              <span className={`soc-badge ${node.soc > 60 ? 'high' : node.soc > 25 ? 'mid' : 'low'}`}>
                {node.soc.toFixed(0)}%
              </span>
            </div>
            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{ width: `${Math.min(100, node.soc)}%` }}
              ></div>
            </div>
            <div className="node-stats">
              <span>☀ {node.generation.toFixed(2)} kW</span>
              <span>⚡ {node.demand.toFixed(2)} kW</span>
              <span>🔋 {node.charge.toFixed(1)}/{node.capacity} kWh</span>
            </div>
            {node.blackouts > 0 && (
              <div className="blackout-warn">⚠ {node.blackouts} blackout(s)</div>
            )}
          </div>
        ))}
      </div>

      {data.transactions && data.transactions.length > 0 && (
        <div className="transactions">
          <h3>⚡ P2P Transfers</h3>
          {data.transactions.map((tx, i) => (
            <div key={i} className="tx-line">
              Node {tx.from} → Node {tx.to}: {tx.kWh.toFixed(3)} kWh
            </div>
          ))}
        </div>
      )}

      {data.ml_trained && data.ml_trained.length > 0 && (
        <div className="ml-event">
          🧠 ML retrained: {data.ml_trained.map(id => `N${id}`).join(', ')}
        </div>
      )}
    </div>
  );
}

export default App;
