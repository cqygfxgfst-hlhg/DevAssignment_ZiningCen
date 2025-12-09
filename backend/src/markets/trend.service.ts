import { Injectable } from '@nestjs/common';
import { NormalizedMarket } from './dto/market.dto';

@Injectable()
export class TrendService {
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

  rank(markets: NormalizedMarket[], limit = 20): NormalizedMarket[] {
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

    return scored
      .sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))
      .slice(0, limit)
      .map(({ _activityRaw, _activity, ...rest }) => rest);
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
}

