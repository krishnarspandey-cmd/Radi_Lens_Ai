import './AISuggestionPanel.css';

export default function AISuggestionPanel({ prediction, confidence }) {
  const isPneumonia = prediction === 'PNEUMONIA';
  const pct = Math.round(confidence * 100);

  let title = '';
  let icon = '';
  let colorClass = '';
  let suggestions = [];

  if (!isPneumonia) {
    title = 'No Signs Detected';
    icon = '✅';
    colorClass = 'sugg-normal';
    suggestions = [
      'Continue routine health monitoring.',
      'Maintain good respiratory hygiene.',
      'Repeat scan if new symptoms develop.'
    ];
  } else {
    // Pneumonia
    if (pct < 60) {
      title = 'Inconclusive Result';
      icon = '❓';
      colorClass = 'sugg-low';
      suggestions = [
        'Retake X-ray with a higher quality image.',
        'Consider manual review by a radiologist.',
        'Evaluate patient symptoms alongside AI result.'
      ];
    } else if (pct >= 60 && pct <= 80) {
      title = 'Moderate Concern — Further Testing Advised';
      icon = '⚠️';
      colorClass = 'sugg-mod';
      suggestions = [
        'Schedule a review with a licensed radiologist.',
        'Consider correlation with clinical symptoms (cough, fever).',
        'Monitor patient vitals closely.'
      ];
    } else {
      title = 'High Concern — Immediate Action Recommended';
      icon = '🚨';
      colorClass = 'sugg-high';
      suggestions = [
        'Consult a licensed pulmonologist or radiologist immediately.',
        'Consider additional diagnostic tests (blood tests, sputum culture).',
        'Monitor for severe symptoms: fever, chest pain, breathing difficulty.',
        'Avoid self-medication.'
      ];
    }
  }

  return (
    <div className={`suggestion-panel glass ${colorClass}`}>
      <div className="sugg-header">
        <span className="sugg-icon">{icon}</span>
        <h3 className="sugg-title">{title}</h3>
      </div>
      
      <div className="sugg-body">
        <p className="sugg-intro">Based on the AI findings, consider the following next steps:</p>
        <ul className="sugg-list">
          {suggestions.map((s, i) => (
            <li key={i}>
              <span className="sugg-bullet">→</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="sugg-footer-disclaimer">
        ⚠️ Always consult a licensed medical professional before making clinical decisions.
      </div>
    </div>
  );
}
