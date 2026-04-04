---
wave: 2
depends_on: [1]
files_modified: ["frontend/src/components/TopologyView.jsx", "frontend/src/App.css", "frontend/src/App.jsx"]
autonomous: true
requirements: [WEB-02]
---

# 2. P2P Topology Visualization with Animated Flow Lines

<objective>
Create an interactive SVG-based network topology view showing all nodes in a circular layout. When P2P transactions occur, animated glowing flow lines pulse between trading nodes. WEB-02 requirement: Animate power transfers between nodes based on the output of the negotiation logic. Uses decisions D-03 (Interactive SVG Flow Lines) and D-04 (circular topology with glowing animated SVG paths).
</objective>

## Tasks

### 2.1 Create TopologyView component

<read_first>frontend/src/App.jsx, frontend/src/App.css, .planning/phases/04-dashboard-visualization/04-UI-SPEC.md</read_first>
<action>
Create `frontend/src/components/TopologyView.jsx`:

Props: `{ nodes, transactions, onNodeClick, selectedNodeId }`

1. **Circular layout calculation:**
```javascript
const centerX = 250, centerY = 200, radius = 140;
const positions = nodes.map((node, i) => {
  const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
  return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
});
```

2. **SVG structure** (`viewBox="0 0 500 400"`, width and height 100%):
   - `<defs>` section with:
     - `<filter id="glow">` — `<feGaussianBlur stdDeviation="3" />` + `<feComposite>`
     - `<linearGradient id="flow-gradient">` — `--accent-purple` stops
   - Transaction flow lines (rendered first, behind nodes):
     - For each transaction in `transactions`, draw `<line>` from `positions[tx.from]` to `positions[tx.to]`
     - Stroke: `#a855f7` (accent-purple)
     - Stroke-width: `Math.max(1, Math.min(4, tx.kWh * 4))` (proportional to kWh, clamped 1–4px)
     - `strokeDasharray="8 4"` with CSS animation `flow-dash` applied
     - `filter="url(#glow)"`
     - `opacity="0.7"`
   - Node circles:
     - `<circle>` with `r="24"` at each position
     - Fill: `#22c55e` if soc > 60, `#eab308` if soc > 25, `#ef4444` otherwise
     - Stroke: `#3b82f6` with `strokeWidth="3"` if `selectedNodeId === node.id`, else `#1e293b` with `strokeWidth="1"`
     - `cursor="pointer"` with `onClick={() => onNodeClick(node.id)}`
   - Node labels:
     - `<text>` centered at each position, fill `#f1f5f9`, fontSize 11, fontWeight 600
     - Text content: `N${node.id}`
   - SoC labels:
     - `<text>` below each circle (y + 38), fill `#94a3b8`, fontSize 10
     - Text content: `${node.soc.toFixed(0)}%`

3. Wrap in a container div with `className="topology-view"`.
</action>
<acceptance_criteria>
- File `frontend/src/components/TopologyView.jsx` exists
- `TopologyView.jsx` contains `Math.cos(angle)` for circular layout
- `TopologyView.jsx` contains `<svg` with `viewBox`
- `TopologyView.jsx` contains `<line` for transaction flow lines
- `TopologyView.jsx` contains `<circle` for node rendering
- `TopologyView.jsx` contains `filter="url(#glow)"`
- `TopologyView.jsx` contains `onNodeClick`
- `TopologyView.jsx` contains `strokeDasharray`
</acceptance_criteria>

### 2.2 Add topology CSS animations

<read_first>frontend/src/App.css</read_first>
<action>
Add to `frontend/src/App.css`:

```css
/* ── Topology View ──────────────────────────────────────────────── */

.topology-view {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.topology-view svg {
  width: 100%;
  height: auto;
  max-height: 400px;
}

.topology-view line {
  animation: flow-dash 1.5s linear infinite;
}

@keyframes flow-dash {
  to { stroke-dashoffset: -24; }
}

.topology-view circle {
  transition: stroke 0.3s ease, fill 0.3s ease;
}

.topology-view circle:hover {
  filter: brightness(1.2);
}

.topology-view .node-selected {
  animation: node-ring-pulse 2s ease-in-out infinite;
}

@keyframes node-ring-pulse {
  0%, 100% { stroke-opacity: 1; }
  50% { stroke-opacity: 0.5; }
}

.topology-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
  font-size: 0.9rem;
}
```
</action>
<acceptance_criteria>
- `App.css` contains `.topology-view`
- `App.css` contains `@keyframes flow-dash`
- `App.css` contains `stroke-dashoffset: -24`
- `App.css` contains `@keyframes node-ring-pulse`
</acceptance_criteria>

### 2.3 Integrate TopologyView into App.jsx

<read_first>frontend/src/App.jsx, frontend/src/components/TopologyView.jsx</read_first>
<action>
Modify `frontend/src/App.jsx`:

1. Import: `import TopologyView from './components/TopologyView';`
2. Add state: `const [selectedNodeId, setSelectedNodeId] = useState(null);`
3. Add `import { useState } from 'react';` if not already imported.
4. Insert `<TopologyView>` between the metrics-bar and the nodes-grid:
```jsx
<TopologyView
  nodes={data.nodes}
  transactions={data.transactions || []}
  onNodeClick={(id) => setSelectedNodeId(prev => prev === id ? null : id)}
  selectedNodeId={selectedNodeId}
/>
```
</action>
<acceptance_criteria>
- `App.jsx` contains `import TopologyView from './components/TopologyView'`
- `App.jsx` contains `selectedNodeId`
- `App.jsx` contains `setSelectedNodeId`
- `App.jsx` contains `<TopologyView`
</acceptance_criteria>

## must_haves
- SVG renders all nodes in a circular topology layout
- Active P2P transactions draw animated flow lines between nodes
- Flow line width is proportional to kWh traded
- Nodes are color-coded by SoC level (green/yellow/red)
- Clicking a node selects it (highlighted ring)
