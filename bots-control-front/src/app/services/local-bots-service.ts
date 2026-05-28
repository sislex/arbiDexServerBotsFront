import type { BotControlItem, BotInfo } from '../store/types';

const STORAGE_KEY = 'bots-control-local-bots';

export interface LocalBotConfig {
  botParams: Record<string, unknown>;
  jobParams: Record<string, unknown>;
}

export interface LocalBotRuntime {
  running: boolean;
  paused: boolean;
  createdAt: string;
  jobCount: number;
  errorCount: number;
  lastLatency: number;
  averageLatency: number;
  isSendData: boolean;
  arbitragesCount: number;
  lastJobTimeStart: string;
  lastJobTimeFinish: string;
  lastJobResult: unknown;
}

export interface LocalBotEntry {
  id: string;
  config: LocalBotConfig;
  runtime: LocalBotRuntime;
}

export type LocalBotsByServer = Record<string, LocalBotEntry[]>;

export const DEFAULT_LOCAL_BOT_CONFIG_TEMPLATE = JSON.stringify(
  {
    id: 'local-bot-001',
    botParams: {
      description: 'Local bot',
    },
    jobParams: {},
  },
  null,
  2,
);

const createDefaultRuntime = (): LocalBotRuntime => ({
  running: false,
  paused: true,
  createdAt: new Date().toISOString(),
  jobCount: 0,
  errorCount: 0,
  lastLatency: 0,
  averageLatency: 0,
  isSendData: false,
  arbitragesCount: 0,
  lastJobTimeStart: '-',
  lastJobTimeFinish: '-',
  lastJobResult: '-',
});

export const loadLocalBotsFromStorage = (): LocalBotsByServer => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as LocalBotsByServer;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const saveLocalBotsToStorage = (data: LocalBotsByServer) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getLocalBotsForServer = (
  data: LocalBotsByServer,
  serverKey: string,
): LocalBotEntry[] => data[serverKey] ?? [];

export const findLocalBot = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
): LocalBotEntry | undefined =>
  getLocalBotsForServer(data, serverKey).find((bot) => bot.id === botId);

export const isLocalBotId = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
): boolean => Boolean(findLocalBot(data, serverKey, botId));

export const localBotToControlItem = (entry: LocalBotEntry): BotControlItem => ({
  id: entry.id,
  running: entry.runtime.running && !entry.runtime.paused,
  status: entry.runtime.paused ? 'pause' : 'active',
  createdAt: entry.runtime.createdAt,
  jobCount: entry.runtime.jobCount,
  errorCount: entry.runtime.errorCount,
  lastLatency: entry.runtime.lastLatency,
  averageLatency: entry.runtime.averageLatency,
  arbitragesCount: entry.runtime.arbitragesCount,
  lastJobTimeFinish: entry.runtime.lastJobTimeFinish,
  botParams: entry.config.botParams,
  isLocal: true,
});

export const localBotToInfo = (entry: LocalBotEntry): BotInfo => ({
  id: entry.id,
  botParams: entry.config.botParams,
  jobParams: entry.config.jobParams,
  isLocal: true,
});

export const localBotToParams = (entry: LocalBotEntry): Record<string, unknown> => ({
  ...entry.runtime,
  paused: entry.runtime.paused,
  running: entry.runtime.running && !entry.runtime.paused,
});

export const parseLocalBotConfig = (
  rawConfig: string,
  existingIds: string[],
): { id: string; config: LocalBotConfig } => {
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

  const requestedId = String(parsed.id ?? botParams.id ?? '').trim();
  const baseId = requestedId || `local-${Date.now()}`;
  let id = baseId;
  let suffix = 1;
  while (existingIds.includes(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return {
    id,
    config: { botParams, jobParams },
  };
};

export const addLocalBotEntry = (
  data: LocalBotsByServer,
  serverKey: string,
  rawConfig: string,
): { next: LocalBotsByServer; entry: LocalBotEntry } => {
  const existingIds = getLocalBotsForServer(data, serverKey).map((bot) => bot.id);
  const { id, config } = parseLocalBotConfig(rawConfig, existingIds);
  const entry: LocalBotEntry = {
    id,
    config,
    runtime: createDefaultRuntime(),
  };
  const next = {
    ...data,
    [serverKey]: [...getLocalBotsForServer(data, serverKey), entry],
  };
  return { next, entry };
};

export const updateLocalBotRuntime = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
  patch: Partial<LocalBotRuntime>,
): LocalBotsByServer => {
  const bots = getLocalBotsForServer(data, serverKey);
  const index = bots.findIndex((bot) => bot.id === botId);
  if (index === -1) {
    return data;
  }

  const updated = [...bots];
  updated[index] = {
    ...updated[index],
    runtime: { ...updated[index].runtime, ...patch },
  };

  return { ...data, [serverKey]: updated };
};

export const updateLocalBotConfig = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
  config: LocalBotConfig,
): LocalBotsByServer => {
  const bots = getLocalBotsForServer(data, serverKey);
  const index = bots.findIndex((bot) => bot.id === botId);
  if (index === -1) {
    return data;
  }

  const updated = [...bots];
  updated[index] = {
    ...updated[index],
    config,
  };

  return { ...data, [serverKey]: updated };
};

export const setLocalBotPaused = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
  pause: boolean,
): LocalBotsByServer =>
  updateLocalBotRuntime(data, serverKey, botId, {
    paused: pause,
    running: !pause,
  });

export const restartLocalBot = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
): LocalBotsByServer =>
  updateLocalBotRuntime(data, serverKey, botId, {
    lastJobTimeStart: new Date().toISOString(),
    lastJobTimeFinish: '-',
    lastJobResult: 'restarted',
  });

export const removeLocalBotEntry = (
  data: LocalBotsByServer,
  serverKey: string,
  botId: string,
): LocalBotsByServer => {
  const bots = getLocalBotsForServer(data, serverKey).filter((bot) => bot.id !== botId);
  if (bots.length === getLocalBotsForServer(data, serverKey).length) {
    return data;
  }

  const next = { ...data, [serverKey]: bots };
  if (bots.length === 0) {
    delete next[serverKey];
  }
  return next;
};
