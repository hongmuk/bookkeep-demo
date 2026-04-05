import { useState } from 'react';
import { Store, Scissors, Bell, Globe, Settings2, Save } from 'lucide-react';
import { shop, serviceList } from '../data/mock';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'services' | 'notifications'>('shop');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">시스템 설정</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Workspace Configuration
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          {[
            { key: 'shop', icon: Store, label: 'Profile' },
            { key: 'services', icon: Scissors, label: 'Services' },
            { key: 'notifications', icon: Bell, label: 'Alerts' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-lg transition-all
                ${activeTab === key ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl">
        {activeTab === 'shop' && <ShopSettings />}
        {activeTab === 'services' && <ServiceSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}

function ShopSettings() {
  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Studio Profile</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Primary workspace details</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>
      
      <div className="p-8 lg:p-10 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Studio Name</label>
            <input className={inputClass} defaultValue={shop.name} />
          </div>
          <div>
            <label className={labelClass}>Official Phone</label>
            <input className={inputClass} defaultValue={shop.phone} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Studio Location</label>
          <input className={inputClass} defaultValue={shop.address} />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Opening Hour</label>
            <input type="time" className={inputClass} defaultValue={shop.businessHours.open} />
          </div>
          <div>
            <label className={labelClass}>Closing Hour</label>
            <input type="time" className={inputClass} defaultValue={shop.businessHours.close} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Weekly Off-Days</label>
          <div className="flex gap-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
              <button
                key={d}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all duration-300
                  ${i === 6 ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}
              >{d}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceSettings() {
  const categories = [...new Set(serviceList.map((s) => s.category))];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Service Items</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage treatments & pricing</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
          + Add New Service
        </button>
      </div>

      <div className="p-8 lg:p-10 space-y-12">
        {categories.map((cat) => (
          <div key={cat} className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 italic">{cat} Collection</h4>
            <div className="grid gap-3">
              {serviceList.filter((s) => s.category === cat).map((s) => (
                <div key={s.id} className="group flex items-center gap-6 p-5 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300">
                  <div className="flex-1">
                    <span className="text-sm font-black text-slate-900">{s.name}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.durationMinutes} Minutes Session</p>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <span className="text-sm font-black text-slate-900 tabular-nums">₩{s.price.toLocaleString()}</span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-900 transition-colors">
                      <Settings2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationSettings() {
  const items = [
    { label: 'New Booking', desc: 'Alert when a new appointment is registered', checked: true },
    { label: 'Cancellations', desc: 'Immediate notification for cancelled slots', checked: true },
    { label: 'Client Reminders', desc: 'Automatic SMS/AlimTalk 24h before', checked: true },
    { label: 'Payout Ready', desc: 'Notification when monthly report is ready', checked: true },
    { label: 'System Errors', desc: 'External API sync failure alerts', checked: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Push Notifications</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Global alert policies</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 lg:p-10 grid md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-900 transition-all group">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900">{item.label}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.desc}</p>
            </div>
            <ToggleSwitch defaultChecked={item.checked} />
          </div>
        ))}
      </div>
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
