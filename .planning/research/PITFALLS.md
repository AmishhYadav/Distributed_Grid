# Pitfalls Research: Microgrid Simulations

## Common Mistakes

### 1. Complex P2P Over-Engineering
- **Warning Sign:** Trying to route traffic through libp2p or WebRTC right off the bat.
- **Prevention:** Use a central WebSocket server that *acts* as a P2P router. A node sends a message to the router saying "Target: Node B", and the router forwards it. This validates the logical decentralization without the networking nightmare.
- **Phase:** P2P Logic implementation.

### 2. Boring/Static Synthetic Data
- **Warning Sign:** The ML prediction is perfectly accurate because the data is just a pure sine wave, making the dashboard boring.
- **Prevention:** Add brownian noise and sudden stochastic events (spikes, drops) to the generated demand and solar curves.
- **Phase:** Data Generation phase.

### 3. State Desync Between Nodes
- **Warning Sign:** Two nodes believe they transferred 5kWh of power, but the total energy in the system mysteriously multiplied or vanished.
- **Prevention:** Implement a strict transactional ledger approach (e.g. two-phase commit or atomic steps) inside the simulated network tick.
- **Phase:** Negotiation Logic implementation.

### 4. Overly Complex ML implementation
- **Warning Sign:** Training the model real-time at every tick causes lag.
- **Prevention:** Train the model offline/semi-offline or on background threads, and only infer at each tick.
- **Phase:** ML Engine implementation.
