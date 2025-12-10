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
var KalshiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KalshiService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let KalshiService = KalshiService_1 = class KalshiService {
    http;
    logger = new common_1.Logger(KalshiService_1.name);
    baseUrls = (process.env.KALSHI_BASE_URL ??
        'https://api.elections.kalshi.com/trade-api/v2,https://api.kalshi.com/trade-api/v2')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    authHeader = process.env.KALSHI_AUTH_HEADER;
    constructor(http) {
        this.http = http;
    }
    async fetchMarkets(limit = 300) {
        for (const baseUrl of this.baseUrls) {
            const url = this.buildMarketsUrl(baseUrl, limit);
            try {
                const response = await (0, rxjs_1.lastValueFrom)(this.http.get(url, {
                    headers: this.authHeader ? { Authorization: this.authHeader } : {},
                    validateStatus: () => true,
                }));
                if (response.status >= 400) {
                    this.logger.warn(`Kalshi HTTP ${response.status} from ${baseUrl}`);
                    continue;
                }
                const markets = response.data?.markets ?? [];
                this.logger.log(`Kalshi fetched ${markets.length} markets from ${baseUrl}`);
                const filtered = this.filterRecent(markets);
                this.logger.log(`Filtered to ${filtered.length} valid markets`);
                const normalized = filtered.map((m) => this.toNormalized(m));
                this.logSample(normalized);
                return normalized;
            }
            catch (err) {
                this.logger.warn(`Kalshi endpoint failed (${baseUrl}), trying next or falling back`, err instanceof Error ? err.message : err);
            }
        }
        this.logger.warn('Kalshi API unavailable, falling back to mock sample');
        return this.mockMarkets();
    }
    buildMarketsUrl(base, limit) {
        const trimmed = base.replace(/\/+$/, '');
        const root = trimmed.endsWith('/markets')
            ? trimmed
            : `${trimmed}/markets`;
        const hasQuery = root.includes('?');
        const params = new URLSearchParams({
            limit: `${Math.min(Math.max(limit, 1), 1000)}`,
            status: 'open',
            mve_filter: 'exclude',
        });
        return `${root}${hasQuery ? '&' : '?'}${params.toString()}`;
    }
    toNormalized(market) {
        const probability = this.deriveProbability(market);
        return {
            platform: 'Kalshi',
            id: market.id ?? market.ticker ?? market.title,
            question: market.title ?? '',
            probability,
            volume: market.volume,
            volume24h: market.volume_24h ?? market.day_volume,
            liquidity: market.liquidity ??
                this.parseNumber(market.liquidity_dollars),
            createdAt: market.created_time ?? market.open_time,
            endDate: market.close_time ?? market.expiration_time ?? market.latest_expiration_time,
            category: market.category ? [market.category] : undefined,
            url: market.ticker
                ? `https://kalshi.com/markets/${market.ticker}`
                : undefined,
            lastUpdated: new Date().toISOString(),
        };
    }
    deriveProbability(market) {
        const priceSources = [
            market.last_price ?? this.parseNumber(market.last_price_dollars),
            market.yes_bid ?? this.parseNumber(market.yes_bid_dollars),
            market.yes_ask ?? this.parseNumber(market.yes_ask_dollars),
            market.previous_price ?? this.parseNumber(market.previous_price_dollars),
        ];
        for (const p of priceSources) {
            const normalized = this.toUnitPrice(p);
            if (normalized !== undefined)
                return normalized;
        }
        return 0.5;
    }
    filterRecent(data) {
        const now = Date.now();
        const createdDays = Number(process.env.MARKET_CREATED_WINDOW_DAYS ?? 365) || 365;
        const createdWindowAgo = now - createdDays * 24 * 60 * 60 * 1000;
        return data.filter((m) => {
            if (!m.title || (!m.id && !m.ticker))
                return false;
            const end = m.close_time ?? m.expiration_time ?? m.latest_expiration_time;
            const created = m.created_time ?? m.open_time;
            const endTs = end ? Date.parse(end) : undefined;
            const createdTs = created ? Date.parse(created) : undefined;
            const hasValidEnd = endTs !== undefined && !Number.isNaN(endTs);
            const hasValidCreated = createdTs !== undefined && !Number.isNaN(createdTs);
            if (hasValidEnd)
                return true;
            if (hasValidCreated)
                return createdTs >= createdWindowAgo;
            return true;
        });
    }
    toUnitPrice(value) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            return undefined;
        }
        const raw = Number(value);
        if (Number.isNaN(raw))
            return undefined;
        const price = raw > 1 ? raw / 100 : raw;
        return Math.min(1, Math.max(0, price));
    }
    parseNumber(value) {
        if (value === undefined || value === null)
            return undefined;
        const parsed = typeof value === 'string' ? Number(value) : value;
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    logSample(markets) {
        if (process.env.KALSHI_LOG_SAMPLES !== 'true')
            return;
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
    mockMarkets() {
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
};
exports.KalshiService = KalshiService;
exports.KalshiService = KalshiService = KalshiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], KalshiService);
//# sourceMappingURL=kalshi.service.js.map