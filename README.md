# Dev Assignment 🚀

## 0.Project Demo

##### **Demo & Links**

- **Video Demo (YouTube)**: https://youtu.be/YgBLT9qbeGY
- **Live Frontend (Vercel)**: https://devassignmentziningcen.vercel.app/
- **API Document**: https://dev-assignment-zining-9da0b7876044.herokuapp.com/api

These links allow reviewers to quickly understand the product flow and core interactions.

##### **Feature Overview**

The application aggregates prediction-market data across platforms, computes a unified trend score, and presents a clean, responsive interface for browsing markets. It also includes lightweight personalization that adjusts market rankings based on user-selected interests.

##### Known Issues

There are two current limitations: some Kalshi event links may incorrectly route to a 404 due to inconsistent slugs, and the personalization effect is subtle because the current weighting logic is static and not deeply tuned. These will be improved in future iterations.

## 1. Project Overview
Sharp is a high-performance aggregation service designed to unify the fragmented prediction market landscape. It ingests real-time data from major platforms like **Polymarket** and **Kalshi**, normalizing disparate schemas into a single, queryable model.

Instead of just listing markets, Sharp implements a **Trend Scoring Algorithm** to surface high-velocity opportunities. It features a robust multi-source aggregation pipeline that handles data normalization and conflict resolution, serving as a reliable backend for trading dashboards or analytical tools. A lightweight personalization layer is also included to demonstrate ranking capabilities based on user preferences.

**Key Value Proposition:**

*   **Unified Schema**: One API to query multiple prediction markets.
*   **Smart Ranking**: Dynamic `trendScore` calculation based on volume, liquidity, and velocity.
*   **Performance**: Optimized with multi-layer caching strategies.
*   **Personalization**: Tailored feeds filtering noise based on user intent.

## 2. API Documentation

#### 2.1**Swagger UI** (recommended for reviewers):  

Once the backend is running, open:  `http://localhost:3001/api`  This provides an interactive OpenAPI (Swagger) UI for exploring the `GET /markets/trending` endpoint, query parameters, and response schemas.



#### 2.2

#### App

##### `GET /`

Health check or basic service information.

------

#### Markets

##### `GET /markets/trending`

**Retrieve trending market insights**

Fetches aggregated market data from platforms such as **Polymarket** and **Kalshi**, supporting heat-based ranking, time-range filtering, and optional personalization.

##### **Query Parameters**

| Name                 | Type                      | Description                                                  |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| `endWithinHours`     | string                    | Filters markets that will end within the specified number of hours (e.g., `24` means markets ending within the next 24 hours). |
| `createdWithinHours` | string                    | Filters markets created within the specified number of hours (e.g., `48` means markets created in the past 48 hours). |
| `personalized`       | string (`true` / `false`) | Enables personalized ranking if set to `true`.               |
| `personalized`   | string (`true` / `false`) | Whether to enable personalized ranking.                      | `true`, `false`           |
| `prefCategory`   | string                    | Personalized preference: categories of interest, comma-separated. Example: `Politics,Crypto`. | Any comma-separated list  |
| `prefPlatform`   | string                    | Personalized platform weight mapping. Example: `Polymarket:1.5,Kalshi:0.8`. | Platform:weight map       |
| `prefHorizon`    | string                    | Personalized time-horizon preference.                        | `short`, `medium`, `long` |
| `prefVolatility` | string                    | Personalized volatility preference.                          | `high`, `low`             |
| `limit`          | string                    | Max number of results to return. Default: `20`.              | Any integer               |
| `platform`       | string                    | Restrict results to a specific data provider. If omitted, aggregates all platforms. | `Polymarket`, `Kalshi`    |

##### This intentionally highlights:

- Cross-platform normalization (same shape regardless of provider).
- Presence of `trendScore` to explain ordering.
- Inclusion of liquidity/volume metadata for downstream analytics.

##### Example Response

​	Example payload from 

`GET /markets/trending?limit=2&personalized=false&createdWithinHours=144&endWithinHours=5`:

```json
[
    {
        "platform": "Polymarket",
        "id": "bitcoin-up-or-down-december-10-5pm-et",
        "question": "Bitcoin Up or Down - December 10, 5PM ET",
        "probability": 0.5,
        "volume": "4638.999097",
        "liquidity": "1492.4789",
        "createdAt": "2025-12-08T22:56:36.280088Z",
        "endDate": "2025-12-10T23:00:00Z",
        "url": "https://polymarket.com/event/bitcoin-up-or-down-december-10-5pm-et/bitcoin-up-or-down-december-10-5pm-et",
        "lastUpdated": "2025-12-10T22:10:15.746Z",
        "trendScore": 0.8362
    },
    {
        "platform": "Polymarket",
        "id": "ethereum-up-or-down-december-10-8pm-et",
        "question": "Ethereum Up or Down - December 10, 8PM ET",
        "probability": 0.5,
        "volume": "788.421564",
        "liquidity": "14530.6486",
        "createdAt": "2025-12-09T01:01:11.350859Z",
        "endDate": "2025-12-11T02:00:00Z",
        "url": "https://polymarket.com/event/ethereum-up-or-down-december-10-8pm-et/ethereum-up-or-down-december-10-8pm-et",
        "lastUpdated": "2025-12-10T22:10:15.746Z",
        "trendScore": 0.8271
    }
]
```



## 3. Technical Design Summary

### 3.1 Trend Logic Explanation
The trend scoring logic lives in the `TrendService` and is designed to be:
- **Batch-relative**: Every request recomputes a batch-level activity z-score, so ranking is robust across markets with different absolute scales.
- **Multi-factor**: Combines **24h volume**, **liquidity depth**, **recency** and **time-to-close** plus **uncertainty** (how close probability is to 50%).

High-level formula (omitting normalization details for brevity):

```text
activity_raw  = 0.6 * log10(volume24h + 1) + 0.4 * log10(liquidity + 1)
activity_norm = sigmoid(z_score(activity_raw within batch))

trendScore ≈ 0.5 * activity_norm
           + 0.2 * sqrt(freshness_score)      // newer markets get a boost
           + 0.2 * sqrt(closing_soon_score)   // markets closing soon get attention
           + 0.1 * sqrt(uncertainty_score)    // markets near 50% are more interesting
```

When `UserPreferences` are provided, a small multiplicative **boost factor** is applied to `trendScore` based on:
- Category matches (e.g. Crypto / Politics).
- Platform weights (per-provider multipliers).
- Time horizon alignment (short / medium / long).
- Volatility preference (high-uncertainty vs. stable odds).

The boost is capped to keep the ranking stable and explainable.

### 3.2 Caching Strategy
- The trending endpoint uses a **Redis-backed cache** in `MarketsCache`, with keys derived from `(platform, limit, endWithinHours, createdWithinHours)`.
- On non-personalized requests:
  - The service first checks Redis; if a value exists, it returns the cached normalized markets.
  - On cache miss, it fetches from upstream providers, runs the ranking pipeline, and stores the result with a TTL (`TREND_CACHE_TTL_SEC`, default ~60s).
- Personalized requests **bypass cache** to avoid mixing user-specific preferences into global cached entries.

This provides a simple, predictable cache-aside pattern that protects upstream APIs while keeping the implementation small and easy to reason about.

### 3.3 Fallback & Resilience
- **Per-provider fallback**:
  - Polymarket: tries multiple endpoints (`hot markets`, `events`, then generic `markets`) and gracefully degrades to the next source if one fails.
  - Kalshi: iterates across configured base URLs and falls back to a small in-memory mock dataset if all endpoints fail (useful for local dev and demo).
- **Partial failures**:
  - If one provider is completely unavailable, aggregation still returns markets from the other provider so the API remains usable.
- **Error handling**:
  - All external calls run through centralized logging and non-fatal error handling to avoid crashing the main request path.



## 4. Tests

- Backend includes unit tests around the **trend scoring logic** (`TrendService`) to validate that:
  - More active markets receive higher scores.
  - Fresher / closing-soon markets are preferred over stale ones.
  - Markets near 50% probability are rewarded for uncertainty.
- Run all backend tests from `backend/` via:

```bash
npm test
```

## 5. Detailed Features

### 5.1 Multi-Platform Market Fetching

- **Polymarket & Kalshi integrations**: Dedicated adapter services fetch active markets, focusing on liquid, high-volume contracts.
- **Parallel I/O**: External API calls are executed in parallel to keep end-to-end latency low even when aggregating hundreds of markets. If one provider is temporarily unavailable or rate-limited, the service continues to return results from the remaining healthy providers.

### 5.2 Unified Market Normalization

- **Single contract model**: All upstream responses are mapped onto a single `NormalizedMarket` shape (platform, question, probability, volume, volume24h, liquidity, createdAt, endDate, category, url).
- **Cross-platform comparability**: Normalization makes it possible to rank and filter markets from different providers in a single list without provider-specific branching in the client.

### 5.3 Trending Ranking Engine

- **Activity-aware scoring**: Markets are scored using a composite of recent volume, liquidity depth, recency and uncertainty, instead of just raw volume.
- **Batch-relative normalization**: Within each batch, an activity score is converted to a z-score and passed through a sigmoid, making the ranking robust to scale differences between small and large datasets.

### 5.4 Lightweight Personalization

- **Preference model**: Optional `UserPreferences` allow callers to hint categories (e.g. Crypto, Politics), platform weights, time horizon and volatility appetite.
- **Score boosting, not rewriting**: Personalization is applied as a small multiplicative boost on top of the base `trendScore`, so the core ranking stays stable and explainable.

### 5.5 Caching & Performance

- **Redis-backed cache**: Aggregated and ranked market lists are cached per-query shape (platform, limit, time filters), drastically reducing load on upstream APIs.
- **API-first design**: The system is optimized as a backend for dashboards and analytical tools, exposing a single, well-documented HTTP endpoint that encapsulates all of the above behavior.





## 6. Next Steps / Functionality

- **Deeper personalization & user profiles**: Persist user preference profiles (categories, risk appetite, horizons) and learn from click/interaction data to evolve from static weights to a learned ranking model.

- **Historical analytics & backtesting**: Store trend snapshots over time to build dashboards for market momentum, strategy backtesting, and model evaluation (e.g., how well did `trendScore` anticipate subsequent volume or price moves).

- **Productization as a data/API platform**: Expose tiered APIs (free/paid) for hedge funds, researchers, and retail apps to consume normalized prediction market data and trend feeds, with SLAs, usage-based billing, and custom integrations.

  

## 7. Run Instructions

### 7.1 Prerequisites

- Node.js **>= 18**
- npm **>= 9**
- A running **PostgreSQL** instance (optional but recommended for snapshot storage).
- A running **Redis** instance for caching.

### 7.2 Backend (NestJS)

From the `backend/` directory:

```bash
npm install
npm run start:dev
```

This starts the NestJS server (default on `http://localhost:3001`).

#### Environment Variables

Create a `.env` file in `backend/` (or export env vars in your shell).

**Minimal required for local dev:**

```bash
DATABASE_URL="postgresql://postgres:123456@localhost:5432/sharp?schema=public"
```

Everything else has sane defaults and is **optional tuning**:

```bash
# Server (optional, defaults to 3001)
PORT=3001

# Redis (optional, defaults to redis://localhost:6379)
REDIS_URL=redis://localhost:6379
TREND_CACHE_TTL_SEC=60

# Polymarket (optional)
POLYMARKET_BASE_URL=https://gamma-api.polymarket.com/markets
POLYMARKET_EVENTS_BASE_URL=https://gamma-api.polymarket.com/events
POLYMARKET_LOG_SAMPLES=false

# Kalshi (optional)
KALSHI_BASE_URL=https://api.elections.kalshi.com/trade-api/v2,https://api.kalshi.com/trade-api/v2
KALSHI_AUTH_HEADER= # optional, e.g. "Bearer <token>"
KALSHI_LOG_SAMPLES=false

# Trending behavior (optional)
MARKET_END_WINDOW_DAYS_PAST=7
MARKET_END_WINDOW_DAYS_FUTURE=14
MARKET_CREATED_WINDOW_DAYS=120
MIN_KALSHI_IN_TREND=3
```

> The service is designed to run with **sensible defaults**, so in the simplest setup you only need `DATABASE_URL`, and can let the rest fall back to defaults.

### 7.3 Frontend (React Dashboard)

From the `frontend/` directory:

```bash
npm install
npm start
```

By default, the frontend expects the backend at `http://localhost:3001`. You can adjust the base URL in the frontend `api.ts` if needed.



