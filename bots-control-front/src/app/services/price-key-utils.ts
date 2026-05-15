export interface PriceSeriesConfig {
  key: string;
  name: string;
  color: string;
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
    if (parts.length !== 3 || parts[0] !== source) {
      return false;
    }
    const sym = parts[1].toUpperCase();
    return sym.includes(t0) && sym.includes(t1);
  };

  const bidKey = allKeys.find((k) => match(k) && k.endsWith('|bidPrice'));
  const askKey = allKeys.find((k) => match(k) && k.endsWith('|askPrice'));

  if (bidKey && askKey) {
    return { bidKey, askKey };
  }
  return null;
}

export function buildSeriesFromPipeKeys(pipeKeys: string[]): PriceSeriesConfig[] {
  return pipeKeys.map((pipeKey, i) => ({
    key: pipeKey.replace(/\|/g, ''),
    name: formatPipeKeyName(pipeKey),
    color: PRICE_COLORS[i % PRICE_COLORS.length],
  }));
}
