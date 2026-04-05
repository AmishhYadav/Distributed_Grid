/**
 * ChartsPanel — Right sidebar with real-time charts
 */
import { memo, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const tooltipStyle = {
  background: 'rgba(10, 21, 37, 0.96)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#eef2ff',
  fontSize: '0.78rem',
};

function ChartsPanel({ history = [], selectedNode = null }) {
  const envChartData = useMemo(() => {
    if (!history || history.length < 2) return null;
    return history.map((snap) => ({
      tick: snap.tick,
      solar: +(snap.env_solar * 100).toFixed(1),
      demand: +(snap.env_demand * 100).toFixed(1),
    }));
  }, [history]);
  
  const nodeChartData = useMemo(() => {
      if (!history || history.length < 2 || !selectedNode) return null;
      return history.map(snap => {
          const n = snap.nodes?.find(n => n.id === selectedNode.id);
          if (!n) return null;
          return {
              tick: snap.tick,
              demand: +n.demand.toFixed(2),
              prediction: +(n.prediction || n.demand).toFixed(2),
          }
      }).filter(Boolean);
  }, [history, selectedNode]);

  return (
    <div className="charts-panel">
      <div className="charts-panel-header">System Analytics</div>
      <div className="charts-panel-body">
        
        {/* Environment Chart */}
        <div className="chart-block" style={{ flex: 1, minHeight: '200px' }}>
          <div className="chart-block-title">Global Environment</div>
          {envChartData ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={envChartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="cSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="tick" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="solar" stroke="var(--accent-gold)" fill="url(#cSolar)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="demand" stroke="var(--accent-cyan)" fill="url(#cDemand)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="chart-empty-msg">Waiting for simulation data...</div>
          )}
        </div>

        {/* Node Chart */}
        <div className="chart-block" style={{ flex: 1, minHeight: '200px' }}>
          <div className="chart-block-title">Node Predict vs Actual</div>
          {nodeChartData ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={nodeChartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="tick" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} />
                <Line type="monotone" dataKey="prediction" name="Predicted" stroke="var(--accent-purple)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="stepAfter" dataKey="demand" name="Actual" stroke="var(--accent-green)" strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="chart-empty-msg">Select a node to view ML prediction history.</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default memo(ChartsPanel);
