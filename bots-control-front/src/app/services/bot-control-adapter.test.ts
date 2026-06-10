import { describe, expect, it } from 'vitest';
import {
  buildBotConfigClipboardText,
  buildCopyBotConfigText,
  buildBotTypeRowsFromRules,
  buildJobTypeRowsFromRules,
  buildServerRulesClipboardText,
  suggestCopyBotId,
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

describe('suggestCopyBotId', () => {
  it('suggests next numeric id', () => {
    expect(
      suggestCopyBotId(
        [
          { id: '10', botParams: {}, jobParams: {} },
          { id: '12', botParams: {}, jobParams: {} },
        ],
        '12',
      ),
    ).toBe('13');
  });
});

describe('buildCopyBotConfigText', () => {
  it('builds set-bot config with a new id', () => {
    const text = buildCopyBotConfigText(
      {
        id: '12',
        botParams: { botType: 'TestBot', paused: false },
        jobParams: { jobType: 'get_Cex_Quotes' },
      },
      [{ id: '12', botParams: {}, jobParams: {} }],
    );

    expect(JSON.parse(text)).toEqual({
      id: '13',
      botParams: { botType: 'TestBot', paused: false },
      jobParams: { jobType: 'get_Cex_Quotes' },
    });
  });
});

describe('buildBotTypeRowsFromRules', () => {
  it('maps each bot rule to type and description rows', () => {
    const rows = buildBotTypeRowsFromRules([
      { id: '1', botParams: { botType: 'TestBot', description: 'Bot A' }, jobParams: {} },
      { id: '2', botParams: { botType: 'ArbBot', description: 'Bot B' }, jobParams: {} },
    ]);

    expect(rows).toEqual([
      { id: '1', type: 'TestBot', description: 'Bot A' },
      { id: '2', type: 'ArbBot', description: 'Bot B' },
    ]);
  });
});

describe('buildJobTypeRowsFromRules', () => {
  it('maps each bot rule to job type and description rows', () => {
    const rows = buildJobTypeRowsFromRules([
      {
        id: '1',
        botParams: {},
        jobParams: { jobType: 'get_Cex_Quotes', description: 'Quotes job' },
      },
    ]);

    expect(rows).toEqual([{ id: '1', type: 'get_Cex_Quotes', description: 'Quotes job' }]);
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
