import { CalendarDays, Clock, CheckCircle2, TrendingUp, ArrowUpRight, MoreHorizontal, Zap, BarChart2 } from 'lucide-react';
import { useStore } from '../store';
import { statusLabels, staffList, getDailySales } from '../data/mock';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Terminal Insights</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest opacity-70">Real-time Data Stream / 2026.04.06</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
            <Zap className="w-3.5 h-3.5 fill-current" /> Quick Register
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total Daily Slot" value={todayBookings.length} unit="건" color="indigo" icon={CalendarDays} trend="+12%" />
        <KPICard label="Success Rate" value={completed.length} unit="건" color="emerald" icon={CheckCircle2} trend="Live" />
        <KPICard label="Gross Revenue" value={todayRevenue.toLocaleString()} unit="원" color="rose" icon={TrendingUp} trend="High" />
        <KPICard label="Active Queue" value={upcomingBookings.length} unit="명" color="slate" icon={Clock} />
      </div>

      {/* Main Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sales Chart (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[420px]">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenue performance</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">7 Days Rolling</span>
              <button className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
            </div>
          </div>
          <div className="p-8 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-[#1a1b23] text-white px-4 py-2 rounded-xl shadow-2xl border border-white/5 animate-in zoom-in-95">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Snapshot</p>
                        <p className="text-sm font-black tabular-nums">₩{Number(payload[0].value).toLocaleString()}</p>
                      </div>
                    );
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fill="url(#chartColor)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Status (1/3) */}
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <BarChart2 className="w-8 h-8 opacity-50" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Operational Node</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black tracking-tight leading-tight">Team<br/>Optimization</h4>
                <p className="text-sm font-medium text-indigo-100/60 leading-relaxed italic">"팀원 5명 전원 가동 중. 현재 지연 시간 없음."</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex -space-x-3">
                {staffList.map((s) => (
                  <div key={s.id} className="w-10 h-10 rounded-full border-4 border-indigo-600 shadow-lg flex items-center justify-center text-[11px] font-black" style={{ backgroundColor: s.profileColor }}>
                    {s.name[0]}
                  </div>
                ))}
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                Resource Center <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>

      {/* Bottom Detail Row */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Schedule Table (2/3) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Incoming Workflow</h3>
            <button className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest border-b border-indigo-600 pb-0.5">Full Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  {['Time Slot', 'Client Identity', 'Service Category', 'Professional', 'Status'].map((h) => (
                    <th key={h} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {upcomingBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-[13px] font-black text-slate-900 tabular-nums">{b.startTime} — {b.endTime}</td>
                    <td className="px-8 py-5">
                      <span className="text-[13px] font-black text-slate-900">{b.customerName}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[12px] font-bold text-slate-500 italic uppercase tracking-tighter">{b.services[0].name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-slate-100" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }}>
                          {b.staffName[0]}
                        </div>
                        <span className="text-[13px] font-black text-slate-700 tracking-tight">{b.staffName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                        {statusLabels[b.status]}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channels (1/3) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between h-full">
          <div className="space-y-8">
            <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest italic border-b border-slate-50 pb-4">Origin analytics</h4>
            <div className="space-y-8">
              {[
                { label: 'Naver Sync', val: 65, color: 'bg-indigo-500 shadow-indigo-100' },
                { label: 'Kakao Channel', val: 20, color: 'bg-yellow-400 shadow-yellow-100' },
                { label: 'Direct Entry', val: 15, color: 'bg-slate-300 shadow-slate-100' },
              ].map((c) => (
                <div key={c.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{c.label}</span>
                    <span className="text-[13px] font-black text-slate-900 tabular-nums">{c.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`${c.color} h-full rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${c.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed mt-12 italic text-center">Data refreshed every 5 minutes from satellite nodes.</p>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, unit, icon: Icon, color, trend }: { label: string; value: string | number; unit: string; icon: any; color: string; trend?: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200 shadow-slate-100',
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all group flex flex-col gap-8 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 border transition-transform group-hover:rotate-12 duration-500 shadow-2xl ${colors[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <span className="text-[10px] font-black px-3 py-1.5 bg-slate-900 text-white rounded-xl uppercase tracking-widest shadow-xl">
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic opacity-60">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter leading-none">{value}</span>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-slate-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
    </div>
  );
}
