import { useState } from 'react';
import { getSettlements, staffList } from '../data/mock';

export default function Settlement() {
  const [month, setMonth] = useState('2026-03');
  const settlements = getSettlements(month);
  const [expandedId, setExpandedId] = useState<string | null>(settlements[0]?.staffId || null);

  const totalPayout = settlements.reduce((s, st) => s + st.netAmount, 0);

  return (
    <div className="space-y-24 text-brand-black">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Settlement</h2>
          <div className="flex items-center gap-8">
            <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Monthly Disbursement Archive</p>
            <div className="h-px w-12 bg-brand-black/20" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent border-none text-[14px] font-black uppercase tracking-tighter outline-none"
            />
          </div>
        </div>
        <div className="text-right space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">Total Disbursement</span>
          <p className="text-[40px] font-black tracking-tighter tabular-nums leading-none">₩{totalPayout.toLocaleString()}</p>
        </div>
      </section>

      {/* Settlement Sequence */}
      <section className="space-y-1">
        {settlements.map((st, idx) => {
          const staff = staffList.find((s) => s.id === st.staffId);
          const isExpanded = expandedId === st.staffId;

          return (
            <div key={st.staffId} className="group border-b border-brand-black/5">
              <button
                onClick={() => setExpandedId(isExpanded ? null : st.staffId)}
                className="w-full flex items-center gap-12 py-12 px-4 -mx-4 hover:bg-brand-black/[0.02] transition-all text-left relative"
              >
                <span className="text-[10px] font-black opacity-10 absolute left-0 top-12 tabular-nums">0{idx + 1}</span>
                <div className="w-16 h-16 shrink-0 border border-brand-black/10 p-1 rounded-full">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-[12px] font-black text-white" style={{ backgroundColor: staff?.profileColor }}>{st.staffName[0]}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{st.staffName}</h3>
                  <p className="text-[10px] font-bold text-brand-black/30 uppercase tracking-[0.2em] mt-1">{staff?.settlementType.replace(/_/g, ' ')}</p>
                </div>
                <div className="hidden md:block text-right w-48">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic block mb-1">Gross Sales</span>
                  <p className="text-[18px] font-black tabular-nums tracking-tighter">₩{st.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-right w-48">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic block mb-1">Net Payout</span>
                  <p className="text-[20px] font-black tabular-nums tracking-tighter text-brand-accent">₩{st.netAmount.toLocaleString()}</p>
                </div>
              </button>

              {/* Expanded Detail - Editorial Layout */}
              {isExpanded && (
                <div className="px-32 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-24 reveal">
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Performance Metrics</h4>
                    <div className="space-y-6">
                      {Object.entries(st.serviceSales).map(([cat, amount]) => {
                        const rate = staff?.incentiveRates[cat] || 0;
                        const incentive = Math.round(amount * rate / 100);
                        return (
                          <div key={cat} className="flex items-end justify-between border-b border-brand-black/5 pb-4 group/item">
                            <div className="space-y-1">
                              <span className="text-[13px] font-black uppercase tracking-tighter">{cat}</span>
                              <p className="text-[10px] font-bold opacity-30 uppercase">Rate: {rate}%</p>
                            </div>
                            <p className="text-[16px] font-black tabular-nums tracking-tighter group-hover/item:text-brand-accent transition-colors">₩{incentive.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Accounting Summary</h4>
                    <div className="bg-brand-black text-white p-10 space-y-10">
                      <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-40">
                          <span>Base Salary</span>
                          <span className="tabular-nums italic">₩{st.baseSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-40">
                          <span>Incentives</span>
                          <span className="tabular-nums italic">₩{st.incentiveAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-brand-accent">
                          <span>Deductions</span>
                          <span className="tabular-nums italic">- ₩{st.deductions.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="pt-10 border-t border-white/10 flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 italic">Final Disbursement</span>
                        <p className="text-4xl font-black tabular-nums tracking-tighter">₩{st.netAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
