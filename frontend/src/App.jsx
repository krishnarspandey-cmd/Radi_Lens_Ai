import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import MedicalDisclaimerModal from './components/MedicalDisclaimerModal';
import SeverityScoreCard from './components/SeverityScoreCard';
import MultiModelComparisonTable from './components/MultiModelComparisonTable';
import ConfidenceCharts from './components/ConfidenceCharts';
import GradCAMViewer from './components/GradCAMViewer';
import AISuggestionPanel from './components/AISuggestionPanel';
import PDFReportGenerator from './components/PDFReportGenerator';
import AnalysisHistory from './components/AnalysisHistory';
import PerformanceMetricsBar from './components/PerformanceMetricsBar';
import { analyzeXRay } from './api';
import './App.css';

const STATE = { IDLE: 'idle', LOADING: 'loading', RESULT: 'result', ERROR: 'error' };

export default function App() {
  const [appState, setAppState] = useState(STATE.IDLE);
  const [result, setResult]     = useState(null);
  const [fileToAnalyze, setFileToAnalyze] = useState(null);
  const [preview, setPreview]   = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const saveHistory = (res, url) => {
    try {
      const stored = localStorage.getItem('radilens-history');
      let history = stored ? JSON.parse(stored) : [];
      history.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        primaryResult: res.primary_result,
        previewUrl: url
      });
      if (history.length > 5) history = history.slice(0, 5);
      localStorage.setItem('radilens-history', JSON.stringify(history));
      // Dispatch custom event to tell AnalysisHistory to update if we decide to
      window.dispatchEvent(new Event('storage'));
    } catch (e) { console.error('History save error', e); }
  };

  const handleFileSelected = useCallback(async (file) => {
    // Create image preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileToAnalyze(file);
    setAppState(STATE.LOADING);
    setErrorMsg('');

    try {
      const data = await analyzeXRay(file);
      if (!data.primary_result || data.models.length === 0) {
        throw new Error('AI Engine loaded 0 diagnostic models. Please ensure the .pth files are placed strictly in the `ai_models` folder on Hugging Face.');
      }
      setResult(data);
      saveHistory(data, objectUrl);
      setAppState(STATE.RESULT);
    } catch (err) {
      console.error('Analysis error:', err);
      let msg = 'An unexpected error occurred. Please try again.';
      if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        msg = 'Request timed out. Models might be loading — please try again.';
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        msg = 'Cannot connect to backend. Please ensure AI service & Gateway are running.';
      }
      setErrorMsg(msg);
      setAppState(STATE.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileToAnalyze(null);
    setResult(null);
    setErrorMsg('');
    setAppState(STATE.IDLE);
  }, [preview]);

  const handleSelectHistoryItem = () => {
    // We could load the history item here. For simplicity, just reset or do nothing.
    alert("Viewing past history details is not fully implemented in this preview. Please upload a new image.");
  };

  return (
    <div className="app">
      <MedicalDisclaimerModal />
      <Navbar />

      <main className="main">
        {/* ── Hero ──────────────────────────────────────────── */}
        {appState === STATE.IDLE && (
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Advanced AI Dashboard Active
            </div>
            <h1 id="hero-heading" className="hero-title">
              Detect Pneumonia<br/>
              <span className="hero-gradient">Intelligently</span>
            </h1>
            <p className="hero-desc">
              Upload a chest X-ray image and our multi-model ensemble will analyze it,
              delivering robust predictions, GradCAM heatmaps, and actionable insights.
            </p>
          </section>
        )}

        {/* ── Main Upload/Error State ─────────────────────────────────────── */}
        {(appState === STATE.IDLE || appState === STATE.LOADING || appState === STATE.ERROR) && (
          <div className="card glass" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '40px' }}>
            {appState === STATE.IDLE && (
              <div className="card-content">
                <div className="card-header">
                  <h2 className="card-title">Upload X-Ray Image</h2>
                  <p className="card-subtitle">JPEG or PNG · Max 50MB</p>
                </div>
                <UploadZone onFileSelected={handleFileSelected} disabled={false} />
              </div>
            )}

            {appState === STATE.LOADING && (
              <div className="card-content">
                {preview && (
                  <div className="preview-strip">
                    <img src={preview} alt="Uploaded X-ray preview" className="preview-thumb" />
                    <div>
                      <p className="preview-label">Image uploaded</p>
                      <p className="preview-sub">Running multi-model analysis…</p>
                    </div>
                  </div>
                )}
                <LoadingSpinner />
              </div>
            )}

            {appState === STATE.ERROR && (
              <div className="card-content error-state">
                <div className="error-icon" aria-hidden="true">❌</div>
                <h2 className="error-title">Analysis Failed</h2>
                <p className="error-message">{errorMsg}</p>
                <div className="error-tips">
                  <p>Troubleshooting checklist:</p>
                  <ul>
                    <li>FastAPI AI service running on <code>port 8000</code>?</li>
                    <li>Spring Boot backend running on <code>port 8080</code>?</li>
                  </ul>
                </div>
                <button id="retry-btn" className="btn-primary" onClick={handleReset}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2 4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Result Dashboard ──────────────────────────────────────────────── */}
        {appState === STATE.RESULT && result && (
          <div className="dashboard-container result-capture-zone">
            
            {/* 1. Header Card with Primary Result */}
            <ResultCard result={result.primary_result} />
            
            {/* 2. RALE Severity Score Card (Replacement for Risk Indicator) */}
            <SeverityScoreCard 
              raleScore={result.primary_result.rale_score} 
              severity={result.primary_result.severity} 
            />

            {/* 3. Multi-Model Table */}
            <MultiModelComparisonTable models={result.models} />

            {/* 4. Confidence Analytics Charts */}
            <ConfidenceCharts models={result.models} primaryResult={result.primary_result} />

            {/* 5. GradCAM Viewer */}
            <GradCAMViewer file={fileToAnalyze} originalPreview={preview} />

            {/* 6. AI Suggestion Panel */}
            <AISuggestionPanel 
              prediction={result.primary_result.prediction} 
              confidence={result.primary_result.confidence} 
            />

            {/* 7. Performance Metrics */}
            <PerformanceMetricsBar result={result} />

            {/* 8. Actions (PDF + Reset) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
              <PDFReportGenerator />
              <button className="btn-primary" onClick={handleReset} style={{ padding: '0 28px' }}>
                Start New Analysis
              </button>
            </div>
          </div>
        )}

        {appState === STATE.IDLE && (
          <AnalysisHistory onSelectHistoryItem={handleSelectHistoryItem} />
        )}
      </main>
    </div>
  );
}
