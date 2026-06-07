import { useQuery } from '@tanstack/react-query';
import { statsSchema, type DateRange } from '@/lib/schemas/stats';

async function fetchStats(range: DateRange) {
  const res = await fetch(`/api/stats?range=${encodeURIComponent(range)}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  const json: unknown = await res.json();
  return statsSchema.parse(json);
}

export function useStats(range: DateRange) {
  return useQuery({
    queryKey: ['stats', range],
    queryFn: () => fetchStats(range),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
