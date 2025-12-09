"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketsModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const markets_controller_1 = require("./markets.controller");
const polymarket_service_1 = require("./polymarket.service");
const kalshi_service_1 = require("./kalshi.service");
const trend_service_1 = require("./trend.service");
const redis_module_1 = require("../redis/redis.module");
const markets_cache_1 = require("./markets.cache");
const prisma_service_1 = require("../prisma.service");
const snapshot_service_1 = require("./snapshot.service");
let MarketsModule = class MarketsModule {
};
exports.MarketsModule = MarketsModule;
exports.MarketsModule = MarketsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 3,
            }),
        ],
        controllers: [markets_controller_1.MarketsController],
        providers: [
            prisma_service_1.PrismaService,
            snapshot_service_1.SnapshotService,
            polymarket_service_1.PolymarketService,
            kalshi_service_1.KalshiService,
            trend_service_1.TrendService,
            markets_cache_1.MarketsCache,
        ],
        exports: [polymarket_service_1.PolymarketService, kalshi_service_1.KalshiService, trend_service_1.TrendService, markets_cache_1.MarketsCache],
    })
], MarketsModule);
//# sourceMappingURL=markets.module.js.map