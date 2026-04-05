import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useSimulation from '../hooks/useSimulation'

/* ═══════════════════════════════════════════════════════════
   AetherGrid Simulation Dashboard — "The Living Ledger"
   Eco-modernist editorial design: asymmetric 3-column layout
   with glass panels, tonal layering, and flow-line animations
   ═══════════════════════════════════════════════════════════ */

const HOUSE_NAMES = ['Maple House', 'Oak Villa', 'Pine Crest', 'Cedar Home', 'Birch Manor']
const HOUSE_ICONS = ['house', 'bungalow', 'cottage', 'villa', 'apartment']

// Pentagon positions around center hub (% based)
const NODE_POSITIONS = [
  { top: '10%', left: '50%', translate: '-50% 0' },      // top-center
  { top: '35%', right: '10%' },                           // right-top
  { bottom: '10%', right: '20%' },                        // right-bottom
  { bottom: '10%', left: '20%' },                         // left-bottom
  { top: '35%', left: '10%' },                            // left-top
]

// Line endpoints matching node positions (for SVG paths)
const NODE_COORDS = [
  { x: 50, y: 15 },
  { x: 85, y: 40 },
  { x: 75, y: 85 },
  { x: 25, y: 85 },
  { x: 15, y: 40 },
]

function getStatusColor(soc) {
  if (soc > 70) return 'var(--sim-emerald)'
  if (soc > 30) return 'var(--sim-amber)'
  return 'var(--sim-error)'
}

function getBorderClass(soc) {
  if (soc > 70) return 'node-border-surplus'
  if (soc > 30) return 'node-border-balanced'
  return 'node-border-critical'
}

function getNetClass(net) {
  return net >= 0 ? 'net-positive' : 'net-negative'
}

function formatTime(isoString) {
  if (!isoString) return '--:--:--'
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function formatNumber(n) {
  if (n == null) return '0'
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export default function SimulationPage() {
  const navigate = useNavigate()
  const { snapshot, connected, transactions, pause, resume, setSpeed, cloudShock } = useSimulation()
  const [selectedNode, setSelectedNode] = useState(null)
  const [currentSpeed, setCurrentSpeed] = useState(1)

  const nodes = snapshot?.nodes || []
  const selectedData = selectedNode !== null ? nodes[selectedNode] : null

  const handleSpeedChange = (spd) => {
    setCurrentSpeed(spd)
    setSpeed(spd)
  }

  const handlePlayPause = () => {
    if (snapshot?.paused) resume()
    else pause()
  }

  // Aggregate metrics
  const totalGen = useMemo(() => nodes.reduce((s, n) => s + (n.generation || 0), 0), [nodes])
  const totalDemand = useMemo(() => nodes.reduce((s, n) => s + (n.demand || 0), 0), [nodes])
  const avgSoc = useMemo(() => nodes.length ? nodes.reduce((s, n) => s + (n.soc || 0), 0) / nodes.length : 0, [nodes])
  const totalBlackouts = useMemo(() => nodes.reduce((s, n) => s + (n.blackouts || 0), 0), [nodes])
  const totalTrains = useMemo(() => nodes.reduce((s, n) => s + (n.train_count || 0), 0), [nodes])

  // Network ML status
  const networkPrediction = useMemo(() => {
    if (!nodes.length) return { text: 'Waiting for data...', action: 'INITIALIZING', confidence: 0 }
    const surplus = nodes.filter(n => n.prediction > 0).length
    const deficit = nodes.filter(n => n.prediction < 0).length
    const modeled = nodes.filter(n => n.has_model).length
    const conf = modeled ? Math.round((modeled / nodes.length) * 100) : 0
    if (surplus > deficit) return { text: 'High efficiency P2P matching detected.', action: 'BALANCED LOAD', confidence: conf }
    if (deficit > surplus) return { text: 'Deficit anticipated — preemptive bidding active.', action: 'DEMAND SURGE', confidence: conf }
    return { text: 'Network equilibrium maintained.', action: 'STABLE GRID', confidence: conf }
  }, [nodes])

  // Grid stability status
  const gridStatus = useMemo(() => {
    if (!nodes.length) return 'WAITING'
    const critical = nodes.filter(n => n.soc < 20).length
    if (critical > 1) return 'CRITICAL'
    if (critical === 1) return 'WARNING'
    return 'STABLE'
  }, [nodes])

  return (
    <div className="sim-root">
      {/* ═══ Top Nav Bar ═══ */}
      <header className="sim-header">
        <div className="sim-header-left">
          <span className="sim-logo" onClick={() => navigate('/')}>AetherGrid</span>
          <div className="sim-live-badge">
            <span className="sim-live-dot">
              <span className="sim-live-ping" />
              <span className="sim-live-core" />
            </span>
            <span className="sim-live-text">Live Simulation</span>
          </div>
          <div className="sim-header-stats">
            <div className="sim-header-stat">
              <span className="sim-stat-label">Sim Time</span>
              <span className="sim-stat-value">{formatTime(snapshot?.time)}</span>
            </div>
            <div className="sim-header-stat">
              <span className="sim-stat-label">Tick Count</span>
              <span className="sim-stat-value">{formatNumber(snapshot?.tick)}</span>
            </div>
          </div>
        </div>
        <div className="sim-header-right">
          {/* Play/Pause + Speed */}
          <div className="sim-controls-group">
            <button className="sim-icon-btn" onClick={handlePlayPause}>
              <span className="material-symbols-outlined">
                {snapshot?.paused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                className={`sim-speed-btn ${currentSpeed === spd ? 'active' : ''}`}
                onClick={() => handleSpeedChange(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>
          {/* Utility icons */}
          <div className="sim-utility-icons">
            <button className="sim-icon-btn"><span className="material-symbols-outlined">speed</span></button>
            <button className="sim-icon-btn"><span className="material-symbols-outlined">schedule</span></button>
            <button className="sim-icon-btn"><span className="material-symbols-outlined">bolt</span></button>
          </div>
          {/* Cloud Shock */}
          <button className="sim-cloud-shock-btn" onClick={cloudShock}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '1rem' }}>bolt</span>
            Cloud Shock
          </button>
        </div>
      </header>

      {/* ═══ Main 3-Column Layout ═══ */}
      <main className="sim-main">

        {/* ── LEFT: Transfer Log ── */}
        <section className="sim-panel-left">
          <div className="sim-log-header">
            <div>
              <h3 className="sim-log-title">Transfer Log</h3>
              <p className="sim-log-subtitle">Real-time ledger updates</p>
            </div>
          </div>

          <div className="sim-log-list">
            {transactions.length === 0 && (
              <div className="sim-log-empty">
                <span className="material-symbols-outlined sim-log-empty-icon">electric_bolt</span>
                <span>Waiting for transfers...</span>
              </div>
            )}
            {transactions.map((tx, i) => (
              <div key={i} className="sim-tx-card">
                <div className="sim-tx-top">
                  <span className="sim-tx-id">#{String(tx.tick || i).padStart(5, '0')}</span>
                  <span className={`sim-tx-badge ${tx.type === 'ml_train' ? 'ml' : 'p2p'}`}>
                    {tx.type === 'ml_train' ? 'ML TRAIN' : 'P2P'}
                  </span>
                </div>
                <div className="sim-tx-body">
                  <div className="sim-tx-nodes">
                    <span className="sim-tx-node-name">
                      {tx.type === 'ml_train' ? 'Grid Hub' : (HOUSE_NAMES[tx.from] || `Node ${tx.from}`)}
                    </span>
                    <span className="material-symbols-outlined sim-tx-arrow">south</span>
                    <span className="sim-tx-node-name">
                      {tx.type === 'ml_train' ? (HOUSE_NAMES[tx.nodeId] || `Node ${tx.nodeId}`) : (HOUSE_NAMES[tx.to] || `Node ${tx.to}`)}
                    </span>
                  </div>
                  <div className="sim-tx-amount">
                    <span className={`sim-tx-kwh ${tx.type === 'ml_train' ? 'ml' : ''}`}>
                      {tx.kWh ? `${tx.kWh.toFixed(2)} kWh` : 'Retrained'}
                    </span>
                    <span className="sim-tx-status">
                      {tx.type === 'ml_train' ? 'Processing' : 'Success'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="sim-log-footer">
            <p className="sim-footer-label">Total P2P Traded</p>
            <div className="sim-footer-value">
              <span className="sim-footer-number">{formatNumber(snapshot?.total_p2p_traded || 0)}</span>
              <span className="sim-footer-unit">kWh</span>
            </div>
            <div className="sim-footer-trend">
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>trending_up</span>
              <span>+{((snapshot?.total_p2p_traded || 0) * 0.01).toFixed(1)}% vs last tick</span>
            </div>
          </div>
        </section>

        {/* ── CENTER: Neighborhood Map ── */}
        <section className="sim-panel-center">
          {/* Background pattern image */}
          <div className="sim-map-bg">
            <img
              alt=""
              className="sim-map-bg-img"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkgfdYpJt4i3h70qnVz3XnT7ptLkAFSJw0P1tTohkyaJsZTasW3mZ3K4OYHAJlb24ndpP1t9BsLr1O7VVsDrUrawfhNZLeFe8_Sk_DST2QLpLLPCfJjkp5oE0woNiE7gBQuruUNR6TEYtexI3wlqWTHvLVaJEWhirhG0LlDXaRdzUdVf9ly15TXpBuHc0gasQEAUwnAb19uyBkPbItFvu07l3qmdDLrcCMsOIdF--oJc3SEy3BArss_jphvB709aUD6h3qXeCvUEGU"
            />
          </div>

          <div className="sim-map-container">
            {/* Central Grid Hub */}
            <div className="sim-hub">
              <div className="sim-hub-circle">
                <span className="material-symbols-outlined sim-hub-icon" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
              <div className="sim-hub-label">
                <span>CENTRAL HUB</span>
              </div>
            </div>

            {/* SVG Flow Lines */}
            <svg className="sim-flow-svg">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#005227', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#80da96', stopOpacity: 0.2 }} />
                </linearGradient>
              </defs>
              {NODE_COORDS.map((nc, i) => (
                <path
                  key={i}
                  className="flow-line"
                  d={`M ${nc.x}% ${nc.y}% L 50% 50%`}
                  fill="none"
                  stroke="url(#flowGrad)"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* House Nodes */}
            {nodes.map((node, i) => {
              const pos = NODE_POSITIONS[i] || {}
              const isSelected = selectedNode === i
              return (
                <div
                  key={node.id}
                  className={`sim-node ${isSelected ? 'selected' : ''}`}
                  style={{ position: 'absolute', ...pos }}
                  onClick={() => setSelectedNode(isSelected ? null : i)}
                >
                  <div className="sim-node-inner">
                    <div className={`sim-node-card ${getBorderClass(node.soc)}`}>
                      <span className="material-symbols-outlined sim-node-icon">{HOUSE_ICONS[i]}</span>
                      {/* Vertical battery gauge */}
                      <div className="sim-node-battery">
                        <div
                          className="sim-node-battery-fill"
                          style={{
                            height: `${node.soc}%`,
                            background: node.soc > 70 ? 'var(--sim-emerald)' : node.soc > 30 ? 'var(--sim-amber)' : 'var(--sim-error)',
                          }}
                        />
                      </div>
                    </div>
                    <span className="sim-node-name">{HOUSE_NAMES[i]}</span>
                    <span className={`sim-node-net ${getNetClass(node.net)}`}>
                      {node.net >= 0 ? '+' : ''}{node.net?.toFixed(1)} kW
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Environmental Indicators */}
          <div className="sim-env-row">
            <div className="sim-env-card">
              <div className="sim-env-icon amber">
                <span className="material-symbols-outlined">light_mode</span>
              </div>
              <div>
                <p className="sim-env-label">Solar Intensity</p>
                <p className="sim-env-value">{((snapshot?.env_solar || 0) * 1000).toFixed(0)} W/m²</p>
              </div>
            </div>
            <div className="sim-env-card">
              <div className="sim-env-icon green">
                <span className="material-symbols-outlined">speed</span>
              </div>
              <div>
                <p className="sim-env-label">Neighborhood Demand</p>
                <p className="sim-env-value">{(totalDemand).toFixed(1)} kW</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT: Neighborhood Overview / Node Detail ── */}
        <section className="sim-panel-right">
          <div className="sim-detail-scroll">
            {/* Header */}
            <div className="sim-detail-header">
              <div>
                <h2 className="sim-detail-title">
                  {selectedData ? HOUSE_NAMES[selectedNode] : 'Neighborhood Overview'}
                </h2>
                <p className="sim-detail-subtitle">
                  {selectedData ? `Node ${selectedData.id} · Individual Metrics` : `Total Nodes: ${nodes.length} Active`}
                </p>
              </div>
              <div className={`sim-status-pill ${gridStatus.toLowerCase()}`}>
                {selectedData ? (selectedData.soc > 70 ? 'SURPLUS' : selectedData.soc > 30 ? 'BALANCED' : 'CRITICAL') : gridStatus}
              </div>
            </div>

            {/* Circular Battery Gauge */}
            <div className="sim-gauge-wrap">
              <div className="sim-gauge-ring">
                <svg className="sim-gauge-svg" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface-container-highest)" strokeWidth="12" />
                  <circle
                    cx="100" cy="100" r="90" fill="none"
                    stroke="var(--primary)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - (selectedData ? selectedData.soc : avgSoc) / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div className="sim-gauge-inner">
                  <span className="material-symbols-outlined sim-gauge-icon">battery_charging_full</span>
                  <span className="sim-gauge-percent">
                    {(selectedData ? selectedData.soc : avgSoc).toFixed(0)}
                    <span className="sim-gauge-pct">%</span>
                  </span>
                  <p className="sim-gauge-label">{selectedData ? 'SoC' : 'Avg. SoC'}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="sim-metrics-grid">
              <div className="sim-metric-card">
                <span className="material-symbols-outlined sim-metric-icon amber">solar_power</span>
                <p className="sim-metric-label">{selectedData ? 'Solar Gen' : 'Total Gen'}</p>
                <p className="sim-metric-value">{(selectedData ? selectedData.generation : totalGen).toFixed(2)} kWh</p>
              </div>
              <div className="sim-metric-card">
                <span className="material-symbols-outlined sim-metric-icon green">bolt</span>
                <p className="sim-metric-label">{selectedData ? 'Demand' : 'Total Demand'}</p>
                <p className="sim-metric-value">{(selectedData ? selectedData.demand : totalDemand).toFixed(2)} kWh</p>
              </div>
            </div>

            {selectedData && (
              <>
                {/* Extra node stats */}
                <div className="sim-metrics-grid" style={{ marginTop: '0.75rem' }}>
                  <div className="sim-metric-card">
                    <span className="material-symbols-outlined sim-metric-icon" style={{ color: selectedData.net >= 0 ? 'var(--sim-emerald)' : 'var(--sim-error)' }}>swap_vert</span>
                    <p className="sim-metric-label">Net Energy</p>
                    <p className="sim-metric-value" style={{ color: selectedData.net >= 0 ? 'var(--sim-emerald)' : 'var(--sim-error)' }}>
                      {selectedData.net >= 0 ? '+' : ''}{selectedData.net?.toFixed(2)} kWh
                    </p>
                  </div>
                  <div className="sim-metric-card">
                    <span className="material-symbols-outlined sim-metric-icon green">battery_horiz_075</span>
                    <p className="sim-metric-label">Charge</p>
                    <p className="sim-metric-value">{selectedData.charge?.toFixed(1)} / {selectedData.capacity} kWh</p>
                  </div>
                </div>
              </>
            )}

            {/* ML Prediction */}
            <div className="sim-ml-card">
              <div className="sim-ml-bg">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div className="sim-ml-content">
                <div className="sim-ml-header">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>psychology</span>
                  <span className="sim-ml-label">{selectedData ? 'Node Prediction' : 'Network Prediction'}</span>
                </div>
                <p className="sim-ml-text">
                  {selectedData
                    ? (selectedData.has_model
                        ? `Next tick forecast: ${selectedData.prediction >= 0 ? '+' : ''}${selectedData.prediction?.toFixed(2)} kWh net energy`
                        : 'Model training pending — collecting historical data...')
                    : networkPrediction.text}
                </p>
                <div className="sim-ml-footer">
                  <span className="sim-ml-action">
                    Action: {selectedData
                      ? (selectedData.prediction >= 0 ? 'PRE-OFFER' : 'PRE-BID')
                      : networkPrediction.action}
                  </span>
                  <span className="sim-ml-conf">
                    {selectedData
                      ? (selectedData.has_model ? `${selectedData.train_count} trains` : 'No model')
                      : `${networkPrediction.confidence}% Confidence`}
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Stats */}
            <div>
              <p className="sim-history-label">Historical Performance</p>
              <div className="sim-history-grid">
                <div className="sim-history-item">
                  <span className="sim-history-value">{selectedData ? selectedData.blackouts : totalBlackouts}</span>
                  <span className="sim-history-key">Blackouts</span>
                </div>
                <div className="sim-history-item">
                  <span className="sim-history-value">{selectedData ? selectedData.train_count : totalTrains}</span>
                  <span className="sim-history-key">ML Trains</span>
                </div>
                <div className="sim-history-item">
                  <span className="sim-history-value optimal">
                    {selectedData ? (selectedData.has_model ? 'ACTIVE' : 'PENDING') : (totalTrains > 0 ? 'OPTIMAL' : 'INIT')}
                  </span>
                  <span className="sim-history-key">Model</span>
                </div>
              </div>
            </div>

            {/* Back to overview button (when node selected) */}
            {selectedData && (
              <button className="sim-back-overview" onClick={() => setSelectedNode(null)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                Back to Overview
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
