import type { DateRange } from '@/lib/schemas/stats';
import type { DateRange as PrismaDateRange } from '@/lib/generated/prisma/client';


export const queryToPrisma: Record<DateRange, PrismaDateRange> = {
    '7d': 'd7',
    '30d': 'd30',
    '90d': 'd90',
  };


  export const prismaToQuery: Record<PrismaDateRange, DateRange> = {
    d7: '7d',
    d30: '30d',
    d90: '90d',
  };