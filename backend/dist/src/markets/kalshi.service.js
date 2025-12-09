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
        'https://api.kalshi.com/v1,https://api.elections.kalshi.com/v1')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    authHeader = process.env.KALSHI_AUTH_HEADER;
    constructor(http) {
        this.http = http;
    }
    async fetchMarkets(limit = 100) {
        for (const baseUrl of this.baseUrls) {
            const url = `${baseUrl}/markets?status=active&limit=${limit}`;
            try {
                const response = await (0, rxjs_1.lastValueFrom)(this.http.get(url, {
                    headers: this.authHeader ? { Authorization: this.authHeader } : {},
                }));
                const markets = response.data?.markets ?? [];
                this.logger.log(`Kalshi fetched ${markets.length} markets from ${baseUrl}`);
                return markets.map((m) => this.toNormalized(m));
            }
            catch (err) {
                this.logger.warn(`Kalshi endpoint failed (${baseUrl}), trying next or falling back`, err);
            }
        }
        this.logger.warn('Kalshi API unavailable, falling back to mock sample');
        return this.mockMarkets();
    }
    toNormalized(market) {
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
    clamp(value) {
        if (Number.isNaN(value)) {
            return 0.5;
        }
        return Math.min(1, Math.max(0, value));
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