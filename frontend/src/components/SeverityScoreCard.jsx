export default function SeverityScoreCard({ raleScore, severity }) {
  let bgClass = 'bg-secondary-container/20 border-secondary/20';
  let iconBg = 'bg-secondary-container';
  let iconColor = 'text-on-secondary-container';
  let icon = 'check_circle';

  if (severity === 'Mild') {
    bgClass = 'bg-secondary-container/10 border-secondary/20';
    icon = 'info';
  } else if (severity === 'Moderate') {
    bgClass = 'bg-tertiary-fixed/20 border-tertiary/20';
    iconBg = 'bg-tertiary-fixed';
    iconColor = 'text-on-tertiary-fixed';
    icon = 'warning';
  } else if (severity === 'Severe') {
    bgClass = 'bg-error-container/30 border-error/20';
    iconBg = 'bg-error-container';
    iconColor = 'text-on-error-container';
    icon = 'emergency';
  }

  return (
    <div className={`rounded-xl border p-lg ${bgClass} shadow-[0_2px_4px_rgba(0,0,0,0.04)]`}>
      <div className="flex items-start gap-md">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <span className={`material-symbols-outlined icon-fill text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-title-sm text-on-surface">
            Clinical Severity (RALE Proxy): <strong>{severity}</strong>
          </p>
          <div className="flex items-baseline gap-sm mt-sm">
            <span className="text-display-lg text-on-surface">{raleScore}</span>
            <span className="text-body-main text-on-surface-variant">/ 8</span>
            <span className="text-body-sm text-on-surface-variant ml-md">Estimated Lung Opacity Index</span>
          </div>

          {/* Score Bar */}
          <div className="mt-md w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                severity === 'Severe' ? 'bg-error' : severity === 'Moderate' ? 'bg-tertiary' : 'bg-secondary'
              }`}
              style={{ width: `${(raleScore / 8) * 100}%` }}
            />
          </div>

          <p className="mt-md text-body-sm text-on-surface-variant italic opacity-80">
            Reference: Warren MA, et al. "Severity scoring of lung oedema on the chest radiograph is associated with clinical outcomes in ARDS." Thorax 73(9): 840–846 (2018).
          </p>
        </div>
      </div>
    </div>
  );
}
