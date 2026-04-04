# Requirements

## Validated
(None yet – ship to validate)

## Active

### Simulation Engine (ENG)
- [ ] **ENG-01**: Implement a global clock tick system that drives the entire simulation forward.
- [ ] **ENG-02**: Create a synthetic data generator for "Solar Irradiance" incorporating daily arcs and stochastic cloud noise.
- [ ] **ENG-03**: Create a synthetic data generator for "Power Demand" with typical household usage patterns and random noise.
- [ ] **ENG-04**: Execute a stateless P2P message bus that allows nodes to send targeted messages to other nodes without global authority intervention.

### Node Agents (NODE)
- [ ] **NODE-01**: Nodes must track internal battery state (charge level, capacity limits, charge/discharge rates).
- [ ] **NODE-02**: Nodes must consume synthetic solar/demand data to update their current energy surplus/deficit status.
- [ ] **NODE-03**: Integrate a Random Forest model into each node that trains on historical ticks and inferences future demand.
- [ ] **NODE-04**: Implement the Decentralized Negotiation logic (Nodes broadcast energy requests when predicting a deficit, and offer when predicting surplus).

### Web Dashboard (WEB)
- [ ] **WEB-01**: Visualize the microgrid as a network of nodes, displaying basic metrics per node.
- [ ] **WEB-02**: Animate power transfers between nodes based on the output of the negotiation logic.
- [ ] **WEB-03**: Implement simulation controls (play, pause, speed multi, force cloud shock).
- [ ] **WEB-04**: Display a console or log view of real-time P2P negotiations happening.
- [ ] **WEB-05**: View ML training/prediction health for individual nodes upon selection.

### Infrastructure (INF)
- [ ] **INF-01**: Set up WebSockets connection transmitting simulation state changes to the web client.

## Out of Scope
- Actual hardware IoT sensor ingestion.
- True cryptographically secure blockchain ledgers.
- P2P networking via libp2p or WebRTC between separate browsers.
