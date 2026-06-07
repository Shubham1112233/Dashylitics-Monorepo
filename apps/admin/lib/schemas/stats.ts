import { z } from 'zod';

export const dateRangeSchema = z.enum(['7d', '30d', '90d']);
export type DateRange = z.infer<typeof dateRangeSchema>;

export const revenuePointSchema = z.object({
  period: z.string(),
  revenue: z.number().nonnegative(),
});

export const statsSchema = z.object({
  totalRevenue: z.number(),
  totalUsers: z.number().nonnegative().int(),
  totalOrders: z.number().nonnegative().int(),
  revenueData: z.array(revenuePointSchema),
  deltas: z.object({
    revenuePercent: z.number(),
    usersPercent: z.number(),
    ordersPercent: z.number(),
  }),
});

export type Stats = z.infer<typeof statsSchema>;
export type RevenuePoint = z.infer<typeof revenuePointSchema>;
