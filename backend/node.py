"""
Decentralized Energy Microgrid — Node Agent

Represents a single smart household in the microgrid.
Tracks battery state, solar generation, and demand consumption
with strict energy conservation bounds.

Phase 2: Integrates Random Forest ML for demand prediction
and P2P negotiation readiness.
"""

from __future__ import annotations
from datetime import datetime

import os
import sqlite3
import numpy as np
from sklearn.ensemble import RandomForestRegressor


# Maximum ticks of history to keep for training (rolling window = 7 days)
_MAX_HISTORY_TICKS = 168  # 7 days × 24 hours


class Node:
    """A single household node with solar panel, battery storage, and ML prediction."""

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

        # ── ML components (Phase 2) ──────────────────────────────────
        self.model: RandomForestRegressor | None = None
        self.latest_prediction = 0.0   # predicted net energy for next tick
        self.latest_confidence = 0.0   # ML prediction confidence %
        self.train_count = 0           # how many times the model has been trained

        # ── P2P / resilience stats (Phase 2) ─────────────────────────
        self.blackout_ticks = 0        # ticks spent at 0 charge

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

        # Track blackout ticks
        if self.charge == 0.0:
            self.blackout_ticks += 1

        # Track what was actually stored/drawn (clipped by bounds)
        actual_delta = self.charge - previous_charge

        # Run ML prediction for the next tick (if model trained)
        hour = timestamp.hour + timestamp.minute / 60.0
        self.latest_prediction = self.predict(hour, solar_normalised, demand_normalised)

        state = {
            "id": self.id,
            "time": timestamp.isoformat(),
            "generation": round(self.current_generation, 4),
            "demand": round(self.current_demand, 4),
            "net": round(self.net_energy, 4),
            "charge": round(self.charge, 4),
            "capacity": self.battery_capacity,
            "soc": round(self.charge / self.battery_capacity * 100, 1),
            "actual_delta": round(actual_delta, 4),
            "prediction": round(self.latest_prediction, 4),
            "confidence": self.latest_confidence,
            "blackouts": self.blackout_ticks,
            "train_count": self.train_count,
            "has_model": self.model is not None,
        }
        self.history.append(state)

        # Trim history to rolling window
        if len(self.history) > _MAX_HISTORY_TICKS:
            self.history = self.history[-_MAX_HISTORY_TICKS:]

        return state

    # ── Database Pre-training (Phase 2 enhancement) ──────────────────
    def load_history_from_db(self, db_path: str = "history.db") -> bool:
        """
        Fetch synthetic history from the SQLite database and pre-train the model.
        This provides instant robust predictions on startup without waiting days.
        """
        if not os.path.exists(db_path):
            return False
            
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # We need the last 168 hours (7 days) for a good training baseline
        cursor.execute('''
            SELECT time, hour, solar_norm, demand_norm 
            FROM environment 
            ORDER BY tick DESC 
            LIMIT ?
        ''', (_MAX_HISTORY_TICKS,))
        
        rows = cursor.fetchall()
        conn.close()
        
        if len(rows) < 30:
            return False
            
        # Reverse to chronological order
        rows.reverse()
        
        X = []
        y = []
        
        for i in range(len(rows) - 1):
            curr = rows[i]
            nxt = rows[i+1]
            
            # curr: (time, hour, solar_norm, demand_norm)
            hour = curr[1]
            generation = curr[2] * self.solar_panel_rating
            demand = curr[3] * self.base_demand_kw
            
            X.append([hour, generation, demand])
            
            # next tick's net energy
            next_generation = nxt[2] * self.solar_panel_rating
            next_demand = nxt[3] * self.base_demand_kw
            next_net = next_generation - next_demand
            y.append(next_net)
            
        X_arr = np.array(X)
        y_arr = np.array(y)
        
        self.model = RandomForestRegressor(
            n_estimators=50,
            max_depth=8,
            random_state=self.id,
        )
        self.model.fit(X_arr, y_arr)
        self.train_count += 1
        return True

    # ── ML Training ──────────────────────────────────────────────────
    def train_model(self) -> bool:
        """
        Train RandomForest on accumulated history.
        Called by the engine every 24 ticks (once per logical day).

        Features (X): hour_of_day, generation, demand
        Target  (y):  net energy of the *next* tick

        Returns True if training succeeded, False if not enough data.
        """
        if len(self.history) < 30:
            return False

        # Build feature matrix and targets
        X = []
        y = []
        for i in range(len(self.history) - 1):
            tick = self.history[i]
            next_tick = self.history[i + 1]

            # Parse hour from ISO timestamp
            hour = float(tick["time"].split("T")[1].split(":")[0])

            X.append([hour, tick["generation"], tick["demand"]])
            y.append(next_tick["net"])

        X_arr = np.array(X)
        y_arr = np.array(y)

        self.model = RandomForestRegressor(
            n_estimators=50,
            max_depth=8,
            random_state=self.id,  # per-node determinism
        )
        self.model.fit(X_arr, y_arr)
        self.train_count += 1
        return True

    # ── ML Prediction ────────────────────────────────────────────────
    def predict(self, hour: float, solar_norm: float, demand_norm: float) -> float:
        """Predict net energy for the next tick. Returns 0.0 if untrained."""
        if self.model is None:
            self.latest_confidence = 0.0
            return 0.0
            
        features = np.array([[hour, solar_norm * self.solar_panel_rating,
                               demand_norm * self.base_demand_kw]])
                               
        # Calculate standard deviation (disagreement) across all trees in the forest
        tree_preds = [tree.predict(features)[0] for tree in self.model.estimators_]
        std_dev = np.std(tree_preds)
        
        # Normalize the standard deviation to a 0-100 scale.
        # A variance of 0 means perfect agreement (100% confidence).
        # We clamp lower bound so massive std dev equals 0% conf.
        conf = max(0.0, min(100.0, 100.0 - (std_dev * 100.0)))
        self.latest_confidence = round(conf, 1)
        
        return float(self.model.predict(features)[0])

    # ── P2P Charge Adjustment ────────────────────────────────────────
    def adjust_charge(self, delta: float) -> float:
        """
        Add or remove energy from this node's battery (from P2P transfer).
        Returns the actual amount transferred (may be clipped by bounds).
        """
        previous = self.charge
        self.charge = max(0.0, min(self.battery_capacity, self.charge + delta))
        return self.charge - previous

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
            f"soc={self.soc:.0f}%, "
            f"pred={self.latest_prediction:+.2f})"
        )
