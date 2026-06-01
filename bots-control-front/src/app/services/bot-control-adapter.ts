import type { BotControlItem, BotInfo } from '../store/types';

interface BotParamsLike {
  paused?: boolean;
  description?: string;
}

interface BotRuntimeLike {
  running?: boolean;
  createdAt?: string;
  jobCount?: number;
  errorCount?: number;
  lastLatency?: number;
  averageLatency?: number;
  lastJobTimeStart?: string;
  lastJobTimeFinish?: string;
  lastJobResult?: unknown;
}

export interface BotListRowViewModel {
  id: string;
  description: string;
  created: string;
  jobs: number;
  arbitrages: number;
  errors: number;
  avgReqTime: string;
  lastReqTime: string;
  status: string;
}

export interface BotControlDetailsViewModel {
  status: 'active' | 'paused';
  running: boolean;
  createdAt: string;
  jobCount: number;
  errorCount: number;
  lastLatency: number;
  lastJobTimeStart: string;
  lastJobTimeFinish: string;
  lastJobResult: unknown;
  isSendData: boolean;
  botParamsJson: string;
  jobParamsJson: string;
}

const toNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toStringSafe = (value: unknown, fallback = '-') => {
  const str = String(value ?? '').trim();
  return str.length > 0 ? str : fallback;
};

export const mapBotItemToListRow = (
  item: BotControlItem,
  fallbackDescription: string,
): BotListRowViewModel => {
  const asRecord = item as BotRuntimeLike & {
    arbitragesCount?: number;
    status?: string;
    botParams?: BotParamsLike;
    description?: string;
  };
  const description =
    toStringSafe(asRecord.botParams?.description, '') ||
    toStringSafe(asRecord.description, '') ||
    fallbackDescription ||
    '-';
  const isActive =
    asRecord.status === 'active' ||
    (typeof asRecord.running === 'boolean' ? asRecord.running : false);

  return {
    id: toStringSafe(item.id, ''),
    description,
    created: toStringSafe(asRecord.createdAt, '-'),
    jobs: toNumber(asRecord.jobCount),
    arbitrages: toNumber(asRecord.arbitragesCount),
    errors: toNumber(asRecord.errorCount),
    avgReqTime: `${toNumber(asRecord.averageLatency ?? asRecord.lastLatency)}ms`,
    lastReqTime: `${toNumber(asRecord.lastLatency)}ms`,
    status: isActive ? 'active' : 'pause',
  };
};

export const mapBotDetailsToViewModel = (
  botId: string,
  botInfo: BotInfo | null,
  botParams: Record<string, unknown> | null,
): BotControlDetailsViewModel => {
  const info = (botInfo ?? {}) as Record<string, unknown>;
  const infoBotParams = ((botInfo?.botParams as Record<string, unknown> | undefined) ??
    {}) as Record<string, unknown>;
  const params = (botParams ?? {}) as Record<string, unknown>;

  const paused = Boolean(params.paused ?? infoBotParams.paused ?? false);
  const running = !paused;

  return {
    status: running ? 'active' : 'paused',
    running: Boolean(params.running ?? info.running ?? false),
    createdAt: toStringSafe(params.createdAt ?? info.createdAt, '-'),
    jobCount: toNumber(params.jobCount ?? info.jobCount),
    errorCount: toNumber(params.errorCount ?? info.errorCount),
    lastLatency: toNumber(params.lastLatency ?? info.lastLatency),
    lastJobTimeStart: toStringSafe(params.lastJobTimeStart, '-'),
    lastJobTimeFinish: toStringSafe(params.lastJobTimeFinish, '-'),
    lastJobResult: params.lastJobResult ?? info.lastJobResult ?? '-',
    isSendData: Boolean(params.isSendData ?? info.isSendData ?? false),
    botParamsJson: JSON.stringify((botInfo?.botParams as Record<string, unknown> | undefined) ?? {}, null, 2),
    jobParamsJson: JSON.stringify((botInfo?.jobParams as Record<string, unknown> | undefined) ?? {}, null, 2),
  };
};

export const getEmptySettingsPayload = (botId: string) =>
  JSON.stringify(
    {
      id: botId,
      botParams: {},
      jobParams: {},
    },
    null,
    2,
  );

export interface ParsedBotConfig {
  id: string;
  botParams: Record<string, unknown>;
  jobParams: Record<string, unknown>;
}

export const parseBotConfigJson = (rawConfig: string): ParsedBotConfig => {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawConfig) as Record<string, unknown>;
  } catch {
    throw new Error('Invalid JSON config');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Bot config must be a JSON object');
  }

  const botParams = (parsed.botParams ?? {}) as Record<string, unknown>;
  const jobParams = (parsed.jobParams ?? {}) as Record<string, unknown>;

  if (typeof botParams !== 'object' || Array.isArray(botParams)) {
    throw new Error('botParams must be an object');
  }
  if (typeof jobParams !== 'object' || Array.isArray(jobParams)) {
    throw new Error('jobParams must be an object');
  }

  const id = String(parsed.id ?? botParams.id ?? '').trim();
  if (!id) {
    throw new Error('Bot id is required');
  }

  return { id, botParams, jobParams };
};

export const buildBotSettingsPayload = (
  id: string,
  botParams: Record<string, unknown>,
  jobParams: Record<string, unknown>,
) => JSON.stringify({ id, botParams, jobParams });

export interface BotRuleItem {
  id: string;
  botParams: Record<string, unknown>;
  jobParams: Record<string, unknown>;
}

const normalizeBotRuleItem = (item: unknown): BotRuleItem | null => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = String(record.id ?? '').trim();
  if (!id) {
    return null;
  }

  return {
    id,
    botParams: (record.botParams ?? {}) as Record<string, unknown>,
    jobParams: (record.jobParams ?? {}) as Record<string, unknown>,
  };
};

export const normalizeRulesList = (response: unknown): BotRuleItem[] => {
  if (Array.isArray(response)) {
    return response
      .map(normalizeBotRuleItem)
      .filter((item): item is BotRuleItem => item !== null);
  }

  if (response && typeof response === 'object') {
    const list = (response as Record<string, unknown>).botsRulesList;
    if (Array.isArray(list)) {
      return list
        .map(normalizeBotRuleItem)
        .filter((item): item is BotRuleItem => item !== null);
    }
  }

  return [];
};

export const mergeBotRuleIntoList = (
  rules: BotRuleItem[],
  newRule: BotRuleItem,
): BotRuleItem[] => {
  const index = rules.findIndex((rule) => rule.id === newRule.id);
  if (index === -1) {
    return [...rules, newRule];
  }

  const next = [...rules];
  next[index] = newRule;
  return next;
};

export const removeBotRuleFromList = (rules: BotRuleItem[], botId: string): BotRuleItem[] =>
  rules.filter((rule) => rule.id !== botId);

export const DEFAULT_BOT_CONFIG_TEMPLATE = JSON.stringify(
  {
    id: '59',
    botParams: {
      botType: 'TestBot',
      paused: true,
      isRepeat: true,
      delayBetweenRepeat: 200,
      maxJobs: 1000000,
      maxErrors: 100,
      timeoutMs: 30000,
      description: 'My bot',
    },
    jobParams: {
      jobType: 'get_Cex_Quotes',
      source: 'dzengi',
      token0: 'ETH',
      token1: 'FDUSD',
    },
  },
  null,
  2,
);
