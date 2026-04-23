import { useState, useCallback } from 'react';
import UploadZone from '../components/UploadZone';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultCard from '../components/ResultCard';
import SeverityScoreCard from '../components/SeverityScoreCard';
import MultiModelComparisonTable from '../components/MultiModelComparisonTable';
import ConfidenceCharts from '../components/ConfidenceCharts';
import GradCAMViewer from '../components/GradCAMViewer';
import AISuggestionPanel from '../components/AISuggestionPanel';
import PerformanceMetricsBar from '../components/PerformanceMetricsBar';
import PDFReportGenerator from '../components/PDFReportGenerator';
import { analyzeXRay } from '../api';

const STATE = { IDLE: 'idle', LOADING: 'loading', RESULT: 'result', ERROR: 'error' };

export default function DiagnosticHub() {
  const [appState, setAppState] = useState(STATE.IDLE);
  const [result, setResult] = useState(null);
  const [fileToAnalyze, setFileToAnalyze] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [generateHeatmap, setGenerateHeatmap] = useState(true);

  const saveHistory = (res, url) => {
    try {
      const stored = localStorage.getItem('radilens-history');
      let history = stored ? JSON.parse(stored) : [];
      history.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        primaryResult: res.primary_result,
        previewUrl: url,
      });
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem('radilens-history', JSON.stringify(history));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('History save error', e);
    }
  };

  const handleFileSelected = useCallback(async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileToAnalyze(file);
    setAppState(STATE.LOADING);
    setErrorMsg('');

    try {
      const data = await analyzeXRay(file);
      if (!data.primary_result || data.models.length === 0) {
        throw new Error('AI Engine loaded 0 diagnostic models.');
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

  const isPneumonia = result?.primary_result?.prediction === 'PNEUMONIA';
  const confidence = result?.primary_result?.confidence;
  const pct = confidence ? Math.round(confidence * 100) : 0;

  return (
    <div className="p-lg lg:p-container-margin">
      <div className="max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="mb-lg">
          <h1 className="text-display-lg text-on-surface mb-2">Pneumonia Detection System</h1>
          <p className="text-body-main text-on-surface-variant">
            AI-powered chest X-ray analysis for clinical decision support.
          </p>
        </div>

        {/* ── IDLE / LOADING / ERROR ── */}
        {appState !== STATE.RESULT && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            {/* Left Column: Upload & Options */}
            <div className="lg:col-span-5 flex flex-col gap-lg">
              {/* Upload Zone */}
              <UploadZone
                onFileSelected={handleFileSelected}
                disabled={appState === STATE.LOADING}
              />

              {/* Analysis Controls */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                <h4 className="text-title-sm text-on-surface mb-md">Analysis Options</h4>

                <div className="flex items-center justify-between mb-sm">
                  <span className="text-body-sm text-on-surface">Generate Heatmap</span>
                  <button
                    onClick={() => setGenerateHeatmap(!generateHeatmap)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                      generateHeatmap ? 'bg-primary-container' : 'bg-surface-variant'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${
                        generateHeatmap ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-md">
                  <span className="text-body-sm text-on-surface">Include Detailed Report</span>
                  <div className="w-10 h-5 bg-primary-container rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </div>

                {appState === STATE.LOADING ? (
                  <LoadingSpinner />
                ) : appState === STATE.ERROR ? (
                  <div className="text-center">
                    <div className="text-error text-body-sm mb-md p-md bg-error-container/30 rounded-lg">
                      <span className="material-symbols-outlined text-lg align-middle mr-1">error</span>
                      {errorMsg}
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full bg-primary text-on-primary text-title-sm py-md rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">refresh</span>
                      Try Again
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-primary-container text-on-primary text-title-sm py-md rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">analytics</span>
                    Run Analysis
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Preview / Waiting */}
            <div className="lg:col-span-7 flex flex-col gap-lg">
              {/* Placeholder Result Area */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-md">
                <div>
                  <p className="text-label-bold text-on-surface-variant uppercase mb-1">AI Prediction</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-2xl">hourglass_empty</span>
                    <h2 className="text-display-lg text-outline">AWAITING SCAN</h2>
                  </div>
                </div>
                <div className="w-full md:w-48 text-right">
                  <div className="flex justify-between mb-1">
                    <span className="text-label-bold text-on-surface-variant">Confidence</span>
                    <span className="text-data-mono text-outline">—</span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>

              {/* Image preview placeholders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md flex-1">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="p-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <span className="text-label-bold text-on-surface">Original X-Ray</span>
                    <button className="text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-lg">zoom_in</span>
                    </button>
                  </div>
                  <div className="flex-grow bg-slate-900 relative min-h-[240px] flex items-center justify-center">
                    {preview ? (
                      <img src={preview} alt="Uploaded X-Ray" className="w-full h-full object-contain opacity-80" />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl">image</span>
                        <span className="text-body-sm">Upload an image to preview</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="p-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <span className="text-label-bold text-on-surface">AI Heatmap Highlight</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                      <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" />
                    </div>
                  </div>
                  <div className="flex-grow bg-slate-900 relative min-h-[240px] flex items-center justify-center">
                    <div className="text-slate-500 flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl">gradient</span>
                      <span className="text-body-sm">Heatmap appears after analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT STATE ── */}
        {appState === STATE.RESULT && result && (
          <div className="space-y-lg result-capture-zone">
            {/* Top Row: Result Summary + Image Viewers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
              {/* Left: Result + Controls */}
              <div className="lg:col-span-5 flex flex-col gap-lg">
                {/* Result Summary Card */}
                <ResultCard result={result.primary_result} />

                {/* Severity Score */}
                <SeverityScoreCard
                  raleScore={result.primary_result.rale_score}
                  severity={result.primary_result.severity}
                />

                {/* Actions */}
                <div className="flex gap-md">
                  <PDFReportGenerator />
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface text-title-sm py-md rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">restart_alt</span>
                    New Scan
                  </button>
                </div>

                {/* Performance Metrics */}
                <PerformanceMetricsBar result={result} />
              </div>

              {/* Right: Image Viewers */}
              <div className="lg:col-span-7 flex flex-col gap-lg">
                <GradCAMViewer file={fileToAnalyze} originalPreview={preview} />
              </div>
            </div>

            {/* Model Comparison */}
            <MultiModelComparisonTable models={result.models} />

            {/* Charts */}
            <ConfidenceCharts models={result.models} primaryResult={result.primary_result} />

            {/* AI Suggestions */}
            <AISuggestionPanel
              prediction={result.primary_result.prediction}
              confidence={result.primary_result.confidence}
            />

            {/* Disclaimer */}
            <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant flex items-start gap-md">
              <span className="material-symbols-outlined text-primary-container shrink-0">info</span>
              <p className="text-body-sm text-on-surface-variant">
                <strong>Medical Disclaimer:</strong> This AI system is for research and educational purposes only.
                All diagnostic results must be verified by a licensed medical professional before any clinical decisions are made.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
