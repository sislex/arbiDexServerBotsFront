export interface PriceSeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface PricePairFromJob {
  source: string;
  token0: string;
  token1: string;
}

export const PRICE_COLORS = [
  '#f0b90b',
  '#f6465d',
  '#0ecb81',
  '#ff6838',
  '#1da2b4',
  '#b659ff',
  '#2196f3',
  '#ff9800',
  '#e91e63',
  '#00bcd4',
];

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

export function getPricePairFromJob(jobParams: Record<string, unknown>): PricePairFromJob | null {
  const source = String(jobParams['source'] ?? '').trim();
  const isDex = source.startsWith('dex:');
  const opts = jobParams['opts'] as Record<string, unknown> | undefined;
  const tokenIn = opts?.['tokenIn'] as Record<string, unknown> | undefined;
  const tokenOut = opts?.['tokenOut'] as Record<string, unknown> | undefined;

  const token0 = isDex
    ? String(jobParams['token0'] ?? tokenIn?.['address'] ?? '').trim()
    : String(jobParams['token0'] ?? tokenIn?.['symbol'] ?? '').trim();
  const token1 = isDex
    ? String(jobParams['token1'] ?? tokenOut?.['address'] ?? '').trim()
    : String(jobParams['token1'] ?? tokenOut?.['symbol'] ?? '').trim();

  if (!source || !token0 || !token1) {
    return null;
  }

  return { source, token0, token1 };
}

export function buildSeriesFromPipeKeys(pipeKeys: string[]): PriceSeriesConfig[] {
  return pipeKeys.map((pipeKey, i) => ({
    key: pipeKey.replace(/\|/g, ''),
    name: formatPipeKeyName(pipeKey),
    color: PRICE_COLORS[i % PRICE_COLORS.length],
  }));
}
