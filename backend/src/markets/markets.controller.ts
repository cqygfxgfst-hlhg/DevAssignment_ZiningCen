import { Controller, Get, Query, Logger } from '@nestjs/common';
import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import { NormalizedMarket, TrendOptions } from './dto/market.dto';
import { TrendService } from './trend.service';
import { MarketsCache } from './markets.cache';
import { SnapshotService } from './snapshot.service';

@Controller('markets')
export class MarketsController {
  private readonly logger = new Logger(MarketsController.name);

  constructor(
    private readonly polymarket: PolymarketService,
    private readonly kalshi: KalshiService,
    private readonly trend: TrendService,
    private readonly cache: MarketsCache,
    private readonly snapshots: SnapshotService,
  ) {}

  @Get('trending')
  async getTrending(
    @Query('platform') platform?: TrendOptions['platform'],
    @Query('limit') limit = '20',
  ): Promise<NormalizedMarket[]> {
    const parsedLimit = Number(limit) || 20;
    this.logger.log(
      `GET /markets/trending platform=${platform ?? 'all'} limit=${parsedLimit}`,
    );

    const cached = await this.cache.get(platform, parsedLimit);
    if (cached && cached.length > 0) {
      this.logger.log(
        `Cache hit for platform=${platform ?? 'all'} limit=${parsedLimit}`,
      );
      return cached;
    }

    const markets = await this.collectMarkets(platform);
    this.logger.log(`Collected ${markets.length} markets`);
    const ranked = this.trend.rank(markets, parsedLimit);
    // Persist snapshot (best-effort)
    void this.snapshots.save(ranked);
    await this.cache.set(platform, parsedLimit, ranked);
    return ranked;
  }

  private async collectMarkets(
    platform?: TrendOptions['platform'],
  ): Promise<NormalizedMarket[]> {
    if (platform === 'Polymarket') {
      return this.polymarket.fetchMarkets();
    }
    if (platform === 'Kalshi') {
      return this.kalshi.fetchMarkets();
    }
    const [poly, kalshi] = await Promise.all([
      this.polymarket.fetchMarkets(),
      this.kalshi.fetchMarkets(),
    ]);
    return [...poly, ...kalshi];
  }
}

