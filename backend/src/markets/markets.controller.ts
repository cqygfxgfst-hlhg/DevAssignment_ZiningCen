import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import {
  NormalizedMarket,
  TrendOptions,
  UserPreferences,
} from './dto/market.dto';
import { TrendService } from './trend.service';
import { MarketsCache } from './markets.cache';
import { SnapshotService } from './snapshot.service';

@ApiTags('markets')
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
  @ApiOperation({
    summary: '获取热门市场趋势',
    description:
      '获取来自 Polymarket 和 Kalshi 等平台的聚合市场数据，支持根据热度排序、时间过滤以及个性化推荐。',
  })
  @ApiResponse({
    status: 200,
    description: '成功返回市场列表',
    type: [NormalizedMarket],
  })
  @ApiQuery({
    name: 'platform',
    required: false,
    enum: ['Polymarket', 'Kalshi'],
    description: '指定数据来源平台，不传则聚合所有平台',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '返回结果的数量限制，默认为 20',
    example: 20,
  })
  @ApiQuery({
    name: 'endWithinHours',
    required: false,
    description: '过滤在指定小时数内结束的市场',
    example: 24,
  })
  @ApiQuery({
    name: 'createdWithinHours',
    required: false,
    description: '过滤在指定小时数内创建的市场',
    example: 48,
  })
  @ApiQuery({
    name: 'personalized',
    required: false,
    description: '是否启用个性化排序 (true/false)',
    example: 'true',
  })
  @ApiQuery({
    name: 'prefCategory',
    required: false,
    description: '个性化参数：感兴趣的类别，逗号分隔',
    example: 'Politics,Crypto',
  })
  @ApiQuery({
    name: 'prefPlatform',
    required: false,
    description: '个性化参数：平台权重配置',
    example: 'Polymarket:1.5,Kalshi:0.8',
  })
  @ApiQuery({
    name: 'prefHorizon',
    required: false,
    description: '个性化参数：时间偏好 (short/medium/long)',
    enum: ['short', 'medium', 'long'],
  })
  @ApiQuery({
    name: 'prefVolatility',
    required: false,
    description: '个性化参数：波动性偏好 (high/low)',
    enum: ['high', 'low'],
  })
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
      ranked = this.trend.rank(filtered, parsedLimit, prefs);
    } else {
      ranked = this.trend.rank(filtered, parsedLimit);
    }

    // Persist snapshot (best-effort)
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
