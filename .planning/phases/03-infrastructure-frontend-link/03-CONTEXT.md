# Phase 3: Infrastructure & Frontend Link - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Setup WebSockets and establish the React frontend app to consume the ongoing Python simulation loop data.
</domain>

<decisions>
## Implementation Decisions

### Backend Wrapper
- **D-01:** FastAPI will wrap the simulation environment.
- **D-02:** FastAPI's background tasks and native WebSocket endpoints will manage the continuous tick loop without blocking HTTP connections.

### Frontend Architecture
- **D-03:** Vite + React will be the dashboard framework.
- **D-04:** Vanilla CSS will be exclusively used for styling, strictly avoiding Tailwind to maximize fine-grained aesthetic control over the premium dynamic layouts.

### Data Broadcast Protocol
- **D-05:** Full Snapshot Broadcast over WebSockets.
- **D-06:** The frontend will simply react to an entire state dictionary sent per tick, maintaining localized synchrony.
</decisions>

<specifics>
## Specific Ideas

No specific requirements — standard structural scaffolding approach.
</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine.py` - Needs rewriting/refactoring from a `while True` loop to an `asyncio` compatible loop that can yield state updates directly to the FastAPI WebSocket router.
</code_context>

<deferred>
## Deferred Ideas

- Advanced UI data visualization charts (Deferred to Phase 4).
</deferred>
