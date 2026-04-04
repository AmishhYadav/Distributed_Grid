"""
Decentralized Energy Microgrid — FastAPI WebSocket Server

Serves the simulation engine over WebSockets.
Clients connect to ws://localhost:8000/ws/stream and receive
full simulation snapshots every tick as JSON.
"""

from __future__ import annotations

import asyncio
import sys
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Add backend directory to path so imports resolve
sys.path.insert(0, os.path.dirname(__file__))

from engine import Engine


# ── Connection Manager ───────────────────────────────────────────────
class ConnectionManager:
    """Track active WebSocket connections."""

    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        print(f"  📡 Client connected ({len(self.active)} total)")

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)
        print(f"  📡 Client disconnected ({len(self.active)} remaining)")

    async def broadcast(self, data: dict):
        """Send snapshot to all connected clients."""
        stale = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.active.remove(ws)


manager = ConnectionManager()
engine = Engine(num_nodes=5, time_step_hours=1.0, tick_rate_seconds=1.0)


# ── On-tick broadcast callback ───────────────────────────────────────
async def on_tick(snapshot: dict):
    """Called by the engine every tick — broadcast to all WebSocket clients."""
    await manager.broadcast(snapshot)


# ── Lifespan (start engine on server boot) ───────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start the simulation engine as a background task on startup."""
    task = asyncio.create_task(engine.run_async(on_tick=on_tick))
    print("  🚀 Simulation engine task spawned")
    yield
    engine.running = False
    task.cancel()
    print("  ⏹  Simulation engine stopped")


# ── FastAPI App ──────────────────────────────────────────────────────
app = FastAPI(
    title="Microgrid Simulation Server",
    version="0.3.0",
    lifespan=lifespan,
)

# Allow Vite dev server to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── WebSocket Endpoint ───────────────────────────────────────────────
@app.websocket("/ws/stream")
async def stream(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            # Keep connection alive; client can also send commands later
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)


# ── Health Check ─────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "running",
        "tick": engine.tick_count,
        "nodes": len(engine.nodes),
        "p2p_traded": round(engine.router.total_energy_traded, 2),
    }
