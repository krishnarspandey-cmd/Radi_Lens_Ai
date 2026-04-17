import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './ConfidenceCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = "'Inter', sans-serif";

export default function ConfidenceCharts({ models, primaryResult }) {
  if (!models || models.length === 0 || !primaryResult) return null;

  const barData = {
    labels: models.map(m => m.name),
    datasets: [
      {
        label: 'Confidence (%)',
        data: models.map(m => Math.round(m.confidence * 100)),
        backgroundColor: [
          'rgba(56, 189, 248, 0.8)', // ResNet18 - Cyan
          'rgba(192, 132, 252, 0.8)', // DenseNet121 - Purple
          'rgba(251, 146, 60, 0.8)',   // VGG16 - Orange
        ],
        borderColor: [
          '#38bdf8',
          '#c084fc',
          '#fb923c',
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { stepSize: 20 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const isPrimaryPneumonia = primaryResult.prediction === 'PNEUMONIA';
  const pneuPct = isPrimaryPneumonia ? Math.round(primaryResult.confidence * 100) : 100 - Math.round(primaryResult.confidence * 100);
  const normPct = 100 - pneuPct;

  const doughnutData = {
    labels: ['PNEUMONIA', 'NORMAL'],
    datasets: [
      {
        data: [pneuPct, normPct],
        backgroundColor: [
          'rgba(248, 113, 113, 0.8)', // Red
          'rgba(74, 222, 128, 0.8)',  // Green
        ],
        borderColor: [
          '#f87171',
          '#4ade80',
        ],
        borderWidth: 1,
        hoverOffset: 4
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true }
      }
    }
  };

  return (
    <div className="charts-container glass">
      <div className="section-header">
        <h3 className="section-title">Confidence Analytics</h3>
        <p className="section-subtitle">Visualizing model agreement and probabilities</p>
      </div>
      
      <div className="charts-grid">
        <div className="chart-wrapper">
          <h4 className="chart-title">Confidence per Model</h4>
          <div className="chart-canvas-wrap bar-wrap">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chart-wrapper">
          <h4 className="chart-title">Class Distribution (Primary)</h4>
          <div className="chart-canvas-wrap doughnut-wrap">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="doughnut-center-txt">
              <span>{Math.max(pneuPct, normPct)}%</span>
              <p>{isPrimaryPneumonia ? 'Pneumonia' : 'Normal'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
