import type { BotRuleItem } from './bot-control-adapter';

const toInt = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeExtraSettings = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return {};
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return {};
    }

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }

  return {};
};

const normalizeRpcUrl = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : null;
};

const normalizeTokenInfo = (value: unknown) => {
  const record =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    decimals: toInt(record.decimals),
    symbol: String(record.symbol ?? ''),
    address: String(record.address ?? ''),
  };
};

const normalizeJobPair = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  return {
    dex: String(record.dex ?? '')
      .trim()
      .toLowerCase(),
    version: String(record.version ?? '').trim(),
    poolAddress: String(record.poolAddress ?? '').trim(),
  };
};

const normalizePairsToQuote = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map(normalizeJobPair)
    .filter((pair): pair is NonNullable<typeof pair> => pair !== null)
    .sort((left, right) =>
      `${left.dex}|${left.version}|${left.poolAddress}`.localeCompare(
        `${right.dex}|${right.version}|${right.poolAddress}`,
      ),
    );

const normalizeBotParams = (params: Record<string, unknown>) => ({
  botType: String(params.botType ?? ''),
  paused: Boolean(params.paused),
  isRepeat: Boolean(params.isRepeat),
  delayBetweenRepeat: toInt(params.delayBetweenRepeat),
  maxJobs: toInt(params.maxJobs),
  maxErrors: toInt(params.maxErrors),
  timeoutMs: toInt(params.timeoutMs),
  description: String(params.description ?? ''),
});

const isDexJobParams = (jobParams: Record<string, unknown>) =>
  Array.isArray(jobParams.pairsToQuote) ||
  (jobParams.opts && typeof jobParams.opts === 'object') ||
  String(jobParams.source ?? '').startsWith('dex:');

const normalizeDexJobParams = (jobParams: Record<string, unknown>) => {
  const opts =
    jobParams.opts && typeof jobParams.opts === 'object' && !Array.isArray(jobParams.opts)
      ? (jobParams.opts as Record<string, unknown>)
      : {};

  return {
    extraSettings: normalizeExtraSettings(jobParams.extraSettings),
    cexPairId: null,
    jobType: String(jobParams.jobType ?? jobParams.job_type ?? '-'),
    rpcUrl: normalizeRpcUrl(jobParams.rpcUrl),
    source: String(jobParams.source ?? '').toLowerCase(),
    opts: {
      tokenIn: normalizeTokenInfo(opts.tokenIn),
      tokenOut: normalizeTokenInfo(opts.tokenOut),
    },
    pairsToQuote: normalizePairsToQuote(jobParams.pairsToQuote),
  };
};

const normalizeCexJobParams = (jobParams: Record<string, unknown>) => ({
  jobType: String(jobParams.jobType ?? jobParams.job_type ?? '-'),
  source: String(jobParams.source ?? ''),
  token0: String(jobParams.token0 ?? ''),
  token1: String(jobParams.token1 ?? ''),
});

export const normalizeRuleForCompare = (rule: BotRuleItem) => ({
  id: String(rule.id).trim(),
  botParams: normalizeBotParams(rule.botParams),
  jobParams: isDexJobParams(rule.jobParams)
    ? normalizeDexJobParams(rule.jobParams)
    : normalizeCexJobParams(rule.jobParams),
});

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
};

const normalizeRulesForCompare = (rules: BotRuleItem[]) =>
  [...rules]
    .map(normalizeRuleForCompare)
    .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));

export const areBotRulesEqual = (left: BotRuleItem[], right: BotRuleItem[]): boolean => {
  const normalizedLeft = normalizeRulesForCompare(left);
  const normalizedRight = normalizeRulesForCompare(right);
  return stableStringify(normalizedLeft) === stableStringify(normalizedRight);
};
