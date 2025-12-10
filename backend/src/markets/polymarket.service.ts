import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { NormalizedMarket } from './dto/market.dto';

interface PolymarketToken {
  token_id: string;
  outcome: string;
  price?: number;
  winner?: boolean;
}

interface PolymarketMarket {
  market_slug: string;
  question: string;
  slug?: string; // gamma alias
  condition_id?: string;
  conditionId?: string; // gamma alias
  question_id?: string;
  end_date_iso?: string;
  endDate?: string; // gamma alias
  endDateIso?: string; // gamma alias
  created_at?: string;
  createdTime?: string; // gamma alias
  startDate?: string; // gamma alias
  startDateIso?: string; // gamma alias
  accepting_order_timestamp?: string;
  openTime?: string; // gamma alias
  tags?: string[];
  categories?: string[]; // gamma alias
  tokens?: PolymarketToken[];
  volume?: number;
  volume_24h?: number;
  volume24h?: number; // gamma alias
  liquidity?: number;
  active?: boolean;
  closed?: boolean;
  accepting_orders?: boolean;
  yesPrice?: number; // gamma alias
  noPrice?: number; // gamma alias
  eventSlug?: string; // gamma event slug
}

@Injectable()
export class PolymarketService {
  private readonly logger = new Logger(PolymarketService.name);
  private readonly baseUrls: string[] = (
    process.env.POLYMARKET_BASE_URL ?? 'https://gamma-api.polymarket.com/markets'
  )
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  constructor(private readonly http: HttpService) {}

  // Prefer events endpoint for fresher markets; fallback to markets if needed.
  async fetchMarkets(limit = 200): Promise<NormalizedMarket[]> {
    const fromHotMarkets = await this.fetchTopMarkets(limit);
    if (fromHotMarkets.length > 0) return fromHotMarkets;

    const fromEvents = await this.fetchFromEvents(limit);
    if (fromEvents.length > 0) return fromEvents;

    for (const base of this.baseUrls) {
      try {
        const url = this.buildUrl(base, limit);
        const response = await lastValueFrom(
          this.http.get(url, {
            validateStatus: () => true, // 手动处理非 2xx
          }),
        );

        if (response.status >= 400) {
          this.logger.warn(
            `Polymarket HTTP ${response.status} from ${base}`,
          );
          continue;
        }

        const raw = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        const data: PolymarketMarket[] = raw.map((m: any) =>
          this.adaptGammaShape(m),
        );
        this.logger.log(
          `Polymarket fetched ${data.length} markets from ${base}`,
        );

        const filtered = this.filterRecent(data);
        this.logger.log(`Filtered to ${filtered.length} valid markets`);
        const normalized = filtered.map((m) => this.toNormalized(m));
        this.logSample(normalized, 'markets');
        return normalized;
      } catch (err) {
        this.logger.warn(
          `Polymarket endpoint failed (${base}), trying next`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    this.logger.error('All Polymarket endpoints failed, returning empty list');
    return [];
  }

  private async fetchFromEvents(limit: number): Promise<NormalizedMarket[]> {
    const eventBases = (
      process.env.POLYMARKET_EVENTS_BASE_URL ??
      'https://gamma-api.polymarket.com/events'
    )
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);

    for (const base of eventBases) {
      try {
        const url = this.buildEventsUrl(base, limit);
        const response = await lastValueFrom(
          this.http.get(url, {
            validateStatus: () => true,
          }),
        );

        if (response.status >= 400) {
          this.logger.warn(`Polymarket events HTTP ${response.status} from ${base}`);
          continue;
        }

        const events = response.data?.events ?? response.data ?? [];
        if (!Array.isArray(events) || events.length === 0) {
          this.logger.warn(`Polymarket events empty from ${base}`);
          continue;
        }

        const markets: PolymarketMarket[] = [];
        for (const evt of events) {
          const evtSlug = evt?.slug;
          const evtMarkets =
            evt?.markets ??
            evt?.eventMarkets ??
            evt?.marketsData ??
            evt?.marketContracts ??
            [];
          if (!Array.isArray(evtMarkets)) continue;
          for (const m of evtMarkets) {
            const adapted = this.adaptGammaShape(m);
            adapted.eventSlug = adapted.eventSlug ?? evtSlug;
            markets.push(adapted);
          }
        }

        this.logger.log(
          `Polymarket events fetched ${events.length} events, ${markets.length} markets from ${base}`,
        );

        const filtered = this.filterRecent(markets);
        this.logger.log(`Filtered to ${filtered.length} valid markets (events)`);
        const normalized = filtered.map((m) => this.toNormalized(m));
        this.logSample(normalized, 'events');
        return normalized;
      } catch (err) {
        this.logger.warn(
          `Polymarket events endpoint failed (${base}), trying next`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    return [];
  }

  private buildUrl(base: string, limit: number): string {
    const hasQuery = base.includes('?');
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const hardFloor = new Date('2025-12-01T00:00:00Z');
    const startDate = threeDaysAgo > hardFloor ? threeDaysAgo : hardFloor;

    const params = new URLSearchParams({
      limit: `${limit}`,
      offset: '0',
      active: 'true',
      start_date_min: startDate.toISOString().split('.')[0] + 'Z',
    });
    return `${base}${hasQuery ? '&' : '?'}${params.toString()}`;
  }

  private async fetchTopMarkets(limit: number): Promise<NormalizedMarket[]> {
    for (const base of this.baseUrls) {
      try {
        const url = this.buildHotMarketsUrl(base, limit);
        const response = await lastValueFrom(
          this.http.get(url, { validateStatus: () => true }),
        );

        if (response.status >= 400) {
          this.logger.warn(
            `Polymarket hot-markets HTTP ${response.status} from ${base}`,
          );
          continue;
        }

        const raw = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        const data: PolymarketMarket[] = raw.map((m: any) =>
          this.adaptGammaShape(m),
        );

        this.logger.log(
          `Polymarket hot-markets fetched ${data.length} markets from ${base}`,
        );

        const filtered = this.filterRecent(data);
        this.logger.log(`Filtered to ${filtered.length} valid markets (hot)`);
        if (filtered.length > 0) {
          const normalized = filtered.map((m) => this.toNormalized(m));
          this.logSample(normalized, 'hot');
          return normalized;
        }
      } catch (err) {
        this.logger.warn(
          `Polymarket hot-markets endpoint failed (${base}), trying next`,
          err instanceof Error ? err.message : err,
        );
      }
    }
    return [];
  }

  private buildHotMarketsUrl(base: string, limit: number): string {
    const hasQuery = base.includes('?');
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const hardFloor = new Date('2025-12-01T00:00:00Z');
    const startDate = threeDaysAgo > hardFloor ? threeDaysAgo : hardFloor;

    const params = new URLSearchParams({
      limit: `${limit}`,
      offset: '0',
      active: 'true',
      closed: 'false',
      order: 'volume24hr',
      direction: 'desc',
      start_date_min: startDate.toISOString().split('.')[0] + 'Z',
    });
    return `${base}${hasQuery ? '&' : '?'}${params.toString()}`;
  }

  private logSample(markets: NormalizedMarket[], label: string): void {
    if (process.env.POLYMARKET_LOG_SAMPLES !== 'true') {
      return;
    }
    const sample = markets.slice(0, 15).map((m) => ({
      id: m.id,
      probability: m.probability,
      volume: m.volume,
      volume24h: m.volume24h,
      liquidity: m.liquidity,
      createdAt: m.createdAt,
      endDate: m.endDate,
      // 便于手动核算 trendScore：activity/freshness/closingSoon/uncertainty 在 TrendService 里计算
    }));
    this.logger.log(`Polymarket sample (${label}):\n${JSON.stringify(sample, null, 2)}`);
  }

  private buildEventsUrl(base: string, limit: number): string {
    const hasQuery = base.includes('?');
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const hardFloor = new Date('2025-12-01T00:00:00Z');
    const startDate = threeDaysAgo > hardFloor ? threeDaysAgo : hardFloor;

    const params = new URLSearchParams({
      limit: `${limit}`,
      offset: '0',
      closed: 'false',
      order: 'id',
      ascending: 'false',
      start_date_min: startDate.toISOString().split('.')[0] + 'Z',
    });
    return `${base}${hasQuery ? '&' : '?'}${params.toString()}`;
  }

  private toNormalized(market: PolymarketMarket): NormalizedMarket {
    const yesToken = market.tokens?.[0];
    const probability = this.normalizeProbability(yesToken?.price);

    const conditionId = market.condition_id ?? market.conditionId;
    const slug = market.market_slug ?? market.slug;
    const eventSlug = market.eventSlug;

    return {
      platform: 'Polymarket',
      id: slug,
      question: market.question,
      probability,
      volume: market.volume,
      volume24h: market.volume_24h ?? market.volume24h,
      liquidity: market.liquidity,
      createdAt:
        market.created_at ??
        market.accepting_order_timestamp ??
        market.createdTime ??
        market.openTime,
      endDate: market.end_date_iso ?? market.endDate,
      category: market.tags ?? market.categories,
      url:
        (eventSlug && slug
          ? `https://polymarket.com/event/${eventSlug}/${slug}`
          : undefined) ??
        (conditionId
          ? `https://polymarket.com/market/${conditionId}`
          : slug
          ? `https://polymarket.com/market/${slug}`
          : undefined),
      lastUpdated: new Date().toISOString(),
    };
  }

  private filterRecent(data: PolymarketMarket[]): PolymarketMarket[] {
    const now = Date.now();
    const endPastDays =
      Number(process.env.MARKET_END_WINDOW_DAYS_PAST ?? 7) || 7;
    const endFutureDays =
      Number(process.env.MARKET_END_WINDOW_DAYS_FUTURE ?? 14) || 14;
    const createdDays =
      Number(process.env.MARKET_CREATED_WINDOW_DAYS ?? 120) || 120;

    const createdWindowAgo = now - createdDays * 24 * 60 * 60 * 1000;
    const endWindowAgo = now - endPastDays * 24 * 60 * 60 * 1000;
    const endWindowAhead = now + endFutureDays * 24 * 60 * 60 * 1000;

    return data.filter((m) => {
      if (!m.market_slug || !m.question) return false;

      const end =
        m.end_date_iso ?? m.endDate;
      const created =
        m.created_at ?? m.createdTime ?? m.openTime ?? m.accepting_order_timestamp;

      const endTs = end ? Date.parse(end) : undefined;
      const createdTs = created ? Date.parse(created) : undefined;

      const recentEnd =
        endTs !== undefined &&
        !Number.isNaN(endTs) &&
        endTs >= endWindowAgo &&
        endTs <= endWindowAhead;
      const recentCreated =
        createdTs !== undefined &&
        !Number.isNaN(createdTs) &&
        createdTs >= createdWindowAgo;

      return recentEnd || recentCreated;
    });
  }

  private adaptGammaShape(m: any): PolymarketMarket {
    const market_slug = m.market_slug ?? m.slug ?? m.tickerSlug ?? m.id;
    const question = m.question ?? m.title ?? m.name ?? '';
    const end_date_iso =
      m.end_date_iso ??
      m.endDate ??
      m.endDateIso ??
      m.resolution_date ??
      m.resolutionDate;
    const created_at =
      m.created_at ??
      m.createdTime ??
      m.startDate ??
      m.startDateIso ??
      m.openTime;

    const volume =
      m.volume ?? m.totalVolume ?? m.volumeUsd ?? m.liquidity ?? m.poolSize;
    const volume_24h =
      m.volume_24h ??
      m.volume24h ??
      m.volume24H ??
      m.volume24hUsd ??
      m.volume24h_usd;
    const liquidity = m.liquidity ?? m.tvl ?? m.poolSize;

    let tokens: PolymarketToken[] | undefined = m.tokens;
    if (!tokens && (m.yesPrice !== undefined || m.noPrice !== undefined)) {
      const yesPrice =
        m.yesPrice !== undefined
          ? m.yesPrice
          : m.noPrice !== undefined
          ? 1 - m.noPrice
          : undefined;
      tokens = yesPrice !== undefined
        ? [{ token_id: 'yes', outcome: 'Yes', price: yesPrice }]
        : undefined;
    }

    return {
      market_slug,
      question,
      condition_id: m.condition_id ?? m.conditionId,
      question_id: m.question_id ?? m.questionId,
      end_date_iso,
      created_at,
      accepting_order_timestamp: m.accepting_order_timestamp ?? m.openTime,
      tags: m.tags ?? m.categories,
      tokens,
      volume,
      volume_24h,
      liquidity,
      active: m.active,
      closed: m.closed,
      accepting_orders: m.accepting_orders,
      yesPrice: m.yesPrice,
      noPrice: m.noPrice,
      eventSlug: Array.isArray(m.events) && m.events.length > 0 ? m.events[0].slug : undefined,
    };
  }

  private normalizeProbability(price?: number): number {
    if (price === undefined || price === null || Number.isNaN(price)) {
      return 0.5;
    }
    // Polymarket prices are in dollars (0-1). Clamp to [0,1].
    return Math.min(1, Math.max(0, price));
  }
}

