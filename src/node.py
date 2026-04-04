"""
Decentralized Energy Microgrid — Node Agent

Represents a single smart household in the microgrid.
Tracks battery state, solar generation, and demand consumption
with strict energy conservation bounds.
"""

from __future__ import annotations
from datetime import datetime


class Node:
    """A single household node with solar panel and battery storage."""

    def __init__(
        self,
        node_id: int,
        battery_capacity: float,   # kWh
        initial_charge: float,     # kWh
        solar_panel_rating: float, # kW peak
        base_demand_kw: float = 2.0,
    ):
        self.id = node_id
        self.battery_capacity = battery_capacity
        self.charge = initial_charge
        self.solar_panel_rating = solar_panel_rating
        self.base_demand_kw = base_demand_kw

        # Per-tick tracking (updated every step)
        self.current_generation = 0.0  # kWh produced this tick
        self.current_demand = 0.0      # kWh consumed this tick
        self.net_energy = 0.0          # surplus (+) or deficit (-)
        self.history: list[dict] = []

    # ── Core update ──────────────────────────────────────────────────
    def update(
        self,
        solar_normalised: float,
        demand_normalised: float,
        timestamp: datetime,
    ) -> dict:
        """
        Process one simulation tick.

        Args:
            solar_normalised:  0.0–1.0 fraction of peak solar output
            demand_normalised: 0.0–1.0 fraction of peak demand
            timestamp:         current logical time

        Returns:
            dict snapshot of this node's state after the tick
        """
        # Calculate actual kWh for this tick
        self.current_generation = solar_normalised * self.solar_panel_rating
        self.current_demand = demand_normalised * self.base_demand_kw

        # Net energy: positive = surplus, negative = deficit
        self.net_energy = self.current_generation - self.current_demand

        # Update battery with strict bounds [0, capacity]
        previous_charge = self.charge
        self.charge = max(
            0.0,
            min(self.battery_capacity, self.charge + self.net_energy),
        )

        # Track what was actually stored/drawn (clipped by bounds)
        actual_delta = self.charge - previous_charge

        state = {
            "id": self.id,
            "time": timestamp.isoformat(),
            "generation": round(self.current_generation, 4),
            "demand": round(self.current_demand, 4),
            "net": round(self.net_energy, 4),
            "charge": round(self.charge, 4),
            "capacity": self.battery_capacity,
            "soc": round(self.charge / self.battery_capacity * 100, 1),  # State of Charge %
            "actual_delta": round(actual_delta, 4),
        }
        self.history.append(state)
        return state

    # ── Status helpers ───────────────────────────────────────────────
    @property
    def soc(self) -> float:
        """State of Charge as a percentage."""
        return (self.charge / self.battery_capacity) * 100.0

    @property
    def has_surplus(self) -> bool:
        return self.net_energy > 0.0

    @property
    def has_deficit(self) -> bool:
        return self.net_energy < 0.0

    def __repr__(self) -> str:
        return (
            f"Node(id={self.id}, "
            f"charge={self.charge:.1f}/{self.battery_capacity:.0f}kWh, "
            f"soc={self.soc:.0f}%)"
        )
