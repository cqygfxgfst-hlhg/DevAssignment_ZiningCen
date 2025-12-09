import { Controller, Get, Query, Logger } from '@nestjs/common';
import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import { NormalizedMarket, TrendOptions } from './dto/market.dto';
import { TrendService } from './trend.service';

@Controller('markets')
export class MarketsController {
  private readonly logger = new Logger(MarketsController.name);

  constructor(
    private readonly polymarket: PolymarketService,
    private readonly kalshi: KalshiService,
    private readonly trend: TrendService,
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
    const markets = await this.collectMarkets(platform);
    this.logger.log(`Collected ${markets.length} markets`);
    return this.trend.rank(markets, parsedLimit);
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

