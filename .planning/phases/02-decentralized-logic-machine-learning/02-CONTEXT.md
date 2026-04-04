# Phase 2: Decentralized Logic & Machine Learning - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Introduce Random Forest ML to each node and implement the decentralized P2P negotiating bus.
</domain>

<decisions>
## Implementation Decisions

### ML Training Cadence
- **D-01:** Nodes use an Online Daily training cadence.
- **D-02:** Nodes keep historical simulation tick data in memory and physically trigger `scikit-learn` Random Forest retraining at the end of every 24-logical-hour cycle.

### P2P Negotiation Protocol
- **D-03:** Simulate P2P via a Pub-Sub Bus.
- **D-04:** Rather than complex individual networking, nodes publish "I need X kWh" or "I have Y kWh surplus" to a central simulated router class that pairs them up transparently in the background during the tick loop.

### Handling Deficits
- **D-05:** Soft-fail Blackouts.
- **D-06:** If a node's battery hits 0 and they receive no peer energy, they log a "Blackout tick" statistic strictly for metric visibility, but continue to participate in the simulation organically without forced shutdown.

### the agent's Discretion
- Scikit-learn RF hyperparameters (depth, estimators).
- The exact deterministic fair-sharing logic of the Pub/Sub broker when matching unequal bids and offers.
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
- `src/engine.py` - Tick loop already exists; P2P negotiation stage and Daily ML training stage will be injected here.
- `src/node.py` - Will need to be upgraded to hold `sklearn` models.
</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>
