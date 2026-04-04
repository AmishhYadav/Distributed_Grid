# Stack Research: Decentralized Energy Microgrid

## Recommended Stack

- **Backend / Simulation Engine:** Python (FastAPI)
  - *Rationale:* Python is the gold standard for ML. `scikit-learn` provides robust out-of-the-box Random Forest models. Custom simulation loops and synthetic data generation are easy to write.
- **Frontend / Dashboard:** React + TypeScript (Vite)
  - *Rationale:* React's component model maps perfectly to individual "nodes" (houses) on a grid UI. Fast updating of node states works well with React state or lightweight global stores (Zustand).
- **Styling:** TailwindCSS + Framer Motion
  - *Rationale:* Tailwind enables rapid premium UI prototyping. Framer Motion can handle the complex animations of energy "flowing" between nodes.
- **Communication (Simulated P2P):** WebSockets (via `websockets` in Python / native `WebSocket` in browser)
  - *Rationale:* Since true P2P in the browser requires WebRTC (which is complex and often blocked), standard WebSockets connected to a lightweight message broker in the backend can simulate a P2P network flawlessly by broadcasting targeted messages.

## Alternatives Considered
- *All-JavaScript (Node.js + tensorflow.js / random-forest libs)*: Feasible, but ML ecosystem is weaker, and numeric/simulation logic is cleaner in Python.
- *WebRTC*: True P2P between browser tabs. Too complex for a V1 simulation, often suffers from connection drops.

## What NOT to use
- Express/Node.js for backend: Misses out on Python's native ML libraries.
- Heavy databases (PostgreSQL/MongoDB): Unnecessary for a transient simulation unless replay functionality is required.
