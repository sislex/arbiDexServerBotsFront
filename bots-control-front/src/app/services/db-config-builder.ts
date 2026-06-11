import type { BotRuleItem } from './bot-control-adapter';

export interface JobPair {
  dex: string;
  version: string;
  poolAddress: string;
}

const mapPoolToJobPair = (pool: {
  dex?: { name?: string };
  dexName?: string;
  version?: string | null;
  poolAddress?: string | null;
}): JobPair => ({
  dex: String(pool.dex?.name ?? pool.dexName ?? '')
    .trim()
    .toLowerCase(),
  version: String(pool.version ?? '').trim(),
  poolAddress: String(pool.poolAddress ?? '').trim(),
});

export const mapPoolJobRelationToJobPair = (relation: unknown): JobPair => {
  const pool =
    relation && typeof relation === 'object' && !Array.isArray(relation)
      ? ((relation as Record<string, unknown>).pool ?? {})
      : {};
  return mapPoolToJobPair(pool as Parameters<typeof mapPoolToJobPair>[0]);
};

const mapBotParams = (bot: Record<string, unknown>) => ({
  botType: String(bot.botName ?? ''),
  paused: Boolean(bot.paused),
  isRepeat: Boolean(bot.isRepeat),
  delayBetweenRepeat: Number(bot.delayBetweenRepeat ?? 0),
  maxJobs: Number(bot.maxJobs ?? 0),
  maxErrors: Number(bot.maxErrors ?? 0),
  timeoutMs: Number(bot.timeoutMs ?? 0),
  description: String(bot.description ?? ''),
});

const mapDexJobParams = (job: Record<string, unknown>) => {
  const relations = Array.isArray(job.poolsJobRelations) ? job.poolsJobRelations : [];
  const firstPool =
    relations[0] &&
    typeof relations[0] === 'object' &&
    !Array.isArray(relations[0]) &&
    (relations[0] as Record<string, unknown>).pool &&
    typeof (relations[0] as Record<string, unknown>).pool === 'object'
      ? (((relations[0] as Record<string, unknown>).pool ?? {}) as Record<string, unknown>)
      : {};
  const chain =
    job.chain && typeof job.chain === 'object' && !Array.isArray(job.chain)
      ? (job.chain as Record<string, unknown>)
      : {};
  const chainName = String(chain.name ?? '').toLowerCase();
  const rpcUrlRecord =
    job.rpcUrl && typeof job.rpcUrl === 'object' && !Array.isArray(job.rpcUrl)
      ? (job.rpcUrl as Record<string, unknown>)
      : {};
  const token0 =
    firstPool.token0 && typeof firstPool.token0 === 'object' && !Array.isArray(firstPool.token0)
      ? (firstPool.token0 as Record<string, unknown>)
      : {};
  const token1 =
    firstPool.token1 && typeof firstPool.token1 === 'object' && !Array.isArray(firstPool.token1)
      ? (firstPool.token1 as Record<string, unknown>)
      : {};

  return {
    extraSettings: job.extraSettings ?? {},
    cexPairId: null,
    jobType: String(job.jobType ?? job.job_type ?? '-'),
    rpcUrl: rpcUrlRecord.rpcUrl ?? null,
    source: chainName ? `dex:${chainName}` : 'dex:',
    opts: {
      tokenIn: {
        decimals: Number(token0.decimals ?? 0),
        symbol: String(token0.symbol ?? ''),
        address: String(token0.address ?? ''),
      },
      tokenOut: {
        decimals: Number(token1.decimals ?? 0),
        symbol: String(token1.symbol ?? ''),
        address: String(token1.address ?? ''),
      },
    },
    pairsToQuote: relations.map(mapPoolJobRelationToJobPair),
  };
};

const mapCexJobParams = (job: Record<string, unknown>) => {
  const pair =
    job.pair && typeof job.pair === 'object' && !Array.isArray(job.pair)
      ? (job.pair as Record<string, unknown>)
      : {};
  const chain =
    pair.chain && typeof pair.chain === 'object' && !Array.isArray(pair.chain)
      ? (pair.chain as Record<string, unknown>)
      : {};

  return {
    jobType: String(job.job_type ?? job.jobType ?? '-'),
    source: String(chain.name ?? ''),
    token0: String(job.token0 ?? pair.token0 ?? ''),
    token1: String(job.token1 ?? pair.token1 ?? ''),
  };
};

export const buildBotRulesFromDbBots = (bots: unknown[]): BotRuleItem[] =>
  bots
    .filter((bot): bot is Record<string, unknown> => Boolean(bot) && typeof bot === 'object' && !Array.isArray(bot))
    .map((bot) => {
      const id = String(bot.botId ?? bot.id ?? '').trim();
      const job =
        bot.job && typeof bot.job === 'object' && !Array.isArray(bot.job)
          ? (bot.job as Record<string, unknown>)
          : null;
      const cexJob =
        bot.cexJob && typeof bot.cexJob === 'object' && !Array.isArray(bot.cexJob)
          ? (bot.cexJob as Record<string, unknown>)
          : null;

      return {
        id,
        botParams: mapBotParams(bot),
        jobParams: job ? mapDexJobParams(job) : mapCexJobParams(cexJob ?? {}),
      };
    })
    .filter((rule) => rule.id.length > 0);
