import { useEffect, useRef } from 'react';

const RING_RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ResultCard({ result }) {
  const prediction = result.prediction;
  const confidence = result.confidence;
  const isPneumonia = prediction === 'PNEUMONIA';
  const pct = Math.round(confidence * 100);

  const ringRef = useRef(null);
  useEffect(() => {
    if (!ringRef.current) return;
    const target = CIRCUMFERENCE * (1 - confidence);
    ringRef.current.style.strokeDashoffset = CIRCUMFERENCE;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ringRef.current.style.strokeDashoffset = target;
      });
    });
  }, [confidence]);

  return (
    <div className={`bg-surface-container-lowest border rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.04)] ${
      isPneumonia ? 'border-error/30' : 'border-secondary/30'
    }`}>
      {/* Top Badge */}
      <p className="text-label-bold text-on-surface-variant uppercase mb-2">AI Prediction</p>

      <div className="flex items-center justify-between gap-md">
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isPneumonia ? 'bg-error-container' : 'bg-secondary-container'
          }`}>
            <span className={`material-symbols-outlined icon-fill text-2xl ${
              isPneumonia ? 'text-on-error-container' : 'text-on-secondary-container'
            }`}>
              {isPneumonia ? 'warning' : 'check_circle'}
            </span>
          </div>
          <div>
            <h2 className={`text-display-lg ${isPneumonia ? 'text-error' : 'text-secondary'}`}>
              {isPneumonia ? 'PNEUMONIA' : 'NORMAL'}
            </h2>
            <p className="text-body-sm text-on-surface-variant">Primary AI Consensus Result</p>
          </div>
        </div>

        {/* Right: Confidence Ring */}
        <div className="shrink-0">
          <svg width="100" height="100" viewBox="0 0 140 140" role="img">
            <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="#e0e2ea" strokeWidth="8" />
            <circle
              ref={ringRef}
              cx="70" cy="70" r={RING_RADIUS} fill="none"
              stroke={isPneumonia ? '#ba1a1a' : '#006a60'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE}
              transform="rotate(-90 70 70)"
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
                filter: `drop-shadow(0 0 6px ${isPneumonia ? 'rgba(186,26,26,0.3)' : 'rgba(0,106,96,0.3)'})`
              }}
            />
            <text x="70" y="66" textAnchor="middle" fill={isPneumonia ? '#ba1a1a' : '#006a60'} fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">
              {pct}%
            </text>
            <text x="70" y="82" textAnchor="middle" fill="#717783" fontSize="11" fontFamily="Inter, sans-serif">
              confidence
            </text>
          </svg>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-md">
        <div className="flex justify-between mb-1">
          <span className="text-label-bold text-on-surface-variant">Confidence Level</span>
          <span className="text-data-mono text-primary">{pct}%</span>
        </div>
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isPneumonia ? 'bg-error' : 'bg-secondary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
