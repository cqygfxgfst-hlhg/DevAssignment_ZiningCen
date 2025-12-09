import { Injectable } from '@nestjs/common';
import { NormalizedMarket } from './dto/market.dto';

@Injectable()
export class TrendService {
  score(market: NormalizedMarket): number {
    const activity = this.activityScore(market);
    const freshness = this.freshnessScore(market);
    const closing = this.closingSoonScore(market);
    const uncertainty = this.uncertaintyScore(market);

    return Number(
      (
        0.4 * activity +
        0.25 * freshness +
        0.25 * closing +
        0.1 * uncertainty
      ).toFixed(4),
    );
  }

  rank(markets: NormalizedMarket[], limit = 20): NormalizedMarket[] {
    return markets
      .map((m) => ({ ...m, trendScore: this.score(m) }))
      .sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))
      .slice(0, limit);
  }

  private activityScore(m: NormalizedMarket): number {
    const vol = m.volume24h ?? m.volume ?? 0;
    const liq = m.liquidity ?? 0;
    const base = Math.log10(vol + 1) / 4; // scale roughly into 0-1
    const liqBoost = Math.log10(liq + 1) / 5;
    return this.clamp(base + liqBoost);
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

