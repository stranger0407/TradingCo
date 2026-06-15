import { useState, useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatters';
import styles from './OrderTicket.module.css';

const ORDER_TYPES = ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'];

export default function OrderTicket({ symbol = 'AAPL', lastPrice = 189.44, onSubmit }) {
  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState(100);
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  const estimatedTotal = useMemo(() => {
    const price = orderType === 'MARKET' ? lastPrice : (parseFloat(limitPrice) || lastPrice);
    return price * quantity;
  }, [orderType, lastPrice, limitPrice, quantity]);

  const commission = useMemo(() => Math.max(1.00, quantity * 0.005), [quantity]);

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit({
      symbol,
      side,
      orderType,
      quantity,
      limitPrice: limitPrice ? parseFloat(limitPrice) : null,
      stopPrice: stopPrice ? parseFloat(stopPrice) : null,
    });
  };

  const adjustQty = (delta) => setQuantity((prev) => Math.max(1, prev + delta));

  return (
    <div className={styles.ticket}>
      {/* Buy/Sell Toggle */}
      <div className={styles.sideTabs}>
        <button
          className={`${styles.sideTab} ${styles.buy} ${side === 'BUY' ? styles.activeBuy : ''}`}
          onClick={() => setSide('BUY')}
        >
          BUY
        </button>
        <button
          className={`${styles.sideTab} ${styles.sell} ${side === 'SELL' ? styles.activeSell : ''}`}
          onClick={() => setSide('SELL')}
        >
          SELL
        </button>
      </div>

      {/* Order Type */}
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Order Type</span>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
          {ORDER_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Quantity</span>
        <div className={styles.qtyControl}>
          <button className={styles.qtyBtn} onClick={() => adjustQty(-10)}>−</button>
          <input
            className={styles.qtyInput}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
          />
          <button className={styles.qtyBtn} onClick={() => adjustQty(10)}>+</button>
        </div>
      </div>

      {/* Limit Price */}
      {(orderType === 'LIMIT' || orderType === 'STOP_LIMIT') && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Limit Price</span>
          <input
            type="number"
            step="0.01"
            placeholder={lastPrice?.toFixed(2)}
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
          />
        </div>
      )}

      {/* Stop Price */}
      {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Stop Price</span>
          <input
            type="number"
            step="0.01"
            placeholder={lastPrice?.toFixed(2)}
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
          />
        </div>
      )}

      {/* Estimate */}
      <div className={styles.estimate}>
        <span className={styles.estimateLabel}>Est. Total</span>
        <span className={styles.estimateValue}>{formatCurrency(estimatedTotal)}</span>
      </div>
      <div className={styles.estimate}>
        <span className={styles.estimateLabel}>Commission</span>
        <span className={styles.estimateValue}>{formatCurrency(commission)}</span>
      </div>

      {/* Submit */}
      <button
        className={`${styles.submitBtn} ${side === 'BUY' ? styles.submitBuy : styles.submitSell}`}
        onClick={handleSubmit}
        disabled={quantity <= 0}
      >
        {side} {quantity} {symbol} — {orderType === 'MARKET' ? 'at Market' : `@ ${formatCurrency(parseFloat(limitPrice) || lastPrice)}`}
      </button>
    </div>
  );
}
