import { useState } from 'react';
import { CheckCircle2, Settings2, Link2, Server } from 'lucide-react';

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
    name: 'Naver Booking',
    icon: 'N',
    color: '#03C75A',
    status: 'connected',
    lastSync: '2026-04-06 14:30',
    syncCount: 1247,
    description: 'Sync smart place booking data automatically.',
  },
  {
    id: 'kakao',
    name: 'Kakao Booking',
    icon: 'K',
    color: '#FEE500',
    status: 'disconnected',
    description: 'Connect KakaoTalk channel booking system.',
  },
  {
    id: 'alimtalk',
    name: 'Kakao AlimTalk',
    icon: '💬',
    color: '#3B1E1E',
    status: 'connected',
    lastSync: '2026-04-06 14:25',
    syncCount: 356,
    description: 'Send automated reminder and confirmation messages.',
  },
];

const syncLogs = [
  { time: '14:30:12', platform: 'Naver', type: 'Sync Complete', detail: 'Fetched 2 new bookings', success: true },
  { time: '14:25:00', platform: 'Talk', type: 'Sent Complete', detail: 'Sent 3 reminders', success: true },
  { time: '14:15:08', platform: 'Naver', type: 'Sync Complete', detail: 'No changes detected', success: true },
  { time: '14:00:05', platform: 'Naver', type: 'Sync Complete', detail: 'Reflected 1 cancellation', success: true },
  { time: '13:45:12', platform: 'Talk', type: 'Sent Complete', detail: 'Sent confirmation message', success: true },
  { time: '13:30:03', platform: 'Naver', type: 'Auth Error', detail: 'Session expired - Auto re-auth', success: false },
  { time: '13:30:15', platform: 'Naver', type: 'Auth Success', detail: 'Token refreshed successfully', success: true },
];

export default function Integration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">외부 연동 센터</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Link2 className="w-3.5 h-3.5" /> API Connector & Sync System
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >Overview</button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-5 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'logs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >Sync Logs</button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid lg:grid-cols-1 gap-6">
          {/* Integration Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between h-[320px] hover:border-slate-900 transition-all group">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg"
                      style={{
                        backgroundColor: item.id === 'kakao' ? item.color : `${item.color}10`,
                        color: item.id === 'kakao' ? '#3B1E1E' : item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    {item.status === 'connected' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                        Disconnected
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.name}</h3>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-wider">{item.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.status === 'connected' && (
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4 tabular-nums">
                      <span>Last Sync: {item.lastSync?.slice(11)}</span>
                      <span>{item.syncCount?.toLocaleString()} Total</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {item.status === 'connected' ? (
                      <>
                        <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-black transition-all">Sync Now</button>
                        <button className="w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                          <Settings2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button className="w-full py-2.5 bg-slate-50 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">Connect Platform</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sync Strategy */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Server className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Global Sync Policy</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronization Cycle</p>
                <select className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-slate-100 focus:outline-none transition-all uppercase tracking-widest">
                  <option>Every 5 Minutes</option>
                  <option selected>Every 15 Minutes</option>
                  <option>Every 1 Hour</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-black text-slate-900">Push Notifications</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Real-time status alerts</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-black text-slate-900">Auto Re-Auth</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Automatic session refresh</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity Streams</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Timestamp', 'Platform', 'Action Type', 'Detail Description'].map((h) => (
                    <th key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {syncLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="font-bold text-slate-900 tabular-nums">{log.time}</td>
                    <td>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tighter">{log.platform}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.success ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                        <span className="text-sm font-bold text-slate-700">{log.type}</span>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-slate-400 italic">"{log.detail}"</td>
                    <td className="text-right">
                      <div className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${log.success ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-slate-900 shadow-lg shadow-slate-200' : 'bg-slate-200'}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}
