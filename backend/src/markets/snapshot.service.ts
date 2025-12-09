import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NormalizedMarket } from './dto/market.dto';

@Injectable()
export class SnapshotService {
  private readonly logger = new Logger(SnapshotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(markets: NormalizedMarket[]): Promise<void> {
    if (!markets.length) return;
    try {
      await this.prisma.marketSnapshot.createMany({
        data: markets.map((m) => ({
          platform: m.platform,
          marketId: m.id,
          question: m.question,
          probability: Number(m.probability),
          volume: m.volume !== undefined ? Number(m.volume) : null,
          volume24h: m.volume24h !== undefined ? Number(m.volume24h) : null,
          liquidity: m.liquidity !== undefined ? Number(m.liquidity) : null,
          createdAt: m.createdAt ? new Date(m.createdAt) : null,
          endDate: m.endDate ? new Date(m.endDate) : null,
          trendScore: m.trendScore !== undefined ? Number(m.trendScore) : null,
        })),
      });
    } catch (err) {
      this.logger.warn(
        `Failed to persist snapshots: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  async getLatest(limit: number, platform?: string) {
    // Find the latest fetchedAt timestamp (optionally per platform), then return that batch.
    const latest = await this.prisma.marketSnapshot.findFirst({
      where: platform ? { platform } : {},
      orderBy: { fetchedAt: 'desc' },
      select: { fetchedAt: true },
    });
    if (!latest?.fetchedAt) return [];

    return this.prisma.marketSnapshot.findMany({
      where: {
        fetchedAt: latest.fetchedAt,
        ...(platform ? { platform } : {}),
      },
      orderBy: { trendScore: 'desc' },
      take: limit,
    });
  }
}

