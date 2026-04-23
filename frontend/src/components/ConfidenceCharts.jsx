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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Light theme defaults
ChartJS.defaults.color = '#414752';
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
          'rgba(25, 118, 210, 0.7)',   // Primary blue
          'rgba(0, 106, 96, 0.7)',     // Secondary teal
          'rgba(148, 71, 0, 0.7)',     // Tertiary orange
        ],
        borderColor: ['#1976d2', '#006a60', '#944700'],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
        ticks: { stepSize: 20 },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const isPrimaryPneumonia = primaryResult.prediction === 'PNEUMONIA';
  const pneuPct = isPrimaryPneumonia
    ? Math.round(primaryResult.confidence * 100)
    : 100 - Math.round(primaryResult.confidence * 100);
  const normPct = 100 - pneuPct;

  const doughnutData = {
    labels: ['PNEUMONIA', 'NORMAL'],
    datasets: [
      {
        data: [pneuPct, normPct],
        backgroundColor: ['rgba(186, 26, 26, 0.7)', 'rgba(0, 106, 96, 0.7)'],
        borderColor: ['#ba1a1a', '#006a60'],
        borderWidth: 1,
        hoverOffset: 4,
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
        labels: { padding: 20, usePointStyle: true },
      },
    },
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)] p-lg">
      <div className="mb-lg">
        <h3 className="text-title-sm text-on-surface">Confidence Analytics</h3>
        <p className="text-body-sm text-on-surface-variant mt-1">Visualizing model agreement and probabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div>
          <h4 className="text-label-bold text-on-surface-variant uppercase mb-md">Confidence per Model</h4>
          <div className="h-[250px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div>
          <h4 className="text-label-bold text-on-surface-variant uppercase mb-md">Class Distribution (Primary)</h4>
          <div className="h-[250px] relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-20px' }}>
              <span className="text-display-lg text-on-surface">{Math.max(pneuPct, normPct)}%</span>
              <p className="text-body-sm text-on-surface-variant">
                {isPrimaryPneumonia ? 'Pneumonia' : 'Normal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
