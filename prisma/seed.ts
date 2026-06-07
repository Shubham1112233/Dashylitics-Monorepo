import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const baseDeltas = {
  revenuePercent: 12.4,
  usersPercent: 8.1,
  ordersPercent: -2.3,
};

async function main() {
  const { prisma } = await import('../apps/customer/lib/prisma');

  await prisma.statsSnapshot.upsert({
    where: { range: 'd7' },
    create: {
      range: 'd7',
      totalRevenue: 8240,
      totalUsers: 214,
      totalOrders: 52,
      revenueData: [
        { period: 'Mon', revenue: 980 },
        { period: 'Tue', revenue: 1120 },
        { period: 'Wed', revenue: 910 },
        { period: 'Thu', revenue: 1540 },
        { period: 'Fri', revenue: 2010 },
        { period: 'Sat', revenue: 980 },
        { period: 'Sun', revenue: 700 },
      ],
      deltas: baseDeltas,
    },
    update: {
      totalRevenue: 8240,
      totalUsers: 214,
      totalOrders: 52,
      revenueData: [
        { period: 'Mon', revenue: 980 },
        { period: 'Tue', revenue: 1120 },
        { period: 'Wed', revenue: 910 },
        { period: 'Thu', revenue: 1540 },
        { period: 'Fri', revenue: 2010 },
        { period: 'Sat', revenue: 980 },
        { period: 'Sun', revenue: 700 },
      ],
      deltas: baseDeltas,
    },
  });

  await prisma.statsSnapshot.upsert({
    where: { range: 'd30' },
    create: {
      range: 'd30',
      totalRevenue: 128_400,
      totalUsers: 1842,
      totalOrders: 612,
      revenueData: [
        { period: 'W1', revenue: 28_200 },
        { period: 'W2', revenue: 31_400 },
        { period: 'W3', revenue: 35_800 },
        { period: 'W4', revenue: 33_000 },
      ],
      deltas: baseDeltas,
    },
    update: {
      totalRevenue: 128_400,
      totalUsers: 1842,
      totalOrders: 612,
      revenueData: [
        { period: 'W1', revenue: 28_200 },
        { period: 'W2', revenue: 31_400 },
        { period: 'W3', revenue: 35_800 },
        { period: 'W4', revenue: 33_000 },
      ],
      deltas: baseDeltas,
    },
  });

  await prisma.statsSnapshot.upsert({
    where: { range: 'd90' },
    create: {
      range: 'd90',
      totalRevenue: 412_900,
      totalUsers: 5230,
      totalOrders: 1890,
      revenueData: [
        { period: 'Jan', revenue: 62_000 },
        { period: 'Feb', revenue: 58_400 },
        { period: 'Mar', revenue: 71_200 },
        { period: 'Apr', revenue: 69_800 },
        { period: 'May', revenue: 74_500 },
        { period: 'Jun', revenue: 77_000 },
      ],
      deltas: baseDeltas,
    },
    update: {
      totalRevenue: 412_900,
      totalUsers: 5230,
      totalOrders: 1890,
      revenueData: [
        { period: 'Jan', revenue: 62_000 },
        { period: 'Feb', revenue: 58_400 },
        { period: 'Mar', revenue: 71_200 },
        { period: 'Apr', revenue: 69_800 },
        { period: 'May', revenue: 74_500 },
        { period: 'Jun', revenue: 77_000 },
      ],
      deltas: baseDeltas,
    },
  });
}

main()
  .then(async () => {
    const { prisma } = await import('../apps/customer/lib/prisma');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    const { prisma } = await import('../apps/customer/lib/prisma');
    await prisma.$disconnect();
    process.exit(1);
  });
