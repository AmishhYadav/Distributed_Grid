<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-1.5-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-Real--time-4FC08D?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<h1 align="center">⚡ AetherGrid</h1>
<h3 align="center">Decentralized Energy Microgrid Simulation</h3>
<p align="center">
  <em>A real-time interactive dashboard simulating an autonomous peer-to-peer energy microgrid<br/>powered by Random Forest machine learning, with zero central control.</em>
</p>

---

## 🎯 Overview

**AetherGrid** simulates a neighborhood of 5 smart households, each equipped with solar panels and batteries, that autonomously negotiate energy sharing using a decentralized P2P protocol. Each node runs its own Random Forest ML model on synthetic data to predict energy demand and proactively offer or request power — **without any central controller**.

The project ships with:
- 🔬 **Simulation Engine** — Python-based async tick loop with realistic solar/demand curves
- 🧠 **ML Prediction** — Per-node Random Forest models trained on rolling 7-day windows
- ⚡ **P2P Marketplace** — Decentralized bid/offer matching with proportional energy sharing
- 🌐 **WebSocket API** — FastAPI server broadcasting live snapshots at 1 Hz
- 🎨 **Landing Page** — Immersive scroll-expanding hero with storytelling animation
- 📊 **Live Dashboard** — Real-time neighborhood map with node analytics and transfer logs

---

## 📸 Screenshots

| Landing Page | Simulation Dashboard |
|:---:|:---:|
| Scroll-driven storytelling with expanding hero | Live neighborhood map with P2P energy flows |
| ✨ Eco-modernist light theme | ⚡ Real-time WebSocket data |

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph Frontend ["🖥️ Frontend (React + Vite)"]
        LP["Landing Page<br/>Scroll Animation"]
        SD["Simulation Dashboard<br/>Real-time Visualization"]
        WS_CLIENT["WebSocket Client<br/>useSimulation Hook"]
    end

    subgraph Backend ["⚙️ Backend (FastAPI)"]
        SERVER["WebSocket Server<br/>Connection Manager"]
        ENGINE["Simulation Engine<br/>Async Tick Loop"]
    end

    subgraph Simulation ["🔬 Simulation Core"]
        NODES["Node Agents (×5)<br/>Battery + Solar + ML"]
        ROUTER["P2P Router<br/>Bid/Offer Matching"]
        GENERATORS["Data Generators<br/>Solar & Demand Curves"]
    end

    LP -->|"Navigate /simulation"| SD
    SD --> WS_CLIENT
    WS_CLIENT <-->|"WebSocket<br/>ws://localhost:8000/ws/stream"| SERVER
    SERVER <-->|"Broadcast Snapshots<br/>Receive Commands"| ENGINE
    ENGINE --> NODES
    ENGINE --> ROUTER
    ENGINE --> GENERATORS
    NODES -->|"Bids & Offers"| ROUTER
    ROUTER -->|"Energy Transfers"| NODES
    GENERATORS -->|"Solar, Demand"| NODES
    NODES -->|"ML Predictions"| ENGINE
```

### Data Flow — Single Tick Lifecycle

```mermaid
sequenceDiagram
    participant E as Engine
    participant G as Generators
    participant N as Nodes (×5)
    participant R as P2P Router
    participant S as Server
    participant C as Browser Client

    E->>G: Get solar & demand for hour
    G-->>E: solar=0.85, demand=0.42
    
    loop For each Node
        E->>N: node.update(solar, demand, time)
        N->>N: Calculate net energy
        N->>N: Update battery SoC
        N->>N: ML predict next tick
        N-->>E: Node state snapshot
    end

    E->>R: Match bids & offers
    R->>R: Proportional allocation
    R->>N: Execute energy transfers
    R-->>E: Transaction log

    alt Every 24 ticks
        E->>N: node.train_model()
        N->>N: Fit RandomForest on 7-day window
        N-->>E: ML training event
    end

    E->>S: Broadcast snapshot
    S->>C: WebSocket JSON message
    C->>C: Update visualization
    
    Note over C,S: Client can send:<br/>pause | resume | set_speed | cloud_shock
```

### P2P Negotiation Protocol

```mermaid
flowchart LR
    subgraph Assessment ["1️⃣ Assessment"]
        A1["Each node checks<br/>own Battery SoC"]
        A2{"SoC < 30%?"}
        A3{"SoC > 70%?"}
        A4["Publish BID<br/>(energy needed)"]
        A5["Publish OFFER<br/>(energy available)"]
        A6["No action<br/>(balanced)"]
    end

    subgraph Matching ["2️⃣ Matching"]
        M1["Router collects<br/>all bids & offers"]
        M2["Proportional<br/>allocation algorithm"]
        M3["Calculate fair<br/>shares per pair"]
    end

    subgraph Settlement ["3️⃣ Settlement"]
        S1["Deduct energy<br/>from offerer"]
        S2["Credit energy<br/>to bidder"]
        S3["Log transaction<br/>in transfer log"]
    end

    A1 --> A2
    A2 -->|Yes| A4
    A2 -->|No| A3
    A3 -->|Yes| A5
    A3 -->|No| A6
    A4 --> M1
    A5 --> M1
    M1 --> M2
    M2 --> M3
    M3 --> S1
    S1 --> S2
    S2 --> S3
```

### ML Pipeline — Per-Node Random Forest

```mermaid
flowchart TB
    subgraph Input ["📊 Feature Engineering"]
        F1["Hour of day (0-23)"]
        F2["Solar irradiance (0-1)"]
        F3["Base demand (0-1)"]
        F4["Current SoC (%)"]
        F5["Day of week (0-6)"]
    end

    subgraph Training ["🧠 Training Pipeline"]
        T1["Collect rolling<br/>7-day history<br/>(168 ticks)"]
        T2["Extract feature matrix<br/>X = [hour, solar, demand,<br/>soc, day_of_week]"]
        T3["Target: actual net<br/>energy delta (kWh)"]
        T4["RandomForestRegressor<br/>n_estimators=50<br/>max_depth=8"]
    end

    subgraph Prediction ["🔮 Real-time Prediction"]
        P1["Current tick features"]
        P2["Predict next-tick<br/>net energy"]
        P3{"Prediction > 0?"}
        P4["Expect surplus<br/>→ Pre-offer energy"]
        P5["Expect deficit<br/>→ Pre-charge battery"]
    end

    F1 & F2 & F3 & F4 & F5 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4
    T4 -->|"Every 24 ticks"| P1
    P1 --> P2
    P2 --> P3
    P3 -->|Yes| P4
    P3 -->|No| P5
```

---

## 📂 Project Structure

```
AetherGrid/
│
├── backend/                    # Python simulation engine
│   ├── server.py               # FastAPI WebSocket server + CORS
│   ├── engine.py               # Async tick loop, P2P orchestration
│   ├── node.py                 # Node agent: battery, solar, ML model
│   ├── router.py               # P2P bid/offer matching marketplace
│   └── generators.py           # Stochastic solar & demand curves
│
├── frontend/                   # React 19 + Vite 6
│   ├── index.html              # Entry HTML with Google Fonts
│   ├── vite.config.js          # Dev server + WS proxy config
│   ├── package.json            # Dependencies
│   └── src/
│       ├── main.jsx            # React DOM entry + Router
│       ├── App.jsx             # Route definitions (/ and /simulation)
│       ├── index.css           # Full design system + animations
│       ├── hooks/
│       │   └── useSimulation.js    # WebSocket hook + state management
│       └── pages/
│           ├── LandingPage.jsx     # Scroll-expanding hero + storytelling
│           └── SimulationPage.jsx  # Live dashboard with node map
│
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|------------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AetherGrid.git
cd AetherGrid
```

### 2. Backend setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate    # macOS/Linux
# .venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend setup

```bash
cd frontend
npm install
cd ..
```

### 4. Run both servers

Open two terminals:

```bash
# Terminal 1 — Backend (port 8000)
source .venv/bin/activate
uvicorn backend.server:app --host 0.0.0.0 --port 8000
```

```bash
# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 5. Open the app

Navigate to **http://localhost:5173** to see the landing page.  
Click **"Get Started"** or **"Launch Simulation"** to enter the live dashboard.

---

## 🎮 Dashboard Controls

| Control | Action |
|---------|--------|
| ▶️ / ⏸️ | Play / Pause the simulation |
| **1x / 2x / 5x** | Simulation speed multiplier |
| **⚡ Cloud Shock** | Force a 90% solar drop event |
| **Click any node** | Open node detail panel (SoC, ML predictions, stats) |
| **← Home** | Return to landing page |

---

## 🔌 WebSocket API

### Endpoint

```
ws://localhost:8000/ws/stream
```

### Snapshot Schema (Server → Client)

```json
{
  "tick": 142,
  "time": "2026-06-06T22:00:00",
  "hour": 22.0,
  "env_solar": 0.0,
  "env_demand": 0.3842,
  "nodes": [
    {
      "id": 0,
      "charge": 4.21,
      "capacity": 10.0,
      "soc": 42.1,
      "generation": 0.0,
      "demand": 0.38,
      "net": -0.38,
      "prediction": -0.35,
      "has_model": true,
      "blackouts": 0,
      "train_count": 5
    }
  ],
  "transactions": [
    { "from": 2, "to": 0, "kWh": 0.45 }
  ],
  "ml_trained": [],
  "total_p2p_traded": 128.42,
  "paused": false,
  "speed": 1.0
}
```

### Commands (Client → Server)

| Command | JSON Payload |
|---------|-------------|
| Pause | `{"cmd": "pause"}` |
| Resume | `{"cmd": "resume"}` |
| Set Speed | `{"cmd": "set_speed", "multiplier": 5}` |
| Cloud Shock | `{"cmd": "cloud_shock"}` |

---

## 🧪 Key Technical Decisions

### Why Decentralized (No Central Controller)?

Traditional microgrid simulators use a central optimizer. AetherGrid's P2P router operates as a **message bus** where each node independently publishes bids/offers. The matching algorithm is purely reactive — it doesn't know about future demand or global state. This mirrors real-world blockchain-based energy trading protocols.

### Why Random Forest over LSTM/Neural Networks?

| Factor | Random Forest | LSTM |
|--------|:---:|:---:|
| Training speed | ✅ ~10ms | ❌ ~10s |
| Works with small data | ✅ 168 samples | ❌ Needs 1000+ |
| Interpretable | ✅ Feature importance | ❌ Black box |
| Overfitting risk | ✅ Low | ⚠️ Moderate |
| Real-time feasible | ✅ Yes | ⚠️ GPU needed |

For a household with 7 days of hourly data, Random Forest provides excellent accuracy with negligible latency.

### Why WebSocket over REST Polling?

The simulation produces ~1 snapshot/second. REST polling would require the client to hammer the server. WebSocket provides:
- **Push-based** delivery (no wasted requests)
- **Bidirectional** communication (client sends commands back)
- **Sub-millisecond** latency for real-time visualization

---

## 🧬 Simulation Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `num_nodes` | 5 | Number of household nodes |
| `time_step_hours` | 1.0 | Logical hours per tick |
| `tick_rate_seconds` | 1.0 | Real seconds between ticks |
| `_BID_SOC_THRESHOLD` | 30% | SoC below which nodes request energy |
| `_OFFER_SOC_THRESHOLD` | 70% | SoC above which nodes offer energy |
| `_ML_TRAIN_INTERVAL` | 24 ticks | Retrain ML model every simulated day |
| Battery capacities | 10–18 kWh | Varied across nodes |
| Solar panel ratings | 3.0–5.0 kW | Varied across nodes |

---

## 🎨 Design System

AetherGrid uses an **eco-modernist light** palette inspired by sustainable architecture:

| Token | Color | Usage |
|-------|-------|-------|
| `--primary` | `#006d36` | Actions, active states |
| `--primary-container` | `#4ade80` | Highlights, badges |
| `--secondary` | `#00668a` | Data readouts |
| `--error` | `#ba1a1a` | Deficit, critical states |
| `--background` | `#f7f9fb` | Page background |
| `--on-surface` | `#191c1e` | Body text |

**Typography**: Manrope (all weights) for headlines, body, and labels.

---

## 🛣️ Roadmap

- [x] Simulation engine with async tick loop
- [x] Node agents with battery + solar physics
- [x] Random Forest ML prediction per node
- [x] P2P decentralized energy trading
- [x] FastAPI WebSocket server
- [x] Immersive scroll-expanding landing page
- [x] Real-time simulation dashboard
- [ ] Demand response event simulation
- [ ] Multi-day historical charts
- [ ] Node-to-node connection animation
- [ ] Energy pricing model
- [ ] Mobile-responsive dashboard
- [ ] Docker Compose for one-command startup

---

## 📄 License

This project is for educational and demonstration purposes.

---

<p align="center">
  Built with ⚡ by <strong>AetherGrid Team</strong><br/>
  <em>Redefining the digital curation of sustainable energy.</em>
</p>
