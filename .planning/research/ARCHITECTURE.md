# Architecture Research: Decentralized Microgrid Simulation

## Component Boundaries

1. **Simulation Engine (Backend)**
   - Manages the global clock/ticks.
   - Generates weather/synthetic state updates.
   - Hosts the localized Random Forest models (one instance per node inside the backend scope).
   - Simulates the P2P message bus.

2. **Node Agents (Internal to Engine)**
   - Each node contains:
     - `Battery State` (Current charge)
     - `Generation Engine` (Current solar output)
     - `Demand Model` (Simulated user activity)
     - `ML Model` (Random Forest predicting demand)
     - `Negotiator` (Sends/receives requests for power)

3. **Frontend Dashboard (Client)**
   - Subscribes to the WebSocket state stream.
   - Purely a rendering engine for the backend state.
   - Dispatches user commands back to the engine (e.g., "trigger cloud cover").

## Data Flow
`Engine Clock Tick` -> `Update Environment` -> `Nodes Predict Demand` -> `Nodes Request/Offer Power` -> `Negotiation Phase (Simulated P2P messaging)` -> `Finalize Transactions` -> `Update Batteries` -> `Broadcast State to Frontend`.

## Suggested Build Order
1. Build the synthetic data generators and verify visually.
2. Build the basic Node state machine (battery, generation, demand).
3. Integrate the Random Forest ML logic into the nodes.
4. Build the P2P negotiation protocol.
5. Provide the WebSocket stream API.
6. Build the React frontend.
