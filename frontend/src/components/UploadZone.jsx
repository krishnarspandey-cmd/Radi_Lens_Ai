import { useCallback, useState } from 'react';

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
    e.target.value = '';
  };

  return (
    <div>
      <label
        id="upload-zone"
        className={`
          bg-surface-container-lowest border-2 border-dashed rounded-xl p-xl
          flex flex-col items-center justify-center text-center cursor-pointer
          transition-all duration-200 min-h-[256px]
          ${isDragging
            ? 'upload-drag-active border-primary bg-surface-container-low'
            : 'border-outline-variant hover:bg-surface-container-low hover:border-primary/50'
          }
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
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
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
        />

        <span className="material-symbols-outlined text-4xl text-primary mb-4">upload_file</span>
        <h3 className="text-title-sm text-on-surface mb-xs">
          {isDragging ? 'Drop your X-ray here' : 'Upload Chest X-Ray'}
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-md">
          Drag and drop DICOM or JPEG files here, or click to browse.
        </p>
        <span className="bg-primary-container text-on-primary text-label-bold px-md py-sm rounded-lg hover:opacity-90 transition-opacity inline-block">
          Select File
        </span>
      </label>

      {error && (
        <div className="mt-sm flex items-center gap-sm text-error text-body-sm bg-error-container/30 p-sm rounded-lg" role="alert">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}
    </div>
  );
}
