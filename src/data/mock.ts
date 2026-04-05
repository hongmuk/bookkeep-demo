import type { Staff, Service, Customer, Booking, Payment, Settlement, DailySales } from '../types';

export const shop = {
  id: 'shop-1',
  name: '헤어살롱 블룸',
  phone: '02-1234-5678',
  address: '서울특별시 강남구 역삼동 123-45',
  businessHours: { open: '10:00', close: '21:00' },
};

export const staffList: Staff[] = [
  {
    id: 'staff-1', name: '김수현', role: 'owner', phone: '010-1111-2222',
    profileColor: '#6172F3', isActive: true,
    settlementType: 'fixed_plus_incentive', baseSalary: 0,
    incentiveRates: { '커트': 100, '펌': 100, '염색': 100, '클리닉': 100, '리테일': 100 },
  },
  {
    id: 'staff-2', name: '박지민', role: 'staff', phone: '010-3333-4444',
    profileColor: '#F79009', isActive: true,
    settlementType: 'fixed_plus_incentive', baseSalary: 2200000,
    incentiveRates: { '커트': 40, '펌': 35, '염색': 30, '클리닉': 35, '리테일': 10 },
  },
  {
    id: 'staff-3', name: '이하늘', role: 'staff', phone: '010-5555-6666',
    profileColor: '#12B76A', isActive: true,
    settlementType: 'fixed_plus_incentive', baseSalary: 2000000,
    incentiveRates: { '커트': 38, '펌': 33, '염색': 28, '클리닉': 33, '리테일': 10 },
  },
  {
    id: 'staff-4', name: '최서연', role: 'staff', phone: '010-7777-8888',
    profileColor: '#F04438', isActive: true,
    settlementType: 'incentive_only', baseSalary: 0,
    incentiveRates: { '커트': 50, '펌': 45, '염색': 40, '클리닉': 45, '리테일': 15 },
  },
];

export const serviceList: Service[] = [
  { id: 'svc-1', category: '커트', name: '여성 커트', price: 30000, durationMinutes: 40 },
  { id: 'svc-2', category: '커트', name: '남성 커트', price: 22000, durationMinutes: 30 },
  { id: 'svc-3', category: '커트', name: '아동 커트', price: 15000, durationMinutes: 20 },
  { id: 'svc-4', category: '펌', name: '디지털 펌', price: 150000, durationMinutes: 120 },
  { id: 'svc-5', category: '펌', name: '볼륨 매직', price: 130000, durationMinutes: 150 },
  { id: 'svc-6', category: '펌', name: '다운 펌', price: 80000, durationMinutes: 90 },
  { id: 'svc-7', category: '염색', name: '전체 염색', price: 100000, durationMinutes: 90 },
  { id: 'svc-8', category: '염색', name: '뿌리 염색', price: 60000, durationMinutes: 60 },
  { id: 'svc-9', category: '염색', name: '탈색+염색', price: 180000, durationMinutes: 150 },
  { id: 'svc-10', category: '클리닉', name: '두피 클리닉', price: 50000, durationMinutes: 40 },
  { id: 'svc-11', category: '클리닉', name: '모발 클리닉', price: 40000, durationMinutes: 30 },
  { id: 'svc-12', category: '리테일', name: '샴푸 (제품)', price: 28000, durationMinutes: 0 },
];

export const customerList: Customer[] = [
  { id: 'cust-1', name: '홍길동', phone: '010-1000-2000', gender: 'M', visitCount: 12, noShowCount: 0, lastVisitAt: '2026-04-05', memo: '오른쪽 가르마 선호', tags: ['VIP', '지명-박지민'] },
  { id: 'cust-2', name: '김영희', phone: '010-1000-3000', gender: 'F', visitCount: 8, noShowCount: 1, lastVisitAt: '2026-04-03', memo: '두피 민감, 저자극 제품 사용', tags: ['두피민감'] },
  { id: 'cust-3', name: '이철수', phone: '010-1000-4000', gender: 'M', visitCount: 5, noShowCount: 0, lastVisitAt: '2026-04-01', memo: '', tags: [] },
  { id: 'cust-4', name: '박소연', phone: '010-1000-5000', gender: 'F', visitCount: 20, noShowCount: 0, lastVisitAt: '2026-04-06', memo: '매달 첫째 주 토요일 예약', tags: ['VIP', '정기방문'] },
  { id: 'cust-5', name: '최민수', phone: '010-1000-6000', gender: 'M', visitCount: 3, noShowCount: 2, lastVisitAt: '2026-03-15', memo: '노쇼 주의', tags: ['노쇼주의'] },
  { id: 'cust-6', name: '정유진', phone: '010-1000-7000', gender: 'F', visitCount: 15, noShowCount: 0, lastVisitAt: '2026-04-04', memo: '긴 머리, 앞머리 있음', tags: ['VIP'] },
  { id: 'cust-7', name: '강태우', phone: '010-1000-8000', gender: 'M', visitCount: 7, noShowCount: 0, lastVisitAt: '2026-03-28', memo: '', tags: [] },
  { id: 'cust-8', name: '윤서아', phone: '010-1000-9000', gender: 'F', visitCount: 2, noShowCount: 0, lastVisitAt: '2026-04-02', memo: '신규 고객, 인스타 유입', tags: ['신규'] },
];

function generateTodayBookings(): Booking[] {
  const today = '2026-04-06';
  return [
    {
      id: 'bk-1', customerId: 'cust-4', customerName: '박소연', staffId: 'staff-2', staffName: '박지민',
      status: 'completed', date: today, startTime: '10:00', endTime: '12:00',
      services: [{ serviceId: 'svc-1', name: '여성 커트', price: 30000 }, { serviceId: 'svc-4', name: '디지털 펌', price: 150000 }],
      channel: 'naver', totalPrice: 180000, memo: '',
    },
    {
      id: 'bk-2', customerId: 'cust-1', customerName: '홍길동', staffId: 'staff-2', staffName: '박지민',
      status: 'completed', date: today, startTime: '13:00', endTime: '13:30',
      services: [{ serviceId: 'svc-2', name: '남성 커트', price: 22000 }],
      channel: 'phone', totalPrice: 22000, memo: '오른쪽 가르마',
    },
    {
      id: 'bk-3', customerId: 'cust-6', customerName: '정유진', staffId: 'staff-3', staffName: '이하늘',
      status: 'confirmed', date: today, startTime: '14:00', endTime: '15:30',
      services: [{ serviceId: 'svc-7', name: '전체 염색', price: 100000 }],
      channel: 'kakao', totalPrice: 100000, memo: '브라운 계열 희망',
    },
    {
      id: 'bk-4', customerId: 'cust-2', customerName: '김영희', staffId: 'staff-4', staffName: '최서연',
      status: 'confirmed', date: today, startTime: '14:30', endTime: '15:10',
      services: [{ serviceId: 'svc-1', name: '여성 커트', price: 30000 }],
      channel: 'manual', totalPrice: 30000, memo: '저자극 제품',
    },
    {
      id: 'bk-5', customerId: 'cust-3', customerName: '이철수', staffId: 'staff-1', staffName: '김수현',
      status: 'confirmed', date: today, startTime: '15:00', endTime: '15:30',
      services: [{ serviceId: 'svc-2', name: '남성 커트', price: 22000 }],
      channel: 'naver', totalPrice: 22000, memo: '',
    },
    {
      id: 'bk-6', customerId: 'cust-7', customerName: '강태우', staffId: 'staff-3', staffName: '이하늘',
      status: 'pending', date: today, startTime: '16:00', endTime: '16:30',
      services: [{ serviceId: 'svc-2', name: '남성 커트', price: 22000 }],
      channel: 'instagram', totalPrice: 22000, memo: '',
    },
    {
      id: 'bk-7', customerId: 'cust-8', customerName: '윤서아', staffId: 'staff-4', staffName: '최서연',
      status: 'pending', date: today, startTime: '17:00', endTime: '19:30',
      services: [{ serviceId: 'svc-9', name: '탈색+염색', price: 180000 }],
      channel: 'kakao', totalPrice: 180000, memo: '핑크 밀크티 컬러',
    },
    {
      id: 'bk-8', customerId: 'cust-5', customerName: '최민수', staffId: 'staff-1', staffName: '김수현',
      status: 'cancelled', date: today, startTime: '11:00', endTime: '11:30',
      services: [{ serviceId: 'svc-2', name: '남성 커트', price: 22000 }],
      channel: 'naver', totalPrice: 22000, memo: '노쇼 이력 있음',
    },
  ];
}

function generateWeekBookings(): Booking[] {
  const base = generateTodayBookings();
  const extra: Booking[] = [];
  const names = ['홍길동', '김영희', '이철수', '박소연', '정유진', '강태우', '윤서아'];
  const staffIds = ['staff-1', 'staff-2', 'staff-3', 'staff-4'];
  const staffNames = ['김수현', '박지민', '이하늘', '최서연'];
  const svcs = serviceList.filter(s => s.durationMinutes > 0);
  const channels: Booking['channel'][] = ['naver', 'kakao', 'phone', 'manual', 'instagram'];
  const statuses: Booking['status'][] = ['completed', 'completed', 'completed', 'confirmed', 'cancelled'];

  for (let d = 1; d <= 6; d++) {
    const date = `2026-04-0${7 - d}`;
    if (date === '2026-04-06') continue;
    for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
      const si = Math.floor(Math.random() * staffIds.length);
      const svc = svcs[Math.floor(Math.random() * svcs.length)];
      const hour = 10 + Math.floor(Math.random() * 9);
      extra.push({
        id: `bk-w-${d}-${i}`,
        customerId: `cust-${(i % 7) + 1}`,
        customerName: names[i % 7],
        staffId: staffIds[si],
        staffName: staffNames[si],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + Math.ceil(svc.durationMinutes / 60)).toString().padStart(2, '0')}:00`,
        services: [{ serviceId: svc.id, name: svc.name, price: svc.price }],
        channel: channels[Math.floor(Math.random() * channels.length)],
        totalPrice: svc.price,
        memo: '',
      });
    }
  }
  return [...base, ...extra];
}

export const bookingList: Booking[] = generateWeekBookings();

export const paymentList: Payment[] = bookingList
  .filter(b => b.status === 'completed')
  .map((b, i) => ({
    id: `pay-${i}`,
    bookingId: b.id,
    method: (['card', 'cash', 'naver_pay', 'kakao_pay', 'card', 'card'] as Payment['method'][])[i % 6],
    amount: b.totalPrice,
    paidAt: `${b.date} ${b.startTime}`,
  }));

export function getSettlements(month: string): Settlement[] {
  return staffList.filter(s => s.role !== 'owner').map(staff => {
    const cut = 400000 + Math.floor(Math.random() * 300000);
    const perm = 800000 + Math.floor(Math.random() * 600000);
    const color = 500000 + Math.floor(Math.random() * 400000);
    const clinic = 200000 + Math.floor(Math.random() * 200000);
    const retail = 100000 + Math.floor(Math.random() * 100000);
    const total = cut + perm + color + clinic + retail;

    const incentive = Math.round(
      cut * (staff.incentiveRates['커트'] / 100) +
      perm * (staff.incentiveRates['펌'] / 100) +
      color * (staff.incentiveRates['염색'] / 100) +
      clinic * (staff.incentiveRates['클리닉'] / 100) +
      retail * (staff.incentiveRates['리테일'] / 100)
    );

    const deductions = staff.baseSalary > 0 ? Math.round(staff.baseSalary * 0.09) : 0;

    return {
      staffId: staff.id,
      staffName: staff.name,
      periodStart: `${month}-01`,
      periodEnd: `${month}-31`,
      totalSales: total,
      serviceSales: { '커트': cut, '펌': perm, '염색': color, '클리닉': clinic, '리테일': retail },
      serviceCount: {
        '커트': Math.round(cut / 26000),
        '펌': Math.round(perm / 130000),
        '염색': Math.round(color / 90000),
        '클리닉': Math.round(clinic / 45000),
        '리테일': Math.round(retail / 28000),
      },
      incentiveAmount: incentive,
      baseSalary: staff.baseSalary,
      deductions,
      netAmount: staff.baseSalary + incentive - deductions,
    };
  });
}

export function getDailySales(): DailySales[] {
  const days: DailySales[] = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date(2026, 3, 6 - i);
    const ds = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay();
    const base = dayOfWeek === 0 ? 0 : dayOfWeek === 6 ? 600000 : 400000;
    const variance = Math.floor(Math.random() * 300000);
    const total = base + variance;
    days.push({
      date: ds,
      total,
      card: Math.round(total * 0.6),
      cash: Math.round(total * 0.2),
      naverPay: Math.round(total * 0.1),
      kakaoPay: Math.round(total * 0.07),
      other: Math.round(total * 0.03),
    });
  }
  return days;
}

export const channelLabels: Record<string, string> = {
  manual: '수기입력', naver: '네이버', kakao: '카카오', phone: '전화', instagram: '인스타',
};

export const statusLabels: Record<string, string> = {
  pending: '대기', confirmed: '확정', completed: '완료', cancelled: '취소', no_show: '노쇼',
};

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
  no_show: 'bg-red-100 text-red-700',
};

export const methodLabels: Record<string, string> = {
  cash: '현금', card: '카드', naver_pay: '네이버페이', kakao_pay: '카카오페이', gift_card: '상품권', transfer: '계좌이체',
};
