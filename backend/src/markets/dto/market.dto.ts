import { ApiProperty } from '@nestjs/swagger';

export type SupportedPlatform = 'Polymarket' | 'Kalshi';

export class NormalizedMarket {
  @ApiProperty({ enum: ['Polymarket', 'Kalshi'], description: 'Source platform' })
  platform: SupportedPlatform;

  @ApiProperty({ description: 'Unique market identifier' })
  id: string;

  @ApiProperty({ description: 'Question title' })
  question: string;

  @ApiProperty({ description: 'Current probability (0-1)', example: 0.65 })
  probability: number;

  @ApiProperty({ description: 'Total volume (USD)', required: false })
  volume?: number;

  @ApiProperty({ description: '24h volume (USD)', required: false })
  volume24h?: number;

  @ApiProperty({ description: 'Liquidity depth (USD)', required: false })
  liquidity?: number;

  @ApiProperty({ description: 'Created at (ISO 8601)', required: false })
  createdAt?: string;

  @ApiProperty({ description: 'End time (ISO 8601)', required: false })
  endDate?: string;

  @ApiProperty({ description: 'Category tags', required: false, type: [String] })
  category?: string[];

  @ApiProperty({ description: 'Market URL', required: false })
  url?: string;

  @ApiProperty({ description: 'Last updated', required: false })
  lastUpdated?: string;

  @ApiProperty({ description: 'Trend score', required: false })
  trendScore?: number;

  // internal fields for scoring (not exposed)
  _activity?: number;
  _activityRaw?: number;
}

export class UserPreferences {
  @ApiProperty({
    description: "Preferred categories, e.g. 'Politics', 'Crypto', 'Sports'",
    required: false,
    type: [String],
  })
  categories?: string[];

  @ApiProperty({
    description: 'Platform weights, e.g. { Polymarket: 1.5, Kalshi: 1.0 }',
    required: false,
  })
  platformWeights?: Record<string, number>;

  @ApiProperty({
    description: 'Time horizon: short (<7d), medium (<30d), long (>30d)',
    required: false,
    enum: ['short', 'medium', 'long'],
  })
  timeHorizon?: 'short' | 'medium' | 'long';

  @ApiProperty({
    description: 'Volatility preference: high (uncertainty), low (stability)',
    required: false,
    enum: ['high', 'low'],
  })
  volatility?: 'high' | 'low';
}

export class TrendOptions {
  @ApiProperty({ description: 'Limit number of results', default: 20, required: false })
  limit?: number;

  @ApiProperty({
    enum: ['Polymarket', 'Kalshi'],
    required: false,
    description: 'Specify platform',
  })
  platform?: SupportedPlatform;

  @ApiProperty({
    description: 'Filter markets ending within given hours',
    required: false,
  })
  endWithinHours?: string;

  @ApiProperty({
    description: 'Filter markets created within given hours',
    required: false,
  })
  createdWithinHours?: string;

  @ApiProperty({ description: 'Enable personalized ranking', required: false })
  personalized?: boolean;

  @ApiProperty({ type: UserPreferences, required: false })
  preferences?: UserPreferences;
}
