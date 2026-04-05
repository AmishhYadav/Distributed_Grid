/**
 * LocalityMap — SVG neighborhood topology visualization.
 *
 * Houses are placed at organic, non-symmetric positions to feel
 * like a real residential area. The main grid sits in the top-right.
 * Each house shows a battery arc ring, surplus/deficit aura, and
 * subtle idle pulse animation via CSS.
 *
 * Performance: wrapped in React.memo, SVG uses stable key props.
 */
import { memo, useState, useMemo, useCallback } from 'react';
import EnergyLink from './EnergyLink';
import GridNode from './GridNode';

/* ── Organic neighborhood positions (800×520 SVG viewport) ──────
   Arranged like a real residential block — irregular clustering,
   streets implied by spacing, grid node far top-right.          */
const HOUSE_POSITIONS = [
  { x: 180, y: 360 }, // 0 — bottom-left corner house
  { x: 310, y: 300 }, // 1 — center-left (facing the street)
  { x: 165, y: 235 }, // 2 — upper-left house
  { x: 420, y: 360 }, // 3 — bottom-center, across the road
  { x: 520, y: 295 }, // 4 — center-right cluster
  { x: 360, y: 195 }, // 5 — upper-center house
  { x: 255, y: 165 }, // 6 — top-left, back of neighborhood
  { x: 490, y: 185 }, // 7 — top-right house
];

const GRID_POS = { x: 715, y: 80 };

/* ── SOC → color mapping ─────────────────────────────────────── */
function getSocColor(soc) {
  if (soc > 65) return '#00e87a';
  if (soc > 30) return '#ffcc00';
  return '#ff3b6b';
}

/* ── Battery arc (SVG circle stroke trick) ───────────────────── */
function BatteryArc({ cx, cy, r, soc }) {
  const circumference = 2 * Math.PI * r;
  const filled = (soc / 100) * circumference;
  const color = getSocColor(soc);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={3} />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25}
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1), stroke 0.4s' }}
      />
    </>
  );
}

/* ── House icon (drawn in SVG) ───────────────────────────────── */
function HouseIcon({ cx, cy, color }) {
  const hx = cx - 12;
  const hy = cy - 10;
  return (
    <g>
      {/* Roof */}
      <polygon
        points={`${cx},${hy - 10} ${hx - 4},${hy + 2} ${hx + 28},${hy + 2}`}
        fill={color}
        opacity={0.85}
      />
      {/* Chimney */}
      <rect x={hx + 18} y={hy - 14} width={4} height={8} fill={color} opacity={0.6} rx={1} />
      {/* Walls */}
      <rect x={hx} y={hy + 2} width={24} height={16} fill={color} opacity={0.35} rx={2} />
      {/* Door */}
      <rect x={hx + 9} y={hy + 10} width={6} height={8} fill={color} opacity={0.7} rx={1} />
      {/* Window left */}
      <rect x={hx + 2} y={hy + 6} width={5} height={5} fill={color} opacity={0.5} rx={1} />
      {/* Window right */}
      <rect x={hx + 17} y={hy + 6} width={5} height={5} fill={color} opacity={0.5} rx={1} />
    </g>
  );
}

/* ── Single house node ───────────────────────────────────────── */
function HouseNode({ node, pos, isSelected, isHovered, onNodeClick, onHover, onHoverEnd }) {
  const color = getSocColor(node.soc);
  const surplus = node.net > 0;
  const deficit = node.net < 0;

  // Aura color: green if producing, red if consuming more than generating
  const auraColor = surplus ? 'rgba(0,232,122,0.12)' : deficit ? 'rgba(255,59,107,0.1)' : 'transparent';
  const auraOpacity = Math.abs(node.net) > 0.5 ? 1 : 0.5;

  return (
    <g
      className="house-node"
      onClick={() => onNodeClick(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onHoverEnd}
      style={{ cursor: 'pointer' }}
    >
      {/* Aura (surplus/deficit field) */}
      <circle
        cx={pos.x} cy={pos.y} r={42}
        fill={auraColor}
        opacity={auraOpacity}
        style={{ transition: 'fill 0.5s, opacity 0.5s' }}
      />

      {/* Selection pulse ring */}
      {isSelected && (
        <circle
          cx={pos.x} cy={pos.y} r={36}
          fill="none"
          stroke="#00d4ff"
          strokeWidth={1.5}
          opacity={0.7}
          style={{ animation: 'selectionPing 2s ease-out infinite' }}
        />
      )}

      {/* Hover ring */}
      {isHovered && !isSelected && (
        <circle cx={pos.x} cy={pos.y} r={34} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      )}

      {/* Battery arc (outermost visual) */}
      <BatteryArc cx={pos.x} cy={pos.y} r={26} soc={node.soc} />

      {/* Node circle background */}
      <circle
        cx={pos.x} cy={pos.y} r={20}
        fill="#0a1525"
        stroke={isSelected ? '#00d4ff' : isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}
        strokeWidth={isSelected ? 1.5 : 1}
        style={{ transition: 'stroke 0.2s, fill 0.2s' }}
      />

      {/* Idle animation glow when not selected */}
      {!isSelected && (
        <circle
          cx={pos.x} cy={pos.y} r={20}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0}
          style={{ animation: `idleGlow ${2.5 + (node.id % 3) * 0.5}s ease-in-out infinite` }}
        />
      )}

      {/* House icon */}
      <HouseIcon cx={pos.x} cy={pos.y - 2} color={color} />

      {/* Node ID label */}
      <text
        x={pos.x}
        y={pos.y + 38}
        textAnchor="middle"
        fill={isSelected ? '#00d4ff' : '#7b91b5'}
        fontSize={9}
        fontWeight={isSelected ? 700 : 500}
        style={{ fontFamily: 'Space Grotesk, sans-serif', transition: 'fill 0.2s' }}
        pointerEvents="none"
      >
        H{node.id}
      </text>

      {/* SoC % label */}
      <text
        x={pos.x}
        y={pos.y + 48}
        textAnchor="middle"
        fill={color}
        fontSize={8}
        fontWeight={600}
        style={{ fontFamily: 'JetBrains Mono, monospace', transition: 'fill 0.4s' }}
        pointerEvents="none"
      >
        {node.soc.toFixed(0)}%
      </text>

      {/* Blackout warning */}
      {node.blackouts > 0 && (
        <text x={pos.x + 18} y={pos.y - 22} fontSize={10} style={{ animation: 'blink 1s ease-in-out infinite' }}>⚠</text>
      )}
    </g>
  );
}

/* ── LocalityMap (main export) ───────────────────────────────── */
function LocalityMap({ nodes, transactions, selectedNodeId, onNodeClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleHover     = useCallback((id) => setHoveredId(id), []);
  const handleHoverEnd  = useCallback(() => setHoveredId(null), []);

  // Build position lookup by node index (node.id is 0-based int)
  const getPos = useCallback((id) => {
    return HOUSE_POSITIONS[id] ?? { x: 400, y: 260 };
  }, []);

  // Determine which links to highlight (hover or selected)
  const focusId = hoveredId ?? selectedNodeId;

  // Build energy links from transactions
  const links = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.map((tx, i) => {
      const fromPos = getPos(tx.from);
      const toPos   = getPos(tx.to);
      if (!fromPos || !toPos) return null;
      const isHighlighted = focusId === tx.from || focusId === tx.to;
      return (
        <EnergyLink
          key={`link-${i}`}
          fromPos={fromPos}
          toPos={toPos}
          type="share"
          kWh={tx.kWh}
          linkId={i}
          highlighted={isHighlighted || focusId == null}
        />
      );
    }).filter(Boolean);
  }, [transactions, focusId, getPos]);

  // Grid connections: draw dotted line from grid to the lowest-SoC nodes
  const gridLinks = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    const veryLow = nodes.filter(n => n.soc < 15);
    // Only show grid lines for crisis nodes
    return veryLow.slice(0, 2).map((n, i) => {
      const nodePos = getPos(n.id);
      return (
        <EnergyLink
          key={`grid-${i}`}
          fromPos={GRID_POS}
          toPos={nodePos}
          type="grid"
          kWh={1.5}
          linkId={100 + i}
          highlighted={true}
        />
      );
    });
  }, [nodes, getPos]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="locality-map-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Waiting for node data…
        </div>
      </div>
    );
  }

  return (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid meet">
        <defs>
          <style>{`
            @keyframes idleGlow {
              0%, 100% { opacity: 0; r: 20; }
              50%       { opacity: 0.4; r: 24; }
            }
            @keyframes selectionPing {
              0%   { r: 36; opacity: 0.7; }
              100% { r: 50; opacity: 0; }
            }
            @keyframes dashFlow {
              to { stroke-dashoffset: -16; }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0.3; }
            }
            .pointer-events-auto { pointer-events: auto; }
          `}</style>
        </defs>

        {/* Grid node and its connections (rendered first / behind houses) */}
        <GridNode pos={GRID_POS} active={nodes.some(n => n.soc < 15)} />
        {gridLinks}

        {/* Energy links (P2P, behind house nodes) */}
        {links}

        {/* House nodes (need pointer-events to receive clicks) */}
        <g className="pointer-events-auto">
          {nodes.map((node) => {
            const pos = getPos(node.id);
            return (
              <HouseNode
                key={`house-${node.id}`}
                node={node}
                pos={pos}
                isSelected={selectedNodeId === node.id}
                isHovered={hoveredId === node.id}
                onNodeClick={onNodeClick}
                onHover={handleHover}
                onHoverEnd={handleHoverEnd}
              />
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default memo(LocalityMap);
