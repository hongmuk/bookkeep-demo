import { useState } from 'react';

const integrations = [
  { id: 'naver', name: 'Naver Booking', status: 'Active', sync: '14:30', count: 1247, desc: 'Automated synchronization with Naver SmartPlace.' },
  { id: 'kakao', name: 'Kakao Booking', status: 'Idle', sync: '-', count: 0, desc: 'Official KakaoTalk channel booking node.' },
  { id: 'alimtalk', name: 'Kakao AlimTalk', status: 'Active', sync: '14:25', count: 356, desc: 'Automated notification & reminder protocol.' },
];

const syncLogs = [
  { time: '14:30:12', platform: 'NAVER', type: 'SYNC_COMPLETE', detail: 'Fetched 2 new entries', success: true },
  { time: '14:25:00', platform: 'TALK', type: 'SENT_COMPLETE', detail: 'Reminders dispatched', success: true },
  { time: '13:30:03', platform: 'NAVER', type: 'AUTH_ERROR', detail: 'Session expired', success: false },
];

export default function Integration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  return (
    <div className="space-y-24 text-brand-black">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Connect</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">External Service Node & API Sync</p>
        </div>
        <div className="flex bg-brand-black/[0.03] p-1 rounded-full border border-brand-black/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-brand-black text-white shadow-xl' : 'opacity-30 hover:opacity-100'}`}
          >Overview</button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-brand-black text-white shadow-xl' : 'opacity-30 hover:opacity-100'}`}
          >Sync Logs</button>
        </div>
      </section>

      {activeTab === 'overview' ? (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-8 space-y-1">
            {integrations.map((item, idx) => (
              <div key={item.id} className="group flex items-start gap-12 py-12 border-b border-brand-black/5 hover:bg-brand-black/[0.02] transition-all px-4 -mx-4">
                <span className="text-[10px] font-black opacity-10 tabular-nums">0{idx + 1}</span>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-6">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{item.name}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 border border-brand-black/10 uppercase tracking-widest ${item.status === 'Active' ? 'text-brand-accent' : 'opacity-20'}`}>{item.status}</span>
                  </div>
                  <p className="text-sm font-bold text-brand-black/40 leading-relaxed max-w-md uppercase tracking-tight">{item.desc}</p>
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Last Sync</span>
                      <span className="text-[13px] font-black tabular-nums tracking-tighter">{item.sync}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Lifetime Vol.</span>
                      <span className="text-[13px] font-black tabular-nums tracking-tighter">{item.count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="self-center">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] border border-brand-black px-6 py-3 hover:bg-brand-black hover:text-white transition-all">
                    {item.status === 'Active' ? 'Re-Sync' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 border-l border-brand-black/10 pl-16 space-y-16">
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">Global Policy</h4>
              <div className="space-y-12 italic font-bold text-brand-black/60">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Auto-Update Cycle</span>
                  <p className="text-xl font-black uppercase tracking-tighter">Every 15 Minutes</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Conflict Resolution</span>
                  <p className="text-xl font-black uppercase tracking-tighter">Manual Override</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="reveal">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-brand-black pb-4">
                  {['Timestamp', 'Source', 'Protocol', 'Payload Detail'].map((h) => (
                    <th key={h} className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/5">
                {syncLogs.map((log, idx) => (
                  <tr key={idx} className="group hover:bg-brand-black/5 transition-colors">
                    <td className="py-8 text-[13px] font-black tabular-nums tracking-tighter">{log.time}</td>
                    <td className="py-8 text-[11px] font-black uppercase tracking-widest opacity-40">{log.platform}</td>
                    <td className="py-8 text-[13px] font-black uppercase tracking-tighter">{log.type}</td>
                    <td className="py-8 text-[12px] font-bold italic opacity-40 group-hover:opacity-100">"{log.detail}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
