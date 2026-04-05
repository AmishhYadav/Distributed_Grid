import { useState, useCallback } from 'react';
import { useSimulation } from './hooks/useSimulation';
import LandingPage from './pages/LandingPage';
import SimControls from './components/SimControls';
import LocalityMap from './components/LocalityMap';
import ChartsPanel from './components/ChartsPanel';
import NodeInfoPanel from './components/NodeInfoPanel';
import EventLog from './components/EventLog';
import './App.css';

function App() {
  const [view, setView] = useState('landing');
  const { data, isConnected, history, sendCommand } = useSimulation();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // ── Stable callbacks ───────────────────────────────────────────
  const handleLaunch = useCallback(() => {
    setView('simulation');
  }, []);

  const handleTogglePause = useCallback(() => {
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

  // ── View Routing ───────────────────────────────────────────────
  
  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  // Active Simulation View

  if (!isConnected) {
    return (
      <div className="connecting-screen">
        <div className="connecting-logo">Grid<span>Mind</span></div>
        <div className="connecting-spinner"></div>
        <div className="connecting-msg">Connecting to simulation engine...</div>
        <div className="connecting-hint">Verify backend is running: <code>uvicorn backend.server:app</code></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="connecting-screen">
        <div className="connecting-logo">Grid<span>Mind</span></div>
        <div className="connecting-spinner"></div>
        <div className="connecting-msg">Awaiting first data tick...</div>
      </div>
    );
  }

  const togglePause = () => sendCommand(data.paused ? 'resume' : 'pause');
  const selectedNode = data.nodes?.find((n) => n.id === selectedNodeId) || null;
  const transactions = data.transactions || [];

  return (
    <div className="app-sim">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="sim-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div className="sim-logo" onClick={() => setView('landing')} style={{cursor: 'pointer'}}>Grid<span>Mind</span></div>
           <SimControls
             paused={data.paused}
             speed={data.speed || 1}
             onTogglePause={togglePause}
             onSetSpeed={handleSetSpeed}
             onCloudShock={handleCloudShock}
           />
        </div>

        <div className="sim-metrics">
           <div className="sim-metric">
              <span className="sim-metric-val">{(data.env_solar * 100).toFixed(1)}%</span>
              <span className="sim-metric-lbl">Solar</span>
           </div>
           <div className="sim-metric">
              <span className="sim-metric-val">{(data.env_demand * 100).toFixed(1)}%</span>
              <span className="sim-metric-lbl">Demand</span>
           </div>
           <div className="sim-metric">
              <span className="sim-metric-val">{data.total_p2p_traded?.toFixed(2) ?? '0.00'}</span>
              <span className="sim-metric-lbl">kWh Traded</span>
           </div>
        </div>

        <div className="sim-status">
          <span className={`status-dot ${data.paused ? 'paused' : 'live'}`}></span>
          <span>Tick {data.tick} • {data.time?.split('T')[1]?.slice(0, 5) || data.time}</span>
        </div>
      </header>

      {/* ── Main Body ──────────────────────────────────────────── */}
      <div className="sim-body">
        
        {/* Left Panel: Node Info */}
        <NodeInfoPanel 
          node={selectedNode} 
          transactions={transactions} 
          onClose={handleCloseDetail} 
        />

        {/* Center Panel: Map & Event Log */}
        <div className="sim-center">
          <LocalityMap 
            nodes={data.nodes} 
            transactions={transactions} 
            onNodeClick={handleNodeClick} 
            selectedNodeId={selectedNodeId} 
          />
          <EventLog data={data} />
        </div>

        {/* Right Panel: Charts */}
        <ChartsPanel 
          history={history} 
          selectedNode={selectedNode} 
        />

      </div>
    </div>
  );
}

export default App;
