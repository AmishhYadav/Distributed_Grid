/**
 * GridNode — Industrial main grid icon positioned at the edge of the locality map.
 * Shows a power tower icon, status indicator, and optional connection animation.
 */
import { memo } from 'react';

function GridNode({ pos, active = false, onClick }) {
  return (
    <g className="grid-node" onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Outer glow ring */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={36}
        fill="none"
        stroke="#00d4ff"
        strokeWidth={1}
        opacity={active ? 0.25 : 0.08}
        style={active ? { animation: 'gridRingPulse 2.5s ease-in-out infinite' } : {}}
      />

      {/* Background circle */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={24}
        fill="#0a1525"
        stroke={active ? '#00d4ff' : 'rgba(255,255,255,0.08)'}
        strokeWidth={active ? 1.5 : 1}
      />

      {/* Power tower / transmission tower SVG icon */}
      <g transform={`translate(${pos.x - 12}, ${pos.y - 13})`}>
        {/* Tower base legs */}
        <line x1={5}  y1={26} x2={12} y2={10} stroke="#7b91b5" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={19} y1={26} x2={12} y2={10} stroke="#7b91b5" strokeWidth={1.5} strokeLinecap="round" />
        {/* Upper section */}
        <line x1={12} y1={10} x2={12} y2={2}  stroke="#7b91b5" strokeWidth={1.5} strokeLinecap="round" />
        {/* Cross arms */}
        <line x1={4}  y1={16} x2={20} y2={16} stroke="#7b91b5" strokeWidth={1.2} strokeLinecap="round" />
        <line x1={6}  y1={8}  x2={18} y2={8}  stroke="#7b91b5" strokeWidth={1.2} strokeLinecap="round" />
        {/* Top crossbar */}
        <line x1={8}  y1={2}  x2={16} y2={2}  stroke="#7b91b5" strokeWidth={1.5} strokeLinecap="round" />
        {/* Insulators / cables */}
        <circle cx={4}  cy={16} r={1.8} fill="#00d4ff" opacity={active ? 0.9 : 0.3} />
        <circle cx={20} cy={16} r={1.8} fill="#00d4ff" opacity={active ? 0.9 : 0.3} />
        <circle cx={6}  cy={8}  r={1.5} fill="#00d4ff" opacity={active ? 0.9 : 0.3} />
        <circle cx={18} cy={8}  r={1.5} fill="#00d4ff" opacity={active ? 0.9 : 0.3} />
        {/* Top tip glow */}
        <circle cx={12} cy={1.5} r={2.5} fill={active ? '#00d4ff' : 'rgba(0,212,255,0.3)'}
          opacity={active ? 1 : 0.5}
          style={active ? { animation: 'gridTipBlink 1.5s ease-in-out infinite' } : {}}
        />
      </g>

      {/* Status dot */}
      <circle
        cx={pos.x + 18}
        cy={pos.y - 18}
        r={4.5}
        fill={active ? '#00e87a' : '#3d5070'}
        stroke={active ? 'rgba(0, 232, 122, 0.3)' : 'none'}
        strokeWidth={3}
        style={active ? { animation: 'blink 2s ease-in-out infinite' } : {}}
      />

      {/* Label */}
      <text
        x={pos.x}
        y={pos.y + 36}
        textAnchor="middle"
        fill="#3d5070"
        fontSize={9}
        fontWeight={600}
        letterSpacing={0.5}
        style={{ fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase' }}
        pointerEvents="none"
      >
        MAIN GRID
      </text>

      <style>{`
        @keyframes gridRingPulse {
          0%, 100% { r: 36; opacity: 0.25; }
          50%       { r: 42; opacity: 0;   }
        }
        @keyframes gridTipBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </g>
  );
}

export default memo(GridNode);
