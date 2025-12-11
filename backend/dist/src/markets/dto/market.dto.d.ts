export type SupportedPlatform = 'Polymarket' | 'Kalshi';
export declare class NormalizedMarket {
    platform: SupportedPlatform;
    id: string;
    question: string;
    probability: number;
    volume?: number;
    volume24h?: number;
    liquidity?: number;
    createdAt?: string;
    endDate?: string;
    category?: string[];
    url?: string;
    lastUpdated?: string;
    trendScore?: number;
    _activity?: number;
    _activityRaw?: number;
}
export declare class UserPreferences {
    categories?: string[];
    platformWeights?: Record<string, number>;
    timeHorizon?: 'short' | 'medium' | 'long';
    volatility?: 'high' | 'low';
}
export declare class TrendOptions {
    limit?: number;
    platform?: SupportedPlatform;
    endWithinHours?: string;
    createdWithinHours?: string;
    personalized?: boolean;
    preferences?: UserPreferences;
}
