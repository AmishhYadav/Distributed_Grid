# Features Research: Microgrid Simulation

## Table Stakes (Must-Have)
- **Node Grid Visualization:** A main dashboard showing a varying number of nodes (houses) connected in a grid.
- **Real-Time Data Feed:** Visualizing current solar generation and power demand per node.
- **ML Demand Prediction:** The system must show what the Random Forest model is predicting for the next time step.
- **Energy Transfer Animation:** Visual indicators (e.g., traveling dots or glowing lines) when node A shares power with node B.
- **Simulation Controls:** Play, pause, adjust speed, and inject "shocks" (e.g., sudden cloud cover, sudden spike in usage).

## Differentiators
- **Decentralized Negotiation Logs:** An event stream showing how nodes bid for power without a master controller.
- **Individual Node Deep-Dive:** Clicking a node shows its specific Random Forest tree stats or historical accuracy.
- **Grid Failure Mode:** Simulating the macro-grid cutting off, forcing the microgrid to survive on its own P2P sharing.

## Anti-Features (Do Not Build)
- **Real-world IoT Integration:** Out of scope for this V1.
- **Cryptocurrency Integration:** Keep the focus strictly on energy management, not tokens or blockchain overhead.
