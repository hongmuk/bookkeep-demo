import { useState } from 'react';
import { customerList, bookingList } from '../data/mock';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(customerList[0].id);

  const filtered = customerList.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  const selected = selectedId ? customerList.find((c) => c.id === selectedId) : null;
  const customerBookings = selected
    ? bookingList.filter((b) => b.customerId === selected.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <div className="space-y-24 text-brand-black">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Archive</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Client Relationship Database / {customerList.length} Entries</p>
        </div>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search_Database..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-b-2 border-brand-black/10 py-2 text-xl font-black uppercase tracking-tighter focus:border-brand-black outline-none transition-all placeholder:text-brand-black/10 w-80"
          />
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-20">
        {/* Left: Sequential List */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Collection</span>
            <h3 className="text-xl font-black uppercase tracking-widest border-b border-brand-black pb-4">Client Sequence</h3>
          </div>
          <div className="flex flex-col max-h-[calc(100vh-400px)] overflow-y-auto no-scrollbar">
            {filtered.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`group flex items-center justify-between py-6 border-b border-brand-black/5 transition-all
                  ${selectedId === c.id ? 'pl-4' : 'hover:pl-2'}`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black opacity-10 tabular-nums">0{idx + 1}</span>
                  <div className="text-left">
                    <p className={`text-base font-black uppercase tracking-tighter ${selectedId === c.id ? 'text-brand-accent' : 'opacity-40 group-hover:opacity-100'}`}>{c.name}</p>
                    <p className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest tabular-nums mt-1">{c.phone}</p>
                  </div>
                </div>
                {c.tags.includes('VIP') && <div className="w-1 h-1 bg-brand-accent rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Record View */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="reveal space-y-24">
              <div className="space-y-12">
                <div className="flex flex-wrap items-baseline gap-8">
                  <h3 className="serif-display text-[80px] leading-none tracking-tighter italic">{selected.name}</h3>
                  <div className="flex gap-2">
                    {selected.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 border border-brand-black/10 text-[9px] font-black uppercase tracking-widest opacity-40 italic">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-12 border-y border-brand-black/5 py-12">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Frequency</span>
                    <p className="text-2xl font-black tabular-nums tracking-tighter">{selected.visitCount} Sessions</p>
                  </div>
                  <div className="space-y-1 border-l border-brand-black/5 pl-12">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Anomaly Index</span>
                    <p className={`text-2xl font-black tabular-nums tracking-tighter ${selected.noShowCount > 0 ? 'text-brand-accent' : ''}`}>{selected.noShowCount} No-Shows</p>
                  </div>
                  <div className="space-y-1 border-l border-brand-black/5 pl-12">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Engagement</span>
                    <p className="text-2xl font-black tabular-nums tracking-tighter">High</p>
                  </div>
                </div>
              </div>

              {selected.memo && (
                <div className="relative p-12 bg-brand-black text-white italic font-light leading-relaxed text-xl">
                  <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Master_Memo</span>
                  "{selected.memo}"
                </div>
              )}

              <div className="space-y-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Historical Sequence</h4>
                <div className="space-y-1">
                  {customerBookings.map((b) => (
                    <div key={b.id} className="group flex items-center gap-12 py-8 border-b border-brand-black/5 hover:bg-brand-black/[0.02] transition-all px-4 -mx-4">
                      <div className="w-24 shrink-0">
                        <p className="text-[14px] font-black tabular-nums tracking-tighter">{b.date.slice(5)}</p>
                        <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{b.startTime}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-black uppercase tracking-tighter">{b.services[0].name}</p>
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Lead: {b.staffName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-black tabular-nums tracking-tighter">₩{b.totalPrice.toLocaleString()}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-brand-black/10 py-48">
              <p className="serif-display text-4xl opacity-10 italic">Select Client Node</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
