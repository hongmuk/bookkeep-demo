import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { useStore } from '../store';
import { staffList, serviceList, customerList, statusLabels, statusColors, channelLabels } from '../data/mock';
import type { Booking, BookingStatus } from '../types';

const timeSlots = Array.from({ length: 23 }, (_, i) => {
  const h = Math.floor(i / 2) + 10;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
});

export default function Bookings() {
  const { bookings, selectedDate, setSelectedDate, addBooking, updateBookingStatus } = useStore();
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const [showModal, setShowModal] = useState(false);
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const dayBookings = bookings
    .filter((b) => b.date === selectedDate)
    .filter((b) => staffFilter === 'all' || b.staffId === staffFilter);

  const dateObj = new Date(selectedDate);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">예약 관리</h2>
          <p className="text-[14px] text-gray-500 mt-1 font-medium">실시간 예약 현황을 확인하고 관리하세요.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl text-[14px] font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 active:scale-95"
        >
          <Plus className="w-4 h-4" /> 예약 추가
        </button>
      </div>

      {/* Date nav + filters */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100/50">
            <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"><ChevronLeft className="w-5 h-5" /></button>
            <div className="px-4 text-center min-w-[180px]">
              <span className="text-[15px] font-black text-gray-900 tracking-tight">
                {dateObj.getFullYear()}년 {dateObj.getMonth() + 1}월 {dateObj.getDate()}일
                <span className="text-primary-600 ml-1">({dayNames[dateObj.getDay()]})</span>
              </span>
            </div>
            <button onClick={() => shiftDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"><ChevronRight className="w-5 h-5" /></button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={() => setSelectedDate('2026-04-06')}
              className="text-[12px] px-4 py-2 rounded-xl bg-white text-gray-900 font-bold shadow-sm hover:bg-gray-50 transition-colors"
            >오늘</button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="appearance-none text-[13px] font-bold border border-gray-100 bg-gray-50 rounded-2xl px-5 py-2.5 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
              >
                <option value="all">전체 직원</option>
                {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div className="flex bg-gray-100 rounded-2xl p-1 border border-gray-100">
              <button
                onClick={() => setView('timeline')}
                className={`text-[13px] px-5 py-2 rounded-xl font-bold transition-all ${view === 'timeline' ? 'bg-white text-primary-700 shadow-sm shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >타임라인</button>
              <button
                onClick={() => setView('list')}
                className={`text-[13px] px-5 py-2 rounded-xl font-bold transition-all ${view === 'list' ? 'bg-white text-primary-700 shadow-sm shadow-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >목록 뷰</button>
            </div>
          </div>
        </div>
      </div>

      {view === 'timeline' ? (
        <TimelineView bookings={dayBookings} onStatusChange={updateBookingStatus} />
      ) : (
        <ListView bookings={dayBookings} onStatusChange={updateBookingStatus} />
      )}

      {showModal && <BookingModal onClose={() => setShowModal(false)} onSave={addBooking} date={selectedDate} />}
    </div>
  );
}

function TimelineView({ bookings }: { bookings: Booking[]; onStatusChange: (id: string, s: BookingStatus) => void }) {
  const activeStaff = staffList.filter((s) => s.isActive);

  function getBookingStyle(b: Booking) {
    const startH = parseInt(b.startTime.split(':')[0]);
    const startM = parseInt(b.startTime.split(':')[1]);
    const endH = parseInt(b.endTime.split(':')[0]);
    const endM = parseInt(b.endTime.split(':')[1]);
    const top = ((startH - 10) * 60 + startM) * (56 / 60);
    const height = Math.max(((endH - startH) * 60 + (endM - startM)) * (56 / 60), 32);
    return { top: `${top}px`, height: `${height}px` };
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="flex border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="w-20 shrink-0 p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-50 flex items-center justify-center">Time</div>
            {activeStaff.map((s) => (
              <div key={s.id} className="flex-1 p-4 border-r border-gray-50 last:border-r-0">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-sm" style={{ backgroundColor: s.profileColor }}>
                    {s.name[0]}
                  </div>
                  <span className="text-[14px] font-bold text-gray-800">{s.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex relative">
            {/* Time column */}
            <div className="w-20 shrink-0 border-r border-gray-50 bg-gray-50/30">
              {Array.from({ length: 12 }, (_, i) => i + 10).map((h) => (
                <div key={h} className="h-14 border-b border-gray-50 flex items-start justify-center pt-2">
                  <span className="text-[11px] font-bold text-gray-400 tabular-nums">{h}:00</span>
                </div>
              ))}
            </div>

            {/* Staff columns */}
            {activeStaff.map((s) => {
              const staffBookings = bookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled' && b.status !== 'no_show');
              return (
                <div key={s.id} className="flex-1 border-r border-gray-50 last:border-r-0 relative group">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-14 border-b border-gray-50/50 group-hover:bg-gray-50/30 transition-colors" />
                  ))}
                  {staffBookings.map((b) => {
                    const style = getBookingStyle(b);
                    const statusConfig = {
                      completed: 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-emerald-100/50',
                      confirmed: 'bg-primary-50 border-primary-100 text-primary-800 shadow-primary-100/50',
                      pending: 'bg-amber-50 border-amber-100 text-amber-800 shadow-amber-100/50',
                    };
                    const config = statusConfig[b.status as keyof typeof statusConfig] || statusConfig.pending;
                    
                    return (
                      <div
                        key={b.id}
                        className={`absolute left-1.5 right-1.5 rounded-xl border-2 px-3 py-2 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 z-10 shadow-sm ${config}`}
                        style={style}
                      >
                        <div className="flex flex-col h-full">
                          <p className="text-[12px] font-black truncate leading-tight">{b.customerName}</p>
                          <p className="text-[10px] font-bold opacity-70 truncate mt-0.5">
                            {b.services.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({ bookings, onStatusChange }: { bookings: Booking[]; onStatusChange: (id: string, s: BookingStatus) => void }) {
  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {['시간', '고객 정보', '서비스', '담당', '채널', '금액', '상태', '액션'].map((h) => (
                <th key={h} className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((b) => (
              <tr key={b.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-black text-gray-900 tabular-nums whitespace-nowrap">{b.startTime} - {b.endTime}</td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-bold text-gray-900">{b.customerName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-gray-600">{b.services.map((s) => s.name).join(', ')}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }}>
                      {b.staffName[0]}
                    </div>
                    <span className="text-[13px] font-bold text-gray-700">{b.staffName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] px-2 py-1 rounded-full font-bold bg-gray-100 text-gray-500 uppercase tracking-tighter">{channelLabels[b.channel]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-black text-gray-900 tabular-nums whitespace-nowrap">₩{b.totalPrice.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => onStatusChange(b.id, 'confirmed')}
                        className="text-[11px] px-3 py-1.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all active:scale-95"
                      >확정</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => onStatusChange(b.id, 'completed')}
                        className="text-[11px] px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95"
                      >완료</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingModal({ onClose, onSave, date }: { onClose: () => void; onSave: (b: Booking) => void; date: string }) {
  const [form, setForm] = useState({
    customerId: '', staffId: '', serviceId: '', startTime: '10:00', channel: 'manual' as Booking['channel'], memo: '',
  });

  function handleSave() {
    const customer = customerList.find((c) => c.id === form.customerId);
    const staff = staffList.find((s) => s.id === form.staffId);
    const service = serviceList.find((s) => s.id === form.serviceId);
    if (!customer || !staff || !service) return;

    const startH = parseInt(form.startTime.split(':')[0]);
    const startM = parseInt(form.startTime.split(':')[1]);
    const endMin = startH * 60 + startM + service.durationMinutes;
    const endTime = `${Math.floor(endMin / 60).toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`;

    onSave({
      id: `bk-new-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      staffId: staff.id,
      staffName: staff.name,
      status: 'confirmed',
      date,
      startTime: form.startTime,
      endTime,
      services: [{ serviceId: service.id, name: service.name, price: service.price }],
      channel: form.channel,
      totalPrice: service.price,
      memo: form.memo,
    });
    onClose();
  }

  const inputClass = "w-full text-[14px] font-medium border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all appearance-none";
  const labelClass = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl shadow-gray-900/10 border border-white overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">새 예약 등록</h3>
            <p className="text-[13px] text-primary-600 font-bold mt-1">{date} (월요일)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>고객 선택</label>
              <div className="relative">
                <select className={inputClass} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
                  <option value="">선택하세요</option>
                  {customerList.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" />
              </div>
            </div>
            <div>
              <label className={labelClass}>담당 직원</label>
              <div className="relative">
                <select className={inputClass} value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
                  <option value="">선택하세요</option>
                  {staffList.filter(s => s.isActive).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>서비스 시술</label>
            <div className="relative">
              <select className={inputClass} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
                <option value="">선택하세요</option>
                {serviceList.map((s) => <option key={s.id} value={s.id}>{s.name} (₩{s.price.toLocaleString()}, {s.durationMinutes}분)</option>)}
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>시작 시간</label>
              <div className="relative">
                <select className={inputClass} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <Clock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
            <div>
              <label className={labelClass}>예약 채널</label>
              <div className="relative">
                <select className={inputClass} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Booking['channel'] })}>
                  {Object.entries(channelLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>메모</label>
            <textarea 
              className={`${inputClass} h-24 resize-none`} 
              placeholder="특별한 요청사항이 있나요?" 
              value={form.memo} 
              onChange={(e) => setForm({ ...form, memo: e.target.value })} 
            />
          </div>
        </div>
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-[14px] text-gray-500 hover:bg-white rounded-2xl font-bold transition-all hover:shadow-sm">취소</button>
          <button
            onClick={handleSave}
            disabled={!form.customerId || !form.staffId || !form.serviceId}
            className="px-8 py-3 text-[14px] bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary-100 transition-all active:scale-95"
          >예약 확정하기</button>
        </div>
      </div>
    </div>
  );
}
