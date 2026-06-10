import { describe, expect, it } from 'vitest';
import {
  buildBotConfigClipboardText,
  buildServerRulesClipboardText,
  extractBotConfigParts,
  parseServerRulesConfigJson,
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

describe('parseServerRulesConfigJson', () => {
  it('parses botsRulesList object', () => {
    const rules = parseServerRulesConfigJson(
      JSON.stringify({
        botsRulesList: [{ id: '1', botParams: { paused: true }, jobParams: { source: 'binance' } }],
      }),
    );

    expect(rules).toEqual([{ id: '1', botParams: { paused: true }, jobParams: { source: 'binance' } }]);
  });

  it('throws when botsRulesList is missing', () => {
    expect(() => parseServerRulesConfigJson('{"id":"1"}')).toThrow('botsRulesList');
  });
});

describe('buildServerRulesClipboardText', () => {
  it('serializes rules list for clipboard', () => {
    const text = buildServerRulesClipboardText([
      { id: '1', botParams: { paused: true }, jobParams: { source: 'binance' } },
    ]);

    expect(JSON.parse(text)).toEqual({
      botsRulesList: [{ id: '1', botParams: { paused: true }, jobParams: { source: 'binance' } }],
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
