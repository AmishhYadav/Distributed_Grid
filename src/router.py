"""
Decentralized Energy Microgrid — P2P Pub-Sub Router

Simulates a decentralized peer-to-peer energy marketplace.
Nodes publish surplus/deficit bids; the router matches them
fairly without centralized control logic.

Energy conservation is strictly enforced: total energy
transferred out == total energy transferred in.
"""

from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class Transaction:
    """Record of a single energy transfer between two nodes."""
    from_node: int
    to_node: int
    amount: float       # kWh transferred
    tick: int


class P2PRouter:
    """
    Simulated pub-sub bus for decentralized energy trading.

    Each tick, nodes with surplus battery (SoC > 85%) publish offers,
    and nodes with low battery (SoC < 15%) publish bids.
    The router matches them proportionally.
    """

    def __init__(self):
        self.transaction_log: list[Transaction] = []
        self.total_energy_traded: float = 0.0

    def match(
        self,
        bids: dict[int, float],    # {node_id: kWh_needed}
        offers: dict[int, float],  # {node_id: kWh_available}
        nodes: dict[int, object],  # {node_id: Node} for adjust_charge
        tick: int,
    ) -> list[dict]:
        """
        Match energy bids against offers proportionally.

        If total offers >= total bids:
            Each bidder gets their full request.
            Offers are drawn proportionally from each offerer.
        If total offers < total bids:
            Available energy is distributed proportionally among bidders.
            All offerers contribute their full offer.

        Returns list of transaction dicts for the snapshot log.
        """
        if not bids or not offers:
            return []

        total_bid = sum(bids.values())
        total_offer = sum(offers.values())

        if total_bid <= 0 or total_offer <= 0:
            return []

        # Determine how much energy actually flows
        energy_pool = min(total_bid, total_offer)
        transactions = []

        # ── Calculate each bidder's share ────────────────────────────
        bid_shares = {}
        for nid, amount in bids.items():
            if total_bid > 0:
                bid_shares[nid] = (amount / total_bid) * energy_pool
            else:
                bid_shares[nid] = 0.0

        # ── Calculate each offerer's contribution ────────────────────
        offer_shares = {}
        for nid, amount in offers.items():
            if total_offer > 0:
                offer_shares[nid] = (amount / total_offer) * energy_pool
            else:
                offer_shares[nid] = 0.0

        # ── Execute transfers ────────────────────────────────────────
        # Draw from offerers
        for nid, contribution in offer_shares.items():
            if contribution > 0:
                actual = nodes[nid].adjust_charge(-contribution)
                # actual is negative (energy removed)

        # Give to bidders
        for nid, share in bid_shares.items():
            if share > 0:
                actual = nodes[nid].adjust_charge(share)

        # ── Log transactions (simplified: each offer→bid pair) ───────
        offer_list = list(offer_shares.items())
        bid_list = list(bid_shares.items())

        # Create pairwise transaction records for visualization
        offer_idx = 0
        offer_remaining = offer_list[0][1] if offer_list else 0

        for bid_id, bid_amount in bid_list:
            remaining = bid_amount
            while remaining > 0.001 and offer_idx < len(offer_list):
                offerer_id = offer_list[offer_idx][0]
                transfer = min(remaining, offer_remaining)

                if transfer > 0.001:
                    tx = Transaction(
                        from_node=offerer_id,
                        to_node=bid_id,
                        amount=round(transfer, 4),
                        tick=tick,
                    )
                    self.transaction_log.append(tx)
                    transactions.append({
                        "from": offerer_id,
                        "to": bid_id,
                        "kWh": round(transfer, 4),
                    })

                remaining -= transfer
                offer_remaining -= transfer

                if offer_remaining <= 0.001:
                    offer_idx += 1
                    if offer_idx < len(offer_list):
                        offer_remaining = offer_list[offer_idx][1]

        self.total_energy_traded += energy_pool
        return transactions
