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
        const activity = market._activity ?? 0;
        const freshness = this.freshnessScore(market);
        const closing = this.closingSoonScore(market);
        const uncertainty = this.uncertaintyScore(market);
        const stretched = 0.5 * this.clamp(activity) +
            0.2 * Math.sqrt(this.clamp(freshness)) +
            0.2 * Math.sqrt(this.clamp(closing)) +
            0.1 * Math.sqrt(this.clamp(uncertainty));
        return Number(this.clamp(stretched).toFixed(4));
    }
    rank(markets, limit = 20) {
        if (markets.length === 0)
            return [];
        const withActivity = markets.map((m) => ({
            ...m,
            _activityRaw: this.activityRaw(m),
        }));
        const mean = withActivity.reduce((acc, m) => acc + (m._activityRaw ?? 0), 0) /
            withActivity.length;
        const variance = withActivity.reduce((acc, m) => {
            const v = (m._activityRaw ?? 0) - mean;
            return acc + v * v;
        }, 0) / withActivity.length;
        const std = Math.sqrt(variance) || 1e-6;
        const scored = withActivity.map((m) => {
            const z = ((m._activityRaw ?? 0) - mean) / std;
            const aNorm = 1 / (1 + Math.exp(-z));
            const trendScore = this.score({ ...m, _activity: aNorm });
            return { ...m, trendScore };
        });
        const sorted = scored.sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0));
        const minKalshi = Math.min(Number(process.env.MIN_KALSHI_IN_TREND ?? 3) || 3, limit);
        const kalshiSorted = sorted.filter((m) => m.platform === 'Kalshi');
        const nonKalshiSorted = sorted.filter((m) => m.platform !== 'Kalshi');
        const result = [];
        const pickedIds = new Set();
        for (const m of nonKalshiSorted) {
            if (result.length >= Math.max(0, limit - minKalshi))
                break;
            if (pickedIds.has(m.id))
                continue;
            pickedIds.add(m.id);
            result.push(m);
        }
        for (const m of kalshiSorted) {
            if (result.length >= limit)
                break;
            if (pickedIds.has(m.id))
                continue;
            pickedIds.add(m.id);
            result.push(m);
            if (result.length >= limit)
                break;
            if (result.length >= limit - (kalshiSorted.length - result.filter((x) => x.platform === 'Kalshi').length))
                break;
        }
        if (result.length < limit) {
            for (const m of nonKalshiSorted) {
                if (result.length >= limit)
                    break;
                if (pickedIds.has(m.id))
                    continue;
                pickedIds.add(m.id);
                result.push(m);
            }
            if (result.length < limit) {
                for (const m of kalshiSorted) {
                    if (result.length >= limit)
                        break;
                    if (pickedIds.has(m.id))
                        continue;
                    pickedIds.add(m.id);
                    result.push(m);
                }
            }
        }
        return result.map(({ _activityRaw, _activity, ...rest }) => rest);
    }
    activityRaw(m) {
        const vol = Number(m.volume24h ?? m.volume ?? 0);
        const liq = Number(m.liquidity ?? 0);
        const aVol = Math.log10(Math.max(vol, 0) + 1);
        const aLiq = Math.log10(Math.max(liq, 0) + 1);
        return 0.6 * aVol + 0.4 * aLiq;
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