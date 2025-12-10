import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { NormalizedMarket } from './dto/market.dto';

interface KalshiMarket {
  id?: string;
  ticker?: string;
  event_ticker?: string;
  title: string;
  close_time?: string;
  open_time?: string;
  created_time?: string;
  expiration_time?: string;
  latest_expiration_time?: string;
  volume?: number;
  volume_24h?: number;
  day_volume?: number; // v1 alias
  liquidity?: number;
  liquidity_dollars?: string;
  yes_bid?: number; // cents
  yes_bid_dollars?: string;
  yes_ask?: number; // cents
  yes_ask_dollars?: string;
  last_price?: number; // cents
  last_price_dollars?: string;
  previous_price?: number; // cents
  previous_price_dollars?: string;
  category?: string;
  status?: string;
  notional_value?: number;
}

@Injectable()
export class KalshiService {
  private readonly logger = new Logger(KalshiService.name);
  private readonly baseUrls: string[] = (
    process.env.KALSHI_BASE_URL ??
    'https://api.elections.kalshi.com/trade-api/v2,https://api.kalshi.com/trade-api/v2'
  )
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  private readonly authHeader = process.env.KALSHI_AUTH_HEADER;

  constructor(private readonly http: HttpService) {}

  async fetchMarkets(limit = 300): Promise<NormalizedMarket[]> {
    for (const baseUrl of this.baseUrls) {
      const url = this.buildMarketsUrl(baseUrl, limit);
      try {
        const response = await lastValueFrom(
          this.http.get(url, {
            headers: this.authHeader ? { Authorization: this.authHeader } : {},
            validateStatus: () => true,
          }),
        );
        if (response.status >= 400) {
          this.logger.warn(`Kalshi HTTP ${response.status} from ${baseUrl}`);
          continue;
        }
        const markets: KalshiMarket[] = response.data?.markets ?? [];
        this.logger.log(
          `Kalshi fetched ${markets.length} markets from ${baseUrl}`,
        );
        const filtered = this.filterRecent(markets);
        this.logger.log(`Filtered to ${filtered.length} valid markets`);
        const normalized = filtered.map((m) => this.toNormalized(m));
        this.logSample(normalized);
        return normalized;
      } catch (err) {
        this.logger.warn(
          `Kalshi endpoint failed (${baseUrl}), trying next or falling back`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    this.logger.warn('Kalshi API unavailable, falling back to mock sample');
    return this.mockMarkets();
  }

  private buildMarketsUrl(base: string, limit: number): string {
    const trimmed = base.replace(/\/+$/, '');
    const root = trimmed.endsWith('/markets')
      ? trimmed
      : `${trimmed}/markets`;
    const hasQuery = root.includes('?');
    const params = new URLSearchParams({
      limit: `${Math.min(Math.max(limit, 1), 1000)}`,
      status: 'open',
      mve_filter: 'exclude', // 去掉组合式合成事件，保留单市场
    });
    return `${root}${hasQuery ? '&' : '?'}${params.toString()}`;
  }

  private toNormalized(market: KalshiMarket): NormalizedMarket {
    const probability = this.deriveProbability(market);

    return {
      platform: 'Kalshi',
      id: market.id ?? market.ticker ?? market.title,
      question: market.title ?? '',
      probability,
      volume: market.volume,
      volume24h: market.volume_24h ?? market.day_volume,
      liquidity:
        market.liquidity ??
        this.parseNumber(market.liquidity_dollars),
      createdAt: market.created_time ?? market.open_time,
      endDate:
        market.close_time ?? market.expiration_time ?? market.latest_expiration_time,
      category: market.category ? [market.category] : undefined,
      url: market.ticker
        ? `https://kalshi.com/markets/${market.ticker}`
        : undefined,
      lastUpdated: new Date().toISOString(),
    };
  }

  private deriveProbability(market: KalshiMarket): number {
    const priceSources = [
      market.last_price ?? this.parseNumber(market.last_price_dollars),
      market.yes_bid ?? this.parseNumber(market.yes_bid_dollars),
      market.yes_ask ?? this.parseNumber(market.yes_ask_dollars),
      market.previous_price ?? this.parseNumber(market.previous_price_dollars),
    ];

    for (const p of priceSources) {
      const normalized = this.toUnitPrice(p);
      if (normalized !== undefined) return normalized;
    }

    return 0.5;
  }

  private filterRecent(data: KalshiMarket[]): KalshiMarket[] {
    const now = Date.now();
    const createdDays =
      Number(process.env.MARKET_CREATED_WINDOW_DAYS ?? 365) || 365;
    const createdWindowAgo = now - createdDays * 24 * 60 * 60 * 1000;

    return data.filter((m) => {
      if (!m.title || (!m.id && !m.ticker)) return false;

      const end =
        m.close_time ?? m.expiration_time ?? m.latest_expiration_time;
      const created = m.created_time ?? m.open_time;

      const endTs = end ? Date.parse(end) : undefined;
      const createdTs = created ? Date.parse(created) : undefined;

      const hasValidEnd = endTs !== undefined && !Number.isNaN(endTs);
      const hasValidCreated =
        createdTs !== undefined && !Number.isNaN(createdTs);

      // 放宽：有结束时间的市场直接保留（不限制未来窗口），仅过滤缺标题/ID。
      if (hasValidEnd) return true;

      // 无结束时间时，用创建时间做轻量过滤（默认近 365 天），无创建时间也保留。
      if (hasValidCreated) return createdTs >= createdWindowAgo;
      return true;
    });
  }

  private toUnitPrice(value?: number): number | undefined {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return undefined;
    }
    const raw = Number(value);
    if (Number.isNaN(raw)) return undefined;

    // Kalshi价格单位通常是美分(0-100)或美元字符串。>1 视为美分。
    const price = raw > 1 ? raw / 100 : raw;
    return Math.min(1, Math.max(0, price));
  }

  private parseNumber(value?: number | string): number | undefined {
    if (value === undefined || value === null) return undefined;
    const parsed = typeof value === 'string' ? Number(value) : value;
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private logSample(markets: NormalizedMarket[]): void {
    if (process.env.KALSHI_LOG_SAMPLES !== 'true') return;
    const sample = markets.slice(0, 10).map((m) => ({
      id: m.id,
      probability: m.probability,
      volume: m.volume,
      volume24h: m.volume24h,
      liquidity: m.liquidity,
      createdAt: m.createdAt,
      endDate: m.endDate,
    }));
    this.logger.log(`Kalshi sample: ${JSON.stringify(sample, null, 2)}`);
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

