import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkBase =
    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-sans text-sm font-medium active:scale-95 duration-150';
  const linkInactive =
    'text-slate-600 hover:bg-slate-100 group';
  const linkActive =
    'bg-white text-blue-700 shadow-sm border border-slate-200';

  return (
    <aside className="bg-slate-50 border-r border-slate-200 h-screen w-64 fixed left-0 top-0 flex flex-col p-4 space-y-2 z-40 hidden md:flex">
      {/* Header Profile */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-on-primary shrink-0">
          <span className="material-symbols-outlined icon-fill text-lg">medical_services</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-900 truncate">RadiLens AI</span>
          <span className="text-xs text-slate-500 truncate">Diagnostic Platform</span>
        </div>
      </div>

      {/* CTA */}
      <NavLink
        to="/"
        className="bg-blue-700 text-white rounded-lg py-2.5 px-4 w-full mb-4 text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm no-underline"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        New Scan
      </NavLink>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <span className="material-symbols-outlined text-xl group-hover:text-blue-600">clinical_notes</span>
          Diagnostic Hub
        </NavLink>

        <NavLink
          to="/records"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <span className="material-symbols-outlined text-xl group-hover:text-blue-600">groups</span>
          Patient Records
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <span className="material-symbols-outlined text-xl group-hover:text-blue-600">analytics</span>
          Analytics
        </NavLink>
      </nav>

      {/* Footer Links */}
      <div className="pt-4 border-t border-slate-200 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all font-sans text-sm font-medium"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          Settings
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all font-sans text-sm font-medium"
        >
          <span className="material-symbols-outlined text-xl">help</span>
          Support
        </a>
      </div>
    </aside>
  );
}
