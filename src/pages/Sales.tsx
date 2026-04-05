import { useState } from 'react';
import { TrendingUp, CreditCard, Banknote, Wallet } from 'lucide-react';
import { getDailySales } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Sales() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const all = getDailySales();
  const sales = period === 'week' ? all.slice(-7) : all;
  const total = sales.reduce((s, d) => s + d.total, 0);
  const card = sales.reduce((s, d) => s + d.card, 0);
  const cash = sales.reduce((s, d) => s + d.cash, 0);
  const naver = sales.reduce((s, d) => s + d.naverPay, 0);
  const kakao = sales.reduce((s, d) => s + d.kakaoPay, 0);
  const other = sales.reduce((s, d) => s + d.other, 0);
  const avg = Math.round(total / sales.filter(d => d.total > 0).length);
  const pie = [{ name: '카드', value: card }, { name: '현금', value: cash }, { name: '네이버페이', value: naver }, { name: '카카오페이', value: kakao }, { name: '기타', value: other }];

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">매출현황</h2>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setPeriod('week')} className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${period === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>최근 7일</button>
          <button onClick={() => setPeriod('month')} className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${period === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>최근 30일</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SC icon={TrendingUp} label="총 매출" value={total} cls="bg-primary-50 text-primary-600" />
        <SC icon={CreditCard} label="카드 매출" value={card} cls="bg-blue-50 text-blue-600" />
        <SC icon={Banknote} label="현금 매출" value={cash} cls="bg-emerald-50 text-emerald-600" />
        <SC icon={Wallet} label="일 평균" value={avg} cls="bg-amber-50 text-amber-600" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">일별 매출</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sales}>
              <XAxis dataKey="date" tickFormatter={(v: string) => `${v.slice(5,7)}/${v.slice(8)}`} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${(v/10000).toFixed(0)}만`} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="card" stackId="a" fill="#6366f1" name="카드" />
              <Bar dataKey="cash" stackId="a" fill="#10b981" name="현금" />
              <Bar dataKey="naverPay" stackId="a" fill="#f59e0b" name="네이버페이" />
              <Bar dataKey="kakaoPay" stackId="a" fill="#ef4444" name="카카오페이" />
              <Bar dataKey="other" stackId="a" fill="#8b5cf6" radius={[4,4,0,0]} name="기타" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">결제수단별</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>{pie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie>
              <Tooltip formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend formatter={(v: string) => <span style={{ fontSize: 11, color: '#6b7280' }}>{v}</span>} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {pie.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} /><span className="text-gray-600">{d.name}</span></div>
                <span className="font-semibold text-gray-700">₩{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SC({ icon: Icon, label, value, cls }: { icon: any; label: string; value: number; cls: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className={`w-9 h-9 rounded-lg ${cls} flex items-center justify-center mb-3`}><Icon className="w-[18px] h-[18px]" /></div>
      <p className="text-[12px] text-gray-400 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5">₩{value.toLocaleString()}</p>
    </div>
  );
}
