/**
 * TopologyView — Interactive SVG network topology with animated P2P flow lines
 */
function TopologyView({ nodes, transactions, onNodeClick, selectedNodeId }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="topology-view">
        <div className="topology-empty">Waiting for node data...</div>
      </div>
    );
  }

  const centerX = 250;
  const centerY = 200;
  const radius = 140;

  const positions = nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const getSocColor = (soc) => {
    if (soc > 60) return '#22c55e';
    if (soc > 25) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="topology-view">
      <svg viewBox="0 0 500 400" width="100%" height="100%">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Transaction flow lines (rendered behind nodes) */}
        {(transactions || []).map((tx, i) => {
          const from = positions[tx.from];
          const to = positions[tx.to];
          if (!from || !to) return null;

          const lineWidth = Math.max(1, Math.min(4, tx.kWh * 4));

          return (
            <line
              key={`tx-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#a855f7"
              strokeWidth={lineWidth}
              strokeDasharray="8 4"
              opacity={0.7}
              filter="url(#glow)"
              className="flow-line"
            />
          );
        })}

        {/* Node circles */}
        {nodes.map((node, i) => {
          const pos = positions[i];
          const isSelected = selectedNodeId === node.id;

          return (
            <g key={`node-${node.id}`} className="topology-node">
              {/* Selection ring glow */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  opacity={0.4}
                  className="node-selected"
                />
              )}

              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={24}
                fill={getSocColor(node.soc)}
                stroke={isSelected ? '#3b82f6' : '#1e293b'}
                strokeWidth={isSelected ? 3 : 1}
                cursor="pointer"
                onClick={() => onNodeClick(node.id)}
              />

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f1f5f9"
                fontSize={11}
                fontWeight={600}
                pointerEvents="none"
              >
                N{node.id}
              </text>

              {/* SoC label */}
              <text
                x={pos.x}
                y={pos.y + 38}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={10}
                pointerEvents="none"
              >
                {node.soc.toFixed(0)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default TopologyView;
