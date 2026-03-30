import type { PricePoint, PriceSeriesConfig } from '../price-chart/price-chart';

/* ── Series configs ── */

export const twoLineSeries: PriceSeriesConfig[] = [
  { key: 'bidPrice', name: 'Bid (Buy)', color: '#0ecb81' },
  { key: 'askPrice', name: 'Ask (Sell)', color: '#f6465d' },
];

export const multiExchangeSeries: PriceSeriesConfig[] = [
  { key: 'binanceBid', name: 'Binance Bid', color: '#f0b90b' },
  { key: 'binanceAsk', name: 'Binance Ask', color: '#f6465d' },
  { key: 'bybitBid', name: 'Bybit Bid', color: '#0ecb81' },
  { key: 'bybitAsk', name: 'Bybit Ask', color: '#ff6838' },
  { key: 'mexSell', name: 'MEX Sell', color: '#1da2b4' },
];

/* ── Data generators ── */

function generateTwoLineData(
  count: number,
  basePrice: number,
  spread: number,
  volatility: number,
  intervalMs: number,
): PricePoint[] {
  const data: PricePoint[] = [];
  let bid = basePrice;
  const startTime = Date.now() - count * intervalMs;

  for (let i = 0; i < count; i++) {
    const delta = (Math.random() - 0.48) * volatility;
    bid = Math.max(bid + delta, basePrice * 0.9);
    const ask = bid + spread + Math.random() * spread * 0.3;

    data.push({
      time: startTime + i * intervalMs,
      bidPrice: parseFloat(bid.toFixed(4)),
      askPrice: parseFloat(ask.toFixed(4)),
    });
  }
  return data;
}

function generateMultiExchangeData(
  count: number,
  basePrice: number,
  volatility: number,
  intervalMs: number,
): PricePoint[] {
  const data: PricePoint[] = [];
  let binanceBid = basePrice;
  let bybitBid = basePrice + 0.15;
  let mexSell = basePrice + 0.4;
  const startTime = Date.now() - count * intervalMs;

  for (let i = 0; i < count; i++) {
    binanceBid += (Math.random() - 0.48) * volatility;
    bybitBid += (Math.random() - 0.48) * volatility * 1.1;
    mexSell += (Math.random() - 0.48) * volatility * 0.9;

    data.push({
      time: startTime + i * intervalMs,
      binanceBid: parseFloat(binanceBid.toFixed(4)),
      binanceAsk: parseFloat((binanceBid + 0.3 + Math.random() * 0.1).toFixed(4)),
      bybitBid: parseFloat(bybitBid.toFixed(4)),
      bybitAsk: parseFloat((bybitBid + 0.35 + Math.random() * 0.12).toFixed(4)),
      mexSell: parseFloat(mexSell.toFixed(4)),
    });
  }
  return data;
}

/* ── Exported stubs ── */

// Two-line (bid/ask)
export const priceChartStabs_small: PricePoint[] = generateTwoLineData(50, 1820, 0.35, 1.2, 5000);
export const priceChartStabs_medium: PricePoint[] = generateTwoLineData(300, 1820, 0.35, 2.5, 2000);
export const priceChartStabs_large: PricePoint[] = generateTwoLineData(1000, 1820, 0.5, 4.0, 1000);
export const priceChartStabs_streaming: PricePoint[] = generateTwoLineData(200, 1820, 0.35, 2.0, 500);

// Multi-exchange (5 lines)
export const priceChartStabs_multiExchange: PricePoint[] = generateMultiExchangeData(
  300, 1820, 2.5, 2000,
);
export const priceChartStabs_multiExchangeStreaming: PricePoint[] = generateMultiExchangeData(
  200, 1820, 2.0, 500,
);
