'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import QueryError from '@/components/QueryError';
import RevenueChart from '@/components/RevenueChart';
import StatCard from '@/components/StatCard';
import { useStats } from '@/hooks/useStats';
import type { DateRange } from '@/lib/schemas/stats';
import { useDashboardStore } from '@/stores/dashboard-store';

const rangeLabels: Record<DateRange, string> = {
  '7d': 'Last 7 days — daily breakdown',
  '30d': 'Last 30 days — weekly buckets',
  '90d': 'Last 90 days — monthly trend',
};

const rangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export default function Home() {
  const dateRange = useDashboardStore((s) => s.dateRange);
  const setDateRange = useDashboardStore((s) => s.setDateRange);
  const { data, isLoading, error, isFetching } = useStats(dateRange);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Overview
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Key metrics and revenue performance for your workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="range" className="sr-only">
              Date range
            </label>
            <div className="relative">
              <select
                id="range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-violet-500/30 transition-shadow focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {rangeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <svg
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {isFetching && !isLoading && (
              <span
                className="hidden text-xs text-zinc-400 sm:inline"
                aria-live="polite"
              >
                Updating…
              </span>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isLoading && <DashboardSkeleton />}

          {error && (
            <QueryError message={error.message} title="Could not load metrics" />
          )}

          {data && !isLoading && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total revenue"
                  value={currency.format(data.totalRevenue)}
                  deltaPercent={data.deltas.revenuePercent}
                />
                <StatCard
                  title="Active users"
                  value={compact.format(data.totalUsers)}
                  deltaPercent={data.deltas.usersPercent}
                />
                <StatCard
                  title="Orders"
                  value={compact.format(data.totalOrders)}
                  deltaPercent={data.deltas.ordersPercent}
                />
              </div>

              <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none sm:p-8">
                <RevenueChart
                  data={data.revenueData}
                  rangeLabel={rangeLabels[dateRange]}
                />
              </section>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
        Dashlytics — by SHUBHAM EKKALDEVI
      </footer>
    </div>
  );
}
