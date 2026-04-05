import { useState } from 'react';
import { TrendingUp, CreditCard, Banknote, Wallet, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
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
    { name: 'Card', value: totalCard, color: '#0f172a' },
    { name: 'Cash', value: totalCash, color: '#64748b' },
    { name: 'Other', value: totalRevenue - totalCard - totalCash, color: '#cbd5e1' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">매출 분석</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Financial Intelligence
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${period === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >7 Days</button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${period === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >30 Days</button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={totalRevenue} trend="+12.5%" icon={TrendingUp} color="indigo" />
        <MetricCard label="Card Payout" value={totalCard} trend="+8.2%" icon={CreditCard} color="slate" />
        <MetricCard label="Cash Income" value={totalCash} trend="-2.4%" icon={Banknote} color="emerald" />
        <MetricCard label="Daily Avg" value={avgDaily} trend="+5.1%" icon={Wallet} color="amber" />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revenue Timeline</h3>
            <div className="flex items-center gap-4 text-[11px] font-black text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-900" /> TOTAL
              </div>
            </div>
          </div>
          <div className="p-8 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xl border border-slate-800">
                        ₩{Number(payload[0].value).toLocaleString()}
                      </div>
                    );
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#0f172a" radius={[6, 6, 6, 6]} barSize={period === 'week' ? 32 : 10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col h-full">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Payment Methods</h3>
            <div className="flex-1 flex flex-col justify-between">
              <div className="relative w-48 h-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share</span>
                  <span className="text-xl font-black text-slate-900 tabular-nums">Ratio</span>
                </div>
              </div>
              
              <div className="space-y-4 pt-8">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-slate-400">{( (d.value/totalRevenue) * 100 ).toFixed(1)}%</span>
                      <span className="text-sm font-black text-slate-900 tabular-nums">₩{(d.value/10000).toFixed(0)}만</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color: _color }: { label: string; value: number | string; trend: string; icon: any; color: string }) {
  const isUp = trend.startsWith('+');
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
          ₩{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}
