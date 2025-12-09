import { KalshiService } from './kalshi.service';
import { PolymarketService } from './polymarket.service';
import { NormalizedMarket, TrendOptions } from './dto/market.dto';
import { TrendService } from './trend.service';
export declare class MarketsController {
    private readonly polymarket;
    private readonly kalshi;
    private readonly trend;
    private readonly logger;
    constructor(polymarket: PolymarketService, kalshi: KalshiService, trend: TrendService);
    getTrending(platform?: TrendOptions['platform'], limit?: string): Promise<NormalizedMarket[]>;
    private collectMarkets;
}
