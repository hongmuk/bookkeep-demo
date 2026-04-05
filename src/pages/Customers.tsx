import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { customerList, bookingList, statusLabels } from '../data/mock';

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
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Clients
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            Archive / {customerList.length} Members
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR PHONE"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white rounded-full border border-gray-100 text-[12px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-primary-100 shadow-elegant transition-all"
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Customer List (Minimal Side) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-4 mb-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Master List</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full group flex items-center gap-4 p-5 rounded-[32px] transition-all duration-500
                  ${selectedId === c.id 
                    ? 'bg-gray-900 text-white shadow-floating translate-x-2' 
                    : 'bg-white border border-white hover:bg-gray-50/50 hover:shadow-elegant'}`}
              >
                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-[14px] font-black shadow-inner
                  ${selectedId === c.id ? 'bg-white/10' : 'bg-gray-50 text-gray-400'}`}>
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-[15px] font-black tracking-tight ${selectedId === c.id ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                  <p className={`text-[11px] font-bold ${selectedId === c.id ? 'text-white/40' : 'text-gray-400'}`}>{c.phone}</p>
                </div>
                {c.tags.includes('VIP') && (
                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Detail (Editorial Surface) */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="bg-white rounded-[64px] shadow-floating border border-white p-12 lg:p-16 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-32 h-32 rounded-[48px] bg-gray-50 border-4 border-white shadow-elegant flex items-center justify-center text-[40px] font-black text-gray-200">
                  {selected.name[0]}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[48px] font-black text-gray-900 tracking-tighter leading-none">{selected.name}</h3>
                    <div className="flex gap-2">
                      {selected.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Contact</span>
                      <span className="text-[16px] font-black text-gray-900 tabular-nums">{selected.phone}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Visits</span>
                      <span className="text-[16px] font-black text-gray-900 tabular-nums">{selected.visitCount} times</span>
                    </div>
                    {selected.noShowCount > 0 && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">Alert</span>
                        <span className="text-[16px] font-black text-red-500 tabular-nums">{selected.noShowCount} No-Shows</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Memo Section */}
              {selected.memo && (
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent/20 rounded-full" />
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Professional Memo</p>
                  <p className="text-[20px] font-bold text-gray-700 leading-relaxed italic">"{selected.memo}"</p>
                </div>
              )}

              {/* History Table */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <h4 className="text-[18px] font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent" /> VISIT HISTORY
                  </h4>
                  <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Recent 10 Records</span>
                </div>
                
                <div className="space-y-4">
                  {customerBookings.length === 0 ? (
                    <p className="text-[14px] font-bold text-gray-300 py-12 text-center uppercase tracking-widest">No visit history recorded yet</p>
                  ) : (
                    customerBookings.slice(0, 10).map((b) => (
                      <div key={b.id} className="flex items-center gap-8 p-6 rounded-[32px] bg-gray-50/50 hover:bg-white hover:shadow-elegant border border-transparent hover:border-white transition-all duration-500 group">
                        <div className="w-20">
                          <p className="text-[12px] font-black text-gray-400 uppercase tracking-tighter mb-1">{b.date.slice(5)}</p>
                          <p className="text-[15px] font-black text-gray-900 tabular-nums">{b.startTime}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] font-black text-gray-800 leading-tight group-hover:text-accent transition-colors">{b.services.map((s) => s.name).join(', ')}</p>
                          <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{b.staffName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[16px] font-black text-gray-900 tabular-nums mb-1">₩{b.totalPrice.toLocaleString()}</p>
                          <div className="flex items-center justify-end gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{statusLabels[b.status]}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-20 bg-gray-50/50 rounded-[64px] border border-dashed border-gray-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-elegant mx-auto">
                  <Search className="w-6 h-6 text-gray-200" />
                </div>
                <p className="text-[14px] font-black text-gray-300 uppercase tracking-[0.2em]">Select a client from the archive</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
