"""
Decentralized Energy Microgrid — Simulation Engine

Central tick loop that drives the entire simulation forward.
Uses a logical fast-forward clock: 1 real second ≈ 1 simulated hour (configurable).
"""

from __future__ import annotations

import time
from datetime import datetime, timedelta

from generators import get_solar_generation, get_base_demand, apply_stochastic_shock
from node import Node


class Engine:
    """Core simulation engine that orchestrates the microgrid tick loop."""

    def __init__(
        self,
        num_nodes: int = 5,
        time_step_hours: float = 1.0,
        tick_rate_seconds: float = 1.0,
        start_time: datetime | None = None,
    ):
        self.time_step = timedelta(hours=time_step_hours)
        self.tick_rate = tick_rate_seconds
        self.current_time = start_time or datetime(2026, 6, 1, 0, 0, 0)
        self.tick_count = 0

        # Instantiate node agents with varied battery capacities
        self.nodes: list[Node] = []
        for i in range(num_nodes):
            capacity = 10.0 + (i * 2.0)        # kWh — range 10‒18
            initial_charge = capacity * 0.5      # start at 50%
            solar_rating = 3.0 + (i * 0.5)      # kW peak — range 3.0‒5.0
            self.nodes.append(
                Node(
                    node_id=i,
                    battery_capacity=capacity,
                    initial_charge=initial_charge,
                    solar_panel_rating=solar_rating,
                )
            )

    # ── Tick ──────────────────────────────────────────────────────────
    def step(self) -> dict:
        """Advance the simulation by one logical time step."""
        self.tick_count += 1
        hour = self.current_time.hour + self.current_time.minute / 60.0

        # Environment data for this tick
        base_solar = get_solar_generation(hour)
        base_demand = get_base_demand(hour)
        solar, demand = apply_stochastic_shock(base_solar, base_demand)

        # Update every node
        node_states = []
        for node in self.nodes:
            state = node.update(solar, demand, self.current_time)
            node_states.append(state)

        snapshot = {
            "tick": self.tick_count,
            "time": self.current_time.isoformat(),
            "hour": round(hour, 2),
            "env_solar": round(solar, 4),
            "env_demand": round(demand, 4),
            "nodes": node_states,
        }

        # Advance logical clock
        self.current_time += self.time_step
        return snapshot

    # ── Main loop ────────────────────────────────────────────────────
    def run(self, max_ticks: int | None = None) -> None:
        """Run the simulation loop until interrupted or max_ticks reached."""
        print(
            f"\n⚡  Microgrid Engine started  "
            f"| {len(self.nodes)} nodes "
            f"| step={self.time_step} "
            f"| pace={self.tick_rate}s/tick\n"
        )
        print(f"{'Tick':>5}  {'Logical Time':>20}  {'Solar':>7}  {'Demand':>7}  │  Node States")
        print("─" * 90)

        try:
            while True:
                snapshot = self.step()

                # Pretty-print one line per tick
                node_summary = "  ".join(
                    f"N{n['id']}:{n['charge']:.1f}/{n['capacity']:.0f}kWh"
                    for n in snapshot["nodes"]
                )
                print(
                    f"{snapshot['tick']:>5}  "
                    f"{snapshot['time']:>20}  "
                    f"{snapshot['env_solar']:>7.3f}  "
                    f"{snapshot['env_demand']:>7.3f}  │  "
                    f"{node_summary}"
                )

                if max_ticks and self.tick_count >= max_ticks:
                    print(f"\n✓ Reached {max_ticks} ticks — stopping.")
                    break

                time.sleep(self.tick_rate)

        except KeyboardInterrupt:
            print(f"\n⏹  Engine stopped after {self.tick_count} ticks.")


# ── Entry point ──────────────────────────────────────────────────────
if __name__ == "__main__":
    engine = Engine(num_nodes=5, time_step_hours=1.0, tick_rate_seconds=0.3)
    engine.run(max_ticks=48)  # simulate 2 days
