export type Platform = 'Polymarket' | 'Kalshi';

export interface NormalizedMarket {
  platform: Platform;
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
}

export interface UserPreferences {
  categories?: string[];
  platformWeights?: Record<string, number>;
  timeHorizon?: 'short' | 'medium' | 'long';
  volatility?: 'high' | 'low';
}
