import { describe, expect, it } from 'vitest';
import { areBotRulesEqual } from './bot-config-compare';
import { buildBotRulesFromDbBots } from './db-config-builder';
import type { BotRuleItem } from './bot-control-adapter';

describe('buildBotRulesFromDbBots', () => {
  it('maps DEX bot from DB shape like front-new', () => {
    const rules = buildBotRulesFromDbBots([
      {
        botId: 12,
        botName: 'ArbBot',
        paused: false,
        isRepeat: true,
        delayBetweenRepeat: 100,
        maxJobs: 5,
        maxErrors: 3,
        timeoutMs: 5000,
        description: 'Test bot',
        job: {
          jobType: 'get_Dex_Quotes',
          extraSettings: { foo: 1 },
          chain: { name: 'Ethereum' },
          rpcUrl: { rpcUrl: 'https://rpc.example' },
          poolsJobRelations: [
            {
              pool: {
                dex: { name: 'Uniswap' },
                version: 'v3',
                poolAddress: '0xabc',
                token0: { decimals: 18, symbol: 'WETH', address: '0x1' },
                token1: { decimals: 6, symbol: 'USDC', address: '0x2' },
              },
            },
          ],
        },
      },
    ]);

    expect(rules).toEqual([
      {
        id: '12',
        botParams: {
          botType: 'ArbBot',
          paused: false,
          isRepeat: true,
          delayBetweenRepeat: 100,
          maxJobs: 5,
          maxErrors: 3,
          timeoutMs: 5000,
          description: 'Test bot',
        },
        jobParams: {
          extraSettings: { foo: 1 },
          cexPairId: null,
          jobType: 'get_Dex_Quotes',
          rpcUrl: 'https://rpc.example',
          source: 'dex:ethereum',
          opts: {
            tokenIn: { decimals: 18, symbol: 'WETH', address: '0x1' },
            tokenOut: { decimals: 6, symbol: 'USDC', address: '0x2' },
          },
          pairsToQuote: [{ dex: 'uniswap', version: 'v3', poolAddress: '0xabc' }],
        },
      },
    ]);
  });

  it('keeps extraSettings JSON string from DB like front-new', () => {
    const rules = buildBotRulesFromDbBots([
      {
        botId: 1,
        botName: 'Bot',
        job: {
          jobType: 'get_Dex_Quotes_By_Arb_Quoter_Script',
          extraSettings: '{\n  "amountIn": 0.001538,\n  "amountOut": 0.0303\n}\n',
          chain: { name: 'Arbitrum' },
          poolsJobRelations: [],
        },
      },
    ]);

    expect(rules[0]?.jobParams.extraSettings).toBe(
      '{\n  "amountIn": 0.001538,\n  "amountOut": 0.0303\n}\n',
    );
  });

  it('maps CEX bot from DB shape like front-new', () => {
    const rules = buildBotRulesFromDbBots([
      {
        botId: 3,
        botName: 'CexBot',
        paused: true,
        isRepeat: false,
        delayBetweenRepeat: 0,
        maxJobs: 1,
        maxErrors: 1,
        timeoutMs: 1000,
        description: 'CEX',
        cexJob: {
          jobType: 'get_Cex_Quotes',
          pair: {
            chain: { name: 'binance' },
            token0: 'BTC',
            token1: 'USDT',
          },
        },
      },
    ]);

    expect(rules[0]?.jobParams).toEqual({
      jobType: 'get_Cex_Quotes',
      source: 'binance',
      token0: 'BTC',
      token1: 'USDT',
    });
  });
});

describe('areBotRulesEqual', () => {
  const baseRule: BotRuleItem = {
    id: '1',
    botParams: { botType: 'Bot', paused: false },
    jobParams: { jobType: 'get_Cex_Quotes', source: 'binance', token0: 'ETH', token1: 'USDT' },
  };

  it('returns true for identical rules', () => {
    expect(areBotRulesEqual([baseRule], [{ ...baseRule }])).toBe(true);
  });

  it('returns false when bot params differ', () => {
    expect(
      areBotRulesEqual([baseRule], [
        { ...baseRule, botParams: { ...baseRule.botParams, paused: true } },
      ]),
    ).toBe(false);
  });

  it('ignores pairsToQuote order', () => {
    const left: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        pairsToQuote: [
          { dex: 'a', version: 'v2', poolAddress: '0x1' },
          { dex: 'b', version: 'v3', poolAddress: '0x2' },
        ],
      },
    };
    const right: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        pairsToQuote: [
          { dex: 'b', version: 'v3', poolAddress: '0x2' },
          { dex: 'a', version: 'v2', poolAddress: '0x1' },
        ],
      },
    };

    expect(areBotRulesEqual([left], [right])).toBe(true);
  });

  it('treats extraSettings string and parsed object as equal', () => {
    const sharedJobParams = {
      cexPairId: null,
      jobType: 'get_Dex_Quotes_By_Arb_Quoter_Script',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      source: 'dex:arbitrum',
      opts: {
        tokenIn: { decimals: 8, symbol: 'WBTC', address: '0x1' },
        tokenOut: { decimals: 18, symbol: 'WETH', address: '0x2' },
      },
      pairsToQuote: [{ dex: 'uniswap', version: 'v3', poolAddress: '0xabc' }],
    };
    const dbRule: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        ...sharedJobParams,
        extraSettings: '{\n  "amountIn": 0.001538,\n  "amountOut": 0.0303\n}\n',
      },
    };
    const serverRule: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        ...sharedJobParams,
        extraSettings: { amountIn: 0.001538, amountOut: 0.0303 },
      },
    };

    expect(areBotRulesEqual([dbRule], [serverRule])).toBe(true);
  });

  it('ignores feePpm in pairsToQuote on server side', () => {
    const dbRule: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        pairsToQuote: [{ dex: 'uniswap', version: 'v3', poolAddress: '0xabc' }],
      },
    };
    const serverRule: BotRuleItem = {
      id: '1',
      botParams: {},
      jobParams: {
        pairsToQuote: [{ dex: 'uniswap', version: 'v3', poolAddress: '0xabc', feePpm: 10000 }],
      },
    };

    expect(areBotRulesEqual([dbRule], [serverRule])).toBe(true);
  });
});
