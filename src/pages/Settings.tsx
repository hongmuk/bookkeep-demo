import { useState } from 'react';
import { Store, Scissors, Bell } from 'lucide-react';
import { shop, serviceList } from '../data/mock';

export default function SettingsPage() {
  const [tab, setTab] = useState<'shop' | 'services' | 'notifications'>('shop');
  return (
    <div className="space-y-6 max-w-[900px]">
      <h2 className="text-xl font-bold text-gray-900">설정</h2>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
        {[{ key: 'shop', icon: Store, label: '매장 정보' }, { key: 'services', icon: Scissors, label: '시술 메뉴' }, { key: 'notifications', icon: Bell, label: '알림 설정' }].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key as typeof tab)} className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md font-medium ${tab === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>
      {tab === 'shop' && <ShopTab />}
      {tab === 'services' && <ServiceTab />}
      {tab === 'notifications' && <NotifTab />}
    </div>
  );
}

function ShopTab() {
  const ic = "w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white";
  const lc = "block text-[12px] font-semibold text-gray-500 mb-1.5";
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <h3 className="text-[15px] font-bold text-gray-800">매장 정보</h3>
      <div><label className={lc}>매장명</label><input className={ic} defaultValue={shop.name} /></div>
      <div><label className={lc}>전화번호</label><input className={ic} defaultValue={shop.phone} /></div>
      <div><label className={lc}>주소</label><input className={ic} defaultValue={shop.address} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={lc}>영업 시작</label><input type="time" className={ic} defaultValue={shop.businessHours.open} /></div>
        <div><label className={lc}>영업 종료</label><input type="time" className={ic} defaultValue={shop.businessHours.close} /></div>
      </div>
      <div><label className={lc}>휴무일</label><div className="flex gap-2">{['월','화','수','목','금','토','일'].map((d, i) => <button key={d} className={`w-9 h-9 rounded-lg text-[12px] font-medium border ${i === 6 ? 'bg-primary-50 border-primary-200 text-primary-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{d}</button>)}</div></div>
      <button className="px-5 py-2 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700">저장</button>
    </div>
  );
}

function ServiceTab() {
  const cats: string[] = [...new Set(serviceList.map((s) => s.category))];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-[15px] font-bold text-gray-800">시술 메뉴</h3><button className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-[12px] font-semibold hover:bg-primary-700">+ 시술 추가</button></div>
      {cats.map((cat) => (
        <div key={cat}><h4 className="text-[13px] font-bold text-gray-600 mb-2">{cat}</h4><div className="space-y-1.5">{serviceList.filter((s) => s.category === cat).map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"><span className="text-[13px] text-gray-800 font-medium flex-1">{s.name}</span><span className="text-[12px] text-gray-500">{s.durationMinutes > 0 ? `${s.durationMinutes}분` : '-'}</span><span className="text-[13px] font-bold text-gray-700 w-24 text-right">₩{s.price.toLocaleString()}</span><button className="text-[11px] px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-white">수정</button></div>
        ))}</div></div>
      ))}
    </div>
  );
}

function NotifTab() {
  const items = [
    { label: '신규 예약 알림', desc: '새 예약 시 담당 직원에게 푸시', on: true },
    { label: '예약 변경 알림', desc: '예약 수정 시 알림', on: true },
    { label: '예약 취소 알림', desc: '취소 시 알림', on: true },
    { label: '리마인더 (24시간 전)', desc: '고객에게 알림톡', on: true },
    { label: '리마인더 (1시간 전)', desc: '직원에게 푸시', on: false },
    { label: '정산 완료 알림', desc: '월별 정산 확정 시', on: true },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <h3 className="text-[15px] font-bold text-gray-800">알림 설정</h3>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div><p className="text-[13px] text-gray-700 font-medium">{item.label}</p><p className="text-[11px] text-gray-400">{item.desc}</p></div>
          <Toggle init={item.on} />
        </div>
      ))}
    </div>
  );
}

function Toggle({ init }: { init: boolean }) {
  const [on, setOn] = useState(init);
  return (
    <button onClick={() => setOn(!on)} className={`relative rounded-full transition-colors ${on ? 'bg-primary-600' : 'bg-gray-200'}`} style={{ width: 40, height: 22 }}>
      <div className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[20px]' : 'translate-x-0.5'}`} />
    </button>
  );
}
