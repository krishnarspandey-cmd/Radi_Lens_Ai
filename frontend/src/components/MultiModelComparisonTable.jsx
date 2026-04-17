import './MultiModelComparisonTable.css';

export default function MultiModelComparisonTable({ models }) {
  if (!models || models.length === 0) return null;

  return (
    <div className="multi-model-container glass">
      <div className="section-header">
        <h3 className="section-title">Model Comparison</h3>
        <p className="section-subtitle">Results across multiple deep learning architectures</p>
      </div>
      
      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Prediction</th>
              <th>Confidence</th>
              <th>Inference Time</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const isPneumonia = model.prediction === 'PNEUMONIA';
              const pct = Math.round(model.confidence * 100);
              
              return (
                <tr key={model.name} className={model.is_primary ? 'row-primary' : ''}>
                  <td className="cell-model">
                    {model.name}
                    {model.is_primary && <span className="badge-primary">Primary</span>}
                  </td>
                  <td>
                    <span className={`pred-chip ${isPneumonia ? 'pred-pneumonia' : 'pred-normal'}`}>
                      {model.prediction}
                    </span>
                  </td>
                  <td className="cell-confidence">
                    <div className="conf-bar-bg">
                      <div 
                        className="conf-bar-fill" 
                        style={{ 
                          width: `${pct}%`,
                          backgroundColor: isPneumonia ? 'var(--red-400)' : 'var(--green-400)'
                        }}
                      />
                    </div>
                    <span className="conf-text">{pct}%</span>
                  </td>
                  <td className="cell-time">{model.inference_time_ms} ms</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
