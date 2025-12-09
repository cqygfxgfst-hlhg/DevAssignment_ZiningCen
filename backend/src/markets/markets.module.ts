import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketsController } from './markets.controller';
import { PolymarketService } from './polymarket.service';
import { KalshiService } from './kalshi.service';
import { TrendService } from './trend.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [MarketsController],
  providers: [PolymarketService, KalshiService, TrendService],
  exports: [PolymarketService, KalshiService, TrendService],
})
export class MarketsModule {}

