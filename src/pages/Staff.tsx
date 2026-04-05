import { useState } from 'react';
import { staffList } from '../data/mock';

export default function Staff() {
  const [selectedId, setSelectedId] = useState<string | null>(staffList[0].id);
  const staff = selectedId ? staffList.find((s) => s.id === selectedId) : null;

  const roleLabels: Record<string, string> = { owner: 'Master', manager: 'Lead', staff: 'Stylist' };

  return (
    <div className="space-y-24 text-brand-black">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Personnel</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Talent & Human Resources Directory</p>
        </div>
        <button className="text-[11px] font-black uppercase tracking-widest border border-brand-black px-8 py-4 hover:bg-brand-black hover:text-white transition-all">
          + Recruit New Talent
        </button>
      </section>

      <div className="grid lg:grid-cols-12 gap-20">
        {/* Left: Interactive Index */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Registry</span>
            <h3 className="text-xl font-black uppercase tracking-widest border-b border-brand-black pb-4">Active Directory</h3>
          </div>
          <div className="flex flex-col">
            {staffList.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`group flex items-center justify-between py-8 border-b border-brand-black/5 transition-all
                  ${selectedId === s.id ? 'pl-4' : 'hover:pl-2'}`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black opacity-10 tabular-nums">0{idx + 1}</span>
                  <div className="text-left">
                    <p className={`text-lg font-black uppercase tracking-tighter transition-all ${selectedId === s.id ? 'text-brand-accent' : 'opacity-40 group-hover:opacity-100'}`}>{s.name}</p>
                    <p className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest mt-1">{roleLabels[s.role]}</p>
                  </div>
                </div>
                <div className={`w-1 h-1 rounded-full transition-all ${selectedId === s.id ? 'bg-brand-accent scale-[3]' : 'bg-brand-black/10'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Portfolio Detail */}
        <div className="lg:col-span-8">
          {staff ? (
            <div className="reveal space-y-20">
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="w-48 h-48 border border-brand-black/10 p-2 rounded-full shrink-0">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white text-[64px] font-black serif-display italic shadow-2xl" style={{ backgroundColor: staff.profileColor }}>
                    {staff.name[0]}
                  </div>
                </div>
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <h3 className="serif-display text-[72px] leading-none tracking-tighter italic">{staff.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-brand-black text-white rounded-full text-[9px] font-black uppercase tracking-widest">{roleLabels[staff.role]} Account</span>
                      <span className="text-[12px] font-black tabular-nums opacity-40">{staff.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="text-[10px] font-black uppercase tracking-widest border-b border-brand-black pb-1">Edit_Profile</button>
                    <button className="text-[10px] font-black uppercase tracking-widest border-b border-brand-black pb-1">Access_Logs</button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-20">
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Financial Protocol</h4>
                  <div className="space-y-12">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Settlement Type</span>
                      <p className="text-2xl font-black uppercase tracking-tighter italic">{staff.settlementType.replace(/_/g, ' ')}</p>
                    </div>
                    {staff.baseSalary > 0 && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Fixed Remuneration</span>
                        <p className="text-3xl font-black tabular-nums tracking-tighter leading-none">₩{staff.baseSalary.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Incentive Index</h4>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    {Object.entries(staff.incentiveRates).map(([cat, rate]) => (
                      <div key={cat} className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20">{cat}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black tabular-nums tracking-tighter leading-none">{rate}</span>
                          <span className="text-[10px] font-black opacity-20">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-brand-black/10 py-48">
              <p className="serif-display text-4xl opacity-10 italic">Select Specialist Entity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
