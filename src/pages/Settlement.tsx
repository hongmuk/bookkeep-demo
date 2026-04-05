import { useState } from 'react';
import { Download, ChevronDown, FileText, CheckCircle2 } from 'lucide-react';
import { getSettlements, staffList } from '../data/mock';

export default function Settlement() {
  const [month, setMonth] = useState('2026-03');
  const settlements = getSettlements(month);
  const [expandedId, setExpandedId] = useState<string | null>(settlements[0]?.staffId || null);

  const totalSales = settlements.reduce((s, st) => s + st.totalSales, 0);
  const totalPayout = settlements.reduce((s, st) => s + st.netAmount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">정산 내역</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Payout Administration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
          />
          <button className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download className="w-4 h-4" /> PDF 내보내기
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Service Sales</p>
          <p className="text-3xl font-black text-slate-900 tabular-nums">₩{totalSales.toLocaleString()}</p>
          <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="bg-slate-900 h-full w-[85%]" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4 text-white">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Payout Amount</p>
          <p className="text-3xl font-black tabular-nums">₩{totalPayout.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Transfer</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Stylists</p>
          <p className="text-3xl font-black text-slate-900 tabular-nums">{settlements.length} Members</p>
          <div className="flex -space-x-2">
            {staffList.slice(0, 5).map(s => (
              <div key={s.id} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100" style={{ backgroundColor: s.profileColor }} />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Settlement List */}
      <div className="space-y-4">
        <div className="px-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic text-center leading-none">Individual Payout Breakdown</h3>
        </div>
        
        {settlements.map((st) => {
          const staff = staffList.find((s) => s.id === st.staffId);
          const isExpanded = expandedId === st.staffId;

          return (
            <div key={st.staffId} className={`group bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-slate-900 shadow-xl' : 'border-slate-200 shadow-sm hover:border-slate-400'}`}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : st.staffId)}
                className="w-full flex items-center gap-6 p-6 text-left"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-black shadow-lg" style={{ backgroundColor: staff?.profileColor }}>
                  {st.staffName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-black text-slate-900 tracking-tight">{st.staffName}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {staff?.settlementType.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right px-6 border-r border-slate-100 hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sales</p>
                  <p className="text-sm font-bold text-slate-900 tabular-nums">₩{st.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-right px-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Net Payout</p>
                  <p className="text-lg font-black text-slate-900 tabular-nums leading-none">₩{st.netAmount.toLocaleString()}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isExpanded && (
                <div className="p-8 pt-0 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid lg:grid-cols-2 gap-12 mt-8">
                    {/* Categories */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Service Performance</h4>
                      <div className="space-y-2">
                        {Object.entries(st.serviceSales).map(([cat, amount]) => {
                          const rate = staff?.incentiveRates[cat] || 0;
                          const incentive = Math.round(amount * rate / 100);
                          return (
                            <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                              <span className="text-sm font-bold text-slate-700">{cat}</span>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate {rate}%</p>
                                  <p className="text-sm font-black text-slate-900 tabular-nums">₩{incentive.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Accounting */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Final Accounting</h4>
                      <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl">
                        <div className="flex justify-between text-slate-400 text-xs font-bold">
                          <span>Total Incentive</span>
                          <span className="tabular-nums">₩{st.incentiveAmount.toLocaleString()}</span>
                        </div>
                        {staff?.baseSalary ? (
                          <div className="flex justify-between text-slate-400 text-xs font-bold">
                            <span>Base Salary</span>
                            <span className="tabular-nums">₩{st.baseSalary.toLocaleString()}</span>
                          </div>
                        ) : null}
                        <div className="flex justify-between text-red-400 text-xs font-bold">
                          <span>Deductions</span>
                          <span className="tabular-nums">- ₩{st.deductions.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Payment</p>
                            <p className="text-2xl font-black tabular-nums tracking-tighter">₩{st.netAmount.toLocaleString()}</p>
                          </div>
                          <button className="px-4 py-2 bg-white text-slate-900 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-100">Confirm Transfer</button>
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
