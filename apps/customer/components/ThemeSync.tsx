'use client';

import { useEffect } from 'react';
import { useDashboardStore, type ThemeMode } from '@/stores/dashboard-store';

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}

export default function ThemeSync() {
  const theme = useDashboardStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle('dark', resolveTheme(theme) === 'dark');
    };
    apply();

    if (theme !== 'system') return;

    const mq = globalThis.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => apply();
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [theme]);

  return null;
}
