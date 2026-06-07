import { z } from 'zod';

export const snapshotUpdateSchema = z.object({
  totalRevenue: z.number(),
  totalUsers: z.number().nonnegative().int(),
  totalOrders: z.number().nonnegative().int(),
  deltas: z.object({
    revenuePercent: z.number(),
    usersPercent: z.number(),
    ordersPercent: z.number(),
  }),
});