import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../store';
import { shop } from '../data/mock';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/bookings', label: 'Schedule' },
  { to: '/sales', label: 'Financials' },
  { to: '/settlement', label: 'Settlement' },
  { to: '/staff', label: 'Personnel' },
  { to: '/customers', label: 'Archive' },
  { to: '/integration', label: 'Connect' },
  { to: '/settings', label: 'Settings' },
];

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <div className="flex h-screen w-full bg-brand-beige overflow-hidden">
      {/* Editorial Navigation - Minimal vertical list */}
      <nav className="hidden lg:flex flex-col w-[300px] shrink-0 px-12 py-16 justify-between border-r border-brand-black/5">
        <div className="space-y-16">
          <div className="space-y-1">
            <h1 className="serif-display text-4xl text-brand-black leading-none tracking-tighter">BookKeep</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Management Archive</p>
          </div>
          
          <div className="flex flex-col space-y-6">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500
                  ${isActive 
                    ? 'text-brand-black translate-x-2' 
                    : 'text-brand-black/20 hover:text-brand-black hover:translate-x-1'}`
                }
              >
                <span className="mr-4 tabular-nums opacity-20">0{navItems.findIndex(i => i.to === to) + 1}</span>
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-px w-8 bg-brand-black/20" />
          <p className="text-[10px] font-bold text-brand-black/40 leading-relaxed uppercase tracking-widest">
            {shop.name}<br/>
            Master Terminal v1.0
          </p>
        </div>
      </nav>

      {/* Main Content Area - Wide and clean */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-beige">
        {/* Top Minimal Utility */}
        <header className="h-[72px] flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[10px] font-black uppercase tracking-widest border border-brand-black px-3 py-1">Menu</button>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
              Status — <span className="text-brand-accent opacity-100">Live Connection</span>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="hidden xl:block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              Session: 2026.04.06.09:00
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em]">
              User: Kim
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-12 pb-24">
          <div className="max-w-[1400px] mx-auto reveal">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
