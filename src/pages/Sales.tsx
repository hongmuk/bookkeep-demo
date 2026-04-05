import { useState } from 'react';
import { getDailySales } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sales() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const allSales = getDailySales();
  const sales = period === 'week' ? allSales.slice(-7) : allSales;

  const totalRevenue = sales.reduce((s, d) => s + d.total, 0);
  const totalCard = sales.reduce((s, d) => s + d.card, 0);
  const totalCash = sales.reduce((s, d) => s + d.cash, 0);
  const avgDaily = Math.round(totalRevenue / sales.filter(d => d.total > 0).length);

  const pieData = [
    { name: 'Electronic', value: totalCard, color: '#1a1a1a' },
    { name: 'Physical', value: totalCash, color: '#1a1a1a40' },
    { name: 'Others', value: totalRevenue - totalCard - totalCash, color: '#1a1a1a10' },
  ];

  return (
    <div className="space-y-24 text-brand-black">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Financials</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Fiscal Intelligence Report / 2026</p>
        </div>
        <div className="flex bg-brand-black/[0.03] p-1 rounded-full border border-brand-black/5">
          <button
            onClick={() => setPeriod('week')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${period === 'week' ? 'bg-brand-black text-white shadow-xl' : 'opacity-30 hover:opacity-100'}`}
          >Rolling 7D</button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${period === 'month' ? 'bg-brand-black text-white shadow-xl' : 'opacity-30 hover:opacity-100'}`}
          >Rolling 30D</button>
        </div>
      </section>

      {/* Main Revenue Figure */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-20">
        <div className="md:col-span-8 space-y-16">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Accumulated Gross Revenue</span>
            <div className="flex items-baseline gap-6">
              <h3 className="serif-display text-[120px] leading-none tracking-tighter">₩{totalRevenue.toLocaleString()}</h3>
              <span className="text-2xl font-black italic opacity-20 tracking-tighter">KRW</span>
            </div>
          </div>

          {/* High Contrast Bar Chart */}
          <div className="h-[300px] w-full border-t border-brand-black/10 pt-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 10, fontWeight: 900, fill: '#1a1a1a20' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#1a1a1a', fillOpacity: 0.03 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-brand-black text-white px-4 py-2 text-[10px] font-black tabular-nums">
                        Snapshot: ₩{Number(payload[0].value).toLocaleString()}
                      </div>
                    );
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#1a1a1a" barSize={period === 'week' ? 40 : 12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="md:col-span-4 border-l border-brand-black/10 pl-16 flex flex-col justify-between">
          <div className="space-y-12">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Average Performance</span>
              <p className="text-4xl font-black tabular-nums tracking-tighter leading-none italic">₩{avgDaily.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mt-2">Daily Mean Yield</p>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-brand-black pb-4">Transaction Ratio</h4>
              <div className="space-y-6">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{d.name}</span>
                    </div>
                    <span className="text-[14px] font-black tabular-nums tracking-tighter">{((d.value/totalRevenue)*100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-12">
            <button className="w-full py-5 border-2 border-brand-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-black hover:text-white transition-all active:scale-95">
              Export Audit PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
