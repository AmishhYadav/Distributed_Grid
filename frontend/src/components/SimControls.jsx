/**
 * SimControls — Play/Pause, Speed selector, Cloud Shock button
 */
import { memo } from 'react';

function SimControls({ paused, speed, onTogglePause, onSetSpeed, onCloudShock }) {
  return (
    <div className="sim-controls">
      <button
        className={`ctrl-btn ${!paused ? 'active' : ''}`}
        onClick={onTogglePause}
        title={paused ? 'Resume simulation' : 'Pause simulation'}
      >
        {paused ? '▶ Resume' : '⏸ Pause'}
      </button>

      <div className="ctrl-divider"></div>

      <select
        className="speed-select"
        value={Math.round(speed)}
        onChange={(e) => onSetSpeed(Number(e.target.value))}
        title="Simulation Speed"
      >
        <option value={1}>1×</option>
        <option value={2}>2×</option>
        <option value={5}>5×</option>
        <option value={10}>10×</option>
      </select>

      <div className="ctrl-divider"></div>

      <button
        className="ctrl-btn shock shock-btn pulsing"
        onClick={onCloudShock}
        title="Force a severe cloud event"
      >
        ⚡ Emergency
      </button>
    </div>
  );
}

export default memo(SimControls);
