import { useState, useEffect } from 'react';
import { generateGradCAM } from '../api';

export default function GradCAMViewer({ file, originalPreview }) {
  const [activeTab, setActiveTab] = useState('original');
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'heatmap' && !heatmap && !loading && !error) {
      const fetchGradCAM = async () => {
        setLoading(true);
        try {
          const res = await generateGradCAM(file);
          setHeatmap(res.heatmap_base64);
        } catch (err) {
          setError('Failed to generate heatmap.');
        } finally {
          setLoading(false);
        }
      };
      fetchGradCAM();
    }
  }, [activeTab, heatmap, loading, error, file]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md h-full">
      {/* Original Image */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <div
          className={`p-sm border-b flex justify-between items-center cursor-pointer transition-colors ${
            activeTab === 'original'
              ? 'bg-primary-container/10 border-primary/30'
              : 'bg-surface-container-low border-outline-variant'
          }`}
          onClick={() => setActiveTab('original')}
        >
          <span className={`text-label-bold ${activeTab === 'original' ? 'text-primary' : 'text-on-surface'}`}>
            Original X-Ray
          </span>
          <button className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
        </div>
        <div className="flex-grow bg-slate-900 relative min-h-[300px]">
          {originalPreview && (
            <img
              src={originalPreview}
              alt="Chest X-Ray Original"
              className="w-full h-full object-contain opacity-80"
            />
          )}
        </div>
      </div>

      {/* AI Heatmap */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <div
          className={`p-sm border-b flex justify-between items-center cursor-pointer transition-colors ${
            activeTab === 'heatmap'
              ? 'bg-primary-container/10 border-primary/30'
              : 'bg-surface-container-low border-outline-variant'
          }`}
          onClick={() => setActiveTab('heatmap')}
        >
          <span className={`text-label-bold ${activeTab === 'heatmap' ? 'text-primary' : 'text-on-surface'}`}>
            AI Heatmap Highlight
          </span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" />
          </div>
        </div>
        <div className="flex-grow bg-slate-900 relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin-slow" />
              <p className="mt-2 text-body-sm text-slate-400">Generating heatmap...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-error text-body-sm bg-error-container/30 p-md rounded-lg">
                <span className="material-symbols-outlined text-base align-middle mr-1">error</span>
                {error}
              </div>
            </div>
          )}
          {heatmap ? (
            <img
              src={heatmap}
              alt="GradCAM Heatmap"
              className="w-full h-full object-contain opacity-70 mix-blend-screen"
            />
          ) : !loading && !error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
              <span className="material-symbols-outlined text-4xl">gradient</span>
              <span className="text-body-sm">Click to load GradCAM heatmap</span>
            </div>
          ) : null}
          {/* Simulated overlay */}
          {heatmap && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
