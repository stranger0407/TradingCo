import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { screenerApi } from '../../api/screenerApi';
import { formatCurrency, formatPercent, formatVolume, getPnlClass } from '../../utils/formatters';

function ScreenerTable({ items, isLoading, showRank = true }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-xl)', textAlignment: 'center', color: 'var(--text-secondary)' }}>
        Loading screener data...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div style={{ padding: 'var(--space-xl)', textAlignment: 'center', color: 'var(--text-secondary)' }}>
        No data available
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {(showRank ? ['#'] : []).concat(['Symbol', 'Price', 'Change', 'Volume']).map(h => (
            <th key={h} style={{ 
              padding: 'var(--space-sm) var(--space-md)', 
              textAlign: h === 'Symbol' || h === '#' ? 'left' : 'right', 
              fontSize: 'var(--text-xs)', 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              borderBottom: '1px solid var(--border)' 
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr 
            key={item.symbol} 
            onClick={() => navigate(`/dashboard?symbol=${item.symbol}`)}
            style={{ cursor: 'pointer' }}
          >
            {showRank && (
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {i + 1}
              </td>
            )}
            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
              <div style={{ fontWeight: 600 }}>{item.symbol}</div>
            </td>
            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', padding: 'var(--space-sm) var(--space-md)' }}>
              {formatCurrency(item.lastPrice)}
            </td>
            <td className={getPnlClass(item.changePercent)} style={{ 
              textAlign: 'right', 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 600, 
              padding: 'var(--space-sm) var(--space-md)' 
            }}>
              {item.changePercent >= 0 ? '+' : ''}{formatPercent(item.changePercent)}
            </td>
            <td style={{ 
              textAlign: 'right', 
              fontFamily: 'var(--font-mono)', 
              color: 'var(--text-secondary)', 
              fontSize: 'var(--text-sm)', 
              padding: 'var(--space-sm) var(--space-md)' 
            }}>
              {formatVolume(item.volume)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ScreenerPage() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [active, setActive] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [gRes, lRes, aRes] = await Promise.all([
        screenerApi.getGainers(),
        screenerApi.getLosers(),
        screenerApi.getActive(),
      ]);
      setGainers(gRes.data);
      setLosers(lRes.data);
      setActive(aRes.data);
    } catch (err) {
      setError('Failed to fetch screener data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh screener data every 10 seconds for simulated real-time experience
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', animation: 'fadeIn 300ms ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>🔍 Market Screener</h1>
        <button onClick={fetchData} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: 'var(--space-md)', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--loss-red)', color: 'var(--loss-red)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
        {[
          { key: 'gainers', icon: '🟢', title: 'Top Gainers', data: gainers },
          { key: 'losers', icon: '🔴', title: 'Top Losers', data: losers },
          { key: 'active', icon: '🔥', title: 'Most Active', data: active },
        ].map(({ key, icon, title, data }) => (
          <div key={key} className="card">
            <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {icon} {title}
              </h3>
            </div>
            <ScreenerTable items={data} isLoading={isLoading} />
          </div>
        ))}
      </div>
    </div>
  );
}
