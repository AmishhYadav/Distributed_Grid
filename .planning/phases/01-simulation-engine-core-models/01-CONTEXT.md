# Phase 1: Simulation Engine & Core Models - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the backend environment, global clock, and state logic for synthetic data generation and basic nodes.
</domain>

<decisions>
## Implementation Decisions

### Clock Logic
- **D-01:** Use a logical fast-forward clock where 1 real second simulates a configurable block of simulation time (e.g. 1 hour).
- **D-02:** Allows for rapid ML training and visualizations. 

### State Persistence
- **D-03:** Store simulation and node states strictly in-memory using pure Python objects.
- **D-04:** Do not use databases (SQLite/Postgres) this phase to minimize read/write overhead and maximize speed.

### Data Generation
- **D-05:** Implement realistic daily arcs (e.g. solar peaks mid-day).
- **D-06:** Inject heavy stochastic shocks (sudden cloud cover, usage spikes) into the generated streams to accurately stress the downstream ML models and P2P logic.

### the agent's Discretion
- Python random/noise generation math.
- Internal object structuring for node state memory footprints.

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches
</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Codebase initially mapped as empty).

### Integration Points
- Backend state structures will eventually serve WebSocket endpoints in later phases.
</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>
