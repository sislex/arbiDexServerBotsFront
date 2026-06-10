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
  latency?: number;
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
    arbitrageCount?: number;
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
    arbitrages: toNumber(asRecord.arbitrageCount ?? asRecord.arbitragesCount),
    errors: toNumber(asRecord.errorCount),
    avgReqTime: `${toNumber(asRecord.latency ?? asRecord.averageLatency)}ms`,
    lastReqTime: `${toNumber(asRecord.lastLatency)}ms`,
    status: isActive ? 'active' : 'pause',
  };
};

const asConfigObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export const extractBotConfigParts = (
  botInfo: BotInfo | null,
): { botParams: Record<string, unknown>; jobParams: Record<string, unknown> } => {
  if (!botInfo) {
    return { botParams: {}, jobParams: {} };
  }

  if (botInfo.botParams || botInfo.jobParams) {
    return {
      botParams: asConfigObject(botInfo.botParams),
      jobParams: asConfigObject(botInfo.jobParams),
    };
  }

  const rawData = (botInfo as Record<string, unknown>).data;
  if (typeof rawData === 'string' && rawData.trim()) {
    try {
      const parsed = JSON.parse(rawData) as Record<string, unknown>;
      return {
        botParams: asConfigObject(parsed.botParams),
        jobParams: asConfigObject(parsed.jobParams),
      };
    } catch {
      return { botParams: {}, jobParams: {} };
    }
  }

  if (rawData && typeof rawData === 'object') {
    const parsed = rawData as Record<string, unknown>;
    return {
      botParams: asConfigObject(parsed.botParams),
      jobParams: asConfigObject(parsed.jobParams),
    };
  }

  return { botParams: {}, jobParams: {} };
};

export const buildBotConfigClipboardText = (botInfo: BotInfo | null): string => {
  const { botParams, jobParams } = extractBotConfigParts(botInfo);
  return JSON.stringify({ botParams, jobParams }, null, 2);
};

export const buildServerRulesClipboardText = (rules: BotRuleItem[]): string =>
  JSON.stringify({ botsRulesList: rules }, null, 2);

export const mapBotDetailsToViewModel = (
  botId: string,
  botInfo: BotInfo | null,
  botParams: Record<string, unknown> | null,
): BotControlDetailsViewModel => {
  const info = (botInfo ?? {}) as Record<string, unknown>;
  const { botParams: infoBotParams, jobParams: infoJobParams } = extractBotConfigParts(botInfo);
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
    botParamsJson: JSON.stringify(infoBotParams, null, 2),
    jobParamsJson: JSON.stringify(infoJobParams, null, 2),
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

export const suggestCopyBotId = (rules: BotRuleItem[], sourceId: string): string => {
  const usedIds = new Set(rules.map((rule) => rule.id));
  const numericIds = rules
    .map((rule) => Number(rule.id))
    .filter((value) => Number.isFinite(value));

  if (numericIds.length > 0) {
    let candidate = Math.max(...numericIds) + 1;
    while (usedIds.has(String(candidate))) {
      candidate += 1;
    }
    return String(candidate);
  }

  let candidate = `${sourceId}_copy`;
  let index = 2;
  while (usedIds.has(candidate)) {
    candidate = `${sourceId}_copy${index}`;
    index += 1;
  }
  return candidate;
};

export const buildSetBotConfigText = (
  rule: BotRuleItem,
  id: string = rule.id,
): string =>
  JSON.stringify(
    {
      id,
      botParams: rule.botParams,
      jobParams: rule.jobParams,
    },
    null,
    2,
  );

export const buildCopyBotConfigText = (rule: BotRuleItem, rules: BotRuleItem[]): string =>
  buildSetBotConfigText(rule, suggestCopyBotId(rules, rule.id));

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

export interface ServerConfigTypeRow {
  id: string;
  type: string;
  description: string;
}

const toConfigField = (value: unknown, fallback = '-') => {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : fallback;
};

export const buildBotTypeRowsFromRules = (rules: BotRuleItem[]): ServerConfigTypeRow[] =>
  rules.map((rule) => ({
    id: rule.id,
    type: toConfigField(rule.botParams?.botType),
    description: toConfigField(rule.botParams?.description),
  }));

export const buildJobTypeRowsFromRules = (rules: BotRuleItem[]): ServerConfigTypeRow[] =>
  rules.map((rule) => ({
    id: rule.id,
    type: toConfigField(rule.jobParams?.jobType),
    description: toConfigField(rule.jobParams?.description),
  }));

export const parseServerRulesConfigJson = (rawConfig: string): BotRuleItem[] => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawConfig);
  } catch {
    throw new Error('Invalid JSON config');
  }

  if (!parsed || (typeof parsed !== 'object' && !Array.isArray(parsed))) {
    throw new Error('Server config must be a JSON object or array');
  }

  if (!Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    if (!('botsRulesList' in record)) {
      throw new Error('Server config must contain botsRulesList');
    }
    if (!Array.isArray(record.botsRulesList)) {
      throw new Error('botsRulesList must be an array');
    }
  }

  return normalizeRulesList(parsed);
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
