import { CalendarDays, Plus } from 'lucide-react';
import { useStore } from '../store';
import { staffList, getDailySales } from '../data/mock';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { bookings, selectedDate } = useStore();
  const todayBookings = bookings.filter((b) => b.date === selectedDate);
  const completed = todayBookings.filter((b) => b.status === 'completed');
  const todayRevenue = completed.reduce((s, b) => s + b.totalPrice, 0);
  const dailySales = getDailySales().slice(-7);

  const upcomingBookings = todayBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Dashboard
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            Overview / April 06, 2026
          </p>
        </div>
        <div className="flex -space-x-3">
          {staffList.map((s) => (
            <div key={s.id} className="w-12 h-12 rounded-full border-4 border-[#fdfcfb] bg-gray-200 flex items-center justify-center text-[12px] font-black text-white shadow-sm" style={{ backgroundColor: s.profileColor }}>
              {s.name[0]}
            </div>
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-[#fdfcfb] bg-gray-100 flex items-center justify-center text-[12px] font-black text-gray-400">
            +
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Large Metric */}
        <div className="md:col-span-8 bg-white rounded-[48px] p-12 shadow-elegant border border-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Revenue Today</p>
            <h3 className="text-[84px] font-black text-gray-900 tracking-tighter tabular-nums leading-none">
              ₩{todayRevenue.toLocaleString()}
            </h3>
            <div className="mt-8 flex items-center gap-4">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[13px] font-black shadow-sm">+12.5% vs yesterday</span>
              <span className="text-gray-300 font-bold">Based on {completed.length} completed services</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Counter Metric */}
        <div className="md:col-span-4 bg-gray-900 rounded-[48px] p-10 text-white shadow-floating relative flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <CalendarDays className="w-8 h-8 text-white/30" />
            <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">Bookings</span>
          </div>
          <div>
            <p className="text-[64px] font-black leading-none tabular-nums">{todayBookings.length}</p>
            <p className="text-[14px] font-bold text-white/50 mt-2 uppercase tracking-widest">Total Appointments</p>
          </div>
        </div>

        {/* Chart Card */}
        <div className="md:col-span-5 bg-white rounded-[48px] p-10 shadow-elegant border border-white flex flex-col justify-between h-[420px]">
          <div>
            <h4 className="text-[20px] font-black text-gray-900 tracking-tight">Weekly Performance</h4>
            <p className="text-[13px] font-bold text-gray-400 mt-1">Consistency is the key to growth</p>
          </div>
          <div className="flex-1 mt-8 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="total" stroke="#1a1a1a" strokeWidth={4} fill="url(#colorSales)" />
                <Tooltip 
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-[12px] font-black shadow-xl">
                        ₩{Number(payload[0].value).toLocaleString()}
                      </div>
                    );
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="md:col-span-7 bg-white rounded-[48px] p-10 shadow-elegant border border-white h-[420px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[20px] font-black text-gray-900 tracking-tight">Upcoming Schedule</h4>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {upcomingBookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 text-[14px] font-black text-gray-900 tabular-nums">{b.startTime}</div>
                <div className="flex-1 bg-gray-50 group-hover:bg-gray-100/80 transition-all rounded-[24px] px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-black text-gray-900">{b.customerName}</p>
                    <p className="text-[12px] font-bold text-gray-400 mt-0.5">{b.services[0].name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{b.staffName}</span>
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            ))}
            {upcomingBookings.length === 0 && (
              <p className="text-center text-gray-300 font-bold py-20">No more appointments for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
