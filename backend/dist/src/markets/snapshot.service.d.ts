import { PrismaService } from '../prisma.service';
import { NormalizedMarket } from './dto/market.dto';
export declare class SnapshotService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    save(markets: NormalizedMarket[]): Promise<void>;
    getLatest(limit: number, platform?: string): Promise<{
        id: string;
        trendScore: number | null;
        platform: string;
        question: string;
        probability: number;
        volume: number | null;
        volume24h: number | null;
        liquidity: number | null;
        createdAt: Date | null;
        endDate: Date | null;
        marketId: string;
        fetchedAt: Date;
    }[]>;
}
