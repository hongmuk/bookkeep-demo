import { useState } from 'react';
import { Plus, Phone, Shield, Scissors } from 'lucide-react';
import { staffList } from '../data/mock';

export default function Staff() {
  const [selected, setSelected] = useState<string | null>(null);
  const staff = selected ? staffList.find((s) => s.id === selected) : null;
  const roles: Record<string, string> = { owner: '원장', manager: '매니저', staff: '디자이너' };
  const stTypes: Record<string, string> = { fixed_plus_incentive: '고정급 + 인센티브', incentive_only: '순수 인센티브', booth_rental: '면대여' };

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">직원관리</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700"><Plus className="w-4 h-4" /> 직원 초대</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {staffList.map((s) => (
            <button key={s.id} onClick={() => setSelected(s.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left ${selected === s.id ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.profileColor }}>{s.name[0]}</div>
              <div className="flex-1"><div className="flex items-center gap-2"><span className="text-[14px] font-bold text-gray-800">{s.name}</span>{s.role === 'owner' && <Shield className="w-3.5 h-3.5 text-primary-500" />}</div><p className="text-[12px] text-gray-400">{roles[s.role]}</p></div>
              <div className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {staff ? (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: staff.profileColor }}>{staff.name[0]}</div>
                <div><h3 className="text-lg font-bold text-gray-900">{staff.name}</h3><div className="flex items-center gap-3 mt-1"><span className="text-[12px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-medium">{roles[staff.role]}</span><span className="flex items-center gap-1 text-[12px] text-gray-500"><Phone className="w-3 h-3" /> {staff.phone}</span></div></div>
              </div>
              <div><h4 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2"><Scissors className="w-4 h-4 text-primary-500" /> 정산 설정</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-[13px]"><span className="text-gray-500">정산 유형</span><span className="font-semibold text-gray-800">{stTypes[staff.settlementType]}</span></div>
                  {staff.baseSalary > 0 && <div className="flex items-center justify-between text-[13px]"><span className="text-gray-500">기본급</span><span className="font-semibold text-gray-800">₩{staff.baseSalary.toLocaleString()}</span></div>}
                  <div><p className="text-[12px] font-semibold text-gray-500 mb-2">인센티브 비율</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.entries(staff.incentiveRates).map(([cat, rate]) => (
                        <div key={cat} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100"><span className="text-[12px] text-gray-600">{cat}</span><span className="text-[13px] font-bold text-primary-600">{String(rate)}%</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center"><p className="text-sm text-gray-400">좌측에서 직원을 선택하세요</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
