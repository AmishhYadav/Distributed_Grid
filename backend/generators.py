"""
Decentralized Energy Microgrid — Synthetic Data Generators

Produces realistic solar irradiance and household demand curves
with heavy stochastic shocks for stressing ML and P2P negotiation logic.
"""

import math
import random


# ── Solar Generation ─────────────────────────────────────────────────
def get_solar_generation(hour: float) -> float:
    """
    Return normalised solar output [0.0–1.0] for a given hour of day.

    Models a realistic daily arc:
      • Zero output before 6 AM and after 18 PM
      • Smooth sine-based rise peaking near solar noon (12:00)
      • Small Gaussian jitter on the peak to avoid perfect symmetry
    """
    if hour < 6.0 or hour > 18.0:
        return 0.0

    # Map 6–18 → 0–π for a smooth arc
    phase = (hour - 6.0) / 12.0 * math.pi
    base = math.sin(phase)

    # Slight asymmetry — afternoon is ~5% weaker (thermal derating)
    if hour > 13.0:
        base *= 0.95

    # Minor continuous jitter (±3%)
    jitter = random.gauss(0, 0.03)
    return max(0.0, min(1.0, base + jitter))


# ── Household Demand ────────────────────────────────────────────────
def get_base_demand(hour: float) -> float:
    """
    Return normalised household demand [0.0–1.0] for a given hour of day.

    Models a bimodal pattern:
      • Morning peak  ~07:00–09:00  (breakfast, heating, EV charge)
      • Evening peak  ~18:00–21:00  (cooking, HVAC, entertainment)
      • Overnight baseline ~0.15
    """
    # Overnight baseline
    base = 0.15

    # Morning bump — Gaussian centred at 8 AM, σ=1.2 hours
    morning = 0.55 * math.exp(-((hour - 8.0) ** 2) / (2 * 1.2**2))

    # Evening bump — Gaussian centred at 19:30, σ=1.5 hours
    evening = 0.70 * math.exp(-((hour - 19.5) ** 2) / (2 * 1.5**2))

    # Small midday bump (lunch)
    midday = 0.20 * math.exp(-((hour - 12.5) ** 2) / (2 * 0.8**2))

    demand = base + morning + evening + midday

    # Minor continuous jitter (±4%)
    jitter = random.gauss(0, 0.04)
    return max(0.05, min(1.0, demand + jitter))


# ── Stochastic Shocks ───────────────────────────────────────────────
def apply_stochastic_shock(
    solar: float,
    demand: float,
    cloud_probability: float = 0.08,
    spike_probability: float = 0.05,
) -> tuple[float, float]:
    """
    Inject random environmental shocks into the clean signals.

    • Cloud cover:  ~8% chance per tick — drops solar to 10–30% of base
    • Demand spike: ~5% chance per tick — multiplies demand by 1.4–1.8×
    • Both can trigger independently on the same tick
    """
    shocked_solar = solar
    shocked_demand = demand

    # Cloud cover event
    if random.random() < cloud_probability:
        cloud_factor = random.uniform(0.10, 0.30)
        shocked_solar *= cloud_factor

    # Demand spike event (e.g. multiple appliances turning on)
    if random.random() < spike_probability:
        spike_factor = random.uniform(1.4, 1.8)
        shocked_demand = min(1.0, shocked_demand * spike_factor)

    return max(0.0, shocked_solar), max(0.05, shocked_demand)
