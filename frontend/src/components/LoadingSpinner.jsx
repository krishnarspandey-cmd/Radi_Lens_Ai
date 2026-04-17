import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-container" role="status" aria-label="Analyzing X-ray image">
      <div className="loading-visual">
        {/* Outer rotating ring */}
        <div className="ring ring-outer" />
        {/* Middle pulsing ring */}
        <div className="ring ring-middle" />
        {/* Inner core */}
        <div className="ring-core">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h4M12 3v4M17 12h4M12 17v4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="#38bdf8" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      <div className="loading-text">
        <p className="loading-title">Analyzing X-Ray</p>
        <p className="loading-subtitle">Running deep learning inference…</p>
      </div>

      {/* Step indicator */}
      <div className="loading-steps">
        {['Preprocessing', 'Feature Extraction', 'Classification'].map((step, i) => (
          <div key={step} className="loading-step" style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="step-dot" style={{ animationDelay: `${i * 0.4}s` }} />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
