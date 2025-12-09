import { HttpService } from '@nestjs/axios';
import { NormalizedMarket } from './dto/market.dto';
export declare class PolymarketService {
    private readonly http;
    private readonly logger;
    private readonly baseUrls;
    constructor(http: HttpService);
    fetchMarkets(limit?: number): Promise<NormalizedMarket[]>;
    private buildUrl;
    private toNormalized;
    private filterRecent;
    private adaptGammaShape;
    private normalizeProbability;
}
