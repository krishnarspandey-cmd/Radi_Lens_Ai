export default function MultiModelComparisonTable({ models }) {
  if (!models || models.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-lg border-b border-outline-variant">
        <h3 className="text-title-sm text-on-surface">Model Comparison</h3>
        <p className="text-body-sm text-on-surface-variant mt-1">Results across multiple deep learning architectures</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-variant text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Model</th>
              <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Prediction</th>
              <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Confidence</th>
              <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Inference Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant bg-surface-container-lowest">
            {models.map((model) => {
              const isPneumonia = model.prediction === 'PNEUMONIA';
              const pct = Math.round(model.confidence * 100);

              return (
                <tr
                  key={model.name}
                  className={`hover:bg-surface-container-low/50 transition-colors ${
                    model.is_primary ? 'bg-primary-fixed/5' : ''
                  }`}
                >
                  <td className="whitespace-nowrap py-3 px-md">
                    <div className="flex items-center gap-2">
                      <span className="text-title-sm text-on-surface text-sm font-semibold">{model.name}</span>
                      {model.is_primary && (
                        <span className="inline-flex items-center rounded-full bg-primary-fixed px-2 py-0.5 text-label-bold text-on-primary-fixed">
                          Primary
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-md">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-bold ${
                      isPneumonia
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPneumonia ? 'bg-error' : 'bg-secondary'}`} />
                      {model.prediction}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 px-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-24 bg-surface-variant h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isPneumonia ? 'bg-error' : 'bg-secondary'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-data-mono text-on-surface w-10">{pct}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 px-md text-data-mono text-on-surface-variant">
                    {model.inference_time_ms} ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
