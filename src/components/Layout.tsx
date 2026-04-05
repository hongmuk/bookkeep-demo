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
    <div className="flex h-screen overflow-hidden bg-[#fcfcfd]">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100
        flex flex-col transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-black text-gray-900 tracking-tight">BookKeep</h1>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{shop.name}</p>
          </div>
          <button className="ml-auto lg:hidden p-1 hover:bg-gray-100 rounded-md" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200
                ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <Icon className={`w-[20px] h-[20px] transition-transform duration-200 ${sidebarOpen ? 'scale-110' : ''}`} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mx-4 mb-6 mt-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary-600 text-[13px] font-bold shadow-sm">
              김
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-800 truncate">김수현</p>
              <p className="text-[11px] font-medium text-gray-400">원장님</p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-gray-50 rounded-lg">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">BookKeep</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{shop.name}</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

}
