import { useState, useEffect } from 'react';

export default function PatientRecords() {
  const [history, setHistory] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const stored = localStorage.getItem('radilens-history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem('radilens-history');
      if (updated) setHistory(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Demo patient names for localStorage entries
  const demoNames = [
    { name: 'Eleanor Vance', age: 68, sex: 'F', ward: 'Ward 4' },
    { name: 'Marcus Thorne', age: 42, sex: 'M', ward: 'ER' },
    { name: 'Sarah Jenkins', age: 29, sex: 'F', ward: 'Clinic A' },
    { name: 'Robert Chen', age: 74, sex: 'M', ward: 'ICU' },
    { name: 'Aisha Patel', age: 55, sex: 'F', ward: 'Ward 2' },
    { name: 'James Wilson', age: 38, sex: 'M', ward: 'ER' },
    { name: 'Maria Santos', age: 61, sex: 'F', ward: 'Ward 3' },
    { name: 'David Kim', age: 47, sex: 'M', ward: 'Clinic B' },
  ];

  // Merge history with demo data
  const records = history.map((item, i) => {
    const demo = demoNames[i % demoNames.length];
    const isPneumonia = item.primaryResult?.prediction === 'PNEUMONIA';
    const pct = Math.round((item.primaryResult?.confidence || 0) * 100);
    return {
      id: `#PT-${88200 + i}`,
      ...demo,
      date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      prediction: isPneumonia ? 'Pneumonia' : 'Normal',
      confidence: pct,
      isPneumonia,
      status: isPneumonia ? 'Pending Review' : 'Reviewed',
    };
  });

  const filtered = filterStatus === 'All'
    ? records
    : records.filter(r => (filterStatus === 'Pneumonia' ? r.isPneumonia : !r.isPneumonia));

  const pneumoniaCount = records.filter(r => r.isPneumonia).length;

  return (
    <div className="p-lg lg:p-container-margin">
      <div className="max-w-[1440px] mx-auto space-y-lg">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="text-display-lg text-on-surface">Patient Registry</h1>
            <p className="text-body-main text-on-surface-variant mt-1">
              Manage and review recent diagnostic scans across all wards.
            </p>
          </div>
          <div className="flex items-center gap-md">
            <button className="h-10 px-md rounded-lg border border-outline-variant text-primary text-body-sm font-medium hover:bg-surface-container-low transition-colors flex items-center gap-sm bg-surface-container-lowest">
              <span className="material-symbols-outlined text-lg">download</span>
              Export List
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant flex items-center gap-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
              <span className="material-symbols-outlined icon-fill">groups</span>
            </div>
            <div>
              <div className="text-body-sm text-on-surface-variant">Total Patients</div>
              <div className="text-headline-md text-on-surface mt-1">{records.length || '0'}</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant flex items-center gap-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">
              <span className="material-symbols-outlined icon-fill">radiology</span>
            </div>
            <div>
              <div className="text-body-sm text-on-surface-variant">Scans Today</div>
              <div className="text-headline-md text-on-surface mt-1">
                {records.filter(r => {
                  const today = new Date().toDateString();
                  return new Date(r.date).toDateString() === today;
                }).length}
              </div>
            </div>
          </div>

          <div className="bg-error-container rounded-xl p-md border border-error/20 flex items-center gap-md shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center shrink-0 text-on-error-container">
              <span className="material-symbols-outlined icon-fill">warning</span>
            </div>
            <div className="relative z-10">
              <div className="text-body-sm text-on-error-container/80">Flagged Cases</div>
              <div className="text-headline-md text-on-error-container mt-1">{pneumoniaCount}</div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm flex flex-col">
          {/* Filter Toolbar */}
          <div className="p-md border-b border-surface-variant flex flex-col sm:flex-row items-center gap-md justify-between bg-surface-bright rounded-t-xl">
            <div className="flex flex-wrap items-center gap-sm w-full sm:w-auto">
              <div className="relative inline-block text-left w-full sm:w-48">
                <select
                  className="w-full rounded-md bg-surface-container-lowest px-3 py-2 text-sm font-semibold text-on-surface shadow-sm ring-1 ring-inset ring-outline-variant hover:bg-surface-container-low appearance-none cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">Prediction: All</option>
                  <option value="Pneumonia">Pneumonia Only</option>
                  <option value="Normal">Normal Only</option>
                </select>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">filter_list</span>
              <input
                className="block w-full rounded-md border-0 py-1.5 pl-9 pr-3 text-on-surface ring-1 ring-inset ring-outline-variant placeholder:text-outline focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-surface-container-lowest"
                placeholder="Filter by ID or Ward..."
                type="text"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-variant text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Patient ID</th>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Name & Demographics</th>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Scan Date</th>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">AI Prediction</th>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="py-sm px-md text-label-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant bg-surface-container-lowest">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-xl text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2 block">inbox</span>
                      No scan records yet. Upload an X-ray from the Diagnostic Hub to see entries here.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="whitespace-nowrap py-3 px-md text-data-mono text-on-surface-variant">{r.id}</td>
                      <td className="whitespace-nowrap py-3 px-md">
                        <div className="text-title-sm text-on-surface text-sm font-semibold">{r.name}</div>
                        <div className="text-body-sm text-on-surface-variant">{r.sex} • {r.age} yrs • {r.ward}</div>
                      </td>
                      <td className="whitespace-nowrap py-3 px-md text-body-sm text-on-surface">
                        {r.date} <span className="text-on-surface-variant ml-1">{r.time}</span>
                      </td>
                      <td className="whitespace-nowrap py-3 px-md">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-bold ${
                          r.isPneumonia
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.isPneumonia ? 'bg-error' : 'bg-secondary'}`} />
                          {r.prediction} ({r.confidence}%)
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-3 px-md">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-body-sm font-medium border ${
                          r.isPneumonia
                            ? 'bg-surface-container-high text-on-surface border-outline-variant'
                            : 'bg-surface-container text-on-surface-variant border-transparent'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-3 px-md text-right">
                        <button className={`inline-flex items-center justify-center h-8 px-3 rounded text-body-sm font-medium transition-colors shadow-sm ${
                          r.isPneumonia
                            ? 'bg-primary text-on-primary hover:bg-surface-tint'
                            : 'border border-outline text-primary hover:bg-surface-container-low'
                        }`}>
                          {r.isPneumonia ? 'View Results' : 'Open Record'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-md border-t border-surface-variant bg-surface-container-lowest rounded-b-xl flex items-center justify-between">
            <span className="text-body-sm text-on-surface-variant">
              Showing {filtered.length} of {records.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-surface-container-low text-outline disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="p-1 rounded hover:bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
