import { NormalizedMarket, UserPreferences } from './dto/market.dto';
export declare class TrendService {
    private readonly logger;
    score(market: NormalizedMarket): number;
    rank(markets: NormalizedMarket[], limit?: number, preferences?: UserPreferences): NormalizedMarket[];
    private activityRaw;
    private freshnessScore;
    private closingSoonScore;
    private uncertaintyScore;
    private clamp;
    private calculateUserBoost;
}
