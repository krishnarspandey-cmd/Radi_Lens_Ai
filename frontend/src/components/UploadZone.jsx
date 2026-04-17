import { useCallback, useState } from 'react';
import './UploadZone.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 50;

export default function UploadZone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG or PNG image.';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelected(file);
  }, [onFileSelected]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [disabled, handleFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset value so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="upload-wrapper">
      <label
        id="upload-zone"
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload chest X-ray image"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
      >
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="upload-input"
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
        />

        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="url(#uploadGrad)" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M24 32V20M24 20L19 25M24 20L29 25" stroke="url(#uploadGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="16" y="33" width="16" height="2.5" rx="1.25" fill="url(#uploadGrad)"/>
            <defs>
              <linearGradient id="uploadGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8"/>
                <stop offset="1" stopColor="#818cf8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="upload-text">
          <p className="upload-title">
            {isDragging ? 'Drop your X-ray here' : 'Upload Chest X-Ray'}
          </p>
          <p className="upload-subtitle">
            Drag & drop or <span className="upload-link">click to browse</span>
          </p>
          <p className="upload-hint">Supports JPEG, PNG · Max {MAX_SIZE_MB}MB</p>
        </div>

        <div className="upload-badges">
          <span className="upload-badge">
            <span>🔒</span> Secure
          </span>
          <span className="upload-badge">
            <span>⚡</span> Real-time
          </span>
          <span className="upload-badge">
            <span>🤖</span> AI-Powered
          </span>
        </div>
      </label>

      {error && (
        <div className="upload-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
            <path d="M8 5v4M8 11v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
