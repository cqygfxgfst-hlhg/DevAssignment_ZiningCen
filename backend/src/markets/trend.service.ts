import { Injectable, Logger } from '@nestjs/common';
import { NormalizedMarket, UserPreferences } from './dto/market.dto';

@Injectable()
export class TrendService {
  private readonly logger = new Logger(TrendService.name);

  score(market: NormalizedMarket): number {
    // 活跃度用批内 z-score + sigmoid 放大区分度
    const activity = market._activity ?? 0; // 占位，后续 rank() 会填充
    const freshness = this.freshnessScore(market);
    const closing = this.closingSoonScore(market);
    const uncertainty = this.uncertaintyScore(market);

    const stretched =
      0.5 * this.clamp(activity) +
      0.2 * Math.sqrt(this.clamp(freshness)) +
      0.2 * Math.sqrt(this.clamp(closing)) +
      0.1 * Math.sqrt(this.clamp(uncertainty));

    return Number(this.clamp(stretched).toFixed(4));
  }

  rank(
    markets: NormalizedMarket[],
    limit = 20,
    preferences?: UserPreferences,
  ): NormalizedMarket[] {
    if (markets.length === 0) return [];

    // 预计算活跃度原始分
    const withActivity = markets.map((m) => ({
      ...m,
      _activityRaw: this.activityRaw(m),
    }));

    // 计算批内均值/方差用于 z-score
    const mean =
      withActivity.reduce((acc, m) => acc + (m._activityRaw ?? 0), 0) /
      withActivity.length;
    const variance =
      withActivity.reduce((acc, m) => {
        const v = (m._activityRaw ?? 0) - mean;
        return acc + v * v;
      }, 0) / withActivity.length;
    const std = Math.sqrt(variance) || 1e-6;

    // 将活跃度做 z-score 再经 sigmoid 压到 0-1
    const scored = withActivity.map((m) => {
      const z = ((m._activityRaw ?? 0) - mean) / std;
      const aNorm = 1 / (1 + Math.exp(-z));
      const trendScore = this.score({ ...m, _activity: aNorm });
      return { ...m, trendScore };
    });

    // 个性化重排序：如果传入了偏好，则调整分数
    let finalScored = scored;
    if (preferences) {
      this.logger.log(`Applying preferences: ${JSON.stringify(preferences)}`);
      finalScored = scored.map((m) => {
        const boost = this.calculateUserBoost(m, preferences);
        // 放大倍数，避免改变基础分太小 (min 0.1 避免负分)
        const multiplier = Math.max(0.1, 1 + boost);
        // if (boost > 0) {
        //   this.logger.log(`Boosted ${m.id} by ${boost} -> ${m.trendScore}*${multiplier}`);
        // }
        return {
          ...m,
          trendScore: (m.trendScore ?? 0) * multiplier,
        };
      });
    }

    const sorted = finalScored.sort(
      (a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0),
    );

    // 多平台曝光：保证有 Kalshi，但放到列表尾部。
    const minKalshi = Math.min(
      Number(process.env.MIN_KALSHI_IN_TREND ?? 3) || 3,
      limit,
    );
    const kalshiSorted = sorted.filter((m) => m.platform === 'Kalshi');
    const nonKalshiSorted = sorted.filter((m) => m.platform !== 'Kalshi');

    const result: typeof scored = [];
    const pickedIds = new Set<string>();

    // 先放非 Kalshi，预留至少 minKalshi 个位置
    for (const m of nonKalshiSorted) {
      if (result.length >= Math.max(0, limit - minKalshi)) break;
      if (pickedIds.has(m.id)) continue;
      pickedIds.add(m.id);
      result.push(m);
    }

    // 追加 Kalshi，尽量保证 minKalshi（如有），位置靠后
    for (const m of kalshiSorted) {
      if (result.length >= limit) break;
      if (pickedIds.has(m.id)) continue;
      pickedIds.add(m.id);
      result.push(m);
      if (result.length >= limit) break;
      if (result.length >= limit - (kalshiSorted.length - result.filter((x) => x.platform === 'Kalshi').length)) break;
    }

    // 若 Kalshi 不足或仍有空位，再用剩余非 Kalshi 补足
    if (result.length < limit) {
      for (const m of nonKalshiSorted) {
        if (result.length >= limit) break;
        if (pickedIds.has(m.id)) continue;
        pickedIds.add(m.id);
        result.push(m);
      }
      if (result.length < limit) {
        for (const m of kalshiSorted) {
          if (result.length >= limit) break;
          if (pickedIds.has(m.id)) continue;
          pickedIds.add(m.id);
          result.push(m);
        }
      }
    }

    return result.map(({ _activityRaw, _activity, ...rest }) => rest);
  }

  private activityRaw(m: NormalizedMarket): number {
    const vol = Number(m.volume24h ?? m.volume ?? 0);
    const liq = Number(m.liquidity ?? 0);
    const aVol = Math.log10(Math.max(vol, 0) + 1);
    const aLiq = Math.log10(Math.max(liq, 0) + 1);
    // 原始活跃度不做归一化，后续 z-score
    return 0.6 * aVol + 0.4 * aLiq;
  }

  private freshnessScore(m: NormalizedMarket): number {
    if (!m.createdAt) return 0.3; // fallback
    const days =
      (Date.now() - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (Number.isNaN(days)) return 0.3;
    // Newer markets score higher; decay after 14 days
    return this.clamp(1 - Math.min(days / 14, 1));
  }

  private closingSoonScore(m: NormalizedMarket): number {
    if (!m.endDate) return 0.2;
    const daysToEnd =
      (new Date(m.endDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    if (Number.isNaN(daysToEnd)) return 0.2;
    if (daysToEnd < 0) return 0.05; // already closed/overdue
    // Markets closing within a week get higher attention
    return this.clamp(1 - Math.min(daysToEnd / 7, 1));
  }

  private uncertaintyScore(m: NormalizedMarket): number {
    const p = m.probability ?? 0.5;
    // Markets near 50% are often more contentious / interesting.
    return 1 - Math.abs(p - 0.5) * 2;
  }

  private clamp(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.min(1, Math.max(0, value));
  }

  private calculateUserBoost(
    m: NormalizedMarket,
    prefs: UserPreferences,
  ): number {
    let boost = 0;

    // 1. Category Preference
    if (prefs.categories && prefs.categories.length > 0 && m.category) {
      const match = m.category.some((c) =>
        prefs.categories!.some((pc) =>
          c.toLowerCase().includes(pc.toLowerCase()),
        ),
      );
      if (match) boost += 0.5;
    }

    // 2. Platform Weights
    if (prefs.platformWeights) {
      const w = prefs.platformWeights[m.platform];
      if (w !== undefined) {
        boost += w - 1; // e.g. 1.2 -> +0.2, 0.8 -> -0.2
      }
    }

    // 3. Time Horizon
    if (prefs.timeHorizon && m.endDate) {
      const now = Date.now();
      const end = new Date(m.endDate).getTime();
      const days = (end - now) / (1000 * 60 * 60 * 24);

      if (!Number.isNaN(days)) {
        if (prefs.timeHorizon === 'short' && days <= 7) boost += 0.3;
        else if (
          prefs.timeHorizon === 'medium' &&
          days > 7 &&
          days <= 30
        )
          boost += 0.3;
        else if (prefs.timeHorizon === 'long' && days > 30) boost += 0.3;
      }
    }

    // 4. Volatility
    if (prefs.volatility) {
      const p = m.probability;
      const dist = Math.abs(p - 0.5);
      // High volatility/uncertainty: price near 0.5
      if (prefs.volatility === 'high' && dist <= 0.2) boost += 0.3;
      // Low volatility/stability: price near 0 or 1
      if (prefs.volatility === 'low' && dist >= 0.35) boost += 0.3;
    }

    // 限制最大 boost，防止过度干预
    return Math.min(boost, 3.0);
  }
}

