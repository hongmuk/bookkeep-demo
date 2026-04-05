export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type BookingChannel = 'manual' | 'naver' | 'kakao' | 'phone' | 'instagram';
export type PaymentMethod = 'cash' | 'card' | 'naver_pay' | 'kakao_pay' | 'gift_card' | 'transfer';
export type UserRole = 'owner' | 'manager' | 'staff';
export type SettlementType = 'fixed_plus_incentive' | 'incentive_only' | 'booth_rental';

export interface Shop {
  id: string;
  name: string;
  phone: string;
  address: string;
  businessHours: { open: string; close: string };
}

export interface Staff {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  profileColor: string;
  isActive: boolean;
  settlementType: SettlementType;
  baseSalary: number;
  incentiveRates: Record<string, number>;
}

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gender: 'M' | 'F';
  visitCount: number;
  noShowCount: number;
  lastVisitAt: string;
  memo: string;
  tags: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  staffId: string;
  staffName: string;
  status: BookingStatus;
  date: string;
  startTime: string;
  endTime: string;
  services: { serviceId: string; name: string; price: number }[];
  channel: BookingChannel;
  totalPrice: number;
  memo: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  amount: number;
  paidAt: string;
}

export interface Settlement {
  staffId: string;
  staffName: string;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  serviceSales: Record<string, number>;
  serviceCount: Record<string, number>;
  incentiveAmount: number;
  baseSalary: number;
  deductions: number;
  netAmount: number;
}

export interface DailySales {
  date: string;
  total: number;
  card: number;
  cash: number;
  naverPay: number;
  kakaoPay: number;
  other: number;
}
