import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DiagnosticHub from './pages/DiagnosticHub';
import PatientRecords from './pages/PatientRecords';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DiagnosticHub />} />
            <Route path="/records" element={<PatientRecords />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
