"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PolymarketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolymarketService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let PolymarketService = PolymarketService_1 = class PolymarketService {
    http;
    logger = new common_1.Logger(PolymarketService_1.name);
    baseUrls = (process.env.POLYMARKET_BASE_URL ?? 'https://gamma-api.polymarket.com/markets')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    constructor(http) {
        this.http = http;
    }
    async fetchMarkets(limit = 200) {
        for (const base of this.baseUrls) {
            try {
                const url = this.buildUrl(base, limit);
                const response = await (0, rxjs_1.lastValueFrom)(this.http.get(url, {
                    validateStatus: () => true,
                }));
                if (response.status >= 400) {
                    this.logger.warn(`Polymarket HTTP ${response.status} from ${base}`);
                    continue;
                }
                const raw = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ?? [];
                const data = raw.map((m) => this.adaptGammaShape(m));
                this.logger.log(`Polymarket fetched ${data.length} markets from ${base}`);
                const filtered = this.filterRecent(data);
                this.logger.log(`Filtered to ${filtered.length} valid markets`);
                return filtered.map((m) => this.toNormalized(m));
            }
            catch (err) {
                this.logger.warn(`Polymarket endpoint failed (${base}), trying next`, err instanceof Error ? err.message : err);
            }
        }
        this.logger.error('All Polymarket endpoints failed, returning empty list');
        return [];
    }
    buildUrl(base, limit) {
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
    toNormalized(market) {
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
            createdAt: market.created_at ??
                market.accepting_order_timestamp ??
                market.createdTime ??
                market.openTime,
            endDate: market.end_date_iso ?? market.endDate,
            category: market.tags ?? market.categories,
            url: (eventSlug && slug
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
    filterRecent(data) {
        const now = Date.now();
        const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
        return data.filter((m) => {
            if (!m.market_slug || !m.question)
                return false;
            const end = m.end_date_iso ?? m.endDate;
            const created = m.created_at ?? m.createdTime ?? m.openTime ?? m.accepting_order_timestamp;
            const endTs = end ? Date.parse(end) : undefined;
            const createdTs = created ? Date.parse(created) : undefined;
            const recentEnd = endTs !== undefined &&
                !Number.isNaN(endTs) &&
                endTs >= thirtyDaysAgo;
            const recentCreated = createdTs !== undefined &&
                !Number.isNaN(createdTs) &&
                createdTs >= sixMonthsAgo;
            return recentEnd || recentCreated;
        });
    }
    adaptGammaShape(m) {
        const market_slug = m.market_slug ?? m.slug ?? m.tickerSlug ?? m.id;
        const question = m.question ?? m.title ?? m.name ?? '';
        const end_date_iso = m.end_date_iso ??
            m.endDate ??
            m.close_date ??
            m.closeDate ??
            m.resolution_date ??
            m.resolutionDate;
        const created_at = m.created_at ??
            m.createdTime ??
            m.open_date ??
            m.openDate ??
            m.openTime;
        const volume = m.volume ?? m.totalVolume ?? m.volumeUsd ?? m.liquidity ?? m.poolSize;
        const volume_24h = m.volume_24h ??
            m.volume24h ??
            m.volume24H ??
            m.volume24hUsd ??
            m.volume24h_usd;
        const liquidity = m.liquidity ?? m.tvl ?? m.poolSize;
        let tokens = m.tokens;
        if (!tokens && (m.yesPrice !== undefined || m.noPrice !== undefined)) {
            const yesPrice = m.yesPrice !== undefined
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
    normalizeProbability(price) {
        if (price === undefined || price === null || Number.isNaN(price)) {
            return 0.5;
        }
        return Math.min(1, Math.max(0, price));
    }
};
exports.PolymarketService = PolymarketService;
exports.PolymarketService = PolymarketService = PolymarketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PolymarketService);
//# sourceMappingURL=polymarket.service.js.map