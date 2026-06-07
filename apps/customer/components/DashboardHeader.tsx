'use client';

import { BarChart3, Moon, Sun, Monitor } from 'lucide-react';
import { useDashboardStore, type ThemeMode } from '@/stores/dashboard-store';

const modes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function DashboardHeader() {
  const theme = useDashboardStore((s) => s.theme);
  const setTheme = useDashboardStore((s) => s.setTheme);

  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <BarChart3 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Dashlytics
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Analytics overview
            </p>
          </div>
        </div>

        <div
          className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-900"
          role="group"
          aria-label="Theme"
        >
          {modes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              title={label}
              aria-pressed={theme === value}
              className={`rounded-md p-2 transition-colors ${
                theme === value
                  ? 'bg-white text-violet-600 shadow-sm dark:bg-zinc-800 dark:text-violet-400'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="sr-only">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
