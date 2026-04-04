"""
Decentralized Energy Microgrid — Simulation Engine

Central tick loop that drives the entire simulation forward.
Uses a logical fast-forward clock: 1 real second ≈ 1 simulated hour (configurable).

Phase 2: Integrates ML training cadence and P2P negotiation bus.
"""

from __future__ import annotations

import time
from datetime import datetime, timedelta

from generators import get_solar_generation, get_base_demand, apply_stochastic_shock
from node import Node
from router import P2PRouter


# P2P thresholds (State of Charge %)
_BID_SOC_THRESHOLD = 30.0    # nodes below this % request energy
_OFFER_SOC_THRESHOLD = 70.0  # nodes above this % offer energy
_ML_TRAIN_INTERVAL = 24      # ticks between retraining (1 logical day)


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

        # P2P Router
        self.router = P2PRouter()

        # Instantiate node agents with varied battery capacities
        self.nodes: list[Node] = []
        self.node_map: dict[int, Node] = {}
        for i in range(num_nodes):
            capacity = 10.0 + (i * 2.0)        # kWh — range 10‒18
            initial_charge = capacity * 0.5      # start at 50%
            solar_rating = 3.0 + (i * 0.5)      # kW peak — range 3.0‒5.0
            node = Node(
                node_id=i,
                battery_capacity=capacity,
                initial_charge=initial_charge,
                solar_panel_rating=solar_rating,
            )
            self.nodes.append(node)
            self.node_map[i] = node

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

        # ── P2P Negotiation Phase ────────────────────────────────────
        bids = {}
        offers = {}
        for node in self.nodes:
            if node.soc < _BID_SOC_THRESHOLD:
                # Request enough to reach 30% SoC
                need = (0.30 * node.battery_capacity) - node.charge
                if need > 0:
                    bids[node.id] = need
            elif node.soc > _OFFER_SOC_THRESHOLD:
                # Offer excess above 70% SoC
                excess = node.charge - (0.70 * node.battery_capacity)
                if excess > 0:
                    offers[node.id] = excess

        transactions = self.router.match(bids, offers, self.node_map, self.tick_count)

        # ── ML Training (every 24 ticks = 1 logical day) ─────────────
        ml_events = []
        if self.tick_count % _ML_TRAIN_INTERVAL == 0:
            for node in self.nodes:
                trained = node.train_model()
                if trained:
                    ml_events.append(node.id)

        snapshot = {
            "tick": self.tick_count,
            "time": self.current_time.isoformat(),
            "hour": round(hour, 2),
            "env_solar": round(solar, 4),
            "env_demand": round(demand, 4),
            "nodes": node_states,
            "transactions": transactions,
            "ml_trained": ml_events,
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
        print("─" * 100)

        try:
            while True:
                snapshot = self.step()

                # Pretty-print one line per tick
                node_summary = "  ".join(
                    f"N{n['id']}:{n['charge']:.1f}/{n['capacity']:.0f}kWh"
                    for n in snapshot["nodes"]
                )
                line = (
                    f"{snapshot['tick']:>5}  "
                    f"{snapshot['time']:>20}  "
                    f"{snapshot['env_solar']:>7.3f}  "
                    f"{snapshot['env_demand']:>7.3f}  │  "
                    f"{node_summary}"
                )
                print(line)

                # Log P2P transactions
                if snapshot["transactions"]:
                    for tx in snapshot["transactions"]:
                        print(
                            f"       ⚡ P2P: Node {tx['from']} → Node {tx['to']}  "
                            f"{tx['kWh']:.2f} kWh"
                        )

                # Log ML training events
                if snapshot["ml_trained"]:
                    trained_ids = ", ".join(f"N{i}" for i in snapshot["ml_trained"])
                    print(f"       🧠 ML retrained: {trained_ids}")

                if max_ticks and self.tick_count >= max_ticks:
                    self._print_summary()
                    break

                time.sleep(self.tick_rate)

        except KeyboardInterrupt:
            print(f"\n⏹  Engine stopped after {self.tick_count} ticks.")
            self._print_summary()

    # ── Summary ──────────────────────────────────────────────────────
    def _print_summary(self) -> None:
        print(f"\n{'═' * 60}")
        print(f"  SIMULATION SUMMARY — {self.tick_count} ticks")
        print(f"{'═' * 60}")
        for node in self.nodes:
            print(
                f"  Node {node.id}: "
                f"SoC={node.soc:.0f}%  "
                f"Blackouts={node.blackout_ticks}  "
                f"ML trains={node.train_count}  "
                f"Pred={node.latest_prediction:+.2f}"
            )
        print(
            f"\n  Total P2P energy traded: "
            f"{self.router.total_energy_traded:.2f} kWh"
        )
        print(f"  Transaction count: {len(self.router.transaction_log)}")
        print(f"{'═' * 60}\n")


# ── Entry point ──────────────────────────────────────────────────────
if __name__ == "__main__":
    engine = Engine(num_nodes=5, time_step_hours=1.0, tick_rate_seconds=0.1)
    engine.run(max_ticks=72)  # simulate 3 days
