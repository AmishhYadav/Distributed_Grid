---
wave: 2
depends_on: ["1-PLAN.md"]
files_modified: ["src/router.py", "src/node.py", "src/engine.py"]
autonomous: true
---

# 2. P2P Pub-Sub Bus 

## Objective
Build a central simulation router to match energy Needs with Offers between nodes.

## Tasks

### 2.1 Develop P2P Router
<read_first>src/node.py, src/engine.py</read_first>
<action>
Create `src/router.py` with `P2PRouter` class.
Implement `match(bids, offers, nodes)` where bids is a dict of `{node_id: amount_kwh}` and offers is `{node_id: amount_kwh}`. It should calculate a fair distribution of the total offers among the bidders, and call `node.adjust_charge(amount)` to execute the transfers, returning a list of `Transaction` dicts (from, to, amount).

Modify `src/node.py`:
- Add `battery_blackouts` counter. When `charge` hits exactly 0.0, increment it.
- Add `adjust_charge(delta: float)` method to add to `self.charge` while enforcing capacity.

Modify `src/engine.py`:
- Instantiate `P2PRouter`. At the end of `step()`, loop over nodes. If `node.charge < 0.15 * capacity`, it is a bid. If `node.charge > 0.85 * capacity`, it is an offer.
- Pass to `router.match()`. Append the transaction log to the snapshot.
</action>
<acceptance_criteria>
- `python3 src/engine.py` logs successful matched transactions between nodes in the network when shocks occur.
- Energy is conserved strictly across transactions.
</acceptance_criteria>
