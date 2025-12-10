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

export interface UserPreferences {
  // 偏好类别：如 'Politics', 'Crypto', 'Sports'
  categories?: string[];
  // 平台权重：如 { Polymarket: 1.5, Kalshi: 1.0 }
  platformWeights?: Record<string, number>;
  // 时间偏好：short (<7d), medium (<30d), long (>30d)
  timeHorizon?: 'short' | 'medium' | 'long';
  // 波动偏好：high (uncertainty), low (stability)
  volatility?: 'high' | 'low';
}

export interface TrendOptions {
  limit?: number;
  platform?: SupportedPlatform;
  endWithinHours?: string;
  createdWithinHours?: string;
  personalized?: boolean;
  preferences?: UserPreferences;
}
