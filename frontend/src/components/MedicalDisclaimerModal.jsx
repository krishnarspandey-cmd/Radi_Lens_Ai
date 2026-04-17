import { useState, useEffect } from 'react';
import './MedicalDisclaimerModal.css';

export default function MedicalDisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('radilens-disclaimer-seen');
    if (!hasSeen) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('radilens-disclaimer-seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <div className="modal-icon">⚠️</div>
        <h2 className="modal-title">Medical Disclaimer</h2>
        <p className="modal-text">
          This AI-Powered Pneumonia Detection system is a <strong>research prototype</strong> and is <strong>NOT</strong> intended for clinical use.
        </p>
        <p className="modal-text">
          The predictions and confidence scores provided by this tool are for educational and demonstration purposes only. They do not constitute professional medical advice, diagnosis, or treatment.
        </p>
        <p className="modal-text">
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
        <button className="btn-primary modal-btn" onClick={handleDismiss}>
          I Understand
        </button>
      </div>
    </div>
  );
}
