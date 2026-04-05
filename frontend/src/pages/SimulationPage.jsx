import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useSimulation from '../hooks/useSimulation'

/* ═══════════════════════════════════════════════════════════
   AetherGrid Simulation Dashboard
   Light eco-modernist theme, residential neighborhood view
   ═══════════════════════════════════════════════════════════ */

const HOUSE_NAMES = ['Maple House', 'Oak Villa', 'Pine Crest', 'Cedar Home', 'Birch Manor']
const HOUSE_ICONS = ['house', 'villa', 'cottage', 'bungalow', 'home']

// Positions of 5 house nodes around a central grid hub (% based)
const NODE_POSITIONS = [
  { top: '12%', left: '20%' },
  { top: '12%', right: '20%' },
  { bottom: '15%', left: '18%' },
  { bottom: '15%', right: '18%' },
  { top: '50%', left: '50%', transform: 'translate(-50%, -120%)' },
]

function getStatusColor(soc) {
  if (soc > 70) return '#006d36'       // surplus → primary green
  if (soc > 30) return '#e9b44c'       // balanced → amber (using on-surface-variant look)
  return '#ba1a1a'                      // deficit → error red
}

function getStatusLabel(soc) {
  if (soc > 70) return 'Surplus'
  if (soc > 30) return 'Balanced'
  return 'Critical'
}

function formatTime(isoString) {
  if (!isoString) return '--:--'
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDate(isoString) {
  if (!isoString) return 'Awaiting connection...'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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

  // SVG connection lines from each node to center
  const centerX = 50
  const centerY = 50

  const nodeCoords = [
    { x: 25, y: 20 }, // top-left
    { x: 75, y: 20 }, // top-right
    { x: 22, y: 78 }, // bottom-left
    { x: 78, y: 78 }, // bottom-right
    { x: 50, y: 38 }, // top-center
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', fontFamily: 'var(--font-body)' }}>
      {/* ── Top Bar ───────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.75rem 2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div
            onClick={() => navigate('/')}
            style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.05em', cursor: 'pointer', color: '#18181b' }}
          >
            AetherGrid
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: connected ? '#4ade80' : '#ba1a1a',
              animation: connected ? 'pulse-glow 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: connected ? '#006d36' : '#ba1a1a' }}>
              {connected ? 'LIVE' : 'CONNECTING...'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Simulation time */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700 }}>
              Simulation Time
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              {formatDate(snapshot?.time)} — {formatTime(snapshot?.time)}
            </div>
          </div>

          {/* Tick badge */}
          <div style={{
            background: 'var(--surface-container-highest)', padding: '0.25rem 0.75rem',
            borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem',
            border: '1px solid var(--outline-variant)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
              Tick {snapshot?.tick || 0}
            </span>
          </div>

          {/* Play/Pause + Speed */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--surface-container-low)', borderRadius: '9999px',
            padding: '0.25rem',
          }}>
            <button
              onClick={handlePlayPause}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem',
                display: 'flex', alignItems: 'center', color: snapshot?.paused ? 'var(--primary)' : 'var(--on-surface-variant)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                {snapshot?.paused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            <div style={{ width: 1, height: 16, background: 'var(--outline-variant)', margin: '0 0.25rem' }} />
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                className={`speed-btn ${currentSpeed === spd ? 'active' : ''}`}
                onClick={() => handleSpeedChange(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Cloud Shock */}
          <button
            onClick={cloudShock}
            style={{
              background: 'var(--error-container)', color: 'var(--on-error-container)',
              border: '1px solid rgba(186,26,26,0.2)',
              padding: '0.5rem 1.25rem', borderRadius: '9999px',
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ Cloud Shock
          </button>

          {/* Back */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              color: 'var(--on-surface-variant)', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_back</span>
            Home
          </button>
        </div>
      </nav>

      {/* ── Main Grid Layout ─────────────────────────────── */}
      <main style={{
        paddingTop: '5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem',
        height: '100vh', display: 'grid',
        gridTemplateColumns: selectedData ? '1fr 2.2fr 1fr' : '1fr 3fr',
        gridTemplateRows: '1fr',
        gap: '1rem', overflow: 'hidden',
      }}>
        {/* ── LEFT COLUMN: Transfer Log ─────────────────── */}
        <div style={{
          background: 'var(--surface-container-lowest)', borderRadius: '1.5rem',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            padding: '1.25rem', borderBottom: '1px solid var(--surface-container-high)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>
              Transfer Log
            </h3>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>swap_horiz</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {transactions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }}>electric_bolt</span>
                Waiting for transfers...
              </div>
            )}
            {transactions.map((tx, i) => (
              <div key={i} className="transfer-log-entry" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem', borderRadius: '0.75rem',
                background: tx.type === 'ml_train' ? 'rgba(244,190,85,0.08)' : 'var(--surface-container-low)',
                borderLeft: `3px solid ${tx.type === 'ml_train' ? '#e9b44c' : 'var(--primary)'}`,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>
                    Tick {tx.tick}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    {tx.type === 'ml_train'
                      ? `🧠 ML: Node ${tx.nodeId} retrained`
                      : `Node ${tx.from} → Node ${tx.to}`}
                  </span>
                </div>
                {tx.kWh && (
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {tx.kWh.toFixed(2)} kWh
                  </span>
                )}
                {tx.type === 'ml_train' && (
                  <span className="material-symbols-outlined" style={{ color: '#e9b44c', fontSize: '1rem' }}>psychology</span>
                )}
              </div>
            ))}
          </div>

          {/* Total traded */}
          <div style={{
            padding: '1.25rem', borderTop: '1px solid var(--surface-container-high)',
            background: 'var(--surface-container-low)',
          }}>
            <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: '0.25rem' }}>
              Total P2P Traded
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.025em' }}>
                {(snapshot?.total_p2p_traded || 0).toFixed(1)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>kWh</span>
            </div>
          </div>
        </div>

        {/* ── CENTER: Neighborhood Map ─────────────────── */}
        <div style={{
          background: 'var(--surface-container-lowest)', borderRadius: '1.5rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'radial-gradient(var(--outline) 1px, transparent 1px)',
            backgroundSize: '30px 30px', pointerEvents: 'none',
          }} />

          {/* SVG Connection Lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 Z" fill="var(--primary)" opacity="0.6" />
              </marker>
            </defs>
            {nodeCoords.map((nc, i) => {
              const nodeData = nodes[i]
              const isActive = nodeData && (nodeData.soc > 70 || nodeData.soc < 30)
              return (
                <line
                  key={i}
                  x1={`${nc.x}%`} y1={`${nc.y}%`}
                  x2={`${centerX}%`} y2={`${centerY + 8}%`}
                  stroke={isActive ? 'var(--primary)' : 'var(--outline-variant)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? '8 4' : '4 4'}
                  opacity={isActive ? 0.7 : 0.25}
                  markerEnd={isActive ? 'url(#arrowGreen)' : undefined}
                  className={isActive ? 'energy-line' : ''}
                />
              )
            })}
          </svg>

          {/* Central Grid Hub */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', zIndex: 10,
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '9999px',
              background: 'var(--surface-container-lowest)',
              border: '2px solid var(--primary-container)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(77,222,128,0.15)',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '2rem', fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span style={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.125rem' }}>Grid Hub</span>
            </div>
          </div>

          {/* House Nodes */}
          {nodes.map((node, i) => {
            const pos = NODE_POSITIONS[i] || {}
            const color = getStatusColor(node.soc)
            const isSelected = selectedNode === i
            return (
              <div
                key={node.id}
                className={`node-house ${isSelected ? 'selected' : ''}`}
                style={{
                  position: 'absolute', ...pos, zIndex: 20,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedNode(isSelected ? null : i)}
              >
                <div style={{
                  width: 90, padding: '0.75rem',
                  background: 'var(--surface-container-lowest)',
                  borderRadius: '1rem',
                  border: `2px solid ${isSelected ? color : 'var(--surface-container-high)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: isSelected
                    ? `0 0 20px ${color}40`
                    : '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <span className="material-symbols-outlined" style={{ color, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                    {HOUSE_ICONS[i]}
                  </span>
                  {/* Battery bar */}
                  <div style={{ width: '100%', height: 4, background: 'var(--surface-container-high)', borderRadius: 4, overflow: 'hidden', marginBottom: '0.25rem' }}>
                    <div className="battery-fill" style={{ height: '100%', width: `${node.soc}%`, background: color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color }}>
                    {node.soc.toFixed(0)}%
                  </span>
                </div>
                {/* Net energy label */}
                <div style={{
                  position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                  background: node.net >= 0 ? 'rgba(0,109,54,0.1)' : 'rgba(186,26,26,0.1)',
                  color: node.net >= 0 ? 'var(--primary)' : 'var(--error)',
                  padding: '0.125rem 0.5rem', borderRadius: '0.375rem',
                  fontSize: '0.625rem', fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  {node.net >= 0 ? '+' : ''}{node.net?.toFixed(2)} kW
                </div>
              </div>
            )
          })}

          {/* Env indicators */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '1rem',
            display: 'flex', gap: '0.75rem', zIndex: 20,
          }}>
            <div style={{
              background: 'var(--surface-container-lowest)', padding: '0.5rem 1rem',
              borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontSize: '0.75rem', fontWeight: 600,
            }}>
              <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
              {((snapshot?.env_solar || 0) * 100).toFixed(0)}%
            </div>
            <div style={{
              background: 'var(--surface-container-lowest)', padding: '0.5rem 1rem',
              borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontSize: '0.75rem', fontWeight: 600,
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>electric_meter</span>
              {((snapshot?.env_demand || 0) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Node Detail ────────────────── */}
        {selectedData && (
          <div style={{
            background: 'var(--surface-container-lowest)', borderRadius: '1.5rem',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            animation: 'fadeInUp 0.3s ease-out',
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem', borderBottom: '1px solid var(--surface-container-high)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: `${getStatusColor(selectedData.soc)}08`,
            }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{HOUSE_NAMES[selectedNode]}</h3>
                <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>
                  Node {selectedData.id}
                </p>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>close</span>
              </button>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
              {/* Battery gauge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                  <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="40" cy="40" r="34" fill="transparent" stroke="var(--surface-container-high)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="transparent"
                      stroke={getStatusColor(selectedData.soc)}
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - selectedData.soc / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedData.soc.toFixed(0)}%</span>
                    <span style={{ fontSize: '0.5625rem', color: 'var(--on-surface-variant)' }}>SoC</span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>Charge</span>
                    <span style={{ fontWeight: 700 }}>{selectedData.charge?.toFixed(1)} kWh</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>Capacity</span>
                    <span style={{ fontWeight: 700 }}>{selectedData.capacity} kWh</span>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem',
                    paddingTop: '0.375rem', borderTop: '1px solid var(--surface-container-high)',
                  }}>
                    <span style={{ fontWeight: 500 }}>Status</span>
                    <span style={{ fontWeight: 700, color: getStatusColor(selectedData.soc) }}>
                      {getStatusLabel(selectedData.soc)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <MetricRow icon="wb_sunny" iconColor="#f59e0b" label="Solar Gen" value={`${selectedData.generation?.toFixed(2)} kW`} />
                <MetricRow icon="power" iconColor="var(--secondary)" label="Demand" value={`${selectedData.demand?.toFixed(2)} kW`} />
                <MetricRow
                  icon="swap_vert" iconColor={selectedData.net >= 0 ? 'var(--primary)' : 'var(--error)'}
                  label="Net Energy"
                  value={`${selectedData.net >= 0 ? '+' : ''}${selectedData.net?.toFixed(2)} kWh`}
                  valueColor={selectedData.net >= 0 ? 'var(--primary)' : 'var(--error)'}
                />
              </div>

              {/* ML section */}
              <div style={{
                background: 'var(--surface-container-low)', padding: '1rem',
                borderRadius: '1rem', borderLeft: '3px solid var(--primary)',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>psychology</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
                    ML Prediction
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {selectedData.has_model
                    ? `Next tick: ${selectedData.prediction >= 0 ? '+' : ''}${selectedData.prediction?.toFixed(2)} kW`
                    : 'Model not yet trained'}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <StatCard label="Blackouts" value={selectedData.blackouts} valueColor={selectedData.blackouts > 0 ? 'var(--error)' : undefined} />
                <StatCard label="ML Trains" value={selectedData.train_count} />
                <StatCard label="Model" value={selectedData.has_model ? 'Active' : 'Pending'} valueColor={selectedData.has_model ? 'var(--primary)' : 'var(--on-surface-variant)'} />
                <StatCard label="Prediction" value={`${selectedData.prediction?.toFixed(2)} kW`} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────── */

function MetricRow({ icon, iconColor, label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem', background: 'var(--surface-container-low)', borderRadius: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: '1.125rem', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{label}</span>
      </div>
      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: valueColor || 'var(--on-surface)' }}>{value}</span>
    </div>
  )
}

function StatCard({ label, value, valueColor }) {
  return (
    <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: '0.75rem' }}>
      <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: valueColor || 'var(--on-surface)' }}>{value}</div>
    </div>
  )
}
