export default function AISuggestionPanel({ prediction, confidence }) {
  const isPneumonia = prediction === 'PNEUMONIA';
  const pct = Math.round(confidence * 100);

  let title = '';
  let icon = '';
  let bgClass = '';
  let iconBg = '';
  let suggestions = [];

  if (!isPneumonia) {
    title = 'No Signs Detected';
    icon = 'check_circle';
    bgClass = 'border-secondary/20';
    iconBg = 'bg-secondary-container text-on-secondary-container';
    suggestions = [
      'Continue routine health monitoring.',
      'Maintain good respiratory hygiene.',
      'Repeat scan if new symptoms develop.',
    ];
  } else if (pct < 60) {
    title = 'Inconclusive Result';
    icon = 'help';
    bgClass = 'border-outline-variant';
    iconBg = 'bg-surface-container-high text-on-surface-variant';
    suggestions = [
      'Retake X-ray with a higher quality image.',
      'Consider manual review by a radiologist.',
      'Evaluate patient symptoms alongside AI result.',
    ];
  } else if (pct >= 60 && pct <= 80) {
    title = 'Moderate Concern — Further Testing Advised';
    icon = 'warning';
    bgClass = 'border-tertiary/20';
    iconBg = 'bg-tertiary-fixed text-on-tertiary-fixed';
    suggestions = [
      'Schedule a review with a licensed radiologist.',
      'Consider correlation with clinical symptoms (cough, fever).',
      'Monitor patient vitals closely.',
    ];
  } else {
    title = 'High Concern — Immediate Action Recommended';
    icon = 'emergency';
    bgClass = 'border-error/20';
    iconBg = 'bg-error-container text-on-error-container';
    suggestions = [
      'Consult a licensed pulmonologist or radiologist immediately.',
      'Consider additional diagnostic tests (blood tests, sputum culture).',
      'Monitor for severe symptoms: fever, chest pain, breathing difficulty.',
      'Avoid self-medication.',
    ];
  }

  return (
    <div className={`bg-surface-container-lowest border rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.04)] ${bgClass}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-lg">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <span className="material-symbols-outlined icon-fill text-xl">{icon}</span>
        </div>
        <h3 className="text-title-sm text-on-surface">{title}</h3>
      </div>

      {/* Body */}
      <div>
        <p className="text-body-sm text-on-surface-variant mb-md">
          Based on the AI findings, consider the following next steps:
        </p>
        <ul className="space-y-sm">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-sm text-body-sm text-on-surface">
              <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">arrow_forward</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-lg p-md bg-surface-container-low rounded-lg border border-outline-variant flex items-start gap-sm">
        <span className="material-symbols-outlined text-tertiary-container shrink-0">gavel</span>
        <p className="text-body-sm text-on-surface-variant">
          Always consult a licensed medical professional before making clinical decisions.
        </p>
      </div>
    </div>
  );
}
