import { prisma } from '@/lib/prisma';
import { dateRangeSchema, statsSchema, type DateRange } from '@/lib/schemas/stats';
import { DateRange as PrismaDateRange } from '@/lib/generated/prisma/client';
import { NextResponse } from 'next/server';

const queryToPrisma: Record<DateRange, PrismaDateRange> = {
  '7d': 'd7',
  '30d': 'd30',
  '90d': 'd90',
};

export async function GET(request: Request) {
  const rangeParam = new URL(request.url).searchParams.get('range');
  const parsed = dateRangeSchema.safeParse(rangeParam);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid or missing range. Use 7d, 30d, or 90d.' },
      { status: 400 }
    );
  }
  const range = parsed.data;
  const row = await prisma.statsSnapshot.findUnique({
    where: { range: queryToPrisma[range] },
  });
  if (!row) {
    return NextResponse.json(
      { error: 'No stats for this range. Run prisma db seed.' },
      { status: 404 }
    );
  }
  const stats = statsSchema.parse({
    totalRevenue: row.totalRevenue,
    totalUsers: row.totalUsers,
    totalOrders: row.totalOrders,
    revenueData: row.revenueData,
    deltas: row.deltas,
  });
  return NextResponse.json(stats);
}
