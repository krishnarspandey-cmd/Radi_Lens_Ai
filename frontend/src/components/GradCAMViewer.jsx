import { useState, useEffect } from 'react';
import { generateGradCAM } from '../api';
import './GradCAMViewer.css';

export default function GradCAMViewer({ file, originalPreview }) {
  const [activeTab, setActiveTab] = useState('original');
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // We only fetch GradCAM if user switches to the heatmap tab and we don't have it yet
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
    <div className="gradcam-container glass">
      <div className="section-header">
        <h3 className="section-title">Explainability</h3>
        <p className="section-subtitle">GradCAM highlights regions influencing AI decision</p>
      </div>

      <div className="gradcam-tabs">
        <button 
          className={`tab-btn ${activeTab === 'original' ? 'active' : ''}`}
          onClick={() => setActiveTab('original')}
        >
          Original View
        </button>
        <button 
          className={`tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('heatmap')}
        >
          GradCAM Heatmap
        </button>
      </div>

      <div className="gradcam-viewport">
        {activeTab === 'original' ? (
          <img src={originalPreview} alt="Original X-ray" className="gradcam-img" />
        ) : (
          <div className="heatmap-area">
            {loading && (
              <div className="gradcam-loading">
                <div className="spinner"></div>
                <p>Generating heatmap...</p>
              </div>
            )}
            {error && <div className="gradcam-error">{error}</div>}
            {heatmap && <img src={heatmap} alt="GradCAM Heatmap" className="gradcam-img" />}
          </div>
        )}
      </div>
    </div>
  );
}
