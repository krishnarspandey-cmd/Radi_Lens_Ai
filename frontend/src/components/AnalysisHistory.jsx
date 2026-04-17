import { useState, useEffect } from 'react';
import './AnalysisHistory.css';

export default function AnalysisHistory({ onSelectHistoryItem }) {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only parse history on mount or when it changes via other means
    const stored = localStorage.getItem('radilens-history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse history:', err);
      }
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <div className={`history-panel glass ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="history-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>Recent Analyses ({history.length})</span>
        <svg 
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="history-list">
          {history.map((item) => {
            const isPneumonia = item.primaryResult.prediction === 'PNEUMONIA';
            const pct = Math.round(item.primaryResult.confidence * 100);
            return (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => onSelectHistoryItem(item)}
              >
                <img src={item.previewUrl} alt="Thumbnail" className="history-thumb" />
                <div className="history-info">
                  <span className={`history-label ${isPneumonia ? 'hist-pneu' : 'hist-norm'}`}>
                    {item.primaryResult.prediction} ({pct}%)
                  </span>
                  <span className="history-date">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
