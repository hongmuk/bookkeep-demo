import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, MoreVertical, X } from 'lucide-react';
import { useStore } from '../store';
import { staffList, serviceList, customerList, statusLabels, statusColors, channelLabels } from '../data/mock';
import type { Booking, BookingStatus } from '../types';

export default function Bookings() {
  const { bookings, selectedDate, setSelectedDate, addBooking, updateBookingStatus } = useStore();
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const [showModal, setShowModal] = useState(false);
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const dayBookings = bookings
    .filter((b) => b.date === selectedDate)
    .filter((b) => staffFilter === 'all' || b.staffId === staffFilter);

  const dateObj = new Date(selectedDate);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1b23] flex items-center justify-center shadow-2xl">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Schedule Terminal</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Monitoring Node</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Record
        </button>
      </div>

      {/* Controller Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-8 py-2 bg-slate-50 rounded-xl border border-slate-100 min-w-[280px] text-center">
            <span className="text-sm font-black text-slate-900 tabular-nums">
              {dateObj.getFullYear()}. {(dateObj.getMonth() + 1).toString().padStart(2, '0')}. {dateObj.getDate().toString().padStart(2, '0')}
              <span className="text-indigo-600 ml-2 italic">{dayNames[dateObj.getDay()]}</span>
            </span>
          </div>
          <button onClick={() => shiftDate(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-2" />
          <button
            onClick={() => setSelectedDate('2026-04-06')}
            className="text-[10px] font-black px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all uppercase tracking-widest shadow-sm"
          >Today</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setView('timeline')}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${view === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              List Ledger
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-200" />

          <div className="relative group">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-xl text-xs font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 uppercase tracking-widest transition-all cursor-pointer shadow-sm group-hover:border-slate-400"
            >
              <option value="all">Entire Team</option>
              {staffList.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
            </select>
            <Filter className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-900 transition-colors" />
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[750px]">
        {view === 'timeline' ? (
          <TimelineView bookings={dayBookings} />
        ) : (
          <ListView bookings={dayBookings} onStatusChange={updateBookingStatus} />
        )}
      </div>

      {showModal && <BookingModal onClose={() => setShowModal(false)} onSave={addBooking} date={selectedDate} />}
    </div>
  );
}

function TimelineView({ bookings }: { bookings: Booking[] }) {
  const activeStaff = staffList.filter((s) => s.isActive);

  function getBookingStyle(b: Booking) {
    const startH = parseInt(b.startTime.split(':')[0]);
    const startM = parseInt(b.startTime.split(':')[1]);
    const endH = parseInt(b.endTime.split(':')[0]);
    const endM = parseInt(b.endTime.split(':')[1]);
    const top = ((startH - 10) * 60 + startM) * (72 / 60);
    const height = Math.max(((endH - startH) * 60 + (endM - startM)) * (72 / 60) - 2, 32);
    return { top: `${top}px`, height: `${height}px` };
  }

  return (
    <div className="overflow-x-auto custom-scrollbar h-full">
      <div className="min-w-[1100px]">
        {/* Horizontal Sticky Header */}
        <div className="flex border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="w-24 shrink-0 p-5 text-[10px] font-black text-slate-300 uppercase tracking-widest border-r border-slate-50 flex items-center justify-center italic text-center leading-none">TIME<br/>INDEX</div>
          {activeStaff.map((s) => (
            <div key={s.id} className="flex-1 p-5 border-r border-slate-50 last:border-r-0">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[12px] font-black shadow-lg shadow-slate-200 transition-transform hover:scale-110" style={{ backgroundColor: s.profileColor }}>
                  {s.name[0]}
                </div>
                <span className="text-[13px] font-black text-slate-900 tracking-tighter italic">{s.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Timeline Area */}
        <div className="flex relative">
          <div className="w-24 shrink-0 border-r border-slate-100 bg-slate-50/50">
            {Array.from({ length: 12 }, (_, i) => i + 10).map((h) => (
              <div key={h} className="h-[72px] border-b border-slate-100/50 flex items-start justify-center pt-3">
                <span className="text-[11px] font-black text-slate-400 tabular-nums">{h}:00</span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex">
            {activeStaff.map((s) => {
              const staffBookings = bookings.filter((b) => b.staffId === s.id && b.status !== 'cancelled' && b.status !== 'no_show');
              return (
                <div key={s.id} className="flex-1 relative border-r border-slate-50 last:border-r-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-[72px] border-b border-slate-100/30" />
                  ))}
                  
                  {staffBookings.map((b) => {
                    const style = getBookingStyle(b);
                    return (
                      <div
                        key={b.id}
                        className="absolute left-1.5 right-1.5 rounded-2xl border border-slate-900/5 p-4 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 z-10 bg-white group shadow-sm border-l-[6px]"
                        style={{ ...style, borderLeftColor: s.profileColor }}
                      >
                        <div className="flex flex-col h-full pl-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[13px] font-black text-slate-900 truncate tracking-tight">{b.customerName}</span>
                            <span className="text-[9px] font-black text-slate-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity uppercase">{b.startTime}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest italic leading-none mt-1">
                            {b.services[0].name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${statusColors[b.status]}`}>{statusLabels[b.status]}</div>
                          <MoreVertical className="w-3 h-3 text-slate-300" />
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

function ListView({ bookings, onStatusChange: _onStatusChange }: { bookings: Booking[]; onStatusChange: (id: string, s: BookingStatus) => void }) {
  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {['Time Schedule', 'Client Identity', 'Service Detail', 'Assigned Professional', 'Live Status', 'Settlement'].map((h) => (
              <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
            ))}
            <th className="px-8 py-5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-6 text-[13px] font-black text-slate-900 tabular-nums whitespace-nowrap">{b.startTime} — {b.endTime}</td>
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-black text-slate-900 leading-none tracking-tight">{b.customerName}</span>
                  <span className="text-[10px] font-bold text-indigo-500 mt-2 uppercase tracking-widest italic">{channelLabels[b.channel]} Node</span>
                </div>
              </td>
              <td className="px-8 py-6 text-sm text-slate-600 font-bold italic">{b.services.map((s) => s.name).join(', ')}</td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }}>
                    {b.staffName[0]}
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight italic">{b.staffName}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'completed' ? 'bg-emerald-500' : b.status === 'confirmed' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                  {statusLabels[b.status]}
                </div>
              </td>
              <td className="px-8 py-6 text-[13px] font-black text-slate-900 tabular-nums tracking-tighter">₩{b.totalPrice.toLocaleString()}</td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>
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

  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const h = Math.floor(i / 2) + 10;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
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

  const inputClass = "w-full text-sm font-black border border-slate-200 bg-white rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all appearance-none uppercase tracking-widest";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2.5 ml-1";

  return (
    <div className="fixed inset-0 bg-[#1a1b23]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[40px] w-full max-w-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-white animate-in zoom-in-95 duration-500 shadow-indigo-900/10" onClick={(e) => e.stopPropagation()}>
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic underline underline-offset-8 decoration-indigo-500/30">New Entry</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Node Terminal / {date}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 transition-all shadow-sm border border-transparent hover:border-slate-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="sm:col-span-2">
              <label className={labelClass}>Identify Customer</label>
              <select className={inputClass} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
                <option value="">Query Database...</option>
                {customerList.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Execution Staff</label>
              <select className={inputClass} value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
                <option value="">Select Professional</option>
                {staffList.filter(s => s.isActive).map((s) => <option key={s.id} value={s.id}>{s.name} Professional</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Operational Time</label>
              <select className={inputClass} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Treatment Service</label>
            <select className={inputClass} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Query Service Items...</option>
              {serviceList.map((s) => <option key={s.id} value={s.id}>{s.name} — ₩{s.price.toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Secure Memo</label>
            <textarea className={`${inputClass} h-32 resize-none font-medium text-slate-600 normal-case tracking-normal`} placeholder="Record specific requirements..." value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
          </div>
        </div>
        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Discard Entry</button>
          <button
            onClick={handleSave}
            disabled={!form.customerId || !form.staffId || !form.serviceId}
            className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-20 transition-all active:scale-95 uppercase tracking-widest"
          >Confirm Registration</button>
        </div>
      </div>
    </div>
  );
}
