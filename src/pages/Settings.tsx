import { useState } from 'react';
import { Store, Scissors, Bell } from 'lucide-react';
import { shop, serviceList } from '../data/mock';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'services' | 'notifications'>('shop');

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <h2 className="text-[56px] font-black text-gray-900 tracking-[calc(-0.05em)] leading-none italic">
            Settings
          </h2>
          <p className="text-[16px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-1">
            System / Configuration
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1.5 rounded-[20px] border border-white">
          {[
            { key: 'shop', icon: Store, label: 'Profile' },
            { key: 'services', icon: Scissors, label: 'Services' },
            { key: 'notifications', icon: Bell, label: 'Alerts' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 text-[12px] px-6 py-2.5 rounded-[16px] font-black uppercase tracking-widest transition-all
                ${activeTab === key ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {activeTab === 'shop' && <ShopSettings />}
        {activeTab === 'services' && <ServiceSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}

function ShopSettings() {
  const inputClass = "w-full text-[14px] font-black border border-gray-100 bg-gray-50 rounded-[20px] px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all appearance-none uppercase tracking-widest";
  const labelClass = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 italic";

  return (
    <div className="bg-white rounded-[48px] shadow-elegant border border-white p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-50 pb-8">
        <h3 className="text-[24px] font-black text-gray-900 tracking-tight">Studio Profile</h3>
        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Public Information</span>
      </div>
      
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Studio Name</label>
            <input className={inputClass} defaultValue={shop.name} />
          </div>
          <div>
            <label className={labelClass}>Direct Phone</label>
            <input className={inputClass} defaultValue={shop.phone} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Studio Address</label>
          <input className={inputClass} defaultValue={shop.address} />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Opening Hours</label>
            <input type="time" className={inputClass} defaultValue={shop.businessHours.open} />
          </div>
          <div>
            <label className={labelClass}>Closing Hours</label>
            <input type="time" className={inputClass} defaultValue={shop.businessHours.close} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Off-Days Schedule</label>
          <div className="flex gap-3">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
              <button
                key={d}
                className={`flex-1 h-14 rounded-[18px] text-[12px] font-black border transition-all duration-300
                  ${i === 6 ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white'}`}
              >{d}</button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-8 border-t border-gray-50 flex justify-end">
        <button className="px-12 py-4 bg-gray-900 text-white rounded-full text-[13px] font-black uppercase tracking-[0.1em] hover:bg-accent transition-all shadow-floating active:scale-95">
          Save Profile
        </button>
      </div>
    </div>
  );
}

function ServiceSettings() {
  const categories: string[] = [...new Set(serviceList.map((s) => s.category))];

  return (
    <div className="bg-white rounded-[48px] shadow-elegant border border-white p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-50 pb-8">
        <h3 className="text-[24px] font-black text-gray-900 tracking-tight">Service Directory</h3>
        <button className="px-8 py-3 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg">
          + Add New Service
        </button>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat} className="space-y-6">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">{cat} Collection</h4>
            <div className="space-y-3">
              {serviceList.filter((s) => s.category === cat).map((s) => (
                <div key={s.id} className="group flex items-center gap-6 p-6 rounded-[32px] bg-gray-50/50 hover:bg-white hover:shadow-elegant border border-transparent hover:border-white transition-all duration-500">
                  <div className="flex-1">
                    <span className="text-[16px] font-black text-gray-900 group-hover:text-accent transition-colors">{s.name}</span>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.durationMinutes > 0 ? `${s.durationMinutes} Minutes Duration` : 'Flexible Duration'}</p>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <span className="text-[18px] font-black text-gray-900 tabular-nums">₩{s.price.toLocaleString()}</span>
                    <button className="text-[10px] font-black px-4 py-2 border border-gray-100 rounded-full text-gray-400 uppercase tracking-widest hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">Configure</button>
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
    { label: 'New Booking Alert', desc: 'Real-time push for new appointments', checked: true },
    { label: 'Booking Modification', desc: 'Alert when customer changes schedule', checked: true },
    { label: 'Booking Cancellation', desc: 'Immediate notification for cancellations', checked: true },
    { label: 'Reminder (24H Before)', desc: 'Automatic reminder for clients', checked: true },
    { label: 'Reminder (1H Before)', desc: 'Final push for assigned staff', checked: false },
    { label: 'Settlement Confirmation', desc: 'Monthly financial report ready alert', checked: true },
  ];

  return (
    <div className="bg-white rounded-[48px] shadow-elegant border border-white p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-50 pb-8">
        <h3 className="text-[24px] font-black text-gray-900 tracking-tight">System Alerts</h3>
        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Push & SMS Policy</span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-elegant transition-all duration-500 group">
            <div className="space-y-1">
              <p className="text-[14px] font-black text-gray-900 group-hover:text-accent transition-colors">{item.label}</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{item.desc}</p>
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
      className={`relative w-12 h-6 rounded-full transition-all duration-500 ${checked ? 'bg-gray-900 shadow-lg' : 'bg-gray-200'}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-500 ${checked ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );
}
