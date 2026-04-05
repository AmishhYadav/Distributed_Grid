/**
 * EnergyLink — Animated SVG path between two nodes showing energy flow.
 *
 * Uses SVG animateMotion for smooth particle travel along a quadratic
 * bezier curve. Color-coded by type (share/request/grid).
 * Pure SVG — no external animation libraries.
 */
import { memo } from 'react';

const TYPE_CONFIG = {
  share:   { color: '#00e87a', label: 'P2P Share'   },
  request: { color: '#ff3b6b', label: 'Deficit'     },
  grid:    { color: '#00d4ff', label: 'Grid Supply'  },
};

function EnergyLink({ fromPos, toPos, type = 'share', kWh = 1, linkId, highlighted }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.share;
  const strokeWidth = Math.max(1.2, Math.min(3.5, kWh * 3));
  const opacity = highlighted ? 1 : 0.55;

  // Quadratic bezier control point (perpendicular offset)
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / len;
  const perpY = dx / len;
  const curve = Math.min(40, len * 0.18);
  const cx = (fromPos.x + toPos.x) / 2 + perpX * curve;
  const cy = (fromPos.y + toPos.y) / 2 + perpY * curve;

  const d = `M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${toPos.x} ${toPos.y}`;
  const gradId = `grad-${linkId}`;
  const pathRefId = `path-ref-${linkId}`;

  // Particle durations slightly varied per link for organic feel
  const dur1 = 1.4 + (linkId % 3) * 0.25;
  const dur2 = 1.7 + (linkId % 2) * 0.2;

  return (
    <g opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
          x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
        >
          <stop offset="0%"   stopColor={cfg.color} stopOpacity={0.2} />
          <stop offset="50%"  stopColor={cfg.color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={cfg.color} stopOpacity={0.2} />
        </linearGradient>
        {/* Use a path with id for animateMotion */}
        <path id={pathRefId} d={d} />
      </defs>

      {/* Base glow path */}
      <path
        d={d}
        fill="none"
        stroke={cfg.color}
        strokeWidth={strokeWidth + 3}
        opacity={0.05}
        strokeLinecap="round"
      />

      {/* Main path */}
      <path
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="6 10"
        style={{ animation: `dashFlow 1.5s linear infinite` }}
      />

      {/* Particle 1 */}
      <circle r={2.5} fill={cfg.color} opacity={0.95} className="energy-link-particle">
        <animateMotion dur={`${dur1}s`} repeatCount="indefinite" begin="0s">
          <mpath href={`#${pathRefId}`} />
        </animateMotion>
      </circle>

      {/* Particle 2 (offset start) */}
      <circle r={1.8} fill={cfg.color} opacity={0.7} className="energy-link-particle">
        <animateMotion dur={`${dur2}s`} repeatCount="indefinite" begin={`-${dur2 / 2}s`}>
          <mpath href={`#${pathRefId}`} />
        </animateMotion>
      </circle>
    </g>
  );
}

export default memo(EnergyLink);
