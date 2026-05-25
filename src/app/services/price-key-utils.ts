import type { PriceSeriesConfig } from '../components/price-chart/price-chart';

export interface PricePairFromJob {
  source: string;
  token0: string;
  token1: string;
}

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

/** Build deterministic bid/ask pipe keys directly from bot job params */
export function buildPricePipeKeysFromJob(
  source: string,
  token0: string,
  token1: string,
): { bidKey: string; askKey: string; symbol: string } {
  const symbol = `${token0}/${token1}`;
  return {
    symbol,
    bidKey: `${source}|${symbol}|bidPrice`,
    askKey: `${source}|${symbol}|askPrice`,
  };
}

/**
 * Resolve source/token pair from job params.
 * Supports both flat token0/token1 and dex opts.tokenIn/tokenOut addresses.
 */
export function getPricePairFromJob(jobParams: any): PricePairFromJob | null {
  const source = String(jobParams?.source ?? '').trim();
  const isDex = source.startsWith('dex:');

  const token0 = isDex
    ? String(jobParams?.token0 ?? jobParams?.opts?.tokenIn?.address ?? '').trim()
    : String(jobParams?.token0 ?? jobParams?.opts?.tokenIn?.symbol ?? '').trim();
  const token1 = isDex
    ? String(jobParams?.token1 ?? jobParams?.opts?.tokenOut?.address ?? '').trim()
    : String(jobParams?.token1 ?? jobParams?.opts?.tokenOut?.symbol ?? '').trim();

  if (!source || !token0 || !token1) {
    return null;
  }

  return { source, token0, token1 };
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

