# Phase 3: Infrastructure & Frontend Link - Research

## Technical Approach
**FastAPI Backend (Validation of D-01/D-02):**
- Install `fastapi[standard]` and `uvicorn`.
- Current Engine uses `time.sleep()`. This is **blocking** and will freeze FastAPI WebSockets. We must change `time.sleep()` to `asyncio.sleep()` in the engine loop, and change the `run()` method to be `async def run()`.
- Add a broadcaster callback inside the asyncio loop to send snapshots to all connected clients over a WebSocket.

**Vite Frontend (Validation of D-03/D-04):**
- System constraint requires initializing the Vite React app in the root directory (`./`). 
- Because this will create a `src/` directory for the Javascript frontend, we must first rename our existing Python `src/` directory to `backend/` to prevent collisions.
- We will strictly rely on Vanilla CSS. 

**WebSocket Sync (Validation of D-05/D-06):**
- Send the `snapshot` dict entirely over the wire.
- Frontend React component uses `useEffect` to hook into `window.WebSocket` and updates a state object `setTickData()` every tick.
