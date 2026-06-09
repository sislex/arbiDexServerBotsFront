import { describe, expect, it } from 'vitest';
import {
  buildBotConfigClipboardText,
  extractBotConfigParts,
} from './bot-control-adapter';

describe('extractBotConfigParts', () => {
  it('reads botParams and jobParams from direct fields', () => {
    const result = extractBotConfigParts({
      id: '1',
      botParams: { paused: true },
      jobParams: { source: 'binance' },
    });

    expect(result).toEqual({
      botParams: { paused: true },
      jobParams: { source: 'binance' },
    });
  });

  it('reads config from data string returned by settings endpoint', () => {
    const result = extractBotConfigParts({
      id: '1',
      data: JSON.stringify({
        botParams: { paused: false },
        jobParams: { token0: 'ETH' },
      }),
    });

    expect(result).toEqual({
      botParams: { paused: false },
      jobParams: { token0: 'ETH' },
    });
  });
});

describe('buildBotConfigClipboardText', () => {
  it('serializes config for clipboard', () => {
    const text = buildBotConfigClipboardText({
      id: '1',
      botParams: { paused: true },
      jobParams: { source: 'binance' },
    });

    expect(JSON.parse(text)).toEqual({
      botParams: { paused: true },
      jobParams: { source: 'binance' },
    });
  });
});
