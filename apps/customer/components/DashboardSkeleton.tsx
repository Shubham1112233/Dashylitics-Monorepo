export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-9 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
      <div className="h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
