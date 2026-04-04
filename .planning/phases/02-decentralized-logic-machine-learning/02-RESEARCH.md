# Phase 2: Decentralized Logic & Machine Learning - Research

## Technical Approach
**Environment & Dependencies:**
- `scikit-learn` for Random Forest models. Required `pip install scikit-learn`.
- Nodes will need a method to accrue feature datasets (X=Tick data, y=Net Demand Delta) and train the model daily.

**ML Training Implementation (Validation of D-01/D-02):**
- Features (X): `hour_of_day`, `recent_demand`, `recent_solar`.
- Target (y): `expected_net_energy` for the next hour.
- Node logic: Check if `tick_count % 24 == 0` (assuming 1 tick = 1 hour). `node.update` needs a `train_model()` method called every 24 steps by the engine.

**Pub/Sub Router (Validation of D-03/D-04):**
- Create `src/router.py`. A `P2PRouter` class that sits inside the `Engine`.
- Each tick, nodes examine their `current_charge` vs `battery_capacity`. If they predict they will run out of power, they publish `Need(kWh)`. If they are full and wasting solar, they publish `Offer(kWh)`.
- The `P2PRouter.match_bids()` runs: tallies all needs and offers, and redistributes energy proportionally. It then calls `node.adjust_charge(kWh)` to finalize transactions.
- Strict bounds applied so energy is perfectly conserved.

**Deficit Handling (Validation of D-05/D-06):**
- If a node is at 0 charge, `node.blackouts += 1`. We don't crash, we just log it in the dict history.
