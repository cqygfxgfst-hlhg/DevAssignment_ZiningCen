import { TrendService } from './trend.service';
import { NormalizedMarket } from './dto/market.dto';

describe('TrendService', () => {
  let service: TrendService;

  beforeEach(() => {
    service = new TrendService();
  });

  const baseMarket: NormalizedMarket = {
    platform: 'Polymarket',
    id: 'm1',
    question: 'Q1',
    probability: 0.5,
    volume: 0,
    volume24h: 0,
    liquidity: 0,
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  it('gives higher score to more active markets (volume/liquidity)', () => {
    const low = { ...baseMarket, id: 'low', volume24h: 10, liquidity: 100 };
    const mid = { ...baseMarket, id: 'mid', volume24h: 5_000, liquidity: 10_000 };
    const high = { ...baseMarket, id: 'high', volume24h: 10_000, liquidity: 50_000 };

    const ranked = service.rank([low, mid, high], 3);
    const scores = Object.fromEntries(
      ranked.map((m) => [m.id, m.trendScore ?? 0]),
    );

    expect(scores.high).toBeGreaterThan(scores.mid);
    expect(scores.mid).toBeGreaterThan(scores.low);
  });

  it('rewards fresher and closing-soon markets', () => {
    const oldCreated = {
      ...baseMarket,
      id: 'old',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const freshClosing = {
      ...baseMarket,
      id: 'fresh',
      createdAt: new Date().toISOString(),
      endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6h
    };

    const ranked = service.rank([oldCreated, freshClosing], 2);
    const scores = Object.fromEntries(
      ranked.map((m) => [m.id, m.trendScore ?? 0]),
    );

    expect(scores.fresh).toBeGreaterThan(scores.old);
  });

  it('rewards uncertainty around 50%', () => {
    const near50 = { ...baseMarket, id: 'u1', probability: 0.5 };
    const farAway = { ...baseMarket, id: 'u2', probability: 0.95 };

    const [sNear, sFar] = service
      .rank([near50, farAway], 2)
      .map((m) => m.trendScore ?? 0);

    expect(sNear).toBeGreaterThan(sFar);
  });

  it('penalizes already ended markets', () => {
    const past = {
      ...baseMarket,
      id: 'past',
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // ended yesterday
    };
    const future = {
      ...baseMarket,
      id: 'future',
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // ends tomorrow
    };

    const ranked = service.rank([past, future], 2);
    const scores = Object.fromEntries(
      ranked.map((m) => [m.id, m.trendScore ?? 0]),
    );

    expect(scores.future).toBeGreaterThan(scores.past);
  });
});

