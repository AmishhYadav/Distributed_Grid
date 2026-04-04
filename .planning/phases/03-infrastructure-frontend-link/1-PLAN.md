---
wave: 1
depends_on: []
files_modified: ["backend/engine.py", "backend/server.py", "requirements.txt"]
autonomous: true
---

# 1. FastAPI WebSocket Server

## Objective
Migrate the simulation loop to asyncio and wrap it in a FastAPI WebSocket server.

## Tasks

### 1.1 Shift Python environment
<read_first>None</read_first>
<action>
Move the `src` directory to `backend`. (We are making room for Vite in the root).
Add `fastapi` and `uvicorn` to `requirements.txt`.
Install via `pip install -r requirements.txt`.
</action>

### 1.2 Async Engine Loop
<read_first>backend/engine.py</read_first>
<action>
Change `backend/engine.py`:
- Import `asyncio`.
- Change `def run` to `async def run`.
- Replace `time.sleep` with `await asyncio.sleep`.
- Allow the `run()` execution loop to accept an optional asynchronous `on_tick_callback(snapshot)`. Wait on it `await on_tick_callback(snapshot)` prior to sleeping.
</action>

### 1.3 FastAPI Router
<read_first>backend/engine.py</read_first>
<action>
Create `backend/server.py`.
- Instantiate FastAPI app.
- Provide a `WebSocket` `ws://localhost:8000/ws/stream` endpoint. Keep track of connected clients.
- Create an `on_tick_callback` function that iterates through clients, calling `client.send_json(snapshot)`.
- Use a FastAPI lifespan context manager or `@app.on_event("startup")` to instantiate the `Engine` and spawn `asyncio.create_task(engine.run(on_tick_callback))`.
</action>

<acceptance_criteria>
- `uvicorn backend.server:app --reload` runs cleanly on 8000.
</acceptance_criteria>
