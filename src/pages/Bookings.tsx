import { useState } from 'react';
import { useStore } from '../store';
import { staffList, customerList, serviceList, channelLabels } from '../data/mock';

export default function Bookings() {
  const { bookings, selectedDate } = useStore();
  const [showModal, setShowModal] = useState(false);

  const dayBookings = bookings
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-24 animate-in fade-in duration-500">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16 text-brand-black">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Schedule</h2>
          <div className="flex items-center gap-8">
            <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Timeline Archive / {selectedDate}</p>
            <div className="h-px w-12 bg-brand-black/20" />
            <button 
              onClick={() => setShowModal(true)}
              className="text-[11px] font-black uppercase tracking-widest text-brand-accent border-b border-brand-accent pb-1"
            >+ Initialize Entry</button>
          </div>
        </div>
        <div className="flex items-center gap-4 border border-brand-black px-6 py-3 rounded-full">
          <button className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Prev</button>
          <span className="text-sm font-black tabular-nums mx-4">2026.04.06</span>
          <button className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Next</button>
        </div>
      </section>

      {/* Grid Sequence Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left: Time Sequence */}
        <div className="lg:col-span-8 space-y-1">
          {dayBookings.length > 0 ? dayBookings.map((b, idx) => (
            <div key={b.id} className="group flex items-start gap-12 py-12 border-b border-brand-black/5 hover:bg-brand-black/[0.02] transition-all px-4 -mx-4 relative text-brand-black">
              <span className="text-[10px] font-black opacity-10 absolute left-0 top-12 tabular-nums">0{idx + 1}</span>
              <div className="w-32 shrink-0 space-y-1">
                <p className="text-[20px] font-black tabular-nums tracking-tighter">{b.startTime}</p>
                <p className="text-[10px] font-bold text-brand-black/30 uppercase tracking-widest">{b.endTime} End</p>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-brand-accent transition-colors">{b.customerName}</h3>
                  <span className="text-[9px] font-black px-2 py-0.5 border border-brand-black/10 uppercase tracking-widest">{channelLabels[b.channel]}</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Treatment</span>
                    <span className="text-[13px] font-bold italic text-brand-black/60">{b.services[0].name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Assigned Specialist</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: staffList.find(s => s.id === b.staffId)?.profileColor }} />
                      <span className="text-[13px] font-bold text-brand-black/80">{b.staffName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right self-center">
                <p className="text-[18px] font-black tabular-nums tracking-tighter leading-none mb-1">₩{b.totalPrice.toLocaleString()}</p>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">{b.status}</span>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center space-y-4 border border-dashed border-brand-black/10">
              <p className="serif-display text-4xl opacity-10 italic">No Active Protocols</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Database is currently idle</p>
            </div>
          )}
        </div>

        {/* Right: Operational Summary */}
        <div className="lg:col-span-4 space-y-16 text-brand-black">
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Specialist On Duty</h4>
            <div className="grid gap-6">
              {staffList.filter(s => s.isActive).map(s => (
                <div key={s.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-brand-black/10 p-1 rounded-full group-hover:border-brand-black transition-colors">
                      <div className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: s.profileColor }}>{s.name[0]}</div>
                    </div>
                    <div>
                      <p className="text-[13px] font-black uppercase tracking-tighter">{s.name}</p>
                      <p className="text-[10px] font-bold text-brand-black/30 uppercase tracking-widest leading-none">{s.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-black tabular-nums tracking-tighter">{dayBookings.filter(b => b.staffId === s.id).length}</span>
                    <span className="text-[9px] font-black uppercase opacity-20 ml-1">Sessions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 border-2 border-brand-black space-y-8">
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Diagnostic</span>
              <h4 className="text-xl font-black uppercase tracking-tighter leading-tight">Daily Load<br/>Capacity</h4>
            </div>
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-brand-black/5 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-brand-black w-[72%] transition-all duration-1000" />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                <span>Utilization</span>
                <span>72.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && <BookingModal onClose={() => setShowModal(false)} date={selectedDate} />}
    </div>
  );
}

function BookingModal({ onClose, date }: { onClose: () => void; date: string }) {
  const inputClass = "w-full bg-transparent border-b-2 border-brand-black/10 py-4 text-xl font-black uppercase tracking-tighter focus:border-brand-black focus:outline-none transition-all placeholder:text-brand-black/10 text-brand-black";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic text-brand-black";

  return (
    <div className="fixed inset-0 bg-brand-beige/90 backdrop-blur-xl z-50 flex items-center justify-center p-8 animate-in fade-in duration-700">
      <div className="w-full max-w-4xl space-y-20 reveal">
        <div className="flex justify-between items-start border-b border-brand-black/10 pb-12 text-brand-black">
          <div className="space-y-4">
            <h3 className="serif-display text-[64px] leading-none tracking-tighter italic">New Protocol</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Initializing entry for session: {date}</p>
          </div>
          <button onClick={onClose} className="text-[11px] font-black uppercase tracking-[0.4em] hover:text-brand-accent transition-colors">Discard_Entry [ESC]</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
          <div className="space-y-4">
            <label className={labelClass}>Client Entity</label>
            <select className={inputClass}>
              <option value="">Query Database...</option>
              {customerList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className={labelClass}>Execution Staff</label>
            <select className={inputClass}>
              <option value="">Professional Selection</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className={labelClass}>Treatment Node</label>
            <select className={inputClass}>
              <option value="">Query Service Index</option>
              {serviceList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className={labelClass}>Operational Window</label>
            <input type="time" className={inputClass} defaultValue="10:00" />
          </div>
        </div>

        <div className="flex justify-end pt-12">
          <button className="bg-brand-black text-white px-16 py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-brand-accent transition-all shadow-2xl active:scale-95">
            Register Entry Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
