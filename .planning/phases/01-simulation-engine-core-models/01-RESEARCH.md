# Phase 1: Simulation Engine & Core Models - Research

## Technical Approach
**Environment & Dependencies:**
- Python 3.10+
- `asyncio` for the simulation tick loop (allows rapid logical fast-forward).
- Python's built-in `random` and `math` for stochastic data generation.
- Standard library `dataclass` for node states, ensuring pure Python in-memory representation.

**Clock Logic (Validation of D-01/D-02):**
- A central `Engine` class with a `start(tick_rate_ms=1000)` method. The loop iterates, increments a logical `datetime`, and notifies all registered nodes.
- Using `asyncio.sleep` allows adjusting simulation speed easily without blocking.

**Node Memory (Validation of D-03/D-04):**
- Create a `Node` class. It holds state: `battery_charge`, `battery_capacity`, `current_generation`, `current_demand`.
- State updates are processed each tick based on environmental data.

**Data Generation (Validation of D-05/D-06):**
- Sine wave representing solar generation (peaks at 12:00 logical time, zero at night).
- Basic sinusoidal demand wave (peaks morning and evening).
- Stochastic events: A shock function that randomly applies noise/clouds.

## Validation Architecture
- Testing will be handled via raw execution (e.g. `python src/engine.py`) and visually inspecting terminal logs to ensure ticks behave as expected and node capacities stay within strictly managed bounds.
