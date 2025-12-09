-- CreateTable
CREATE TABLE "MarketSnapshot" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,
    "volume24h" DOUBLE PRECISION,
    "liquidity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "trendScore" DOUBLE PRECISION,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketSnapshot_platform_fetchedAt_idx" ON "MarketSnapshot"("platform", "fetchedAt");

-- CreateIndex
CREATE INDEX "MarketSnapshot_fetchedAt_idx" ON "MarketSnapshot"("fetchedAt");
