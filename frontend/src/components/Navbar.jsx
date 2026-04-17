import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#logoGrad)" strokeWidth="2"/>
              <path d="M9 14 Q12 8 14 14 Q16 20 19 14" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="14" cy="14" r="2" fill="url(#logoGrad)"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8"/>
                  <stop offset="1" stopColor="#818cf8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <span className="navbar-title">RadiLens<span className="navbar-ai"> AI</span></span>
            <span className="navbar-tagline">Pneumonia Detection</span>
          </div>
        </div>

        <div className="navbar-badge">
          <span className="badge-dot" aria-hidden="true" />
          <span>ResNet18 · v1.0</span>
        </div>
      </div>
    </header>
  );
}
