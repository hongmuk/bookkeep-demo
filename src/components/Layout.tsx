import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, DollarSign, BarChart3,
  Users, UserCircle, Settings, Menu, X, Link2,
} from 'lucide-react';
import { useStore } from '../store';
import { shop } from '../data/mock';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/bookings', icon: CalendarDays, label: '예약관리' },
  { to: '/sales', icon: DollarSign, label: '매출현황' },
  { to: '/settlement', icon: BarChart3, label: '정산관리' },
  { to: '/staff', icon: Users, label: '직원관리' },
  { to: '/customers', icon: UserCircle, label: '고객관리' },
  { to: '/integration', icon: Link2, label: '외부연동' },
  { to: '/settings', icon: Settings, label: '설정' },
];

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#fdfcfb]">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/5 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Floating Minimal Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        m-4 lg:m-6 w-72 bg-white/70 backdrop-blur-xl border border-white/40
        rounded-[32px] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        shadow-floating
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+40px)] lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-8 py-10">
          <div className="w-12 h-12 rounded-[18px] bg-gray-900 flex items-center justify-center shadow-lg group">
            <CalendarDays className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-[18px] font-black text-gray-900 tracking-tighter leading-tight">BOOK<br/>KEEP</h1>
          </div>
          <button className="ml-auto lg:hidden p-2 bg-gray-50 rounded-full" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 rounded-[22px] text-[15px] font-bold transition-all duration-300
                ${isActive
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-1'
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'
                }`
              }
            >
              <Icon className="w-[20px] h-[20px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 m-4 rounded-[26px] bg-gray-50/50 border border-white/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-[13px] font-black text-gray-500 shadow-inner">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-black text-gray-900 truncate">김수현</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Master</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 shadow-sm border border-gray-100/50 hover:text-gray-900 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Surface */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Transparent Header for Mobile */}
        <header className="lg:hidden flex items-center justify-between px-8 py-6 bg-transparent">
          <button onClick={() => setSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100/50">
            <Menu className="w-6 h-6 text-gray-900" />
          </button>
          <span className="text-[16px] font-black text-gray-900 tracking-tighter uppercase">{shop.name}</span>
        </header>

        {/* Global Search or Utility (Hidden for now, but planned for editorial feel) */}
        <div className="absolute top-8 right-12 hidden lg:flex items-center gap-6 z-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/40 shadow-elegant">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-black text-gray-500 tabular-nums">LIVE UPDATES</span>
          </div>
        </div>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 lg:py-12 page-transition">
          <div className="max-w-[1500px] mx-auto pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
