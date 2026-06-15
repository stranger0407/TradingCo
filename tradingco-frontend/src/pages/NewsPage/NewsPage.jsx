import { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRes, trendRes] = await Promise.all([
        newsApi.getNews(),
        newsApi.getTrendingNews(),
      ]);
      setNewsList(allRes.data);
      setTrending(trendRes.data);
    } catch (err) {
      setError('Failed to fetch market news.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh news every 30 seconds
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-lg)', animation: 'fadeIn 300ms ease-out' }}>
      
      {/* News Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>📰 Market News Feed</h1>
          <button onClick={fetchNews} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: 'var(--space-md)', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--loss-red)', color: 'var(--loss-red)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        {isLoading && newsList.length === 0 ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading market news...
          </div>
        ) : newsList.length === 0 ? (
          <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No news items generated yet.
          </div>
        ) : (
          newsList.map((news) => (
            <div 
              key={news.id} 
              className="card" 
              style={{ padding: 'var(--space-lg)', transition: 'border-color var(--transition-fast)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                {news.symbol && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 'var(--text-xs)',
                    background: 'rgba(88, 166, 255, 0.12)', color: 'var(--accent-blue)',
                  }}>
                    {news.symbol}
                  </span>
                )}
                
                {news.sentiment && (
                  <span style={{
                    padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 500,
                    background: news.sentiment === 'POSITIVE' ? 'rgba(63, 185, 80, 0.12)' : news.sentiment === 'NEGATIVE' ? 'rgba(248, 81, 73, 0.12)' : 'rgba(255,255,255,0.06)',
                    color: news.sentiment === 'POSITIVE' ? 'var(--profit-green)' : news.sentiment === 'NEGATIVE' ? 'var(--loss-red)' : 'var(--text-secondary)',
                  }}>
                    {news.sentiment === 'POSITIVE' ? '▲ Bullish' : news.sentiment === 'NEGATIVE' ? '▼ Bearish' : '● Neutral'}
                  </span>
                )}
                
                <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {news.source || 'Brokerage'} · {formatRelativeTime(news.publishedAt)}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-xs)', lineHeight: 1.4 }}>
                {news.headline}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                {news.summary}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Trending Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--space-md)', paddingBottom: '4px', borderBottom: '1px solid var(--border)' }}>
            🔥 Trending Catalysts
          </h3>
          
          {trending.length === 0 ? (
            <div style={{ padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              No active trending events.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {trending.map((t) => (
                <div 
                  key={t.id}
                  style={{
                    padding: 'var(--space-sm)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    borderLeft: t.sentiment === 'POSITIVE' ? '3px solid var(--profit-green)' : t.sentiment === 'NEGATIVE' ? '3px solid var(--loss-red)' : '3px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{t.symbol}</span>
                    <span>{formatRelativeTime(t.publishedAt)}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>
                    {t.headline}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
