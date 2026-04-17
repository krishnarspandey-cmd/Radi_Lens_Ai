export default function PerformanceMetricsBar({ result }) {
  if (!result || !result.models) return null;
  
  const totalInference = result.models.reduce((sum, m) => sum + m.inference_time_ms, 0);
  const primaryModel = result.models.find(m => m.is_primary)?.name || 'Unknown';
  const size = result.image_size ? result.image_size.join('×') : '224x224';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      padding: '12px',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      color: 'var(--text-secondary)',
      border: '1px solid rgba(255,255,255,0.05)',
      flexWrap: 'wrap'
    }}>
      <span>⏱ Total Inference: <strong>{Math.round(totalInference)}ms</strong></span>
      <span>🧠 Primary: <strong>{primaryModel}</strong></span>
      <span>🖼 Size: <strong>{size}</strong></span>
      <span>📅 {new Date().toLocaleTimeString()}</span>
    </div>
  );
}
