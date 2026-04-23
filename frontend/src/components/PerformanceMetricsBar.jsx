export default function PerformanceMetricsBar({ result }) {
  if (!result || !result.models) return null;

  const totalInference = result.models.reduce((sum, m) => sum + m.inference_time_ms, 0);
  const primaryModel = result.models.find(m => m.is_primary)?.name || 'Unknown';
  const size = result.image_size ? result.image_size.join('×') : '224×224';

  return (
    <div className="flex justify-center gap-lg p-md bg-surface-container-low rounded-lg border border-outline-variant text-body-sm flex-wrap">
      <span className="flex items-center gap-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-base text-primary">timer</span>
        Total: <strong className="text-on-surface">{Math.round(totalInference)}ms</strong>
      </span>
      <span className="flex items-center gap-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-base text-primary">psychology</span>
        Primary: <strong className="text-on-surface">{primaryModel}</strong>
      </span>
      <span className="flex items-center gap-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-base text-primary">photo_size_select_actual</span>
        Size: <strong className="text-on-surface">{size}</strong>
      </span>
      <span className="flex items-center gap-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-base text-primary">schedule</span>
        {new Date().toLocaleTimeString()}
      </span>
    </div>
  );
}
