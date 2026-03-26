import type { PriceSeriesConfig } from '../components/price-chart/price-chart';

/** Palette used to colour each series automatically */
export const PRICE_COLORS = [
  '#f0b90b', '#f6465d', '#0ecb81', '#ff6838', '#1da2b4',
  '#b659ff', '#2196f3', '#ff9800', '#e91e63', '#00bcd4',
];

/**
 * Transform raw key like 'binanceETHUSDCbidPrice' to a pipe-separated
 * format the API expects: 'binance|ETHUSDC|bidPrice'
 */
export function rawKeyToUrlKey(rawKey: string): string {
  const match = rawKey.match(/^(.+?)((?:ETH|BTC|SOL|DOGE|XRP)[A-Z_-]+)(bidPrice|askPrice)$/);
  if (match) {
    return `${match[1]}|${match[2]}|${match[3]}`;
  }
  return rawKey;
}

/** Format 'binanceETHUSDCbidPrice' → 'Binance ETHUSDC Bid' */
export function formatKeyName(rawKey: string): string {
  const match = rawKey.match(/^(.+?)((?:ETH|BTC|SOL|DOGE|XRP)[A-Z_-]+)(bidPrice|askPrice)$/);
  if (match) {
    const exchange = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    const pair = match[2];
    const side = match[3] === 'bidPrice' ? 'Bid' : 'Ask';
    return `${exchange} ${pair} ${side}`;
  }
  return rawKey;
}

/** Build PriceSeriesConfig[] from an array of raw key strings */
export function buildSeriesFromKeys(keys: string[]): PriceSeriesConfig[] {
  return keys.map((rawKey, i) => ({
    key: rawKey,
    name: formatKeyName(rawKey),
    color: PRICE_COLORS[i % PRICE_COLORS.length],
  }));
}

