import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, DollarSign, BarChart3,
  Users, UserCircle, Settings, Menu, X, Link2, Bell, Search, ChevronRight
} from 'lucide-react';
import { useStore } from '../store';
import { shop } from '../data/mock';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/bookings', icon: CalendarDays, label: '예약 관리' },
  { to: '/sales', icon: DollarSign, label: '매출 분석' },
  { to: '/settlement', icon: BarChart3, label: '정산 현황' },
  { to: '/staff', icon: Users, label: '팀원 관리' },
  { to: '/customers', icon: UserCircle, label: '고객 관리' },
  { to: '/integration', icon: Link2, label: '서비스 연동' },
  { to: '/settings', icon: Settings, label: '환경 설정' },
];

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useStore();
  const location = useLocation();
  const currentLabel = navItems.find(item => item.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Structured Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#1e1e2d] text-slate-400
        flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 bg-[#1a1a27] border-b border-white/5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-3">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-black tracking-tight text-white uppercase italic">BookKeep</span>
          <button className="ml-auto lg:hidden p-1 text-slate-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'hover:bg-white/5 hover:text-slate-200 text-slate-400'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Profile */}
        <div className="p-4 bg-[#1a1a27] border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">김</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate italic">김수현 원장</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Main Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] h-full">
        {/* Top Desktop Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <span className="text-slate-900">{shop.name}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-indigo-600 font-black italic">{currentLabel}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-400 w-80 group focus-within:bg-white focus-within:border-indigo-400 transition-all">
              <Search className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-tight">서비스 통합 검색...</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white shadow-sm" />
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Live System</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
