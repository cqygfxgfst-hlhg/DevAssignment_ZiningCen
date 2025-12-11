import { ApiProperty } from '@nestjs/swagger';

export type SupportedPlatform = 'Polymarket' | 'Kalshi';

export class NormalizedMarket {
  @ApiProperty({ enum: ['Polymarket', 'Kalshi'], description: '来源平台' })
  platform: SupportedPlatform;

  @ApiProperty({ description: '市场唯一标识符' })
  id: string;

  @ApiProperty({ description: '预测问题标题' })
  question: string;

  @ApiProperty({ description: '当前概率 (0-1)', example: 0.65 })
  probability: number;

  @ApiProperty({ description: '总交易量 (USD)', required: false })
  volume?: number;

  @ApiProperty({ description: '24小时交易量 (USD)', required: false })
  volume24h?: number;

  @ApiProperty({ description: '流动性深度 (USD)', required: false })
  liquidity?: number;

  @ApiProperty({ description: '创建时间 (ISO 8601)', required: false })
  createdAt?: string;

  @ApiProperty({ description: '结束时间 (ISO 8601)', required: false })
  endDate?: string;

  @ApiProperty({ description: '类别标签', required: false, type: [String] })
  category?: string[];

  @ApiProperty({ description: '市场链接', required: false })
  url?: string;

  @ApiProperty({ description: '最后更新时间', required: false })
  lastUpdated?: string;

  @ApiProperty({ description: '趋势得分', required: false })
  trendScore?: number;

  // internal fields for scoring (not exposed)
  _activity?: number;
  _activityRaw?: number;
}

export class UserPreferences {
  @ApiProperty({
    description: "偏好类别：如 'Politics', 'Crypto', 'Sports'",
    required: false,
    type: [String],
  })
  categories?: string[];

  @ApiProperty({
    description: '平台权重：如 { Polymarket: 1.5, Kalshi: 1.0 }',
    required: false,
  })
  platformWeights?: Record<string, number>;

  @ApiProperty({
    description: '时间偏好：short (<7d), medium (<30d), long (>30d)',
    required: false,
    enum: ['short', 'medium', 'long'],
  })
  timeHorizon?: 'short' | 'medium' | 'long';

  @ApiProperty({
    description: '波动偏好：high (uncertainty), low (stability)',
    required: false,
    enum: ['high', 'low'],
  })
  volatility?: 'high' | 'low';
}

export class TrendOptions {
  @ApiProperty({ description: '限制返回数量', default: 20, required: false })
  limit?: number;

  @ApiProperty({
    enum: ['Polymarket', 'Kalshi'],
    required: false,
    description: '指定平台',
  })
  platform?: SupportedPlatform;

  @ApiProperty({
    description: '过滤在指定小时数内结束的市场',
    required: false,
  })
  endWithinHours?: string;

  @ApiProperty({
    description: '过滤在指定小时数内创建的市场',
    required: false,
  })
  createdWithinHours?: string;

  @ApiProperty({ description: '是否启用个性化排序', required: false })
  personalized?: boolean;

  @ApiProperty({ type: UserPreferences, required: false })
  preferences?: UserPreferences;
}
