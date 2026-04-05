import { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Settings2 } from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  syncCount?: number;
  description: string;
}

const integrations: IntegrationItem[] = [
  {
    id: 'naver', name: '네이버 예약', icon: 'N', color: '#03C75A',
    status: 'connected', lastSync: '2026-04-06 14:30', syncCount: 1247,
    description: '네이버 스마트플레이스 예약 데이터를 자동으로 동기화합니다.',
  },
  {
    id: 'kakao', name: '카카오 예약', icon: 'K', color: '#FEE500',
    status: 'disconnected',
    description: '카카오톡 채널 예약 데이터를 연동합니다.',
  },
  {
    id: 'alimtalk', name: '카카오 알림톡', icon: '\uD83D\uDCAC', color: '#3B1E1E',
    status: 'connected', lastSync: '2026-04-06 14:25', syncCount: 356,
    description: '예약 확인/변경/리마인더 알림톡을 자동 발송합니다.',
  },
];

const syncLogs = [
  { time: '14:30:12', platform: '네이버', type: '동기화 완료', detail: '신규 예약 2건 가져옴', success: true },
  { time: '14:25:00', platform: '알림톡', type: '발송 완료', detail: '예약 리마인더 3건 발송', success: true },
  { time: '14:15:08', platform: '네이버', type: '동기화 완료', detail: '변경 사항 없음', success: true },
  { time: '14:00:05', platform: '네이버', type: '동기화 완료', detail: '예약 취소 1건 반영', success: true },
  { time: '13:45:12', platform: '알림톡', type: '발송 완료', detail: '예약 확인 1건 발송', success: true },
  { time: '13:30:03', platform: '네이버', type: '동기화 오류', detail: '세션 만료 - 자동 재인증 시도', success: false },
  { time: '13:30:15', platform: '네이버', type: '재인증 완료', detail: '세션 갱신 성공', success: true },
];

export default function Integration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Integrations
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            Connect / Sync External Services
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1.5 rounded-[20px] border border-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >Overview</button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >Sync Logs</button>
        </div>
      </header>

      {activeTab === 'overview' ? (
        <div className="space-y-12">
          {/* Integration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((item) => (
              <div key={item.id} className="group bg-white rounded-[48px] p-10 shadow-elegant border border-white hover:shadow-floating transition-all duration-700 flex flex-col justify-between h-[420px]">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div
                      className="w-20 h-20 rounded-[32px] flex items-center justify-center text-[24px] font-black shadow-lg transition-transform group-hover:scale-110 duration-500"
                      style={{
                        backgroundColor: item.id === 'kakao' ? item.color : `${item.color}15`,
                        color: item.id === 'kakao' ? '#3B1E1E' : item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    {item.status === 'connected' ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Online
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle className="w-3.5 h-3.5" /> Offline
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[24px] font-black text-gray-900 tracking-tight">{item.name}</h3>
                    <p className="text-[14px] font-bold text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {item.status === 'connected' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <span>Last Sync</span>
                        <span className="text-gray-900 tabular-nums">{item.lastSync?.slice(11)}</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-gray-900 h-full w-[80%] animate-pulse" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    {item.status === 'connected' ? (
                      <>
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-full text-[12px] font-black uppercase tracking-widest shadow-lg hover:bg-accent transition-all">
                          <RefreshCw className="w-4 h-4" /> Sync
                        </button>
                        <button className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                          <Settings2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                        Connect Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Configuration Area */}
          <div className="bg-white rounded-[48px] p-12 shadow-elegant border border-white">
            <h3 className="text-[24px] font-black text-gray-900 tracking-tight mb-12">Synchronization Policy</h3>
            <div className="grid md:grid-cols-3 gap-12 divide-x divide-gray-50">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Auto-Sync Cycle</p>
                <div className="relative">
                  <select className="appearance-none w-full bg-gray-50 border-none px-6 py-4 rounded-[20px] text-[14px] font-black text-gray-900 focus:ring-4 focus:ring-primary-100 transition-all uppercase tracking-widest">
                    <option>5 Minutes</option>
                    <option selected>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                  <RefreshCw className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
              <div className="space-y-6 px-12">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-black text-gray-900 tracking-tight">Conflict Alert</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Booking overlaps</p>
                  </div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
              <div className="space-y-6 px-12 border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-black text-gray-900 tracking-tight">Failure Notification</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">3+ sync errors</p>
                  </div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[48px] shadow-elegant border border-white overflow-hidden p-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['Time', 'Platform', 'Type', 'Detail'].map((h) => (
                  <th key={h} className="pb-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{h}</th>
                ))}
                <th className="pb-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {syncLogs.map((log, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="py-8 text-[14px] font-black text-gray-900 tabular-nums">{log.time}</td>
                  <td className="py-8">
                    <span className="text-[11px] px-3 py-1 rounded-full font-black bg-gray-100 text-gray-500 uppercase tracking-tighter">{log.platform}</span>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                      <span className="text-[14px] font-black text-gray-800 tracking-tight">{log.type}</span>
                    </div>
                  </td>
                  <td className="py-8 text-[14px] font-bold text-gray-400 italic">"{log.detail}"</td>
                  <td className="py-8 text-right">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${log.success ? 'text-emerald-200' : 'text-red-200'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-500 ${checked ? 'bg-gray-900 shadow-lg' : 'bg-gray-200'}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-500 ${checked ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );
}
