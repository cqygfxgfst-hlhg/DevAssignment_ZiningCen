import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketsController } from './markets.controller';
import { PolymarketService } from './polymarket.service';
import { KalshiService } from './kalshi.service';
import { TrendService } from './trend.service';
import { RedisModule } from '../redis/redis.module';
import { MarketsCache } from './markets.cache';
import { PrismaService } from '../prisma.service';
import { SnapshotService } from './snapshot.service';

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [MarketsController],
  providers: [
    PrismaService,
    SnapshotService,
    PolymarketService,
    KalshiService,
    TrendService,
    MarketsCache,
  ],
  exports: [PolymarketService, KalshiService, TrendService, MarketsCache],
})
export class MarketsModule {}

