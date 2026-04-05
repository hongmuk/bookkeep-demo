import { CalendarDays, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { staffList, getDailySales, statusLabels, statusColors, channelLabels } from '../data/mock';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { bookings, selectedDate } = useStore();
  const todayBookings = bookings.filter((b) => b.date === selectedDate);
  const completed = todayBookings.filter((b) => b.status === 'completed');
  const confirmed = todayBookings.filter((b) => b.status === 'confirmed');
  const pending = todayBookings.filter((b) => b.status === 'pending');
  const todayRevenue = completed.reduce((s, b) => s + b.totalPrice, 0);
  const dailySales = getDailySales().slice(-7);

  const upcoming = todayBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h2 className="text-xl font-bold text-gray-900">대시보드</h2>
        <p className="text-sm text-gray-500 mt-0.5">2026년 4월 6일 월요일</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={CalendarDays} label="오늘 예약" value={`${todayBookings.length}건`} cls="bg-primary-50 text-primary-600" />
        <Card icon={CheckCircle2} label="완료" value={`${completed.length}건`} cls="bg-emerald-50 text-emerald-600" />
        <Card icon={Clock} label="대기/확정" value={`${confirmed.length + pending.length}건`} cls="bg-blue-50 text-blue-600" />
        <Card icon={TrendingUp} label="오늘 매출" value={`₩${todayRevenue.toLocaleString()}`} cls="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Upcoming */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">다음 예약</h3>
          <div className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">남은 예약이 없습니다</p>
            ) : upcoming.map((b) => {
              const staff = staffList.find((s) => s.id === b.staffId);
              return (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: staff?.profileColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-800">{b.customerName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{channelLabels[b.channel]}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5 truncate">{b.services.map((s) => s.name).join(', ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-gray-700">{b.startTime}~{b.endTime}</p>
                    <p className="text-[12px] text-gray-400">{b.staffName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[15px] font-bold text-gray-800 mb-3">주간 매출 추이</h3>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`₩${Number(v).toLocaleString()}`, '매출']}
                  labelFormatter={(l: unknown) => String(l)}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#cG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Staff */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[15px] font-bold text-gray-800 mb-3">직원별 오늘 예약</h3>
            <div className="space-y-2.5">
              {staffList.map((s) => {
                const cnt = todayBookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled').length;
                return (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: s.profileColor }}>{s.name[0]}</div>
                    <span className="text-[13px] text-gray-700 flex-1">{s.name}</span>
                    <span className="text-[13px] font-bold text-gray-800">{cnt}건</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-[15px] font-bold text-gray-800 mb-4">오늘 전체 예약 ({todayBookings.length}건)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['시간', '고객', '서비스', '담당', '채널', '금액', '상태'].map((h) => (
                  <th key={h} className="pb-2.5 text-[12px] font-semibold text-gray-400 whitespace-nowrap pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...todayBookings].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 text-[13px] text-gray-700 pr-4 whitespace-nowrap">{b.startTime}~{b.endTime}</td>
                  <td className="py-2.5 text-[13px] font-medium text-gray-800 pr-4 whitespace-nowrap">{b.customerName}</td>
                  <td className="py-2.5 text-[13px] text-gray-600 pr-4">{b.services.map((s) => s.name).join(', ')}</td>
                  <td className="py-2.5 text-[13px] text-gray-600 pr-4 whitespace-nowrap">{b.staffName}</td>
                  <td className="py-2.5 pr-4"><span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{channelLabels[b.channel]}</span></td>
                  <td className="py-2.5 text-[13px] font-semibold text-gray-700 pr-4 whitespace-nowrap">₩{b.totalPrice.toLocaleString()}</td>
                  <td className="py-2.5"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>{statusLabels[b.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, cls }: { icon: any; label: string; value: string; cls: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className={`w-9 h-9 rounded-lg ${cls} flex items-center justify-center mb-3`}><Icon className="w-[18px] h-[18px]" /></div>
      <p className="text-[12px] text-gray-400 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
