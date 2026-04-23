import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Diagnostic Hub',
  '/records': 'Patient Registry',
  '/analytics': 'Analytics Dashboard',
};

export default function TopBar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'RadiLens AI';

  return (
    <header className="w-full sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto w-full">
        {/* Brand / Page Title */}
        <div className="text-headline-md text-on-surface">{title}</div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-sans text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 w-72 transition-shadow placeholder:text-slate-400"
              placeholder="Search patient ID or name..."
              type="text"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
            <button className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-50 cursor-pointer active:opacity-70">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-50 cursor-pointer active:opacity-70">
              <span className="material-symbols-outlined text-[22px]">account_circle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header (shown below md) */}
      <div className="md:hidden flex justify-between items-center h-14 px-4 border-t border-slate-100">
        <div className="text-lg font-bold tracking-tight text-blue-700">RadiLens AI</div>
        <div className="flex items-center gap-2">
          <button className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
