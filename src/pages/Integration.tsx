import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw, Settings2 } from 'lucide-react';

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
    id: 'naver',
    name: '네이버 예약',
    icon: 'N',
    color: '#03C75A',
    status: 'connected',
    lastSync: '2026-04-06 14:30',
    syncCount: 1247,
    description: '네이버 스마트플레이스 예약 데이터를 자동으로 동기화합니다.',
  },
  {
    id: 'kakao',
    name: '카카오 예약',
    icon: 'K',
    color: '#FEE500',
    status: 'disconnected',
    description: '카카오톡 채널 예약 데이터를 연동합니다.',
  },
  {
    id: 'alimtalk',
    name: '카카오 알림톡',
    icon: '💬',
    color: '#3B1E1E',
    status: 'connected',
    lastSync: '2026-04-06 14:25',
    syncCount: 356,
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">외부 연동</h2>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${activeTab === 'overview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >연동 현황</button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`text-[12px] px-3 py-1.5 rounded-md font-medium ${activeTab === 'logs' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >동기화 로그</button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-3">
          {integrations.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{
                    backgroundColor: item.id === 'kakao' ? item.color : `${item.color}15`,
                    color: item.id === 'kakao' ? '#3B1E1E' : item.color,
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-gray-800">{item.name}</h3>
                    {item.status === 'connected' && (
                      <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 연동됨
                      </span>
                    )}
                    {item.status === 'disconnected' && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> 미연동
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> 오류
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 mb-3">{item.description}</p>

                  {item.status === 'connected' && (
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 마지막 동기화: {item.lastSync}</span>
                      <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 총 {item.syncCount?.toLocaleString()}건 동기화</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {item.status === 'connected' ? (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <RefreshCw className="w-3 h-3" /> 동기화
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Settings2 className="w-3 h-3" /> 설정
                      </button>
                    </div>
                  ) : (
                    <button className="px-4 py-1.5 text-[12px] bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                      연동하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Sync Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-800 mb-4">동기화 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-gray-700 font-medium">자동 동기화 간격</p>
                  <p className="text-[11px] text-gray-400">네이버/카카오 예약 데이터를 가져오는 주기</p>
                </div>
                <select className="text-[12px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
                  <option>5분</option>
                  <option selected>15분</option>
                  <option>30분</option>
                  <option>1시간</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-gray-700 font-medium">충돌 시 알림</p>
                  <p className="text-[11px] text-gray-400">예약 시간 겹침 발생 시 원장에게 알림</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-gray-700 font-medium">동기화 실패 알림</p>
                  <p className="text-[11px] text-gray-400">3회 이상 연속 실패 시 알림</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-600">오늘의 동기화 로그</p>
          </div>
          <div className="divide-y divide-gray-50">
            {syncLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.success ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-[11px] text-gray-400 w-16 shrink-0">{log.time}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0">{log.platform}</span>
                <span className="text-[12px] text-gray-700 font-medium">{log.type}</span>
                <span className="text-[12px] text-gray-400 truncate">{log.detail}</span>
              </div>
            ))}
          </div>
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
      className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
      style={{ minWidth: 40, height: 22 }}
    >
      <div
        className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[20px]' : 'translate-x-0.5'}`}
      />
    </button>
  );
}
