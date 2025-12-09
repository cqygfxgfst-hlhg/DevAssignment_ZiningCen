import { HttpService } from '@nestjs/axios';
import { NormalizedMarket } from './dto/market.dto';
export declare class KalshiService {
    private readonly http;
    private readonly logger;
    private readonly baseUrls;
    private readonly authHeader;
    constructor(http: HttpService);
    fetchMarkets(limit?: number): Promise<NormalizedMarket[]>;
    private toNormalized;
    private clamp;
    private mockMarkets;
}
