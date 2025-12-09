export type SupportedPlatform = 'Polymarket' | 'Kalshi';

export interface NormalizedMarket {
  platform: SupportedPlatform;
  id: string;
  question: string;
  probability: number; // 0-1
  volume?: number;
  volume24h?: number;
  liquidity?: number;
  createdAt?: string;
  endDate?: string;
  category?: string[];
  url?: string;
  lastUpdated?: string;
  trendScore?: number;
  // internal fields for scoring (not exposed)
  _activity?: number;
  _activityRaw?: number;
}

export interface TrendOptions {
  limit?: number;
  platform?: SupportedPlatform;
}

