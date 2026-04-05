import { create } from 'zustand';
import type { Booking } from '../types';
import { bookingList as initialBookings } from '../data/mock';

interface AppState {
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  bookings: initialBookings,
  selectedDate: '2026-04-06',
  setSelectedDate: (date) => set({ selectedDate: date }),
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBookingStatus: (id, status) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    })),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
