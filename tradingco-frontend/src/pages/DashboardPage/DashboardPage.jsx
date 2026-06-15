import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercent, getPnlClass } from '../../utils/formatters';
import styles from './DashboardPage.module.css';

const MOCK_INDICES = [
  { name: 'S&P 500', symbol: 'SPY', price: 518.45, change: 2.25, changePct: 0.44 },
  { name: 'NASDAQ', symbol: 'QQQ', price: 451.35, change: 2.55, changePct: 0.57 },
  { name: 'DOW', symbol: 'DIA', price: 389.40, change: 1.90, changePct: 0.49 },
  { name: 'Russell 2000', symbol: 'IWM', price: 207.68, change: 1.88, changePct: 0.91 },
];

const MOCK_WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.44, change: 1.76, changePct: 0.94 },
  { symbol: 'MSFT', name: 'Microsoft', price: 417.35, change: 1.85, changePct: 0.45 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.40, change: 2.80, changePct: 1.14 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 125.85, change: 1.95, changePct: 1.57 },
  { symbol: 'AMZN', name: 'Amazon', price: 186.58, change: 1.88, changePct: 1.02 },
  { symbol: 'META', name: 'Meta Platforms', price: 503.20, change: 3.40, changePct: 0.68 },
  { symbol: 'GOOG', name: 'Alphabet', price: 155.25, change: 1.45, changePct: 0.94 },
  { symbol: 'JPM', name: 'JPMorgan', price: 198.50, change: 1.70, changePct: 0.86 },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      {/* Market Indices Strip */}
      <div className={styles.indicesStrip}>
        {MOCK_INDICES.map((idx) => (
          <div key={idx.symbol} className={styles.indexCard} onClick={() => navigate(`/asset/${idx.symbol}`)}>
            <h4>{idx.name}</h4>
            <div className={styles.indexPrice}>{formatCurrency(idx.price)}</div>
            <div className={`${styles.indexChange} ${getPnlClass(idx.change)}`}>
              {idx.change >= 0 ? '▲' : '▼'} {formatPercent(idx.changePct)}
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist Panel */}
      <div className={`${styles.panel} ${styles.watchlistPanel}`}>
        <div className={styles.panelHeader}>
          <h3>👁️ Watchlist</h3>
        </div>
        <div className={styles.panelBody}>
          {MOCK_WATCHLIST.map((item) => (
            <div key={item.symbol} className={styles.watchlistRow} onClick={() => navigate(`/asset/${item.symbol}`)}>
              <div className={styles.symbolInfo}>
                <span className={styles.symbolTicker}>{item.symbol}</span>
                <span className={styles.symbolName}>{item.name}</span>
              </div>
              <div className={styles.priceInfo}>
                <div className={styles.priceValue}>{formatCurrency(item.price)}</div>
                <div className={`${styles.priceChange} ${getPnlClass(item.change)}`}>
                  {item.change >= 0 ? '▲' : '▼'} {formatPercent(item.changePct)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className={`${styles.panel} ${styles.chartArea}`}>
        <div className={styles.panelHeader}>
          <h3>📈 Chart — AAPL</h3>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Candlestick • 1D</span>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.placeholder}>
            Chart will render here with TradingView Lightweight Charts
          </div>
        </div>
      </div>

      {/* Order Ticket */}
      <div className={`${styles.panel} ${styles.orderPanel}`}>
        <div className={styles.panelHeader}>
          <h3>📋 Order Ticket</h3>
        </div>
        <div className={styles.panelBody}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <button className="btn-buy" style={{ flex: 1 }}>BUY</button>
            <button className="btn-sell" style={{ flex: 1 }}>SELL</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Symbol</label>
              <input defaultValue="AAPL" />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Order Type</label>
              <select><option>Market</option><option>Limit</option><option>Stop</option></select>
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quantity</label>
              <input type="number" placeholder="100" />
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className={styles.bottomArea}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3>💼 Positions</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.placeholder}>No open positions</div>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3>📰 News</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.placeholder}>News feed loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
