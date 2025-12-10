import { Controller, Get, Query, Logger } from '@nestjs/common';
import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import { NormalizedMarket, TrendOptions, UserPreferences } from './dto/market.dto';
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
    @Query('endWithinHours') endWithinHours?: string,
    @Query('createdWithinHours') createdWithinHours?: string,
    @Query('personalized') personalized?: string,
    @Query('prefCategory') prefCategory?: string,
    @Query('prefPlatform') prefPlatform?: string,
    @Query('prefHorizon') prefHorizon?: string,
    @Query('prefVolatility') prefVolatility?: string,
  ): Promise<NormalizedMarket[]> {
    const parsedLimit = Number(limit) || 20;
    const isPersonalized = personalized === 'true';

    this.logger.log(
      `GET /markets/trending platform=${platform ?? 'all'} limit=${parsedLimit} personalized=${isPersonalized}`,
    );

    // Skip cache for personalized requests
    if (!isPersonalized) {
      const cached = await this.cache.get(
        platform,
        parsedLimit,
        endWithinHours,
        createdWithinHours,
      );
      if (cached && cached.length > 0) {
        this.logger.log(
          `Cache hit for platform=${platform ?? 'all'} limit=${parsedLimit}`,
        );
        return cached;
      }
    }

    const markets = await this.collectMarkets(platform);
    this.logger.log(`Collected ${markets.length} markets`);
    const filtered = this.applyTimeFilters(
      markets,
      endWithinHours,
      createdWithinHours,
    );

    let ranked: NormalizedMarket[];
    if (isPersonalized) {
      const prefs = this.parsePreferences(
        prefCategory,
        prefPlatform,
        prefHorizon,
        prefVolatility,
      );
      // Pass preferences to rank (method signature update needed in next step, casting for now or update service next)
      // For this step, we just prepare the input. To avoid breaking build, we need to update TrendService too.
      // But user said "Step 1". I will update TrendService signature in this step too to keep it consistent.
      ranked = this.trend.rank(filtered, parsedLimit, prefs);
    } else {
      ranked = this.trend.rank(filtered, parsedLimit);
    }

    // Persist snapshot (best-effort) only for non-personalized standard ranking?
    // Or save it anyway? Usually snapshots are for "global trending".
    if (!isPersonalized) {
      void this.snapshots.save(ranked);
      await this.cache.set(
        platform,
        parsedLimit,
        ranked,
        endWithinHours,
        createdWithinHours,
      );
    }
    return ranked;
  }

  private parsePreferences(
    cat?: string,
    plat?: string,
    hor?: string,
    vol?: string,
  ): UserPreferences {
    const preferences: UserPreferences = {};

    if (cat) {
      preferences.categories = cat.split(',').map((c) => c.trim());
    }

    if (plat) {
      // Format: "Polymarket:1.2,Kalshi:0.8"
      const weights: Record<string, number> = {};
      plat.split(',').forEach((p) => {
        const [name, w] = p.split(':');
        const val = parseFloat(w);
        if (name && !isNaN(val)) {
          weights[name.trim()] = val;
        }
      });
      if (Object.keys(weights).length > 0) {
        preferences.platformWeights = weights;
      }
    }

    if (hor === 'short' || hor === 'medium' || hor === 'long') {
      preferences.timeHorizon = hor;
    }

    if (vol === 'high' || vol === 'low') {
      preferences.volatility = vol;
    }

    return preferences;
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

  private applyTimeFilters(
    markets: NormalizedMarket[],
    endWithinHours?: string,
    createdWithinHours?: string,
  ): NormalizedMarket[] {
    const endH = Number(endWithinHours);
    const createdH = Number(createdWithinHours);
    const now = Date.now();

    return markets.filter((m) => {
      if (endH && m.endDate) {
        const endTs = Date.parse(m.endDate);
        if (!Number.isNaN(endTs)) {
          if (endTs > now + endH * 60 * 60 * 1000 || endTs < now) {
            return false;
          }
        }
      }
      if (createdH && m.createdAt) {
        const cTs = Date.parse(m.createdAt);
        if (!Number.isNaN(cTs)) {
          if (cTs < now - createdH * 60 * 60 * 1000) {
            return false;
          }
        }
      }
      return true;
    });
  }
}

