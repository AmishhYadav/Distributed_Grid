import { useState, useCallback, useEffect, useRef } from 'react';
import { useSimulation } from './hooks/useSimulation';
import LandingPage from './pages/LandingPage';
import LocalityMap from './components/LocalityMap';
import './App.css';

function App() {
  const [view, setView] = useState('landing');
  const { data, isConnected, history, sendCommand } = useSimulation();
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const lastTickRef = useRef(0);

  // Accumulate transactions into a persistent history
  useEffect(() => {
    if (data && data.tick !== lastTickRef.current) {
      lastTickRef.current = data.tick;
      if (data.transactions && data.transactions.length > 0) {
        setAllTransactions(prev => {
          const next = [...data.transactions.map(tx => ({ ...tx, tick: data.tick, id: Math.random().toString(36).substr(2, 9) })), ...prev];
          return next.slice(0, 50); // Keep last 50 transactions
        });
      }
    }
  }, [data]);

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
  
  // Custom colors mapped from stitch for isolation:
  // primary: #006d36
  // secondary: #00668a
  // surface: #f7f9fb
  // on-surface: #191c1e

  return (
    <div className="min-h-screen overflow-hidden flex flex-col font-body bg-[#f7f9fb] text-[#191c1e]">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img className="w-full h-full object-cover brightness-105 scale-105 blur-[2px]" alt="Modern home interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbrrPIJg_RRJRddlIecMXulHdfYXLScvhJuVGpul6_zvAMMkThSfgilmtkZPKCfaCym0EJqaieL5rpOhVzZiFFQoxsP6nYMp8BBRY-n4D1a1OusmSvL2aUnbuKGUwylG0mF1P_NxiMc2tyDk6gOCwyBNhsAY_2ZOitKydmZ--3cvDQc05WoWhZPbgAUpaxMjXEPxjbriyL1G-74Em0_E0UbZjdy89_KaAN9CEz45TQa9WxzXTIxTjKvNoUxCHJs9mUtzUAv_YE50Z0"/>
        <div className="absolute inset-0 bg-white/20"></div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-3xl shadow-sm tracking-tight font-semibold">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white" style={{cursor: 'pointer'}} onClick={() => setView('landing')}>GridMind Eco</span>
          <div className="hidden md:flex gap-6 items-center">
            <a className="text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 hover:text-emerald-500 transition-colors" href="#">Dashboard</a>
            <a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#">Analytics</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-zinc-500 flex items-center gap-2 mr-4">
               Tick {data.tick} • {data.time?.split('T')[1]?.slice(0, 5) || data.time}
          </div>
          <span className="text-zinc-500 hover:text-emerald-500 transition-colors font-bold text-sm">Solar: {(data.env_solar * 100).toFixed(0)}%</span>
          <span className="text-zinc-500 hover:text-emerald-500 transition-colors font-bold text-sm">Demand: {(data.env_demand * 100).toFixed(0)}%</span>
          
          <div className="w-10 h-10 rounded-full bg-[#e6e8ea] overflow-hidden border-2 border-white ml-2">
            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmQ6BVNsz8-iMJJwaMkWNagQ2-ptD4SUdrf_jJdmsfR7TOnUGI-n3PVjCOS8a_V3UNCGo0An-ayj8cO3F1AOCXsPOHCRvxQPSM7uGx3q7JasDqiUFQ2MclfDYMAprmyb_mdFp1tdJ29-i15LhIA50huIeU6ZUbKBJcSYNOYTwrfmJ-DZGqGnYEC7HG52VO2PFIBNbUf7KyFXZWDk-MjgmLNkv4mb0775bLRZ-7HfJEky1a-ZKbexrDEURh2qmDId-piEGeStPq4WRY"/>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative z-10 pt-24 px-6 pb-6 flex gap-6 h-full overflow-hidden">
        {/* SideNavBar / Dashboard Controls */}
        <aside className="h-full w-64 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-lg flex flex-col p-4 gap-2 shadow-xl shadow-zinc-200/50">
          <div className="mb-6 px-2">
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">Smart Network</h2>
            <p className="text-xs text-emerald-600 font-bold">{data.paused ? 'Paused' : 'Active Negotiation'}</p>
          </div>
          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer">
              <span>Overview</span>
            </div>
            <div onClick={togglePause} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 px-4 py-3 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all cursor-pointer">
              <span>{data.paused ? 'Resume Engine' : 'Pause Engine'}</span>
            </div>
            <div onClick={handleCloudShock} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 px-4 py-3 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all cursor-pointer">
              <span>Simulate Cloud Cover</span>
            </div>
          </nav>
          <div className="mt-auto pt-6">
            <button onClick={() => handleSetSpeed(data.speed === 1 ? 2 : 1)} className="w-full bg-gradient-to-br from-[#006d36] to-[#4ade80] text-white py-4 px-6 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[0.98] transition-transform">
                {data.speed > 1 ? 'Normal Speed' : 'Fast Forward'}
            </button>
          </div>
        </aside>

        {/* Main View (Map) */}
        <main className="flex-1 relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl border border-white/30">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-80" alt="Neighborhood" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPwrcAOgGXLgDMmWbwYO439k-Gjv5lk61omYKULET_qYrr1g2IQ8xrc1uUrV870ctFQpjD0xSI3xF_3Bup98kqVme0RNMAAqGBbTYFtsYCyPWC29pRqRlSEQwJzzx4ueAr8pHAhhlmK7O82gnSLir4IvDPXh2kuSWWb9lktjvu_DQTUygRH5IDwj5ssWCKWs9XO1DmMHqiMJ3Q1anrliAtc4JSkTt1SYMAu8EvwXwjwaHOupDeKlDWDxWiax3E-SQfWybe883kwpdt"/>
            
            {/* The refactored LocalityMap SVG Layer */}
            <LocalityMap 
              nodes={data.nodes} 
              transactions={transactions} 
              onNodeClick={handleNodeClick} 
              selectedNodeId={selectedNodeId} 
            />
          </div>

          {/* Overlay Header */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Neighborhood Grid</h1>
              <p className="text-zinc-600 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active P2P Trading: {data.nodes?.length || 0} Households
              </p>
            </div>
            <div className="flex gap-2 pointer-events-auto">
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white">
                <span className="text-sm font-bold text-zinc-800">{data.total_p2p_traded?.toFixed(2) ?? '0.00'} kWh Traded</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panels */}
        <aside className="w-96 flex flex-col gap-6">
          {/* Household Detail Panel */}
          <section className="bg-white/70 backdrop-blur-xl rounded-lg p-6 flex flex-col gap-6 shadow-xl shadow-zinc-200/50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Household Detail</h3>
              {selectedNodeId && (
                <button onClick={handleCloseDetail} className="text-xs font-bold text-zinc-500 hover:text-zinc-800">Close</button>
              )}
            </div>
            {selectedNode ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-600 font-bold text-sm">Solar Generation</span>
                    <span className="text-[#006d36] text-3xl font-extrabold tracking-tighter">{(selectedNode.generation ?? 0).toFixed(2)} <span className="text-lg font-bold">kWh</span></span>
                  </div>
                  <div className="h-3 w-full bg-[#e6e8ea] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006d36] to-[#4ade80] rounded-full" style={{width: `${Math.min(((selectedNode.generation ?? 0)/10)*100, 100)}%`}}></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-600 font-bold text-sm">Consumption</span>
                    <span className="text-[#00668a] text-3xl font-extrabold tracking-tighter">{(selectedNode.demand ?? 0).toFixed(2)} <span className="text-lg font-bold">kWh</span></span>
                  </div>
                  <div className="h-3 w-full bg-[#e6e8ea] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00668a] to-[#40c2fd] rounded-full" style={{width: `${Math.min(((selectedNode.demand ?? 0)/10)*100, 100)}%`}}></div>
                  </div>
                </div>

                <div className="bg-[#006d36]/5 rounded-2xl p-4 border border-[#006d36]/10">
                  <div className="flex items-center gap-3 text-[#006d36] mb-1">
                    <span className="text-xs font-extrabold uppercase">{(selectedNode.net ?? 0) > 0 ? 'Net Surplus' : 'Net Deficit'}</span>
                  </div>
                  <p className="text-2xl font-black text-[#191c1e] tracking-tighter">
                    {(selectedNode.net ?? 0) > 0 ? '+' : ''}{(selectedNode.net ?? 0).toFixed(2)} kWh
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Battery SoC: {(selectedNode.soc ?? 0).toFixed(1)}%</p>
                </div>
              </div>
            ) : (
                <div className="py-8 text-center text-zinc-500 font-medium text-sm">Select a household on the map to view detailed energy metrics.</div>
            )}
          </section>

          {/* Event Log Panel */}
          <section className="bg-white/70 backdrop-blur-xl rounded-lg p-6 flex-1 flex flex-col gap-4 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Transaction Logs</h3>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto pr-2" style={{ maxHeight: '300px' }}>
              {allTransactions.length === 0 && <div className="text-xs text-zinc-400 text-center py-4">No recent transactions.</div>}
              {allTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      #{tx.tick}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">House #{tx.from} &rarr; House #{tx.to}</p>
                      <p className="text-[10px] text-zinc-500">P2P Trade</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">+{tx.kWh.toFixed(2)}kWh</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default App;
