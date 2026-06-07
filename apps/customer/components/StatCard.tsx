import { TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  deltaPercent: number;
  caption?: string;
};

function StatCard({ title, value, deltaPercent, caption }: StatCardProps) {
  const positive = deltaPercent >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-sm">
        <span
          className={`inline-flex items-center gap-0.5 font-medium tabular-nums ${
            positive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {positive ? (
            <TrendingUp className="h-4 w-4" aria-hidden />
          ) : (
            <TrendingDown className="h-4 w-4" aria-hidden />
          )}
          {positive ? '+' : ''}
          {deltaPercent.toFixed(1)}%
        </span>
        <span className="text-zinc-500 dark:text-zinc-500">
          {caption ?? 'vs. prior period'}
        </span>
      </div>
    </div>
  );
}

export default memo(StatCard);
