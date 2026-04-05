import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw, Settings2 } from 'lucide-react';

const integrations = [
  { id: 'naver', name: '네이버 예약', icon: 'N', color: '#03C75A', status: 'connected' as const, lastSync: '2026-04-06 14:30', syncCount: 1247, description: '네이버 스마트플레이스 예약 데이터를 자동으로 동기화합니다.' },
  { id: 'kakao', name: '카카오 예약', icon: 'K', color: '#FEE500', status: 'disconnected' as const, description: '카카오톡 채널 예약 데이터를 연동합니다.' },
  { id: 'alimtalk', name: '카카오 알림톡', icon: '💬', color: '#3B1E1E', status: 'connected' as const, lastSync: '2026-04-06 14:25', syncCount: 356, description: '예약 확인/변경/리마인더 알림톡을 자동 발송합니다.' },
];

const logs = [
  { time: '14:30:12', platform: '네이버', type: '동기화 완료', detail: '신규 예약 2건', ok: true },
  { time: '14:25:00', platform: '알림톡', type: '발송 완료', detail: '리마인더 3건', ok: true },
  { time: '14:15:08', platform: '네이버', type: '동기화 완료', detail: '변경 없음', ok: true },
  { time: '14:00:05', platform: '네이버', type: '동기화 완료', detail: '취소 1건 반영', ok: true },
  { time: '13:30:03', platform: '네이버', type: '동기화 오류', detail: '세션 만료', ok: false },
  { time: '13:30:15', platform: '네이버', type: '재인증 완료', detail: '세션 갱신', ok: true },
];

export default function Integration() {
  const [tab, setTab] = useState<'overview' | 'logs'>('overview');
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">외부 연동</h2>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setTab('overview')} className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${tab === 'overview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>연동 현황</button>
          <button onClick={() => setTab('logs')} className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${tab === 'logs' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>동기화 로그</button>
        </div>
      </div>

      {tab === 'overview' ? (
        <div className="space-y-3">
          {integrations.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" style={{ backgroundColor: item.id === 'kakao' ? item.color : `${item.color}20`, color: item.id === 'kakao' ? '#3B1E1E' : item.color }}>{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-gray-800">{item.name}</h3>
                    {item.status === 'connected' ? <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> 연동됨</span> : <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium"><AlertCircle className="w-3.5 h-3.5" /> 미연동</span>}
                  </div>
                  <p className="text-[12px] text-gray-500 mb-3">{item.description}</p>
                  {item.status === 'connected' && <div className="flex items-center gap-4 text-[11px] text-gray-400"><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.lastSync}</span><span><RefreshCw className="w-3 h-3 inline" /> {item.syncCount?.toLocaleString()}건</span></div>}
                </div>
                <div className="shrink-0">
                  {item.status === 'connected' ? (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><RefreshCw className="w-3 h-3" /> 동기화</button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><Settings2 className="w-3 h-3" /> 설정</button>
                    </div>
                  ) : <button className="px-4 py-1.5 text-[12px] bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">연동하기</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-3 border-b border-gray-100"><p className="text-[13px] font-semibold text-gray-600">동기화 로그</p></div>
          <div className="divide-y divide-gray-50">
            {logs.map((l, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${l.ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-[11px] text-gray-400 w-16 shrink-0">{l.time}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0">{l.platform}</span>
                <span className="text-[12px] text-gray-700 font-medium">{l.type}</span>
                <span className="text-[12px] text-gray-400 truncate">{l.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
