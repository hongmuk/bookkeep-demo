import { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { getSettlements, staffList } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Settlement() {
  const [month, setMonth] = useState('2026-03');
  const settlements = getSettlements(month);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalSales = settlements.reduce((s, st) => s + st.totalSales, 0);
  const totalPayout = settlements.reduce((s, st) => s + st.netAmount, 0);
  const chart = settlements.map((s) => ({ name: s.staffName, 매출: s.totalSales, 지급액: s.netAmount }));

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">정산관리</h2>
        <div className="flex items-center gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="text-[13px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50"><Download className="w-3.5 h-3.5" /> PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-[12px] text-gray-400 font-medium">총 매출</p><p className="text-xl font-bold text-gray-900 mt-1">₩{totalSales.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-[12px] text-gray-400 font-medium">총 지급액</p><p className="text-xl font-bold text-primary-600 mt-1">₩{totalPayout.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-[12px] text-gray-400 font-medium">정산 대상</p><p className="text-xl font-bold text-gray-900 mt-1">{settlements.length}명</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-[15px] font-bold text-gray-800 mb-4">직원별 매출 vs 지급액</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chart}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v: number) => `${(v/10000).toFixed(0)}만`} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Bar dataKey="매출" fill="#e0e7ff" radius={[4,4,0,0]} />
            <Bar dataKey="지급액" fill="#6366f1" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {settlements.map((st) => {
          const staff = staffList.find((s) => s.id === st.staffId);
          const open = expandedId === st.staffId;
          return (
            <div key={st.staffId} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button onClick={() => setExpandedId(open ? null : st.staffId)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: staff?.profileColor }}>{st.staffName[0]}</div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-bold text-gray-800">{st.staffName}</p>
                  <p className="text-[12px] text-gray-400">{staff?.settlementType === 'fixed_plus_incentive' ? '고정급+인센티브' : staff?.settlementType === 'incentive_only' ? '순수 인센티브' : '면대여'}</p>
                </div>
                <div className="text-right mr-2"><p className="text-[12px] text-gray-400">매출</p><p className="text-[14px] font-bold text-gray-700">₩{st.totalSales.toLocaleString()}</p></div>
                <div className="text-right mr-2"><p className="text-[12px] text-gray-400">지급액</p><p className="text-[14px] font-bold text-primary-600">₩{st.netAmount.toLocaleString()}</p></div>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {open && (
                <div className="px-4 pb-4 border-t border-gray-100 mt-0 space-y-4 pt-4">
                  <div><h4 className="text-[12px] font-bold text-gray-500 mb-2">시술별 매출</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {Object.entries(st.serviceSales).map(([cat, raw]) => {
                        const amount = raw as number;
                        const rate = staff?.incentiveRates[cat] || 0;
                        const inc = Math.round(amount * rate / 100);
                        const cnt = st.serviceCount[cat] || 0;
                        return (<div key={cat} className="flex items-center text-[12px]"><span className="w-16 text-gray-600 font-medium">{cat}</span><span className="w-12 text-gray-400 text-right">{cnt}건</span><span className="flex-1 text-right text-gray-700">₩{amount.toLocaleString()}</span><span className="w-12 text-center text-gray-400">x{rate}%</span><span className="w-28 text-right font-semibold text-primary-600">₩{inc.toLocaleString()}</span></div>);
                      })}
                    </div>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 space-y-1.5">
                    {staff?.baseSalary ? <R label="기본급" value={st.baseSalary} /> : null}
                    <R label="인센티브 합계" value={st.incentiveAmount} />
                    {st.deductions > 0 && <R label="4대보험 공제" value={-st.deductions} neg />}
                    <div className="border-t border-primary-200 pt-1.5 flex items-center justify-between text-[13px]"><span className="font-bold text-gray-800">최종 지급액</span><span className="font-bold text-primary-700 text-[15px]">₩{st.netAmount.toLocaleString()}</span></div>
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

function R({ label, value, neg }: { label: string; value: number; neg?: boolean }) {
  return <div className="flex items-center justify-between text-[12px]"><span className="text-gray-600">{label}</span><span className={`font-semibold ${neg ? 'text-red-500' : 'text-gray-700'}`}>{neg ? '-' : ''}₩{Math.abs(value).toLocaleString()}</span></div>;
}
