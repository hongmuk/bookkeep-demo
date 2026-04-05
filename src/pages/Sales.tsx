import { useState } from 'react';
import { TrendingUp, CreditCard, Banknote, Wallet } from 'lucide-react';
import { getDailySales } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6172F3', '#12B76A', '#F79009', '#F04438', '#8B5CF6'];

export default function Sales() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const allSales = getDailySales();
  const sales = period === 'week' ? allSales.slice(-7) : allSales;

  const totalRevenue = sales.reduce((s, d) => s + d.total, 0);
  const totalCard = sales.reduce((s, d) => s + d.card, 0);
  const totalCash = sales.reduce((s, d) => s + d.cash, 0);
  const totalNaver = sales.reduce((s, d) => s + d.naverPay, 0);
  const totalKakao = sales.reduce((s, d) => s + d.kakaoPay, 0);
  const totalOther = sales.reduce((s, d) => s + d.other, 0);

  const pieData = [
    { name: '카드', value: totalCard },
    { name: '현금', value: totalCash },
    { name: '네이버페이', value: totalNaver },
    { name: '카카오페이', value: totalKakao },
    { name: '기타', value: totalOther },
  ];

  const avgDaily = Math.round(totalRevenue / sales.filter(d => d.total > 0).length);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">매출현황</h2>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setPeriod('week')}
            className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors ${period === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >최근 7일</button>
          <button
            onClick={() => setPeriod('month')}
            className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors ${period === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >최근 30일</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SalesCard icon={TrendingUp} label="총 매출" value={totalRevenue} color="bg-primary-50 text-primary-600" />
        <SalesCard icon={CreditCard} label="카드 매출" value={totalCard} color="bg-blue-50 text-blue-600" />
        <SalesCard icon={Banknote} label="현금 매출" value={totalCash} color="bg-green-50 text-green-600" />
        <SalesCard icon={Wallet} label="일 평균 매출" value={avgDaily} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">일별 매출</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales}>
              <XAxis dataKey="date" tickFormatter={(v: string) => `${v.slice(5, 7)}/${v.slice(8)}`} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="card" stackId="a" fill="#6172F3" radius={[0, 0, 0, 0]} name="카드" />
              <Bar dataKey="cash" stackId="a" fill="#12B76A" name="현금" />
              <Bar dataKey="naverPay" stackId="a" fill="#F79009" name="네이버페이" />
              <Bar dataKey="kakaoPay" stackId="a" fill="#F04438" name="카카오페이" />
              <Bar dataKey="other" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="기타" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">결제수단별 비율</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend
                formatter={(value: string) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>}
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{((d.value / totalRevenue) * 100).toFixed(1)}%</span>
                  <span className="font-semibold text-gray-700">₩{d.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-[12px] text-gray-400 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5">₩{value.toLocaleString()}</p>
    </div>
  );
}
