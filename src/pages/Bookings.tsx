import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">예약관리</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> 예약 추가
        </button>
      </div>

      {/* Date nav + filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => shiftDate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[15px] font-bold text-gray-800 min-w-[160px] text-center">
              {dateObj.getFullYear()}년 {dateObj.getMonth() + 1}월 {dateObj.getDate()}일 ({dayNames[dateObj.getDay()]})
            </span>
            <button onClick={() => shiftDate(1)} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
            <button
              onClick={() => setSelectedDate('2026-04-06')}
              className="text-[12px] px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 font-medium ml-1"
            >오늘</button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600"
            >
              <option value="all">전체 직원</option>
              {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setView('timeline')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors ${view === 'timeline' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >타임라인</button>
              <button
                onClick={() => setView('list')}
                className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors ${view === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >목록</button>
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
    const top = ((startH - 10) * 60 + startM) * (48 / 60);
    const height = Math.max(((endH - startH) * 60 + (endM - startM)) * (48 / 60), 24);
    return { top: `${top}px`, height: `${height}px` };
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="w-16 shrink-0 p-2 text-[11px] font-semibold text-gray-400 border-r border-gray-100">시간</div>
          {activeStaff.map((s) => (
            <div key={s.id} className="flex-1 p-2 text-center border-r border-gray-100 last:border-r-0">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.profileColor }} />
                <span className="text-[12px] font-semibold text-gray-700">{s.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex relative">
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-gray-100">
            {Array.from({ length: 12 }, (_, i) => i + 10).map((h) => (
              <div key={h} className="h-12 border-b border-gray-50 flex items-start justify-end pr-2 pt-0.5">
                <span className="text-[10px] text-gray-400">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Staff columns */}
          {activeStaff.map((s) => {
            const staffBookings = bookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled' && b.status !== 'no_show');
            return (
              <div key={s.id} className="flex-1 border-r border-gray-100 last:border-r-0 relative">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-12 border-b border-gray-50" />
                ))}
                {staffBookings.map((b) => {
                  const style = getBookingStyle(b);
                  const bgColor = b.status === 'completed' ? 'bg-green-50 border-green-200' :
                    b.status === 'confirmed' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';
                  return (
                    <div
                      key={b.id}
                      className={`absolute left-1 right-1 rounded-md border px-1.5 py-0.5 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${bgColor}`}
                      style={style}
                      title={`${b.customerName} - ${b.services.map(s => s.name).join(', ')}`}
                    >
                      <p className="text-[10px] font-bold text-gray-800 truncate">{b.customerName}</p>
                      <p className="text-[9px] text-gray-500 truncate">{b.services.map(s => s.name).join(', ')}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ListView({ bookings, onStatusChange }: { bookings: Booking[]; onStatusChange: (id: string, s: BookingStatus) => void }) {
  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            {['시간', '고객', '서비스', '담당', '채널', '금액', '상태', '액션'].map((h) => (
              <th key={h} className="px-4 py-3 text-[12px] font-semibold text-gray-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((b) => (
            <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-[13px] text-gray-700 whitespace-nowrap">{b.startTime}~{b.endTime}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-gray-800 whitespace-nowrap">{b.customerName}</td>
              <td className="px-4 py-3 text-[13px] text-gray-600">{b.services.map((s) => s.name).join(', ')}</td>
              <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">{b.staffName}</td>
              <td className="px-4 py-3">
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{channelLabels[b.channel]}</span>
              </td>
              <td className="px-4 py-3 text-[13px] font-semibold text-gray-700 whitespace-nowrap">₩{b.totalPrice.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                  {statusLabels[b.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                {b.status === 'pending' && (
                  <button
                    onClick={() => onStatusChange(b.id, 'confirmed')}
                    className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium hover:bg-blue-100"
                  >확정</button>
                )}
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => onStatusChange(b.id, 'completed')}
                    className="text-[11px] px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium hover:bg-green-100"
                  >완료</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const inputClass = "w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400";
  const labelClass = "block text-[12px] font-semibold text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900">새 예약 추가</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{date}</p>
        </div>
        <div className="px-6 py-4 space-y-3.5">
          <div>
            <label className={labelClass}>고객</label>
            <select className={inputClass} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">선택하세요</option>
              {customerList.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>담당 직원</label>
            <select className={inputClass} value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              <option value="">선택하세요</option>
              {staffList.filter(s => s.isActive).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>시술</label>
            <select className={inputClass} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">선택하세요</option>
              {serviceList.map((s) => <option key={s.id} value={s.id}>{s.name} (₩{s.price.toLocaleString()}, {s.durationMinutes}분)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>시간</label>
              <select className={inputClass} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>채널</label>
              <select className={inputClass} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Booking['channel'] })}>
                {Object.entries(channelLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>메모</label>
            <input className={inputClass} placeholder="요청사항 등" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-gray-500 hover:bg-gray-50 rounded-lg font-medium">취소</button>
          <button
            onClick={handleSave}
            disabled={!form.customerId || !form.staffId || !form.serviceId}
            className="px-4 py-2 text-[13px] bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >저장</button>
        </div>
      </div>
    </div>
  );
}
