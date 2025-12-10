import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import { NormalizedMarket, TrendOptions } from './dto/market.dto';
import { TrendService } from './trend.service';
import { MarketsCache } from './markets.cache';
import { SnapshotService } from './snapshot.service';
export declare class MarketsController {
    private readonly polymarket;
    private readonly kalshi;
    private readonly trend;
    private readonly cache;
    private readonly snapshots;
    private readonly logger;
    constructor(polymarket: PolymarketService, kalshi: KalshiService, trend: TrendService, cache: MarketsCache, snapshots: SnapshotService);
    getTrending(platform?: TrendOptions['platform'], limit?: string, endWithinHours?: string, createdWithinHours?: string, personalized?: string, prefCategory?: string, prefPlatform?: string, prefHorizon?: string, prefVolatility?: string): Promise<NormalizedMarket[]>;
    private parsePreferences;
    private collectMarkets;
    private applyTimeFilters;
}
