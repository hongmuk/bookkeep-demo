import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { useStore } from '../store';
import { staffList, serviceList, customerList, statusLabels, channelLabels } from '../data/mock';
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
    <div className="space-y-12">
      {/* Editorial Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Appointments
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-elegant">
              <button onClick={() => shiftDate(-1)} className="p-1 hover:text-accent transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-[14px] font-black text-gray-900 min-w-[140px] text-center tabular-nums">
                {dateObj.getFullYear()}. {(dateObj.getMonth() + 1).toString().padStart(2, '0')}. {dateObj.getDate().toString().padStart(2, '0')}
              </span>
              <button onClick={() => shiftDate(1)} className="p-1 hover:text-accent transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <span className="text-[13px] font-black text-accent uppercase tracking-[0.2em]">
              {dayNames[dateObj.getDay()]}day
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100/50 p-1.5 rounded-[20px] border border-white">
            <button
              onClick={() => setView('timeline')}
              className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${view === 'timeline' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >Timeline</button>
            <button
              onClick={() => setView('list')}
              className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >Ledger</button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[24px] text-[13px] font-black uppercase tracking-[0.1em] hover:bg-accent transition-all shadow-floating active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </header>

      {/* Filter Bar (Minimalist) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Filter by</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setStaffFilter('all')}
              className={`text-[13px] font-black px-4 py-1.5 rounded-full border transition-all ${staffFilter === 'all' ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
            >All Staff</button>
            {staffList.map((s) => (
              <button 
                key={s.id}
                onClick={() => setStaffFilter(s.id)}
                className={`text-[13px] font-black px-4 py-1.5 rounded-full border transition-all ${staffFilter === s.id ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
              >{s.name}</button>
            ))}
          </div>
        </div>
        <div className="text-[12px] font-black text-gray-300 uppercase tracking-widest">
          Showing {dayBookings.length} results
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
    const top = ((startH - 10) * 60 + startM) * (72 / 60);
    const height = Math.max(((endH - startH) * 60 + (endM - startM)) * (72 / 60) - 4, 32);
    return { top: `${top}px`, height: `${height}px` };
  }

  return (
    <div className="bg-white rounded-[48px] shadow-elegant border border-white overflow-hidden p-8">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Staff Headers */}
          <div className="flex mb-12">
            <div className="w-24 shrink-0" />
            {activeStaff.map((s) => (
              <div key={s.id} className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-[24px] mb-4 flex items-center justify-center text-white text-[18px] font-black shadow-lg" style={{ backgroundColor: s.profileColor }}>
                  {s.name[0]}
                </div>
                <span className="text-[14px] font-black text-gray-900 tracking-tight">{s.name}</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.role}</span>
              </div>
            ))}
          </div>

          {/* Timeline Grid */}
          <div className="flex relative min-h-[864px]">
            {/* Hours Column */}
            <div className="w-24 shrink-0 pr-8">
              {Array.from({ length: 12 }, (_, i) => i + 10).map((h) => (
                <div key={h} className="h-[72px] flex items-start justify-end">
                  <span className="text-[14px] font-black text-gray-900 tabular-nums leading-none pt-1">{h}:00</span>
                </div>
              ))}
            </div>

            {/* Columns per Staff */}
            <div className="flex-1 flex gap-8 relative">
              {activeStaff.map((s) => {
                const staffBookings = bookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled' && b.status !== 'no_show');
                return (
                  <div key={s.id} className="flex-1 relative border-l border-gray-50 last:border-r last:border-gray-50">
                    {/* Subtle Hour Marks */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-[72px] border-b border-gray-50/50" />
                    ))}
                    
                    {/* Booking Cards */}
                    {staffBookings.map((b) => {
                      const style = getBookingStyle(b);
                      return (
                        <div
                          key={b.id}
                          className="absolute left-2 right-2 rounded-[28px] p-5 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-floating hover:-translate-y-1 transition-all duration-500 z-10 group bg-gray-900 text-white shadow-xl"
                          style={style}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[15px] font-black leading-tight tracking-tight">{b.customerName}</p>
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            </div>
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest truncate">
                              {b.services[0].name}
                            </p>
                          </div>
                          <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[11px] font-black tabular-nums">{b.startTime} - {b.endTime}</span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-tighter">View</span>
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
    </div>
  );
}

function ListView({ bookings, onStatusChange }: { bookings: Booking[]; onStatusChange: (id: string, s: BookingStatus) => void }) {
  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white rounded-[48px] shadow-elegant border border-white overflow-hidden p-10">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            {['Time', 'Client', 'Service', 'Staff', 'Amount', 'Status'].map((h) => (
              <th key={h} className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{h}</th>
            ))}
            <th className="pb-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/50">
          {sorted.map((b) => (
            <tr key={b.id} className="group hover:bg-gray-50/50 transition-all duration-300">
              <td className="py-8 text-[15px] font-black text-gray-900 tabular-nums">{b.startTime} - {b.endTime}</td>
              <td className="py-8">
                <p className="text-[15px] font-black text-gray-900 leading-tight">{b.customerName}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Guest</p>
              </td>
              <td className="py-8">
                <span className="text-[14px] font-bold text-gray-600 italic">
                  {b.services.map((s) => s.name).join(', ')}
                </span>
              </td>
              <td className="py-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }} />
                  <span className="text-[13px] font-black text-gray-900">{b.staffName}</span>
                </div>
              </td>
              <td className="py-8 text-[15px] font-black text-gray-900 tabular-nums">₩{b.totalPrice.toLocaleString()}</td>
              <td className="py-8">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${b.status === 'completed' ? 'bg-emerald-500' : b.status === 'confirmed' ? 'bg-primary-500' : 'bg-amber-500'}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                    {statusLabels[b.status]}
                  </span>
                </div>
              </td>
              <td className="py-8 text-right">
                <div className="opacity-0 group-hover:opacity-100 transition-all flex justify-end gap-2 translate-x-4 group-hover:translate-x-0">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => onStatusChange(b.id, 'confirmed')}
                      className="px-4 py-2 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                    >Confirm</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => onStatusChange(b.id, 'completed')}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                    >Complete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-[14px] font-black text-gray-300 uppercase tracking-[0.2em]">No records found</p>
        </div>
      )}
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
