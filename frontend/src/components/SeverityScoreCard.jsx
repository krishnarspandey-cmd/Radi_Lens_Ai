import './SeverityScoreCard.css';

export default function SeverityScoreCard({ raleScore, severity }) {
  let badgeClass = 'sev-normal';
  let icon = '✅';

  if (severity === 'Mild') {
    badgeClass = 'sev-mild';
    icon = '🟢';
  } else if (severity === 'Moderate') {
    badgeClass = 'sev-mod';
    icon = '🟡';
  } else if (severity === 'Severe') {
    badgeClass = 'sev-high';
    icon = '🚨';
  }

  return (
    <div className={`severity-card glass ${badgeClass}`}>
      <div className="sev-icon-wrap">
        <span className="sev-icon">{icon}</span>
      </div>
      <div className="sev-content">
        <p className="sev-title">
          Clinical Severity (RALE Proxy): <strong>{severity}</strong>
        </p>
        <div className="sev-score-wrap">
          <span className="sev-score-num">{raleScore}</span>
          <span className="sev-score-den">/ 8</span>
          <span className="sev-msg">Estimated Lung Opacity Index</span>
        </div>
        <div className="sev-citation" style={{ marginTop: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.8 }}>
          Reference: Warren MA, et al. "Severity scoring of lung oedema on the chest radiograph is associated with clinical outcomes in ARDS." Thorax 73(9): 840–846 (2018).
        </div>
      </div>
    </div>
  );
}
