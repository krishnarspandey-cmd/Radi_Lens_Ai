import { useEffect, useRef } from 'react';
import './ResultCard.css';

const PNEUMONIA_COLOR = '#f87171';
const NORMAL_COLOR    = '#4ade80';
const RING_RADIUS     = 54;
const CIRCUMFERENCE   = 2 * Math.PI * RING_RADIUS;

export default function ResultCard({ result }) {
  // Check if primary_result structure
  const prediction = result.prediction;
  const confidence = result.confidence;

  const isPneumonia = prediction === 'PNEUMONIA';
  const color = isPneumonia ? PNEUMONIA_COLOR : NORMAL_COLOR;
  const pct   = Math.round(confidence * 100);

  /* Animate the confidence ring on mount */
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
    <div className={`result-card ${isPneumonia ? 'pneumonia' : 'normal'}`} style={{ paddingBottom: '24px' }}>
      <div className="result-banner" style={{ background: 'transparent', padding: '10px 0', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="result-icon" aria-hidden="true" style={{ fontSize: '3rem', background: isPneumonia ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', padding: '16px', borderRadius: '20px' }}>
            {isPneumonia ? '🫁' : '✅'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-primary)' }}>
              {isPneumonia ? 'Pneumonia Detected' : 'Normal Scan'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Primary AI Consensus Result
            </p>
          </div>
        </div>

        <div className="confidence-ring-wrap" style={{ transform: 'scale(0.85)' }}>
          <svg width="140" height="140" viewBox="0 0 140 140" role="img">
            <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
            <circle
              ref={ringRef}
              cx="70" cy="70" r={RING_RADIUS} fill="none"
              stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color})` }}
            />
            <text x="70" y="66" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="Inter, sans-serif">{pct}%</text>
            <text x="70" y="82" textAnchor="middle" fill="#8892b0" fontSize="11" fontFamily="Inter, sans-serif">confidence</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
