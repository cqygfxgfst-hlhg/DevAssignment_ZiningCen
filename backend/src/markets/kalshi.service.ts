import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { NormalizedMarket } from './dto/market.dto';

interface KalshiMarket {
  id: string;
  title: string;
  close_time?: string;
  open_time?: string;
  volume?: number;
  day_volume?: number;
  liquidity?: number;
  ticker?: string;
  yes_bid?: number;
  yes_ask?: number;
  category?: string;
}

@Injectable()
export class KalshiService {
  private readonly logger = new Logger(KalshiService.name);
  private readonly baseUrls: string[] = (
    process.env.KALSHI_BASE_URL ??
    'https://api.kalshi.com/v1,https://api.elections.kalshi.com/v1'
  )
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  private readonly authHeader = process.env.KALSHI_AUTH_HEADER;

  constructor(private readonly http: HttpService) {}

  async fetchMarkets(limit = 100): Promise<NormalizedMarket[]> {
    for (const baseUrl of this.baseUrls) {
      const url = `${baseUrl}/markets?status=active&limit=${limit}`;
      try {
        const response = await lastValueFrom(
          this.http.get(url, {
            headers: this.authHeader ? { Authorization: this.authHeader } : {},
          }),
        );
        const markets: KalshiMarket[] = response.data?.markets ?? [];
        this.logger.log(
          `Kalshi fetched ${markets.length} markets from ${baseUrl}`,
        );
        return markets.map((m) => this.toNormalized(m));
      } catch (err) {
        this.logger.warn(
          `Kalshi endpoint failed (${baseUrl}), trying next or falling back`,
          err,
        );
      }
    }

    this.logger.warn('Kalshi API unavailable, falling back to mock sample');
    return this.mockMarkets();
  }

  private toNormalized(market: KalshiMarket): NormalizedMarket {
    // Use mid price of yes bid/ask as probability proxy.
    const bid = market.yes_bid ?? 0.5;
    const ask = market.yes_ask ?? 0.5;
    const probability = this.clamp((bid + ask) / 2);

    return {
      platform: 'Kalshi',
      id: market.id ?? market.ticker ?? market.title,
      question: market.title ?? '',
      probability,
      volume: market.volume,
      volume24h: market.day_volume,
      liquidity: market.liquidity,
      createdAt: market.open_time,
      endDate: market.close_time,
      category: market.category ? [market.category] : undefined,
      url: market.ticker
        ? `https://kalshi.com/markets/${market.ticker}`
        : undefined,
      lastUpdated: new Date().toISOString(),
    };
  }

  private clamp(value: number): number {
    if (Number.isNaN(value)) {
      return 0.5;
    }
    return Math.min(1, Math.max(0, value));
  }

  private mockMarkets(): NormalizedMarket[] {
    const now = new Date();
    return [
      {
        platform: 'Kalshi',
        id: 'MOCK-KALSHI-1',
        question: 'Will the S&P 500 close higher this Friday?',
        probability: 0.58,
        volume: 150000,
        volume24h: 32000,
        liquidity: 85000,
        createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
        endDate: new Date(now.getTime() + 5 * 86400000).toISOString(),
        category: ['Equities'],
        url: 'https://kalshi.com/markets/mock-1',
        lastUpdated: now.toISOString(),
      },
      {
        platform: 'Kalshi',
        id: 'MOCK-KALSHI-2',
        question: 'Will CPI YoY be above 3.0% this month?',
        probability: 0.42,
        volume: 90000,
        volume24h: 28000,
        liquidity: 45000,
        createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
        endDate: new Date(now.getTime() + 20 * 86400000).toISOString(),
        category: ['Macro'],
        url: 'https://kalshi.com/markets/mock-2',
        lastUpdated: now.toISOString(),
      },
    ];
  }
}

