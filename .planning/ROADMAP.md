# Project Roadmap

## Phase 1: Simulation Engine & Core Models
**Goal:** Establish the backend environment, global clock, and state logic for synthetic data generation and basic nodes.
**Requirements:** ENG-01, ENG-02, ENG-03, NODE-01, NODE-02
**Success Criteria:**
1. The system logs a continuous tick loop at a configurable interval.
2. Synthetic environmental data is generated and verified to look realistic with noise over time.
3. Nodes consume this data and update their internal generic battery states accurately.
**UI hint:** no

## Phase 2: Decentralized Logic & Machine Learning
**Goal:** Introduce Random Forest ML to each node and implement the decentralized P2P negotiating bus.
**Requirements:** ENG-04, NODE-03, NODE-04
**Success Criteria:**
1. Nodes train RF models predicting future states accurately based on historical generated ticks.
2. The P2P message bus routes packets securely between specific node IDs without a central router orchestrating the logic.
3. Node battery loads balance successfully via negotiations when shocks occur.
**UI hint:** no

## Phase 3: Infrastructure & Frontend Link
**Goal:** Setup WebSockets for external bridging and establish a foundational React app.
**Requirements:** INF-01, WEB-01
**Success Criteria:**
1. Python Simulation broadcasts state via WebSockets locally.
2. Web Frontend connects reliably to the socket stream.
3. Web Frontend successfully displays the count of connected nodes and basic global data.
**UI hint:** yes

## Phase 4: Interactive Dashboard & Visualizations
**Goal:** Create a full-featured premium UI tracking complex P2P animations and giving the user simulation controls.
**Requirements:** WEB-02, WEB-03, WEB-04, WEB-05
**Success Criteria:**
1. Web dashboard visualizes power sharing interactions elegantly.
2. Users can pause the clock, speed it up, and see effects immediately.
3. Users can click on a node and view its explicit Random Forest prediction logic and logs.
**UI hint:** yes
