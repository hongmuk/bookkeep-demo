import { useState } from 'react';
import { Search, UserCheck, Clock } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">고객 아카이브</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5" /> CRM Intelligence / {customerList.length} Members
          </p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="고객명 또는 연락처 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Customer List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="px-2 mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Directory</h3>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
                  ${selectedId === c.id 
                    ? 'bg-white border-slate-900 shadow-xl translate-x-1' 
                    : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner
                  ${c.gender === 'F' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                  {c.name[0]}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-black text-slate-900 tracking-tight">{c.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 tabular-nums uppercase mt-0.5">{c.phone}</p>
                </div>
                {c.tags.includes('VIP') && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Detail Surface */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Profile Header */}
              <div className="p-8 lg:p-12 border-b border-slate-50 space-y-10">
                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                  <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-[32px] font-black border-4 border-white shadow-xl
                    ${selected.gender === 'F' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                    {selected.name[0]}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{selected.name}</h3>
                      <div className="flex gap-1.5">
                        {selected.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</span>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">{selected.phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loyalty</span>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">{selected.visitCount} Visits</span>
                      </div>
                      {selected.noShowCount > 0 && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Alert</span>
                          <span className="text-sm font-bold text-red-500 tabular-nums">{selected.noShowCount} No-Shows</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selected.memo && (
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                    <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black text-slate-400 border border-slate-100 rounded-full uppercase tracking-widest">Master Memo</div>
                    "{selected.memo}"
                  </div>
                )}
              </div>

              {/* History Table */}
              <div className="p-8 lg:p-12 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> Visit Log Archive
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">Showing Latest 10</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-compact">
                    <thead>
                      <tr className="bg-slate-50/50">
                        {['Date', 'Service Detail', 'Professional', 'Amount', 'Status'].map((h) => (
                          <th key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {customerBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="font-bold text-slate-900 tabular-nums">{b.date.slice(5)}</td>
                          <td className="text-slate-600 font-medium">{b.services.map((s) => s.name).join(', ')}</td>
                          <td className="font-bold text-slate-700">{b.staffName}</td>
                          <td className="font-bold text-slate-900 tabular-nums">₩{b.totalPrice.toLocaleString()}</td>
                          <td>
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {statusLabels[b.status]}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Select a client profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
