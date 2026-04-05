import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { statusLabels, statusColors, channelLabels, staffList, getDailySales } from '../data/mock';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { bookings, selectedDate } = useStore();
  const todayBookings = bookings.filter((b) => b.date === selectedDate);
  const completed = todayBookings.filter((b) => b.status === 'completed');
  const confirmed = todayBookings.filter((b) => b.status === 'confirmed');
  const pending = todayBookings.filter((b) => b.status === 'pending');
  const todayRevenue = completed.reduce((s, b) => s + b.totalPrice, 0);
  const dailySales = getDailySales().slice(-7);

  const upcomingBookings = todayBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-8">
      {/* Header with Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">대시보드</h2>
          <p className="text-[14px] text-gray-500 mt-1 font-medium">
            안녕하세요, <span className="text-primary-600 font-bold">김수현 원장님!</span> 오늘은 7건의 예약이 기다리고 있어요.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <span className="text-[13px] font-bold text-gray-600">2026년 4월 6일 월요일</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <SummaryCard icon={CalendarDays} label="오늘 예약" value={`${todayBookings.length}건`} color="bg-primary-50 text-primary-600" />
        <SummaryCard icon={CheckCircle2} label="시술 완료" value={`${completed.length}건`} color="bg-emerald-50 text-emerald-600" />
        <SummaryCard icon={Clock} label="대기/확정" value={`${confirmed.length + pending.length}건`} color="bg-indigo-50 text-indigo-600" />
        <SummaryCard icon={TrendingUp} label="오늘 매출" value={`₩${todayRevenue.toLocaleString()}`} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">다음 예약 일정</h3>
            <button className="text-[12px] font-bold text-primary-600 hover:underline">전체보기</button>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-medium">남은 예약이 없습니다</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {upcomingBookings.map((b) => {
                const staff = staffList.find((s) => s.id === b.staffId);
                return (
                  <div key={b.id} className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-gray-50/50 hover:bg-white hover:border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="w-1.5 h-12 rounded-full shrink-0" style={{ backgroundColor: staff?.profileColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-bold text-gray-900 tracking-tight">{b.customerName}</span>
                        <div className="flex gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-gray-400 border border-gray-100 uppercase tracking-wider">
                            {channelLabels[b.channel]}
                          </span>
                        </div>
                      </div>
                      <p className="text-[13px] font-medium text-gray-500 truncate">
                        {b.services.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[15px] font-black text-gray-900 tabular-nums tracking-tighter">{b.startTime} - {b.endTime}</p>
                      <p className="text-[12px] font-bold text-primary-600/60 mt-0.5">{b.staffName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Chart */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-[17px] font-bold text-gray-900 mb-6 tracking-tight">주간 매출 추이</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={dailySales} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5557ed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#5557ed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(8)} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-[11px] font-bold shadow-xl border border-gray-800">
                            ₩{Number(payload[0].value).toLocaleString()}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#5557ed" strokeWidth={3} fill="url(#colorSales)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staff Summary */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[17px] font-bold text-gray-900 mb-5 tracking-tight">직원별 현황</h3>
            <div className="grid gap-4">
              {staffList.map((s) => {
                const count = todayBookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled').length;
                return (
                  <div key={s.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[13px] font-black shadow-inner" style={{ backgroundColor: s.profileColor }}>
                        {s.name[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[14px] font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{s.name}</span>
                      <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-primary-500 h-full rounded-full transition-all duration-500" style={{ width: `${(count / 10) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-[14px] font-black text-gray-900 tabular-nums">{count}건</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-[13px] text-gray-500 font-bold tracking-tight">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1 tracking-tighter tabular-nums">{value}</p>
    </div>
  );
}
