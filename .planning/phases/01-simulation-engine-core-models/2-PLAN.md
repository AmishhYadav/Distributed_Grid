---
wave: 2
depends_on: ["1-PLAN.md"]
files_modified: ["src/generators.py"]
autonomous: true
---

# 2. Synthetic Data Generators

## Objective
Build functions to generate solar and demand data with stochastic shocks.

## Tasks

### 2.1 Implement Generation Math
<read_first>None</read_first>
<action>
Create `src/generators.py`.
Implement `get_solar_generation(logical_time)` mapping hour of day 0-24 to a sine wave (peak at 12, zero <=6, zero >=18).
Implement `get_base_demand(logical_time)` with logical peaks around 8AM and 7PM.
Add stochastic shock logic: randomly apply a 0.2x multiplier (clouds) to solar output on some ticks, and random spikes (1.5x) to demand.
</action>
<acceptance_criteria>
- `generators.py` bounds solar drops to zero at night naturally.
</acceptance_criteria>
