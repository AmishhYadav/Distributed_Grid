# Phase 4: Dashboard & Visualization - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Build premium interactive charts, grid topology visualization, and polished UI to fulfill the high-aesthetic constraints of the project.
</domain>

<decisions>
## Implementation Decisions

### Charting Library
- **D-01:** `recharts` will be used for historical data visualization.
- **D-02:** It integrates natively with React and can be styled via Vanilla CSS to match the dark-mode aesthetic.

### Topology Visualization
- **D-03:** Interactive SVG Flow Lines will be used.
- **D-04:** Nodes will be arranged in a grid/circle topology, and P2P transactions will trigger glowing, animated SVG paths flowing between the `from` and `to` nodes to create a "wow" factor.

### Animations & Polish
- **D-05:** Pure Vanilla CSS will handle micro-animations.
- **D-06:** We will use `transition`, `transform`, and `@keyframes` to animate components (e.g., battery filling, glassmorphism hovers, transaction pulses) instead of heavyweight libraries like Framer Motion.
</decisions>

<specifics>
## Specific Ideas

- The `useSimulation` hook already maintains a `history` array of the last 200 ticks. We will pass this to `recharts` to plot a rolling line chart of `env_solar` vs `env_demand`.
- The Topology view will need SVG coordinate mapping to draw lines between `NodeCard` components.
</specifics>

<canonical_refs>
## Canonical References

No external specs required.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/App.css` already contains foundational variables (`--bg-primary`, `--accent-green`, etc.) that will strictly dictate the premium dark-mode aesthetic.
- `frontend/src/hooks/useSimulation.js` natively exposes the `history` slice needed for charting.
</code_context>

<deferred>
## Deferred Ideas

- Adding fully interactive node controls (e.g., "Manually Trigger Shock") is deferred for potential future features, focusing on visualization first.
</deferred>
