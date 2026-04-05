import { useState } from 'react';
import { Search, Phone, Tag, AlertTriangle, Calendar } from 'lucide-react';
import { customerList, bookingList, statusLabels, statusColors } from '../data/mock';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = customerList.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  const selected = selectedId ? customerList.find((c) => c.id === selectedId) : null;
  const customerBookings = selected
    ? bookingList.filter((b) => b.customerId === selected.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">고객관리</h2>
        <span className="text-[13px] text-gray-400">총 {customerList.length}명</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 전화번호 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-260px)] overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left
                  ${selectedId === c.id ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                  ${c.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-gray-800">{c.name}</span>
                    {c.noShowCount > 0 && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  </div>
                  <p className="text-[11px] text-gray-400">{c.phone} · 방문 {c.visitCount}회</p>
                </div>
                {c.tags.includes('VIP') && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 font-bold">VIP</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold
                  ${selected.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selected.name[0]}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900">{selected.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[12px] text-gray-500"><Phone className="w-3 h-3" /> {selected.phone}</span>
                    <span className="text-[12px] text-gray-400">방문 {selected.visitCount}회</span>
                    {selected.noShowCount > 0 && (
                      <span className="text-[12px] text-red-500 font-medium">노쇼 {selected.noShowCount}회</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selected.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  {selected.tags.map((tag) => (
                    <span key={tag} className={`text-[11px] px-2 py-0.5 rounded-full font-medium
                      ${tag === 'VIP' ? 'bg-amber-100 text-amber-700' :
                        tag === '노쇼주의' ? 'bg-red-100 text-red-600' :
                        tag === '신규' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'}`}
                    >{tag}</span>
                  ))}
                </div>
              )}

              {/* Memo */}
              {selected.memo && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[12px] text-gray-400 font-semibold mb-1">메모</p>
                  <p className="text-[13px] text-gray-700">{selected.memo}</p>
                </div>
              )}

              {/* History */}
              <div>
                <h4 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" /> 방문 이력
                </h4>
                {customerBookings.length === 0 ? (
                  <p className="text-[13px] text-gray-400 py-4 text-center">방문 이력이 없습니다</p>
                ) : (
                  <div className="space-y-2">
                    {customerBookings.slice(0, 10).map((b) => (
                      <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                        <div className="text-center min-w-[50px]">
                          <p className="text-[11px] text-gray-400">{b.date.slice(5)}</p>
                          <p className="text-[12px] font-semibold text-gray-700">{b.startTime}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] text-gray-700">{b.services.map((s) => s.name).join(', ')}</p>
                          <p className="text-[11px] text-gray-400">{b.staffName}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">₩{b.totalPrice.toLocaleString()}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                          {statusLabels[b.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-sm text-gray-400">좌측에서 고객을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
