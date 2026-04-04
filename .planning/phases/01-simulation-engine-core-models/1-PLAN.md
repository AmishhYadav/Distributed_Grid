---
wave: 1
depends_on: []
files_modified: ["src/engine.py"]
autonomous: true
---

# 1. Core Simulation Engine

## Objective
Establish the backend environment and the global fast-forward clock.

## Tasks

### 1.1 Create Engine Loop
<read_first>None</read_first>
<action>
Create `src/engine.py`.
Implement an `Engine` class.
It should have a `run` method that loops infinitely, increments a logical `current_time` by a defined `time_step_hours` (e.g. 1 hour), and sleeps for a configurable `tick_rate_seconds` (e.g. 1 real second).
Print the logical time tick to the console.
</action>
<acceptance_criteria>
- `python src/engine.py` runs and outputs sequential time ticks to stdout.
</acceptance_criteria>
