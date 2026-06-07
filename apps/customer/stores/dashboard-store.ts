import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DateRange } from '@/lib/schemas/stats';

export type ThemeMode = 'light' | 'dark' | 'system';

type DashboardState = {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      dateRange: '7d',
      setDateRange: (dateRange) => set({ dateRange }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'dashlytics-dashboard' }
  )
);
