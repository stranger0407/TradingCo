import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TradingChart from '../../components/trading/TradingChart/TradingChart';
import OrderTicket from '../../components/trading/OrderTicket/OrderTicket';
import WatchlistPanel from '../../components/trading/WatchlistPanel/WatchlistPanel';
import PositionsTable from '../../components/trading/PositionsTable/PositionsTable';
import OrderHistoryTable from '../../components/trading/OrderHistoryTable/OrderHistoryTable';
import { formatCurrency, formatPercent, getPnlClass } from '../../utils/formatters';
import styles from './DashboardPage.module.css';

const MOCK_INDICES = [
  { name: 'S&P 500', symbol: 'SPY', price: 518.45, change: 2.25, changePct: 0.44 },
  { name: 'NASDAQ', symbol: 'QQQ', price: 451.35, change: 2.55, changePct: 0.57 },
  { name: 'DOW', symbol: 'DIA', price: 389.40, change: 1.90, changePct: 0.49 },
  { name: 'Russell 2000', symbol: 'IWM', price: 207.68, change: 1.88, changePct: 0.91 },
  { name: 'VIX', symbol: 'VIX', price: 14.32, change: -0.58, changePct: -3.89 },
];

const MOCK_POSITIONS = [
  { symbol: 'AAPL', side: 'BUY', quantity: 100, avgCost: 185.20, currentPrice: 189.44, marketValue: 18944, unrealizedPnl: 424, unrealizedPnlPct: 2.29 },
  { symbol: 'MSFT', side: 'BUY', quantity: 50, avgCost: 410.00, currentPrice: 417.35, marketValue: 20867.50, unrealizedPnl: 367.50, unrealizedPnlPct: 1.79 },
  { symbol: 'TSLA', side: 'BUY', quantity: 30, avgCost: 255.00, currentPrice: 248.40, marketValue: 7452, unrealizedPnl: -198, unrealizedPnlPct: -2.59 },
];

const MOCK_ORDERS = [
  { id: '1', symbol: 'AAPL', side: 'BUY', orderType: 'MARKET', quantity: 100, filledQuantity: 100, avgFillPrice: 185.20, status: 'FILLED', createdAt: '2024-01-15T10:30:00' },
  { id: '2', symbol: 'MSFT', side: 'BUY', orderType: 'LIMIT', quantity: 50, filledQuantity: 50, limitPrice: 410.00, avgFillPrice: 410.00, status: 'FILLED', createdAt: '2024-01-15T11:15:00' },
  { id: '3', symbol: 'TSLA', side: 'BUY', orderType: 'MARKET', quantity: 30, filledQuantity: 30, avgFillPrice: 255.00, status: 'FILLED', createdAt: '2024-01-16T09:45:00' },
  { id: '4', symbol: 'NVDA', side: 'BUY', orderType: 'LIMIT', quantity: 40, filledQuantity: 0, limitPrice: 120.00, status: 'PENDING', createdAt: '2024-01-16T14:00:00' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeSymbol, setActiveSymbol] = useState('AAPL');
  const [bottomTab, setBottomTab] = useState('positions');

  const handleSymbolSelect = (symbol) => {
    setActiveSymbol(symbol);
  };

  const handleOrderSubmit = (orderData) => {
    console.log('Order submitted:', orderData);
    // Will connect to API in production
  };

  return (
    <div className={styles.dashboard}>
      {/* Market Indices Strip */}
      <div className={styles.indicesStrip}>
        {MOCK_INDICES.map((idx) => (
          <div key={idx.symbol} className={styles.indexCard} onClick={() => handleSymbolSelect(idx.symbol)}>
            <h4>{idx.name}</h4>
            <div className={styles.indexPrice}>{formatCurrency(idx.price)}</div>
            <div className={`${styles.indexChange} ${getPnlClass(idx.change)}`}>
              {idx.change >= 0 ? '▲' : '▼'} {formatPercent(Math.abs(idx.changePct))}
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist Panel */}
      <div className={`${styles.panel} ${styles.watchlistPanel}`}>
        <WatchlistPanel activeSymbol={activeSymbol} onSelect={handleSymbolSelect} />
      </div>

      {/* Chart Area */}
      <div className={`${styles.panel} ${styles.chartArea}`}>
        <TradingChart symbol={activeSymbol} />
      </div>

      {/* Order Ticket */}
      <div className={`${styles.panel} ${styles.orderPanel}`}>
        <div className={styles.panelHeader}>
          <h3>📋 Order Ticket</h3>
        </div>
        <div className={styles.panelBody}>
          <OrderTicket symbol={activeSymbol} lastPrice={189.44} onSubmit={handleOrderSubmit} />
        </div>
      </div>

      {/* Bottom Area */}
      <div className={styles.bottomArea}>
        <div className={styles.panel} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.panelHeader}>
            <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
              {['positions', 'orders', 'trades'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: bottomTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: bottomTab === tab ? 600 : 400,
                    fontSize: 'var(--text-sm)', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: bottomTab === tab ? '2px solid var(--accent-blue)' : '2px solid transparent',
                    paddingBottom: '4px',
                  }}
                >
                  {tab === 'positions' ? `💼 Positions (${MOCK_POSITIONS.length})`
                    : tab === 'orders' ? `📋 Orders (${MOCK_ORDERS.length})`
                    : '📊 Trades'}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.panelBody}>
            {bottomTab === 'positions' && <PositionsTable positions={MOCK_POSITIONS} />}
            {bottomTab === 'orders' && <OrderHistoryTable orders={MOCK_ORDERS} />}
            {bottomTab === 'trades' && <div className={styles.placeholder}>No closed trades yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
