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
    <div className="flex h-screen overflow-hidden bg-[#f4f4f7]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] bg-white border-r border-gray-100
        flex flex-col shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">BookKeep</p>
            <p className="text-[10px] text-gray-400">{shop.name}</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">김</div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">김수현</p>
              <p className="text-[10px] text-gray-400">원장</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-bold text-gray-800">BookKeep</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
