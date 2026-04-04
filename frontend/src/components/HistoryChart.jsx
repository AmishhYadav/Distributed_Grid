/**
 * HistoryChart — Rolling area chart for Solar vs Demand using recharts
 *
 * Wrapped in React.memo so it only re-renders when `history` reference
 * changes (throttled in useSimulation to every ~3 ticks).
 * isAnimationActive={false} prevents Recharts from replaying the entrance
 * animation on every data update.
 */
import { memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tooltipStyle = {
  background: 'rgba(17,24,39,0.95)',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  backdropFilter: 'blur(8px)',
  color: '#f1f5f9',
  fontSize: '0.82rem',
};

function HistoryChart({ history }) {
  const chartData = useMemo(() => {
    if (!history || history.length < 2) return null;
    return history.map((snap) => ({
      tick: snap.tick,
      solar: +(snap.env_solar * 100).toFixed(1),
      demand: +(snap.env_demand * 100).toFixed(1),
    }));
  }, [history]);

  if (!chartData) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">📊 Solar vs Demand</h3>
        <div className="chart-empty">Collecting historical data...</div>
      </div>
    );
  }

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
            contentStyle={tooltipStyle}
            labelFormatter={(tick) => `Tick ${tick}`}
          />
          <Area
            type="monotone"
            dataKey="solar"
            stroke="#f59e0b"
            fill="url(#solarGrad)"
            strokeWidth={2}
            name="Solar %"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="demand"
            stroke="#3b82f6"
            fill="url(#demandGrad)"
            strokeWidth={2}
            name="Demand %"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(HistoryChart);
