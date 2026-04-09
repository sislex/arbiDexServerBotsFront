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

/**
 * Format a pipe-separated key 'kucoin|ETH-USDT|bidPrice' → 'Kucoin ETH-USDT Bid'
 */
export function formatPipeKeyName(pipeKey: string): string {
  const parts = pipeKey.split('|');
  if (parts.length === 3) {
    const exchange = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const symbol = parts[1];
    const side = parts[2] === 'bidPrice' ? 'Bid' : parts[2] === 'askPrice' ? 'Ask' : parts[2];
    return `${exchange} ${symbol} ${side}`;
  }
  return pipeKey;
}

/**
 * Find matching price keys from the available keys list by source and tokens.
 * Handles any symbol format (binance: 'ETHUSDC', kucoin: 'ETH-USDT', etc.)
 */
export function findPriceKeys(
  allKeys: string[],
  source: string,
  token0: string,
  token1: string,
): { bidKey: string; askKey: string } | null {
  const t0 = token0.toUpperCase();
  const t1 = token1.toUpperCase();

  const match = (k: string) => {
    const parts = k.split('|');
    if (parts.length !== 3 || parts[0] !== source) return false;
    const sym = parts[1].toUpperCase();
    return sym.includes(t0) && sym.includes(t1);
  };

  const bidKey = allKeys.find((k) => match(k) && k.endsWith('|bidPrice'));
  const askKey = allKeys.find((k) => match(k) && k.endsWith('|askPrice'));

  if (bidKey && askKey) return { bidKey, askKey };
  return null;
}

/** Build PriceSeriesConfig[] from an array of raw key strings */
export function buildSeriesFromKeys(keys: string[]): PriceSeriesConfig[] {
  return keys.map((rawKey, i) => ({
    key: rawKey,
    name: formatKeyName(rawKey),
    color: PRICE_COLORS[i % PRICE_COLORS.length],
  }));
}

/** Build PriceSeriesConfig[] from pipe-separated keys */
export function buildSeriesFromPipeKeys(pipeKeys: string[]): PriceSeriesConfig[] {
  return pipeKeys.map((pipeKey, i) => ({
    key: pipeKey.replace(/\|/g, ''),
    name: formatPipeKeyName(pipeKey),
    color: PRICE_COLORS[i % PRICE_COLORS.length],
  }));
}

