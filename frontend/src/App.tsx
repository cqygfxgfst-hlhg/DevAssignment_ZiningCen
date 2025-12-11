import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchTrendingMarkets } from './api';
import { NormalizedMarket, Platform, UserPreferences } from './types';

function App() {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [limit, setLimit] = useState(15);
  const [endWithinHours, setEndWithinHours] = useState<string>('');
  const [createdWithinHours, setCreatedWithinHours] = useState<string>('');
  
  // Preferences state
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefCategories, setPrefCategories] = useState<string[]>([]);
  const [prefHorizon, setPrefHorizon] = useState<'short' | 'medium' | 'long' | ''>('');
  const [prefVolatility, setPrefVolatility] = useState<'high' | 'low' | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markets, setMarkets] = useState<NormalizedMarket[]>([]);

  // Construct preferences object
  const preferences: UserPreferences | undefined = useMemo(() => {
    const hasPrefs = prefCategories.length > 0 || prefHorizon || prefVolatility;
    if (!hasPrefs) return undefined;
    return {
      categories: prefCategories.length > 0 ? prefCategories : undefined,
      timeHorizon: prefHorizon || undefined,
      volatility: prefVolatility || undefined,
    };
  }, [prefCategories, prefHorizon, prefVolatility]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTrendingMarkets(
          platform || undefined,
          limit,
          endWithinHours || undefined,
          createdWithinHours || undefined,
          preferences,
        );
        setMarkets(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Request failed');
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [platform, limit, endWithinHours, createdWithinHours, preferences]);

  const subtitle = useMemo(() => {
    let base = platform ? `Platform: ${platform}` : 'All Platforms';
    base += ` · Top ${limit}`;
    if (preferences) base += ' (Personalized)';
    return base;
  }, [platform, limit, preferences]);

  const toggleCategory = (cat: string) => {
    setPrefCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Prediction Market Trend Aggregator</p>
          <h1>Market Trends Dashboard</h1>
          <p className="subtitle">{subtitle}</p>
          
          <div className="controls">
            <label className="field">
              <span>Platform</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform | '')}
              >
                <option value="">All</option>
                <option value="Polymarket">Polymarket</option>
                <option value="Kalshi">Kalshi</option>
              </select>
            </label>
            <label className="field">
              <span>Limit</span>
              <input
                type="number"
                min={5}
                max={50}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || 10)}
              />
            </label>
            <label className="field">
              <span>Ends Within</span>
              <select
                value={endWithinHours}
                onChange={(e) => setEndWithinHours(e.target.value)}
              >
                <option value="">Any</option>
                <option value="24">24 Hours</option>
                <option value="72">3 Days</option>
                <option value="168">7 Days</option>
              </select>
            </label>
            <label className="field">
              <span>Created Within</span>
              <select
                value={createdWithinHours}
                onChange={(e) => setCreatedWithinHours(e.target.value)}
              >
                <option value="">Any</option>
                <option value="24">24 Hours</option>
                <option value="72">3 Days</option>
                <option value="168">7 Days</option>
              </select>
            </label>
            <button 
              className={`pref-toggle ${showPrefs ? 'active' : ''}`} 
              onClick={() => setShowPrefs(!showPrefs)}
            >
              {showPrefs ? 'Hide Preferences' : '✨ Preferences'}
            </button>
          </div>

          {showPrefs && (
            <div className="prefs-panel">
              <div className="pref-group">
                <span className="pref-label">Interests:</span>
                <div className="pref-options">
                  {['Politics', 'Sports', 'Crypto', 'AI', 'Macro'].map((cat) => (
                    <button
                      key={cat}
                      className={`chip ${prefCategories.includes(cat) ? 'selected' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pref-group">
                <span className="pref-label">Horizon:</span>
                <div className="pref-options">
                  <button
                    className={`chip ${prefHorizon === 'short' ? 'selected' : ''}`}
                    onClick={() => setPrefHorizon(prefHorizon === 'short' ? '' : 'short')}
                  >
                    Short (&lt;7d)
                  </button>
                  <button
                    className={`chip ${prefHorizon === 'medium' ? 'selected' : ''}`}
                    onClick={() => setPrefHorizon(prefHorizon === 'medium' ? '' : 'medium')}
                  >
                    Medium (7-30d)
                  </button>
                  <button
                    className={`chip ${prefHorizon === 'long' ? 'selected' : ''}`}
                    onClick={() => setPrefHorizon(prefHorizon === 'long' ? '' : 'long')}
                  >
                    Long (&gt;30d)
                  </button>
                </div>
              </div>
              <div className="pref-group">
                <span className="pref-label">Volatility:</span>
                <div className="pref-options">
                  <button
                    className={`chip ${prefVolatility === 'high' ? 'selected' : ''}`}
                    onClick={() => setPrefVolatility(prefVolatility === 'high' ? '' : 'high')}
                  >
                    High (Opportunity)
                  </button>
                  <button
                    className={`chip ${prefVolatility === 'low' ? 'selected' : ''}`}
                    onClick={() => setPrefVolatility(prefVolatility === 'low' ? '' : 'low')}
                  >
                    Stable (Certainty)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="content">
        {loading && <div className="notice">Loading...</div>}
        {error && <div className="notice error">Error: {error}</div>}
        {!loading && !error && markets.length === 0 && (
          <div className="notice">No data available</div>
        )}
        <div className="grid">
          {markets.map((m) => (
            <article key={`${m.platform}-${m.id}`} className="card">
              <div className="card-top">
                <span className="badge">{m.platform}</span>
                {m.category?.length ? (
                  <span className="tags">{m.category.join(', ')}</span>
                ) : null}
              </div>
              <h3 className="question">
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noreferrer">
                    {m.question}
                  </a>
                ) : (
                  m.question
                )}
              </h3>
              <div className="metrics">
                <div>
                  <span className="label">Prob</span>
                  <strong>{(m.probability * 100).toFixed(1)}%</strong>
                </div>
                <div>
                  <span className="label">24h Vol</span>
                  <strong>{formatNumber(m.volume24h ?? m.volume)}</strong>
                </div>
                <div>
                  <span className="label">Liquidity</span>
                  <strong>{formatNumber(m.liquidity)}</strong>
                </div>
                <div>
                  <span className="label">Trend</span>
                  <strong>{(m.trendScore ?? 0).toFixed(2)}</strong>
                </div>
              </div>
              <div className="footer">
                <span>
                  Created: {m.createdAt ? formatDate(m.createdAt) : 'Unknown'}
                </span>
                <span>
                  Ends: {m.endDate ? formatDate(m.endDate) : 'N/A'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function formatNumber(value?: number | string) {
  if (value === undefined || value === null) return '—';
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return '—';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toFixed(0);
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default App;
