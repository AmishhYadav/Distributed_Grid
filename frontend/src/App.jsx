import { useState, useCallback, useMemo } from 'react';
import { useSimulation } from './hooks/useSimulation';
import SimControls from './components/SimControls';
import TopologyView from './components/TopologyView';
import HistoryChart from './components/HistoryChart';
import NodeDetailPanel from './components/NodeDetailPanel';
import NegotiationLog from './components/NegotiationLog';
import './App.css';

function App() {
  const { data, isConnected, history, sendCommand } = useSimulation();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // ── Stable callbacks (won't change between renders) ────────────
  const handleTogglePause = useCallback(() => {
    // Read data.paused at call-time via the latest sendCommand closure
    sendCommand('toggle_pause_hack');
  }, [sendCommand]);

  const handleSetSpeed = useCallback(
    (mult) => sendCommand('set_speed', { multiplier: mult }),
    [sendCommand],
  );

  const handleCloudShock = useCallback(
    () => sendCommand('cloud_shock'),
    [sendCommand],
  );

  const handleNodeClick = useCallback(
    (id) => setSelectedNodeId((prev) => (prev === id ? null : id)),
    [],
  );

  const handleCloseDetail = useCallback(
    () => setSelectedNodeId(null),
    [],
  );

  // ── Early returns ──────────────────────────────────────────────
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

  // We need the toggle to know current paused state — override with
  // a proper handler now that `data` is available.
  const togglePause = () => sendCommand(data.paused ? 'resume' : 'pause');

  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId) || null;
  const transactions = data.transactions || [];

  return (
    <div className="app">
      <header className="header">
        <h1>⚡ Microgrid Simulation</h1>
        <SimControls
          paused={data.paused}
          speed={data.speed || 1}
          onTogglePause={togglePause}
          onSetSpeed={handleSetSpeed}
          onCloudShock={handleCloudShock}
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
          <span className="value">{transactions.length}</span>
        </div>
      </div>

      <TopologyView
        nodes={data.nodes}
        transactions={transactions}
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNodeId}
      />

      <HistoryChart history={history} />

      <div className="nodes-grid">
        {data.nodes.map((node) => (
          <div
            key={node.id}
            className={`node-card ${selectedNodeId === node.id ? 'selected' : ''}`}
            onClick={() => handleNodeClick(node.id)}
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

      <NegotiationLog data={data} />

      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          transactions={transactions}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default App;
