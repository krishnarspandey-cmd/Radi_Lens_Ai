import { useState, useEffect } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7D');
  const [stats, setStats] = useState({ total: 0, pneumonia: 0, normal: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('radilens-history');
    if (stored) {
      try {
        const history = JSON.parse(stored);
        const pneumonia = history.filter(h => h.primaryResult?.prediction === 'PNEUMONIA').length;
        setStats({
          total: history.length,
          pneumonia,
          normal: history.length - pneumonia,
        });
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const detectionRate = stats.total > 0 ? ((stats.pneumonia / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-lg lg:p-container-margin">
      <div className="max-w-[1440px] mx-auto space-y-lg">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded p-xs">
            {['7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-md py-xs text-label-bold rounded-sm transition-colors ${
                  timeRange === range
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {range}
              </button>
            ))}
            <div className="w-px h-4 bg-outline-variant mx-xs" />
            <button className="flex items-center gap-xs px-md py-xs text-on-surface-variant hover:bg-surface-container text-label-bold rounded-sm transition-colors">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <span>Custom</span>
            </button>
          </div>
          <div className="flex gap-md">
            <button className="h-10 px-md flex items-center gap-sm border border-outline-variant rounded text-on-surface text-label-bold hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Export CSV</span>
            </button>
            <button className="h-10 px-md flex items-center gap-sm bg-primary-container text-on-primary-container rounded text-label-bold hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Model Accuracy */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-title-sm text-on-surface-variant">Model Accuracy</span>
              <span className="material-symbols-outlined text-secondary-container">target</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-display-lg text-on-surface">
                98.4<span className="text-body-main text-on-surface-variant">%</span>
              </div>
              <div className="flex items-center gap-xs text-secondary text-label-bold bg-secondary-fixed/20 px-sm py-xs rounded-sm">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                <span>0.2%</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary-fixed opacity-10 rounded-full blur-2xl" />
          </div>

          {/* Total Scans */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-title-sm text-on-surface-variant">Total Scans Analyzed</span>
              <span className="material-symbols-outlined text-primary-container">radiology</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-display-lg text-on-surface">{stats.total.toLocaleString()}</div>
              <div className="flex items-center gap-xs text-secondary text-label-bold bg-secondary-fixed/20 px-sm py-xs rounded-sm">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                <span>5.4%</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-fixed opacity-10 rounded-full blur-2xl" />
          </div>

          {/* Detection Rate */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-title-sm text-on-surface-variant">Pneumonia Detection Rate</span>
              <span className="material-symbols-outlined text-tertiary-container">warning</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-display-lg text-on-surface">
                {detectionRate}<span className="text-body-main text-on-surface-variant">%</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant text-label-bold bg-surface-container-high px-sm py-xs rounded-sm">
                <span className="material-symbols-outlined text-sm">horizontal_rule</span>
                <span>0.0%</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary-fixed opacity-10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md" style={{ minHeight: '400px' }}>
          {/* Detection Trends */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg lg:col-span-2 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-title-sm text-on-surface">Detection Trends</h3>
              <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">more_vert</button>
            </div>
            {/* Chart */}
            <div className="flex-1 relative w-full" style={{ minHeight: '280px' }}>
              {/* Y-Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-body-sm text-data-mono text-outline-variant items-end pr-sm">
                <span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
              </div>
              {/* Grid Lines */}
              <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-full border-t border-outline-variant ${i < 4 ? 'border-dashed opacity-50' : 'opacity-100'} h-0`} />
                ))}
              </div>
              {/* SVG Chart Lines */}
              <div className="absolute left-8 right-0 top-0 bottom-6">
                <svg className="overflow-visible" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q10,75 20,60 T40,50 T60,65 T80,40 T100,30" fill="none" stroke="#e0e2ea" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0,95 Q15,90 30,85 T50,80 T70,75 T90,60 T100,55" fill="none" stroke="#1976d2" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  <path d="M0,95 Q15,90 30,85 T50,80 T70,75 T90,60 T100,55 L100,100 L0,100 Z" fill="url(#blueGrad)" opacity="0.2" />
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1976d2" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* X-Axis */}
              <div className="absolute left-8 right-0 bottom-0 h-6 flex justify-between text-body-sm text-data-mono text-outline-variant items-end">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-md mt-sm">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-surface-variant" />
                <span className="text-body-sm text-on-surface-variant">Normal Scans</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-primary-container" />
                <span className="text-body-sm text-on-surface-variant">Pneumonia Detected</span>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col">
            <h3 className="text-title-sm text-on-surface mb-lg">Prediction Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="relative w-48 h-48 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#1976d2 0% ${detectionRate}%, #e0e2ea ${detectionRate}% 100%)`,
                }}
              >
                <div className="absolute w-32 h-32 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center">
                  <span className="text-display-lg text-on-surface">{detectionRate}%</span>
                  <span className="text-body-sm text-on-surface-variant text-center leading-tight">
                    Positivity<br />Rate
                  </span>
                </div>
              </div>
              {/* Legend */}
              <div className="mt-xl w-full space-y-sm">
                <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                  <div className="flex items-center gap-sm">
                    <div className="w-3 h-3 rounded-sm bg-surface-variant" />
                    <span className="text-body-sm text-on-surface-variant">Normal (Negative)</span>
                  </div>
                  <span className="text-data-mono text-on-surface">{stats.normal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-sm">
                    <div className="w-3 h-3 rounded-sm bg-primary-container" />
                    <span className="text-body-sm text-on-surface-variant">Pneumonia (Positive)</span>
                  </div>
                  <span className="text-data-mono text-on-surface">{stats.pneumonia.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
          <div className="flex justify-between items-center mb-lg">
            <div>
              <h3 className="text-title-sm text-on-surface">System Confidence Heatmap</h3>
              <p className="text-body-sm text-on-surface-variant">
                Aggregated focal points across positive detections (Top 100 recent scans).
              </p>
            </div>
            <button className="text-primary hover:text-primary-container text-label-bold flex items-center gap-xs transition-colors">
              <span>View Detailed Heatmap</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
            {/* Simulated Heatmap */}
            <div className="relative bg-surface-container rounded overflow-hidden aspect-[4/3] flex items-center justify-center border border-outline-variant">
              <div className="absolute inset-0 bg-gradient-to-br from-inverse-surface to-on-surface opacity-90 mix-blend-multiply" />
              <div className="absolute w-32 h-32 rounded-full bg-error opacity-40 blur-xl top-1/3 left-1/4" />
              <div className="absolute w-24 h-24 rounded-full bg-error opacity-60 blur-lg top-[40%] right-1/3" />
              <div className="absolute w-40 h-40 rounded-full bg-tertiary opacity-30 blur-2xl bottom-1/4 left-1/3" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
              <span className="absolute bottom-md right-md text-data-mono text-on-primary opacity-50">
                Composite: N={stats.total || 100}
              </span>
            </div>

            {/* Detection Zones */}
            <div className="flex flex-col justify-center gap-md">
              <h4 className="text-title-sm text-on-surface border-b border-outline-variant pb-xs">
                Primary Detection Zones
              </h4>
              {[
                { name: 'Right Lower Lobe (RLL)', pct: 65, color: 'bg-error' },
                { name: 'Left Lower Lobe (LLL)', pct: 42, color: 'bg-error opacity-80' },
                { name: 'Right Middle Lobe (RML)', pct: 28, color: 'bg-tertiary opacity-60' },
                { name: 'Apical Segments', pct: 12, color: 'bg-tertiary-fixed' },
              ].map((zone) => (
                <div key={zone.name} className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">{zone.name}</span>
                  <div className="flex items-center gap-sm w-1/2">
                    <div className="flex-1 bg-surface-variant h-2 rounded-full overflow-hidden">
                      <div className={`${zone.color} h-full`} style={{ width: `${zone.pct}%` }} />
                    </div>
                    <span className="text-data-mono text-on-surface w-8 text-right">{zone.pct}%</span>
                  </div>
                </div>
              ))}

              <div className="mt-md p-md bg-surface-container-low rounded border border-outline-variant flex items-start gap-md">
                <span className="material-symbols-outlined text-primary-container">info</span>
                <p className="text-body-sm text-on-surface-variant">
                  The AI model exhibits high confidence in basilar consolidations, consistent with typical
                  community-acquired pneumonia presentations in the current dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
