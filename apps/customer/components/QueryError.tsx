'use client';

import { AlertCircle } from 'lucide-react';

type Props = {
  title?: string;
  message: string;
};

export default function QueryError({ title = 'Something went wrong', message }: Props) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
    >
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
