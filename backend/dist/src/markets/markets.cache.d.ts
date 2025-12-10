import type { RedisClientType } from 'redis';
import { NormalizedMarket } from './dto/market.dto';
export declare class MarketsCache {
    private readonly redis;
    private readonly logger;
    private readonly ttlSeconds;
    constructor(redis: RedisClientType);
    private key;
    get(platform?: string, limit?: number, endWithinHours?: string, createdWithinHours?: string): Promise<NormalizedMarket[] | null>;
    set(platform: string | undefined, limit: number | undefined, data: NormalizedMarket[], endWithinHours?: string, createdWithinHours?: string): Promise<void>;
}
