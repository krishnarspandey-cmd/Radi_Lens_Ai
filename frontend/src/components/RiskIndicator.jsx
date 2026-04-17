import './RiskIndicator.css';

export default function RiskIndicator({ confidence, prediction }) {
  // We only show risk for PNEUMONIA to keep it focused, or show NORMAL as lowest risk.
  
  let riskLevel = 'LOW';
  let message = 'Low confidence result';
  let badgeClass = 'risk-low';
  let icon = '🟢';

  if (prediction === 'NORMAL') {
    riskLevel = 'MINIMAL';
    message = 'No signs detected';
    badgeClass = 'risk-minimal';
    icon = '✅';
  } else {
    const pct = confidence * 100;
    if (pct < 60) {
      riskLevel = 'LOW';
      message = 'Low confidence result. Manual review strongly recommended.';
      badgeClass = 'risk-low';
      icon = '🟢';
    } else if (pct >= 60 && pct <= 80) {
      riskLevel = 'MODERATE';
      message = 'Moderate concern. Further testing advised.';
      badgeClass = 'risk-mod';
      icon = '🟡';
    } else {
      riskLevel = 'HIGH';
      message = 'High concern. Immediate action recommended.';
      badgeClass = 'risk-high';
      icon = '🚨';
    }
  }

  return (
    <div className={`risk-indicator glass ${badgeClass}`}>
      <div className="risk-icon-wrap">
        <span className="risk-icon">{icon}</span>
      </div>
      <div className="risk-content">
        <p className="risk-title">
          Risk Level: <strong>{riskLevel}</strong>
        </p>
        <p className="risk-msg">{message}</p>
      </div>
    </div>
  );
}
