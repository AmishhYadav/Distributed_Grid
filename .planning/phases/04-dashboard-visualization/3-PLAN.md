---
wave: 2
depends_on: [1]
files_modified: ["frontend/src/components/HistoryChart.jsx", "frontend/src/App.css", "frontend/src/App.jsx"]
autonomous: true
requirements: [WEB-02]
---

# 3. Historical Data Charts with recharts

<objective>
Create rolling line charts showing solar irradiance vs demand over the last 200 ticks using recharts. The history array from useSimulation already maintains this data (D-01, D-02). This visualization enables users to see trends and correlations in the simulation data.
</objective>

## Tasks

### 3.1 Create HistoryChart component

<read_first>frontend/src/hooks/useSimulation.js, frontend/src/App.css, .planning/phases/04-dashboard-visualization/04-UI-SPEC.md</read_first>
<action>
Create `frontend/src/components/HistoryChart.jsx`:

Props: `{ history }`

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function HistoryChart({ history }) {
  if (!history || history.length < 2) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">📊 Solar vs Demand</h3>
        <div className="chart-empty">Collecting historical data...</div>
      </div>
    );
  }

  // Transform data: map history snapshots to chart-friendly format
  const chartData = history.map((snap) => ({
    tick: snap.tick,
    solar: +(snap.env_solar * 100).toFixed(1),
    demand: +(snap.env_demand * 100).toFixed(1),
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">📊 Solar vs Demand</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
          <XAxis
            dataKey="tick"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(17,24,39,0.95)',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              backdropFilter: 'blur(8px)',
              color: '#f1f5f9',
              fontSize: '0.82rem',
            }}
            labelFormatter={(tick) => `Tick ${tick}`}
          />
          <Area type="monotone" dataKey="solar" stroke="#f59e0b" fill="url(#solarGrad)" strokeWidth={2} name="Solar %" dot={false} />
          <Area type="monotone" dataKey="demand" stroke="#3b82f6" fill="url(#demandGrad)" strokeWidth={2} name="Demand %" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryChart;
```
</action>
<acceptance_criteria>
- File `frontend/src/components/HistoryChart.jsx` exists
- `HistoryChart.jsx` contains `import { LineChart` or `import { AreaChart` from `recharts`
- `HistoryChart.jsx` contains `ResponsiveContainer`
- `HistoryChart.jsx` contains `env_solar`
- `HistoryChart.jsx` contains `env_demand`
- `HistoryChart.jsx` contains `Collecting historical data...`
- `HistoryChart.jsx` contains `solarGrad`
</acceptance_criteria>

### 3.2 Add chart CSS styles

<read_first>frontend/src/App.css</read_first>
<action>
Add to `frontend/src/App.css`:

```css
/* ── Historical Charts ──────────────────────────────────────────── */

.chart-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.chart-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 1rem;
  font-size: 0.85rem;
}

/* Recharts tooltip customization */
.recharts-tooltip-wrapper {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}
```
</action>
<acceptance_criteria>
- `App.css` contains `.chart-container`
- `App.css` contains `.chart-title`
- `App.css` contains `.chart-empty`
</acceptance_criteria>

### 3.3 Integrate HistoryChart into App.jsx

<read_first>frontend/src/App.jsx</read_first>
<action>
Modify `frontend/src/App.jsx`:

1. Import: `import HistoryChart from './components/HistoryChart';`
2. Destructure `history` from `useSimulation()`: ensure `history` is already destructured (it was added in plan 1).
3. Add `<HistoryChart history={history} />` after the TopologyView and before the nodes-grid.
</action>
<acceptance_criteria>
- `App.jsx` contains `import HistoryChart from './components/HistoryChart'`
- `App.jsx` contains `<HistoryChart`
- `App.jsx` contains `history={history}`
</acceptance_criteria>

## must_haves
- Rolling line chart renders solar and demand percentages from history data
- Chart uses recharts with AreaChart showing gradient fills
- Tooltip displays dark glassmorphism style matching design system
- Chart updates automatically with each new tick
- Empty state shows "Collecting historical data..." message
