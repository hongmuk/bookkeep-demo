import { useState } from 'react';
import { Plus, Phone, Shield, Scissors } from 'lucide-react';
import { staffList } from '../data/mock';

export default function Staff() {
  const [selected, setSelected] = useState<string | null>(staffList[0].id);
  const staff = selected ? staffList.find((s) => s.id === selected) : null;

  const roleLabels: Record<string, string> = { owner: 'Master', manager: 'Manager', staff: 'Stylist' };
  const settlementLabels: Record<string, string> = {
    fixed_plus_incentive: 'Fixed + Incentive',
    incentive_only: 'Performance Based',
    booth_rental: 'Booth Rental',
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Team
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            Directory / {staffList.length} Professionals
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[24px] text-[13px] font-black uppercase tracking-[0.1em] hover:bg-accent transition-all shadow-floating active:scale-95">
          <Plus className="w-4 h-4" /> Recruit Staff
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Staff List (Minimal Side) */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-4 mb-4 italic">Active Members</p>
          <div className="space-y-3">
            {staffList.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full group flex items-center gap-5 p-6 rounded-[32px] transition-all duration-500
                  ${selected === s.id 
                    ? 'bg-gray-900 text-white shadow-floating translate-x-2' 
                    : 'bg-white border border-white hover:bg-gray-50/50 hover:shadow-elegant'}`}
              >
                <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-[18px] font-black shadow-lg" style={{ backgroundColor: s.profileColor }}>
                  {s.name[0]}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-[17px] font-black tracking-tight ${selected === s.id ? 'text-white' : 'text-gray-900'}`}>{s.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  </div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${selected === s.id ? 'text-white/40' : 'text-gray-400'}`}>{roleLabels[s.role]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Staff Detail (Editorial Surface) */}
        <div className="lg:col-span-8">
          {staff ? (
            <div className="bg-white rounded-[64px] shadow-floating border border-white p-12 lg:p-16 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-12 items-start md:items-center border-b border-gray-50 pb-16">
                <div className="w-40 h-40 rounded-[56px] bg-gray-50 border-8 border-white shadow-elegant flex items-center justify-center text-[56px] font-black text-white" style={{ backgroundColor: staff.profileColor }}>
                  {staff.name[0]}
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[56px] font-black text-gray-900 tracking-tighter leading-none">{staff.name}</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em]">
                        {roleLabels[staff.role]}
                      </span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-[15px] font-black tabular-nums">{staff.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Edit Profile</button>
                    <button className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Permissions</button>
                  </div>
                </div>
              </div>

              {/* Settlement Configuration */}
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <h4 className="text-[20px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Scissors className="w-6 h-6 text-accent" /> Financial Configuration
                  </h4>
                  <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Payout Settings</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-floating flex flex-col justify-between h-64">
                    <Shield className="w-8 h-8 text-white/20" />
                    <div>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1">Settlement Type</p>
                      <p className="text-[24px] font-black tracking-tight">{settlementLabels[staff.settlementType]}</p>
                    </div>
                  </div>
                  
                  {staff.baseSalary > 0 && (
                    <div className="bg-white rounded-[40px] p-10 shadow-elegant border border-white flex flex-col justify-between h-64">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center font-black">$</div>
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Salary</p>
                        <p className="text-[32px] font-black text-gray-900 tabular-nums leading-none">₩{staff.baseSalary.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6 pt-6">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Incentive Distribution by Category</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(staff.incentiveRates).map(([cat, rate]) => (
                      <div key={cat} className="group bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 p-6 rounded-[28px] transition-all duration-500 hover:shadow-elegant">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{cat}</p>
                        <p className="text-[24px] font-black text-gray-900 tabular-nums leading-none group-hover:text-accent transition-colors">{String(rate)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-20 bg-gray-50/50 rounded-[64px] border border-dashed border-gray-200">
              <p className="text-[14px] font-black text-gray-300 uppercase tracking-[0.2em]">Select a professional to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
