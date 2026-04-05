import { useState } from 'react';
import { Download, ChevronDown, Plus } from 'lucide-react';
import { getSettlements, staffList } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Settlement() {
  const [month, setMonth] = useState('2026-03');
  const settlements = getSettlements(month);
  const [expandedId, setExpandedId] = useState<string | null>(settlements[0]?.staffId || null);

  const totalSales = settlements.reduce((s, st) => s + st.totalSales, 0);
  const totalPayout = settlements.reduce((s, st) => s + st.netAmount, 0);

  const chartData = settlements.map((s) => ({
    name: s.staffName,
    revenue: s.totalSales,
    payout: s.netAmount,
  }));

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Settlement
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none bg-white border border-gray-100 px-6 py-2 rounded-full text-[13px] font-black text-gray-900 shadow-elegant focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all uppercase tracking-widest"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-floating hover:bg-accent transition-all">
              <Download className="w-3.5 h-3.5" /> EXPORT PDF
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payout</p>
          <p className="text-[32px] font-black text-gray-900 tabular-nums leading-none">₩{totalPayout.toLocaleString()}</p>
        </div>
      </header>

      {/* Summary Bento Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[40px] p-10 shadow-elegant border border-white group">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Revenue</p>
          <p className="text-[40px] font-black text-gray-900 tabular-nums">₩{totalSales.toLocaleString()}</p>
          <div className="w-full bg-gray-50 h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-gray-900 h-full rounded-full w-[75%]" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-[40px] p-10 shadow-floating text-white">
          <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-4">Net Payout</p>
          <p className="text-[40px] font-black text-white tabular-nums">₩{totalPayout.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-6">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic">Efficiency Index</span>
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
        </div>
        <div className="bg-white rounded-[40px] p-10 shadow-elegant border border-white">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Staff Count</p>
          <p className="text-[40px] font-black text-gray-900 tabular-nums">{settlements.length}</p>
          <div className="mt-6 flex -space-x-2">
            {staffList.slice(0, 4).map(s => (
              <div key={s.id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" style={{ backgroundColor: s.profileColor }} />
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Chart Section */}
      <div className="bg-white rounded-[48px] p-12 shadow-elegant border border-white">
        <h3 className="text-[20px] font-black text-gray-900 tracking-tight mb-12">Performance vs Payout Comparison</h3>
        <div className="h-[250px] -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 900, fill: '#cbd5e1' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) return (
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-[11px] font-black shadow-xl">
                      ₩{Number(payload[0].value).toLocaleString()}
                    </div>
                  );
                  return null;
                }}
              />
              <Bar dataKey="revenue" fill="#f1f5f9" radius={[8, 8, 8, 8]} barSize={24} />
              <Bar dataKey="payout" fill="#1a1a1a" radius={[8, 8, 8, 8]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Settlement Details */}
      <div className="space-y-6">
        <div className="px-4">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Detailed Ledger</p>
        </div>
        {settlements.map((st) => {
          const staff = staffList.find((s) => s.id === st.staffId);
          const isExpanded = expandedId === st.staffId;

          return (
            <div key={st.staffId} className={`rounded-[40px] transition-all duration-700 overflow-hidden ${isExpanded ? 'bg-white shadow-floating border border-white' : 'bg-white/50 border border-transparent hover:bg-white hover:shadow-elegant'}`}>
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : st.staffId)}
                className="w-full flex items-center gap-8 p-8 text-left group"
              >
                <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-[18px] font-black shadow-lg transition-transform group-hover:scale-105" style={{ backgroundColor: staff?.profileColor }}>
                  {st.staffName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-[18px] font-black text-gray-900 tracking-tight">{st.staffName}</p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    {staff?.settlementType === 'fixed_plus_incentive' ? 'Fixed + Incentive' :
                      staff?.settlementType === 'incentive_only' ? 'Performance Based' : 'Direct Rent'}
                  </p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-[18px] font-black text-gray-900 tabular-nums">₩{st.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-right px-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Net Payout</p>
                  <p className="text-[20px] font-black text-gray-900 tabular-nums">₩{st.netAmount.toLocaleString()}</p>
                </div>
                <div className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-gray-900 text-white' : 'text-gray-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Detail Content */}
              {isExpanded && (
                <div className="p-12 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid lg:grid-cols-2 gap-12 border-t border-gray-50 pt-12">
                    {/* Breakdown */}
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 italic">Categorized Performance</h4>
                      <div className="space-y-4">
                        {Object.entries(st.serviceSales).map(([cat, rawAmount]) => {
                          const amount = rawAmount as number;
                          const rate = staff?.incentiveRates[cat] || 0;
                          const incentive = Math.round(amount * rate / 100);
                          const count = st.serviceCount[cat] || 0;
                          return (
                            <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-4">
                                <span className="text-[14px] font-black text-gray-900 min-w-[80px]">{cat}</span>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tabular-nums">{count} Services</span>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <p className="text-[11px] font-bold text-gray-400 uppercase">Sales × {rate}%</p>
                                  <p className="text-[14px] font-black text-gray-900 tabular-nums">₩{incentive.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Final Accounting */}
                    <div className="space-y-8">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 italic">Summary Accounting</h4>
                      <div className="bg-gray-900 rounded-[32px] p-8 text-white space-y-4 shadow-floating">
                        {staff?.baseSalary ? (
                          <div className="flex justify-between items-center opacity-60">
                            <span className="text-[13px] font-bold uppercase tracking-widest">Base Salary</span>
                            <span className="text-[15px] font-black tabular-nums">₩{st.baseSalary.toLocaleString()}</span>
                          </div>
                        ) : null}
                        <div className="flex justify-between items-center opacity-60">
                          <span className="text-[13px] font-bold uppercase tracking-widest">Total Incentive</span>
                          <span className="text-[15px] font-black tabular-nums">₩{st.incentiveAmount.toLocaleString()}</span>
                        </div>
                        {st.deductions > 0 && (
                          <div className="flex justify-between items-center text-accent/80">
                            <span className="text-[13px] font-bold uppercase tracking-widest">Deductions (INS)</span>
                            <span className="text-[15px] font-black tabular-nums">- ₩{st.deductions.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                          <div>
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Net Payment Amount</span>
                            <p className="text-[32px] font-black tracking-tighter tabular-nums leading-none mt-2">₩{st.netAmount.toLocaleString()}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white/40 rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
