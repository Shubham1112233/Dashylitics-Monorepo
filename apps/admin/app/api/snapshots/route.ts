import { prisma } from '@/lib/prisma';
import { prismaToQuery } from '@/lib/range-map';
import { snapshotUpdateSchema } from '@/lib/schemas/admin';
import { NextResponse } from 'next/server';

export async function GET() {
    const rows = await prisma.statsSnapshot.findMany({
        orderBy: {
            range: 'asc',
        },
    })

    const snapshots = rows.map((row) => {
        const metrics = snapshotUpdateSchema.parse({
            totalRevenue: row.totalRevenue,
            totalUsers: row.totalUsers,
            totalOrders: row.totalOrders,
            deltas: row.deltas,
        })

       return {
        range: prismaToQuery[row.range],
        ...metrics,
       };
    })

    return NextResponse.json(snapshots);
}

