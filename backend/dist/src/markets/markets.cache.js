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
var MarketsCache_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketsCache = void 0;
const common_1 = require("@nestjs/common");
let MarketsCache = MarketsCache_1 = class MarketsCache {
    redis;
    logger = new common_1.Logger(MarketsCache_1.name);
    ttlSeconds = Number(process.env.TREND_CACHE_TTL_SEC ?? 60);
    constructor(redis) {
        this.redis = redis;
    }
    key(platform, limit) {
        return `trending:${platform ?? 'all'}:${limit ?? 'default'}`;
    }
    async get(platform, limit) {
        try {
            const val = await this.redis.get(this.key(platform, limit));
            if (!val)
                return null;
            return JSON.parse(val);
        }
        catch (err) {
            this.logger.warn(`Redis get failed for platform=${platform} limit=${limit}: ${err instanceof Error ? err.message : err}`);
            return null;
        }
    }
    async set(platform, limit, data) {
        try {
            await this.redis.set(this.key(platform, limit), JSON.stringify(data), {
                EX: this.ttlSeconds,
            });
        }
        catch (err) {
            this.logger.warn(`Redis set failed for platform=${platform} limit=${limit}: ${err instanceof Error ? err.message : err}`);
        }
    }
};
exports.MarketsCache = MarketsCache;
exports.MarketsCache = MarketsCache = MarketsCache_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object])
], MarketsCache);
//# sourceMappingURL=markets.cache.js.map