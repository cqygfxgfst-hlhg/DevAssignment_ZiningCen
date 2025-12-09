"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendService = void 0;
const common_1 = require("@nestjs/common");
let TrendService = class TrendService {
    score(market) {
        const activity = this.activityScore(market);
        const freshness = this.freshnessScore(market);
        const closing = this.closingSoonScore(market);
        const uncertainty = this.uncertaintyScore(market);
        return Number((0.4 * activity +
            0.25 * freshness +
            0.25 * closing +
            0.1 * uncertainty).toFixed(4));
    }
    rank(markets, limit = 20) {
        return markets
            .map((m) => ({ ...m, trendScore: this.score(m) }))
            .sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))
            .slice(0, limit);
    }
    activityScore(m) {
        const vol = m.volume24h ?? m.volume ?? 0;
        const liq = m.liquidity ?? 0;
        const base = Math.log10(vol + 1) / 4;
        const liqBoost = Math.log10(liq + 1) / 5;
        return this.clamp(base + liqBoost);
    }
    freshnessScore(m) {
        if (!m.createdAt)
            return 0.3;
        const days = (Date.now() - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (Number.isNaN(days))
            return 0.3;
        return this.clamp(1 - Math.min(days / 14, 1));
    }
    closingSoonScore(m) {
        if (!m.endDate)
            return 0.2;
        const daysToEnd = (new Date(m.endDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24);
        if (Number.isNaN(daysToEnd))
            return 0.2;
        if (daysToEnd < 0)
            return 0.05;
        return this.clamp(1 - Math.min(daysToEnd / 7, 1));
    }
    uncertaintyScore(m) {
        const p = m.probability ?? 0.5;
        return 1 - Math.abs(p - 0.5) * 2;
    }
    clamp(value) {
        if (Number.isNaN(value))
            return 0;
        return Math.min(1, Math.max(0, value));
    }
};
exports.TrendService = TrendService;
exports.TrendService = TrendService = __decorate([
    (0, common_1.Injectable)()
], TrendService);
//# sourceMappingURL=trend.service.js.map