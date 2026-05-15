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
