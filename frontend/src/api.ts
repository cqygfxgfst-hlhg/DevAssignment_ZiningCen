import { NormalizedMarket, Platform, UserPreferences } from './types';

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, '') ?? 'http://localhost:3001';

export async function fetchTrendingMarkets(
  platform?: Platform,
  limit = 20,
  endWithinHours?: string,
  createdWithinHours?: string,
  preferences?: UserPreferences,
): Promise<NormalizedMarket[]> {
  const params = new URLSearchParams();
  if (platform) params.set('platform', platform);
  if (limit) params.set('limit', limit.toString());
  if (endWithinHours) params.set('endWithinHours', endWithinHours);
  if (createdWithinHours) params.set('createdWithinHours', createdWithinHours);

  if (preferences) {
    params.set('personalized', 'true');
    if (preferences.categories && preferences.categories.length > 0) {
      params.set('prefCategory', preferences.categories.join(','));
    }
    if (preferences.platformWeights) {
      const parts = Object.entries(preferences.platformWeights)
        .map(([k, v]) => `${k}:${v}`)
        .join(',');
      params.set('prefPlatform', parts);
    }
    if (preferences.timeHorizon) {
      params.set('prefHorizon', preferences.timeHorizon);
    }
    if (preferences.volatility) {
      params.set('prefVolatility', preferences.volatility);
    }
  }

  const res = await fetch(`${API_BASE}/markets/trending?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`获取趋势市场失败，状态码 ${res.status}`);
  }

  const data = (await res.json()) as NormalizedMarket[];
  return data;
}
