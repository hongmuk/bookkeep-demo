import { useState } from 'react';
import { Plus, Phone, Shield, Scissors } from 'lucide-react';
import { staffList } from '../data/mock';

export default function Staff() {
  const [selectedId, setSelectedId] = useState<string | null>(staffList[0].id);
  const staff = selectedId ? staffList.find((s) => s.id === selectedId) : null;

  const roleLabels: Record<string, string> = { owner: 'Master', manager: 'Manager', staff: 'Stylist' };
  const settlementLabels: Record<string, string> = {
    fixed_plus_incentive: 'Fixed + Incentive',
    incentive_only: 'Pure Incentive',
    booth_rental: 'Booth Rental',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">팀 매니지먼트</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Professional Directory
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> 새로운 팀원 초대
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Staff List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="px-2 mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Members</h3>
          </div>
          {staffList.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
                ${selectedId === s.id 
                  ? 'bg-white border-slate-900 shadow-xl translate-x-1' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-black shadow-md transition-transform group-hover:scale-105" style={{ backgroundColor: s.profileColor }}>
                {s.name[0]}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 tracking-tight">{s.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{roleLabels[s.role]}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Staff Detail Panel */}
        <div className="lg:col-span-8">
          {staff ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Profile Top */}
              <div className="p-8 lg:p-12 border-b border-slate-50 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-32 h-32 rounded-[32px] flex items-center justify-center text-white text-[48px] font-black shadow-2xl border-4 border-white" style={{ backgroundColor: staff.profileColor }}>
                  {staff.name[0]}
                </div>
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{staff.name}</h3>
                      <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                        {staff.isActive ? 'On-Duty' : 'Offline'}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{roleLabels[staff.role]} Account</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-bold tabular-nums tracking-tight">{staff.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-black transition-all">Edit Professional Info</button>
                    <button className="px-5 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Manage Permissions</button>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="p-8 lg:p-12 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Scissors className="w-4 h-4" /> Financial Configuration
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Structure</p>
                      <p className="text-lg font-black text-slate-900">{settlementLabels[staff.settlementType]}</p>
                    </div>
                    {staff.baseSalary > 0 && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Base Salary</p>
                        <p className="text-lg font-black text-slate-900 tabular-nums">₩{staff.baseSalary.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Incentive Ratio by Service Category</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(staff.incentiveRates).map(([cat, rate]) => (
                      <div key={cat} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-900 transition-all group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{cat}</p>
                        <p className="text-2xl font-black text-slate-900 tabular-nums group-hover:text-primary-600 transition-colors">{rate}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Select a professional member</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
