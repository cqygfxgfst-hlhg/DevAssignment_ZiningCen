import { Inject, Injectable, Logger } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { NormalizedMarket } from './dto/market.dto';

@Injectable()
export class MarketsCache {
  private readonly logger = new Logger(MarketsCache.name);
  private readonly ttlSeconds = Number(process.env.TREND_CACHE_TTL_SEC ?? 60);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType,
  ) {}

  private key(platform?: string, limit?: number): string {
    return `trending:${platform ?? 'all'}:${limit ?? 'default'}`;
  }

  async get(
    platform?: string,
    limit?: number,
  ): Promise<NormalizedMarket[] | null> {
    try {
      const val = await this.redis.get(this.key(platform, limit));
      if (!val) return null;
      return JSON.parse(val) as NormalizedMarket[];
    } catch (err) {
      this.logger.warn(
        `Redis get failed for platform=${platform} limit=${limit}: ${
          err instanceof Error ? err.message : err
        }`,
      );
      return null;
    }
  }

  async set(
    platform: string | undefined,
    limit: number | undefined,
    data: NormalizedMarket[],
  ): Promise<void> {
    try {
      await this.redis.set(this.key(platform, limit), JSON.stringify(data), {
        EX: this.ttlSeconds,
      });
    } catch (err) {
      this.logger.warn(
        `Redis set failed for platform=${platform} limit=${limit}: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }
}

