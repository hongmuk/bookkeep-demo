import { useStore } from '../store';
import { staffList, getDailySales } from '../data/mock';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { bookings, selectedDate } = useStore();
  const todayBookings = bookings.filter((b) => b.date === selectedDate);
  const completed = todayBookings.filter((b) => b.status === 'completed');
  const todayRevenue = completed.reduce((s, b) => s + b.totalPrice, 0);
  const dailySales = getDailySales().slice(-7);

  return (
    <div className="space-y-24">
      {/* Editorial Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter text-brand-black">Overview</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Operational Performance Index / Q2 2026</p>
        </div>
        <div className="text-right space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">Session Date</span>
          <p className="text-[20px] font-black tracking-tighter tabular-nums">2026.04.06 (MON)</p>
        </div>
      </section>

      {/* Primary Metrics - Asymmetrical Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7 space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Daily Gross Revenue</span>
            <div className="flex items-baseline gap-4">
              <span className="serif-display text-[100px] leading-none tracking-tighter">₩{(todayRevenue/10000).toFixed(1)}</span>
              <span className="text-2xl font-black italic opacity-20 tracking-tighter">Million</span>
            </div>
          </div>
          
          {/* Revenue Chart - High Contrast Minimal */}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-brand-black text-white px-4 py-2 text-[11px] font-black tabular-nums shadow-2xl">
                        VALUE: ₩{Number(payload[0].value).toLocaleString()}
                      </div>
                    );
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#1a1a1a" strokeWidth={1.5} fill="#1a1a1a" fillOpacity={0.03} animationDuration={2500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col justify-between py-4 border-l border-brand-black/5 pl-12 space-y-12">
          <div className="space-y-8">
            <MetricLine label="Active Queue" value={todayBookings.length} unit="Units" />
            <MetricLine label="Operational Efficiency" value="92.4" unit="%" />
            <MetricLine label="Client Retention" value="12" unit="%" trend="up" />
          </div>
          <div className="p-8 bg-brand-black text-white space-y-6">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Internal Note</span>
            <p className="text-sm font-light leading-relaxed italic">"현재 매장 운영 효율이 전주 대비 12% 상승했습니다. 오후 2시 예약 밀집도가 높으니 주의 바랍니다."</p>
          </div>
        </div>
      </section>

      {/* Secondary Table - Ledger Style */}
      <section className="space-y-12 pt-12 border-t border-brand-black/10">
        <div className="flex items-center justify-between">
          <h3 className="serif-display text-4xl tracking-tighter">Recent Ledger</h3>
          <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-brand-black pb-1">View Full Archive</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-brand-black pb-4">
                {['Time', 'Client', 'Professional', 'Service', 'Status'].map((h) => (
                  <th key={h} className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5">
              {todayBookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="group hover:bg-brand-black/5 transition-colors">
                  <td className="py-8 text-[13px] font-black tabular-nums tracking-tighter">{b.startTime} — {b.endTime}</td>
                  <td className="py-8 text-[14px] font-black uppercase tracking-tighter">{b.customerName}</td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }} />
                      <span className="text-[12px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{b.staffName}</span>
                    </div>
                  </td>
                  <td className="py-8 text-[12px] font-bold italic opacity-40 group-hover:opacity-100">{b.services[0].name}</td>
                  <td className="py-8">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 border border-brand-black/10 ${b.status === 'completed' ? 'bg-brand-black text-white' : ''}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricLine({ label, value, unit, trend }: { label: string; value: string | number; unit: string; trend?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-brand-black/10 pb-4">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-[32px] font-black tracking-tighter tabular-nums leading-none">{value}</span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-20">{unit}</span>
        </div>
      </div>
      {trend && (
        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic mb-1">+{trend} Growth</span>
      )}
    </div>
  );
}
