import { describe, expect, it } from 'vitest';
import { formatConfigForDiff, sortObjectKeysDeep } from './config-diff-format';

describe('config-diff-format', () => {
  it('sorts botsRulesList by id and object keys alphabetically', () => {
    const formatted = formatConfigForDiff(
      JSON.stringify({
        botsRulesList: [
          {
            id: '174',
            jobParams: { z: 1, a: 2 },
            botParams: { paused: true, botType: 'BotB' },
          },
          {
            id: '12',
            botParams: { botType: 'BotA' },
            jobParams: { source: 'binance' },
          },
        ],
      }),
    );

    expect(formatted).toBe(
      JSON.stringify(
        {
          botsRulesList: [
            {
              botParams: { botType: 'BotA' },
              id: '12',
              jobParams: { source: 'binance' },
            },
            {
              botParams: { botType: 'BotB', paused: true },
              id: '174',
              jobParams: { a: 2, z: 1 },
            },
          ],
        },
        null,
        2,
      ),
    );
  });

  it('produces identical output for configs with different bot and key order', () => {
    const original = formatConfigForDiff(
      JSON.stringify({
        botsRulesList: [
          { id: '2', botParams: { paused: false }, jobParams: { token1: 'USDT', token0: 'ETH' } },
          { id: '1', botParams: { paused: true }, jobParams: { source: 'binance' } },
        ],
      }),
    );
    const updated = formatConfigForDiff(
      JSON.stringify({
        botsRulesList: [
          { jobParams: { source: 'binance' }, botParams: { paused: true }, id: '1' },
          { id: '2', jobParams: { token0: 'ETH', token1: 'USDT' }, botParams: { paused: false } },
        ],
      }),
    );

    expect(original).toBe(updated);
  });

  it('sorts nested object keys recursively', () => {
    expect(sortObjectKeysDeep({ b: { d: 1, c: 2 }, a: 1 })).toEqual({
      a: 1,
      b: { c: 2, d: 1 },
    });
  });
});
