import { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { getDailySales } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Sales() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const allSales = getDailySales();
  const sales = period === 'week' ? allSales.slice(-7) : allSales;

  const totalRevenue = sales.reduce((s, d) => s + d.total, 0);
  const totalCard = sales.reduce((s, d) => s + d.card, 0);
  const totalCash = sales.reduce((s, d) => s + d.cash, 0);
  const avgDaily = Math.round(totalRevenue / sales.filter(d => d.total > 0).length);

  const pieData = [
    { name: 'Card', value: totalCard, color: '#1a1a1a' },
    { name: 'Cash', value: totalCash, color: '#475569' },
    { name: 'Pay', value: totalRevenue - totalCard - totalCash, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Sales Report
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            Financial Insights / 2026 Q2
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1.5 rounded-[20px] border border-white">
          <button
            onClick={() => setPeriod('week')}
            className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${period === 'week' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >7 Days</button>
          <button
            onClick={() => setPeriod('month')}
            className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${period === 'month' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >30 Days</button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Revenue Card */}
        <div className="md:col-span-8 bg-white rounded-[48px] p-12 shadow-elegant border border-white relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Accumulated Revenue</p>
              <h3 className="text-[96px] font-black text-gray-900 tracking-tighter tabular-nums leading-none">
                ₩{totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center gap-12">
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Average</p>
                <p className="text-[20px] font-black text-gray-900 tabular-nums">₩{avgDaily.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Card Proportion</p>
                <p className="text-[20px] font-black text-gray-900 tabular-nums">{((totalCard/totalRevenue)*100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        {/* Small Highlight Cards */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-floating h-1/2 flex flex-col justify-between">
            <CreditCard className="w-8 h-8 text-white/20" />
            <div>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1">Card Payments</p>
              <p className="text-[32px] font-black tabular-nums">₩{totalCard.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-[40px] p-10 shadow-elegant border border-white h-1/2 flex flex-col justify-between">
            <Banknote className="w-8 h-8 text-gray-200" />
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Cash Payments</p>
              <p className="text-[32px] font-black text-gray-900 tabular-nums">₩{totalCash.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Big Chart Section */}
        <div className="md:col-span-7 bg-white rounded-[48px] p-12 shadow-elegant border border-white">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-[24px] font-black text-gray-900 tracking-tight">Revenue Timeline</h4>
            <span className="text-[12px] font-black text-gray-300 uppercase tracking-widest">Growth Analysis</span>
          </div>
          <div className="h-[300px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 11, fontWeight: 900, fill: '#cbd5e1' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-[12px] font-black shadow-xl">
                        ₩{Number(payload[0].value).toLocaleString()}
                      </div>
                    );
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#1a1a1a" radius={[12, 12, 12, 12]} barSize={period === 'week' ? 40 : 12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method Distribution */}
        <div className="md:col-span-5 bg-white rounded-[48px] p-12 shadow-elegant border border-white flex flex-col">
          <h4 className="text-[24px] font-black text-gray-900 tracking-tight mb-12">Payment Methods</h4>
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative w-48 h-48 mx-auto mb-12">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[24px] font-black text-gray-900">Total</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Proportion</span>
              </div>
            </div>
            <div className="space-y-4">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-bold text-gray-400">{((d.value/totalRevenue)*100).toFixed(1)}%</span>
                    <span className="text-[14px] font-black text-gray-900 tabular-nums">₩{d.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
