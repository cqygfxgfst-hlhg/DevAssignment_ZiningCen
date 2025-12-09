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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MarketsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketsController = void 0;
const common_1 = require("@nestjs/common");
const kalshi_service_1 = require("./kalshi.service");
const polymarket_service_1 = require("./polymarket.service");
const trend_service_1 = require("./trend.service");
const markets_cache_1 = require("./markets.cache");
const snapshot_service_1 = require("./snapshot.service");
let MarketsController = MarketsController_1 = class MarketsController {
    polymarket;
    kalshi;
    trend;
    cache;
    snapshots;
    logger = new common_1.Logger(MarketsController_1.name);
    constructor(polymarket, kalshi, trend, cache, snapshots) {
        this.polymarket = polymarket;
        this.kalshi = kalshi;
        this.trend = trend;
        this.cache = cache;
        this.snapshots = snapshots;
    }
    async getTrending(platform, limit = '20') {
        const parsedLimit = Number(limit) || 20;
        this.logger.log(`GET /markets/trending platform=${platform ?? 'all'} limit=${parsedLimit}`);
        const cached = await this.cache.get(platform, parsedLimit);
        if (cached && cached.length > 0) {
            this.logger.log(`Cache hit for platform=${platform ?? 'all'} limit=${parsedLimit}`);
            return cached;
        }
        const markets = await this.collectMarkets(platform);
        this.logger.log(`Collected ${markets.length} markets`);
        const ranked = this.trend.rank(markets, parsedLimit);
        void this.snapshots.save(ranked);
        await this.cache.set(platform, parsedLimit, ranked);
        return ranked;
    }
    async collectMarkets(platform) {
        if (platform === 'Polymarket') {
            return this.polymarket.fetchMarkets();
        }
        if (platform === 'Kalshi') {
            return this.kalshi.fetchMarkets();
        }
        const [poly, kalshi] = await Promise.all([
            this.polymarket.fetchMarkets(),
            this.kalshi.fetchMarkets(),
        ]);
        return [...poly, ...kalshi];
    }
};
exports.MarketsController = MarketsController;
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('platform')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketsController.prototype, "getTrending", null);
exports.MarketsController = MarketsController = MarketsController_1 = __decorate([
    (0, common_1.Controller)('markets'),
    __metadata("design:paramtypes", [polymarket_service_1.PolymarketService,
        kalshi_service_1.KalshiService,
        trend_service_1.TrendService,
        markets_cache_1.MarketsCache,
        snapshot_service_1.SnapshotService])
], MarketsController);
//# sourceMappingURL=markets.controller.js.map