---
wave: 3
depends_on: ["1-PLAN.md", "2-PLAN.md"]
files_modified: ["src/node.py", "src/engine.py"]
autonomous: true
---

# 3. Node State Memory Agents

## Objective
Create the in-memory python objects representing houses.

## Tasks

### 3.1 Implement Node Class
<read_first>src/engine.py, src/generators.py</read_first>
<action>
Create `src/node.py`.
Implement `Node` class with `battery_capacity, current_charge, base_demand`.
Add a method `update_state(global_time)` which calls `generators.py` to get current solar and demand.
Calculate net energy. Adjust `current_charge` staying bounded within `[0, battery_capacity]`.
Print out "Node {id} battery: {charge}/{capacity}" on each update.
Modify `src/engine.py` so that the main tick loop instantiates 3 node instances directly, and calls `update_state` on them every tick.
</action>
<acceptance_criteria>
- `python src/engine.py` outputs the status of 3 independent nodes updating their battery levels dynamically each tick.
- Battery limits properly enforce max capacity and 0 min bounds.
</acceptance_criteria>
