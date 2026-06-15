import { formatCurrency, formatPercent, getPnlClass } from '../../../utils/formatters';
import styles from './WatchlistPanel.module.css';

const DEFAULT_WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.44, change: 1.76, changePct: 0.94 },
  { symbol: 'MSFT', name: 'Microsoft', price: 417.35, change: 1.85, changePct: 0.45 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 155.25, change: 1.45, changePct: 0.94 },
  { symbol: 'AMZN', name: 'Amazon', price: 186.58, change: 1.88, changePct: 1.02 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.40, change: 2.80, changePct: 1.14 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 125.85, change: 1.95, changePct: 1.57 },
  { symbol: 'META', name: 'Meta Platforms', price: 503.20, change: 3.40, changePct: 0.68 },
  { symbol: 'JPM', name: 'JPMorgan', price: 198.50, change: 1.70, changePct: 0.86 },
  { symbol: 'V', name: 'Visa Inc.', price: 275.30, change: 0.95, changePct: 0.35 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.80, change: -0.45, changePct: -0.29 },
  { symbol: 'WMT', name: 'Walmart', price: 165.10, change: 0.35, changePct: 0.21 },
  { symbol: 'DIS', name: 'Walt Disney', price: 101.25, change: -1.30, changePct: -1.27 },
];

export default function WatchlistPanel({ items = DEFAULT_WATCHLIST, activeSymbol, onSelect }) {
  return (
    <div className={styles.watchlist}>
      <div className={styles.header}>
        <span className={styles.title}>👁️ Watchlist</span>
        <button className={styles.addBtn}>+ Add</button>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <div
            key={item.symbol}
            className={`${styles.row} ${activeSymbol === item.symbol ? styles.active : ''}`}
            onClick={() => onSelect?.(item.symbol)}
          >
            <div className={styles.left}>
              <span className={styles.ticker}>{item.symbol}</span>
              <span className={styles.name}>{item.name}</span>
            </div>
            <div className={styles.right}>
              <div className={styles.price}>{formatCurrency(item.price)}</div>
              <div className={`${styles.change} ${getPnlClass(item.change)}`}>
                {item.change >= 0 ? '+' : ''}{formatPercent(item.changePct)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
