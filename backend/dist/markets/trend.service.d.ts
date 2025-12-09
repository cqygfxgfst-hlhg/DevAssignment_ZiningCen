import { NormalizedMarket } from './dto/market.dto';
export declare class TrendService {
    score(market: NormalizedMarket): number;
    rank(markets: NormalizedMarket[], limit?: number): NormalizedMarket[];
    private activityScore;
    private freshnessScore;
    private closingSoonScore;
    private uncertaintyScore;
    private clamp;
}
