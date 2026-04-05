import { useState } from 'react';
import { shop, serviceList } from '../data/mock';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'services' | 'notifications'>('shop');

  return (
    <div className="space-y-24 text-brand-black">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-black/10 pb-16">
        <div className="space-y-6">
          <h2 className="serif-display text-[80px] leading-none tracking-tighter">Settings</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">System Core & Operational Parameters</p>
        </div>
        <div className="flex bg-brand-black/[0.03] p-1 rounded-full border border-brand-black/5">
          {['shop', 'services', 'notifications'].map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === key ? 'bg-brand-black text-white shadow-xl' : 'opacity-30 hover:opacity-100'}`}
            >{key}</button>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto reveal">
        {activeTab === 'shop' && <ShopSettings />}
        {activeTab === 'services' && <ServiceSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}

function ShopSettings() {
  const inputClass = "w-full bg-transparent border-b border-brand-black/20 py-4 text-xl font-black uppercase tracking-tighter focus:border-brand-black outline-none transition-all";
  const labelClass = "text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic";

  return (
    <div className="space-y-20">
      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-4">
          <label className={labelClass}>Studio Name</label>
          <input className={inputClass} defaultValue={shop.name} />
        </div>
        <div className="space-y-4">
          <label className={labelClass}>Operational Contact</label>
          <input className={inputClass} defaultValue={shop.phone} />
        </div>
      </div>
      <div className="space-y-4">
        <label className={labelClass}>Primary Location</label>
        <input className={inputClass} defaultValue={shop.address} />
      </div>
      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-4">
          <label className={labelClass}>Commencement</label>
          <input type="time" className={inputClass} defaultValue={shop.businessHours.open} />
        </div>
        <div className="space-y-4">
          <label className={labelClass}>Conclusion</label>
          <input type="time" className={inputClass} defaultValue={shop.businessHours.close} />
        </div>
      </div>
      <div className="pt-12 border-t border-brand-black/10 flex justify-end">
        <button className="bg-brand-black text-white px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-accent transition-all">Update_Core_Profile</button>
      </div>
    </div>
  );
}

function ServiceSettings() {
  const categories = [...new Set(serviceList.map((s) => s.category))];

  return (
    <div className="space-y-20">
      {categories.map((cat) => (
        <div key={cat} className="space-y-8">
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 border-b border-brand-black pb-4">{cat} Index</h4>
          <div className="grid gap-px bg-brand-black/5">
            {serviceList.filter((s) => s.category === cat).map((s) => (
              <div key={s.id} className="bg-brand-beige group flex items-center justify-between py-8 px-4 -mx-4 hover:bg-brand-black/5 transition-all">
                <div className="space-y-1">
                  <span className="text-lg font-black uppercase tracking-tighter">{s.name}</span>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{s.durationMinutes} Minutes Window</p>
                </div>
                <div className="flex items-center gap-12">
                  <span className="text-xl font-black tabular-nums tracking-tighter">₩{s.price.toLocaleString()}</span>
                  <button className="text-[10px] font-black uppercase tracking-widest border border-brand-black/10 px-4 py-2 hover:border-brand-black transition-all">Edit_Index</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationSettings() {
  const items = [
    { label: 'New Booking', desc: 'Real-time synchronization for new entries' },
    { label: 'Cancellation', desc: 'Node removal notification' },
    { label: 'Reminders', desc: 'Automated client engagement protocol' },
    { label: 'Audit Ready', desc: 'Monthly financial report ready' },
  ];

  return (
    <div className="space-y-20">
      <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
        {items.map((item, i) => (
          <div key={i} className="group flex items-start justify-between py-8 border-b border-brand-black/10">
            <div className="space-y-2">
              <p className="text-xl font-black uppercase tracking-tighter">{item.label}</p>
              <p className="text-[10px] font-bold text-brand-black/30 uppercase tracking-widest">{item.desc}</p>
            </div>
            <button className="w-12 h-6 border border-brand-black/20 rounded-full relative p-1 flex items-center group-hover:border-brand-black transition-all">
              <div className="w-4 h-4 bg-brand-black rounded-full ml-auto" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
