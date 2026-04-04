---
wave: 2
depends_on: ["1-PLAN.md"]
files_modified: ["package.json", "src/App.jsx", "src/hooks/useSimulation.js"]
autonomous: true
---

# 2. React Vite Frontend Link

## Objective
Establish the React application within the root directory and hook into WebSockets.

## Tasks

### 2.1 System Scaffold
<read_first>None</read_first>
<action>
Run `npx --yes create-vite@latest --help`. 
Run `npx --yes create-vite@latest ./ --template react` in the root exactly.
Because it's in the root, our python code will sit in `backend/` and frontend JS sits in the newly generated `src/`!
</action>

### 2.2 WebSocket Hook
<read_first>src/App.jsx</read_first>
<action>
Create `src/hooks/useSimulation.js`.
Write a custom hook that returns `{ data, isConnected }`.
Use `useEffect` to initiate a `WebSocket(ws://127.0.0.1:8000/ws/stream)`. On `onmessage`, parse JSON and set state. Add heartbeat/reconnect logic if necessary.

Modify `src/App.jsx`:
Import `useSimulation`. If not connected, render "Connecting...". If connected, render `JSON.stringify(data)` in a `<pre>` tag. We won't apply heavy styling until Phase 4, we just need to verify the data pipe works here.
</action>

<acceptance_criteria>
- `npm run dev` serves on 5173.
- Page opens and displays the ticking JSON blocks streaming seamlessly from Python.
</acceptance_criteria>
