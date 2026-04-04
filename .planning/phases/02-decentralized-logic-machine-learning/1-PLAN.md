---
wave: 1
depends_on: ["0-PLAN.md"]
files_modified: ["src/node.py", "src/engine.py"]
autonomous: true
---

# 1. Random Forest ML Integration

## Objective
Enable nodes to train an ML model on their history to predict next-tick energy demand.

## Tasks

### 1.1 Implement ML in Node
<read_first>src/node.py, src/engine.py</read_first>
<action>
Modify `src/node.py`:
- Import `RandomForestRegressor` from `sklearn.ensemble` and `numpy as np`.
- Add `self.model = None` and `self.latest_prediction = 0.0`.
- Add a new method `train_model()`. It should parse `self.history`, construct `X` (hour, generation, demand) and `y` (the `net` energy of the *next* tick). If `len(self.history) < 25`, skip training to accumulate data. Otherwise, fit `self.model`.
- Add a method `predict(hour, gen, demand)` returning predicted `net_energy` for the coming tick (or 0.0 if not trained yet).
- Update the `engine.py` run loop to call `node.train_model()` every 24 ticks (once a day).
</action>
<acceptance_criteria>
- `python3 src/engine.py` successfully triggers Random Forest training runs every 24 ticks.
</acceptance_criteria>
