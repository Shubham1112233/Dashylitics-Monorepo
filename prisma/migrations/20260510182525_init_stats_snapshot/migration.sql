-- CreateEnum
CREATE TYPE "DateRange" AS ENUM ('7d', '30d', '90d');

-- CreateTable
CREATE TABLE "StatsSnapshot" (
    "range" "DateRange" NOT NULL,
    "totalRevenue" INTEGER NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "revenueData" JSONB NOT NULL,
    "deltas" JSONB NOT NULL,

    CONSTRAINT "StatsSnapshot_pkey" PRIMARY KEY ("range")
);
