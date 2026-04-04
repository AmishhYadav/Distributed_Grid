/**
 * SimControls — Play/Pause, Speed selector, Cloud Shock button
 */
function SimControls({ paused, speed, onTogglePause, onSetSpeed, onCloudShock }) {
  return (
    <div className="sim-controls">
      <button
        className={`control-btn play-btn ${!paused ? 'active' : ''}`}
        onClick={onTogglePause}
        title={paused ? 'Resume simulation' : 'Pause simulation'}
      >
        {paused ? '▶ Resume' : '⏸ Pause'}
      </button>

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

      <button
        className="control-btn shock-btn"
        onClick={onCloudShock}
        title="Force a severe cloud event"
      >
        ☁ Force Cloud Event
      </button>
    </div>
  );
}

export default SimControls;
