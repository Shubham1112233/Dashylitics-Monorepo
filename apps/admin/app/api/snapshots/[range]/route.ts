import { prisma } from '@/lib/prisma';
import { prismaToQuery, queryToPrisma } from '@/lib/range-map';
import { snapshotUpdateSchema } from '@/lib/schemas/admin';
import { DateRange, dateRangeSchema } from '@/lib/schemas/stats';
import { NextResponse } from 'next/server';

type RouteContext = {
    params: Promise<{ range: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
    const { range: rangeParam } = await context.params;
    const parsedRange = dateRangeSchema.safeParse(rangeParam);

    if (!parsedRange.success) {
        return NextResponse.json(
            { error: 'Invalid range' },
            { status: 400 }
        )
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
        )
    }

    const parsedBody = snapshotUpdateSchema.safeParse(body);

    if (!parsedBody.success) {
        return NextResponse.json(
            { error: 'Invalid request body', details: parsedBody.error.flatten() },
            { status: 400 }
        )
    }

    try {
        const row = await prisma.statsSnapshot.update({
            where: { range: queryToPrisma[parsedRange.data] },
            data: {
                totalRevenue: parsedBody.data.totalRevenue,
                totalUsers: parsedBody.data.totalUsers,
                totalOrders: parsedBody.data.totalOrders,
                deltas: parsedBody.data.deltas,
            },
        })

        const metrics = snapshotUpdateSchema.parse({
            totalRevenue: row.totalRevenue,
            totalUsers: row.totalUsers,
            totalOrders: row.totalOrders,
            deltas: row.deltas,
        })

        return NextResponse.json({
            range: prismaToQuery[row.range],
            ...metrics
        });
    } catch {
        return NextResponse.json(
            { error: 'Snapshot not found or update failed' },
            { status: 404 }
        );
    }


} 