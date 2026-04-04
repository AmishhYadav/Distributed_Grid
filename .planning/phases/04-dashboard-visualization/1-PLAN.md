---
wave: 1
depends_on: []
files_modified: ["backend/server.py", "backend/engine.py", "frontend/package.json", "frontend/src/hooks/useSimulation.js", "frontend/src/components/SimControls.jsx", "frontend/src/App.jsx", "frontend/src/App.css"]
autonomous: true
requirements: [WEB-03]
---

# 1. Simulation Controls & Backend Command Endpoints

<objective>
Add play/pause, speed multiplier, and cloud shock controls. This requires backend API endpoints that accept WebSocket commands from the frontend, plus a new SimControls React component. WEB-03 requirement: Implement simulation controls (play, pause, speed multi, force cloud shock).
</objective>

## Tasks

### 1.1 Backend — Add WebSocket command handler

<read_first>backend/server.py, backend/engine.py</read_first>
<action>
Modify `backend/server.py`:

1. Change the WebSocket endpoint `stream()` to parse incoming text as JSON commands:
```python
ws.onmessage handler:
  data = json.loads(await ws.receive_text())
  cmd = data.get("cmd")
  if cmd == "pause": engine.running = False
  elif cmd == "resume": engine.running = True
  elif cmd == "set_speed": engine.tick_rate = 1.0 / float(data.get("multiplier", 1))
  elif cmd == "cloud_shock": engine.force_cloud_shock = True
```

2. Add `import json` at the top.

3. Wrap the `receive_text()` in a try/except to handle invalid JSON gracefully (just log and continue).

Modify `backend/engine.py`:
1. Add `self.force_cloud_shock = False` in `Engine.__init__`.
2. In `step()`, after calling `apply_stochastic_shock(base_solar, base_demand)`, check:
```python
if self.force_cloud_shock:
    solar = solar * 0.1  # severe cloud event — 90% solar drop
    self.force_cloud_shock = False
```
3. Add `self.paused` field. In `run_async`, when `self.running` is False, instead of exiting the loop, `await asyncio.sleep(0.1)` and continue (paused state). Add `"paused": not self.running` to the snapshot dict.
4. Add `"speed": round(1.0 / self.tick_rate, 1)` to the snapshot dict so frontend displays current speed.
</action>
<acceptance_criteria>
- `backend/server.py` contains `json.loads(await ws.receive_text())`
- `backend/server.py` contains `cmd == "pause"`
- `backend/server.py` contains `cmd == "set_speed"`
- `backend/server.py` contains `cmd == "cloud_shock"`
- `backend/engine.py` contains `self.force_cloud_shock = False`
- `backend/engine.py` contains `solar = solar * 0.1`
- `backend/engine.py` snapshot dict contains key `"paused"`
- `backend/engine.py` snapshot dict contains key `"speed"`
</acceptance_criteria>

### 1.2 Frontend — Install recharts

<read_first>frontend/package.json</read_first>
<action>
Run `npm install recharts` inside the `frontend/` directory.
Verify it appears in `dependencies` in `package.json`.
</action>
<acceptance_criteria>
- `frontend/package.json` contains `"recharts"` in the dependencies section
- `frontend/node_modules/recharts` directory exists
</acceptance_criteria>

### 1.3 Frontend — useSimulation hook: add sendCommand

<read_first>frontend/src/hooks/useSimulation.js</read_first>
<action>
Modify `useSimulation.js`:

1. Add a `sendCommand` callback that sends JSON commands through the WebSocket:
```javascript
const sendCommand = useCallback((cmd, payload = {}) => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({ cmd, ...payload }));
  }
}, []);
```

2. Return `sendCommand` from the hook alongside `data`, `isConnected`, `history`:
```javascript
return { data, isConnected, history, sendCommand };
```
</action>
<acceptance_criteria>
- `useSimulation.js` contains `const sendCommand = useCallback`
- `useSimulation.js` contains `wsRef.current.send(JSON.stringify`
- `useSimulation.js` return statement includes `sendCommand`
</acceptance_criteria>

### 1.4 Frontend — SimControls component

<read_first>frontend/src/App.jsx, frontend/src/App.css, .planning/phases/04-dashboard-visualization/04-UI-SPEC.md</read_first>
<action>
Create `frontend/src/components/SimControls.jsx`:

```jsx
// Props: { paused, speed, onTogglePause, onSetSpeed, onCloudShock }
// - Play/Pause button: uses ▶ when paused, ⏸ when running
// - Speed dropdown: options [1, 2, 5, 10]
// - Cloud Shock button: "Force Cloud Event" with ☁ icon
```

The component renders a horizontal bar with three controls:
- Toggle button: `className="control-btn play-btn"`, onClick calls `onTogglePause()`
- Speed select: `<select className="speed-select">` with options 1×, 2×, 5×, 10×, onChange calls `onSetSpeed(value)`
- Shock button: `className="control-btn shock-btn"`, onClick calls `onCloudShock()`

CSS selectors to add to `App.css`:
- `.sim-controls` — flex row, gap 0.5rem, align-items center
- `.control-btn` — bg `var(--bg-card)`, border `1px solid var(--border)`, border-radius `var(--radius-sm)`, padding `0.5rem 1rem`, color `var(--text-primary)`, cursor pointer, font-size 0.85rem, font-weight 500
- `.control-btn:hover` — bg `var(--bg-card-hover)`, border-color `var(--accent-blue)`
- `.play-btn.active` — border-color `var(--accent-blue)`, color `var(--accent-blue)`
- `.speed-select` — bg `var(--bg-card)`, border `1px solid var(--border)`, border-radius `var(--radius-sm)`, color `var(--text-primary)`, padding `0.5rem`, font-size 0.85rem, font-family inherit
- `.shock-btn` — border-color `var(--accent-yellow)`, color `var(--accent-yellow)`
- `.shock-btn:hover` — bg `rgba(234,179,8,0.1)`
</action>
<acceptance_criteria>
- File `frontend/src/components/SimControls.jsx` exists
- `SimControls.jsx` contains `onTogglePause`
- `SimControls.jsx` contains `onSetSpeed`
- `SimControls.jsx` contains `onCloudShock`
- `SimControls.jsx` contains `Force Cloud Event`
- `App.css` contains `.sim-controls`
- `App.css` contains `.shock-btn`
</acceptance_criteria>

### 1.5 Frontend — Integrate SimControls into App.jsx

<read_first>frontend/src/App.jsx, frontend/src/components/SimControls.jsx</read_first>
<action>
Modify `frontend/src/App.jsx`:

1. Import SimControls: `import SimControls from './components/SimControls';`
2. Destructure `sendCommand` from `useSimulation()`: `const { data, isConnected, history, sendCommand } = useSimulation();`
3. Add SimControls to the header section, next to the status div:
```jsx
<SimControls
  paused={data.paused}
  speed={data.speed || 1}
  onTogglePause={() => sendCommand(data.paused ? 'resume' : 'pause')}
  onSetSpeed={(mult) => sendCommand('set_speed', { multiplier: mult })}
  onCloudShock={() => sendCommand('cloud_shock')}
/>
```
4. Update the `.header` CSS to accommodate controls (it already has `justify-content: space-between`; add flex-wrap if needed).
</action>
<acceptance_criteria>
- `App.jsx` contains `import SimControls from './components/SimControls'`
- `App.jsx` contains `sendCommand`
- `App.jsx` contains `onTogglePause`
- `App.jsx` contains `onCloudShock`
</acceptance_criteria>

## must_haves
- Backend accepts pause/resume/set_speed/cloud_shock WebSocket commands
- Frontend displays play/pause toggle, speed selector, and cloud shock button
- Controls are wired end-to-end: clicking pause in UI pauses the simulation engine
- recharts is installed as a dependency
