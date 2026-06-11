import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  mergeBotRuleIntoList,
  normalizeRulesList,
  applyBotConfigForBotId,
  parseBotConfigJson,
  parseServerRulesConfigJson,
  removeBotRuleFromList,
} from '../../services/bot-control-adapter';
import {
  buildBotRuntimeSnapshots,
  waitForBotsRestart,
  waitForBotsRunningState,
} from '../../services/bot-pause-utils';
import { serverApi } from '../../services/server-api';
import { DEFAULT_SERVER_LIST } from '../constants';
import { createAsyncState } from '../utils';
import type {
  ServerItem,
  DbServerItem,
  ServerData,
  TypeListItem,
  BotControlItem,
  RuleItem,
  BotInfo,
  AsyncState,
} from '../types';

interface ServersState {
  serverList: ServerItem[];
  activeServer: ServerItem;
  serverData: AsyncState<ServerData | null>;
  botTypes: AsyncState<TypeListItem[]>;
  jobTypes: AsyncState<TypeListItem[]>;
  botControlList: AsyncState<BotControlItem[]>;
  rulesList: AsyncState<RuleItem[]>;
  activeBotInfo: AsyncState<BotInfo | null>;
  activeBotParams: AsyncState<Record<string, unknown> | null>;
  activeBotErrors: AsyncState<Record<string, unknown>[]>;
  activeBotArbitrage: AsyncState<Record<string, unknown>[]>;
  botControlAction: AsyncState<Record<string, unknown> | null>;
  pendingBotIds: string[];
}

const initialServer = DEFAULT_SERVER_LIST[1] ?? DEFAULT_SERVER_LIST[0];

const initialState: ServersState = {
  serverList: DEFAULT_SERVER_LIST,
  activeServer: initialServer,
  serverData: createAsyncState<ServerData | null>(null),
  botTypes: createAsyncState<TypeListItem[]>([]),
  jobTypes: createAsyncState<TypeListItem[]>([]),
  botControlList: createAsyncState<BotControlItem[]>([]),
  rulesList: createAsyncState<RuleItem[]>([]),
  activeBotInfo: createAsyncState<BotInfo | null>(null),
  activeBotParams: createAsyncState<Record<string, unknown> | null>(null),
  activeBotErrors: createAsyncState<Record<string, unknown>[]>([]),
  activeBotArbitrage: createAsyncState<Record<string, unknown>[]>([]),
  botControlAction: createAsyncState<Record<string, unknown> | null>(null),
  pendingBotIds: [],
};

const addPendingBotId = (state: ServersState, botId: string) => {
  if (!state.pendingBotIds.includes(botId)) {
    state.pendingBotIds.push(botId);
  }
};

const removePendingBotId = (state: ServersState, botId: string) => {
  state.pendingBotIds = state.pendingBotIds.filter((id) => id !== botId);
};

const addPendingBotIds = (state: ServersState, botIds: string[]) => {
  botIds.forEach((botId) => addPendingBotId(state, botId));
};

const removePendingBotIds = (state: ServersState, botIds: string[]) => {
  botIds.forEach((botId) => removePendingBotId(state, botId));
};

const normalizeBotIds = (botIds: string[]) =>
  [...new Set(botIds.map((id) => String(id).trim()).filter(Boolean))];

const splitBulkBotResults = (results: { id: string; error?: string }[], requestedIds: string[]) => {
  const resultById = new Map(results.map((item) => [item.id, item]));
  const successfulBotIds: string[] = [];
  let failed = 0;

  requestedIds.forEach((botId) => {
    const item = resultById.get(botId);
    if (!item || item.error) {
      failed += 1;
      return;
    }
    successfulBotIds.push(botId);
  });

  return { successfulBotIds, failed };
};

const getActiveServerKey = (state: { servers: ServersState }) =>
  `${state.servers.activeServer.ip}:${state.servers.activeServer.port}`;

const getServerKey = (server: Pick<ServerItem, 'ip' | 'port'>) => `${server.ip}:${server.port}`;

const mapApiBotsToControlItems = (items: Record<string, unknown>[]): BotControlItem[] =>
  items.map((item) => ({
    ...(item as BotControlItem),
    id: String(item.id ?? (item as Record<string, unknown>).botId ?? ''),
    running: Boolean(item.running),
    status: item.running ? 'active' : 'pause',
  }));

const parseIpPort = (ipPort: string): ServerItem | null => {
  const [ip = '', port = ''] = ipPort.split(':');
  if (!ip || !port) {
    return null;
  }
  return { ip, port, name: `SERVER_${ip}:${port}` };
};

const parseDbServerItem = (item: DbServerItem): ServerItem | null => {
  const ip = String(item.ip ?? '').trim();
  const port = String(item.port ?? '').trim();
  const serverName = String(item.serverName ?? '').trim();

  if (ip && port) {
    const serverId = String(item.serverId ?? '').trim() || undefined;
    return {
      ip,
      port,
      name: serverName || `SERVER_${ip}:${port}`,
      serverId,
    };
  }

  if (item.ipPort) {
    return parseIpPort(String(item.ipPort));
  }

  return null;
};

export const loadServerData = createAsyncThunk(
  'servers/loadServerData',
  async (_, { getState }) => {
    const response = await serverApi.getServerInfo(
      getActiveServerKey(getState() as { servers: ServersState }),
    );
    return response;
  },
);

export const loadServersFromDb = createAsyncThunk('servers/loadServersFromDb', async () => {
  const response = await serverApi.getServersFromDb();
  const parsed = response
    .map((item) => parseDbServerItem(item))
    .filter((item): item is ServerItem => Boolean(item));
  return parsed;
});

export const loadBotTypes = createAsyncThunk('servers/loadBotTypes', async (_, { getState }) => {
  return serverApi.getBotTypes(getActiveServerKey(getState() as { servers: ServersState }));
});

export const loadJobTypes = createAsyncThunk('servers/loadJobTypes', async (_, { getState }) => {
  return serverApi.getJobTypes(getActiveServerKey(getState() as { servers: ServersState }));
});

export interface LoadBotControlListOptions {
  silent?: boolean;
  prefetchedBots?: Record<string, unknown>[];
  serverKey?: string;
}

export interface RemoveBotFromServerPayload {
  botId: string;
  serverKey: string;
}

export interface RemoveBotsFromServerPayload {
  botIds: string[];
  serverKey: string;
}

export const loadBotControlList = createAsyncThunk(
  'servers/loadBotControlList',
  async (options: LoadBotControlListOptions | void, { getState }) => {
    const serverKey =
      options?.serverKey ?? getActiveServerKey(getState() as { servers: ServersState });
    const items =
      options?.prefetchedBots ?? (await serverApi.getBots(serverKey));
    return {
      serverKey,
      bots: mapApiBotsToControlItems(Array.isArray(items) ? items : []),
    };
  },
);

const refreshBotControlListAfterRunningChange = async (
  activeServer: string,
  botIds: string[],
  expectedRunning: boolean,
  dispatch: (action: unknown) => unknown,
) => {
  try {
    const bots = await waitForBotsRunningState(activeServer, botIds, expectedRunning);
    await dispatch(
      loadBotControlList({ silent: true, prefetchedBots: bots, serverKey: activeServer }),
    );
  } catch {
    await dispatch(loadBotControlList({ silent: true, serverKey: activeServer }));
  }
};

const refreshBotControlListAfterRestart = async (
  activeServer: string,
  botIds: string[],
  snapshotsBefore: ReturnType<typeof buildBotRuntimeSnapshots>,
  dispatch: (action: unknown) => unknown,
) => {
  try {
    const bots = await waitForBotsRestart(activeServer, botIds, snapshotsBefore);
    await dispatch(
      loadBotControlList({ silent: true, prefetchedBots: bots, serverKey: activeServer }),
    );
  } catch {
    await dispatch(loadBotControlList({ silent: true, serverKey: activeServer }));
  }
};

export const setBotFromConfig = createAsyncThunk(
  'servers/setBotFromConfig',
  async (rawConfig: string, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const { id, botParams, jobParams } = parseBotConfigJson(rawConfig);
    const newRule = { id, botParams, jobParams };

    const currentRules = normalizeRulesList(await serverApi.getRules(activeServer));
    const botsRulesList = mergeBotRuleIntoList(currentRules, newRule);

    await serverApi.setBotsRulesList(activeServer, botsRulesList);

    const paused = Boolean(botParams.paused);
    await serverApi.setBotPause(activeServer, id, paused);

    if (!paused) {
      const botsBefore = await serverApi.getBots(activeServer);
      const snapshots = buildBotRuntimeSnapshots(
        botsBefore as Record<string, unknown>[],
        [id],
      );
      await serverApi.restartBot(activeServer, id);
      await refreshBotControlListAfterRestart(activeServer, [id], snapshots, dispatch);
    } else {
      await refreshBotControlListAfterRunningChange(activeServer, [id], false, dispatch);
    }

    await dispatch(loadRulesList());
    return { id, paused };
  },
);

export const updateBotFromConfig = createAsyncThunk(
  'servers/updateBotFromConfig',
  async (
    { botId, rawConfig }: { botId: string; rawConfig: string },
    { getState, dispatch },
  ) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const { id, botParams, jobParams } = applyBotConfigForBotId(rawConfig, botId);
    const newRule = { id, botParams, jobParams };

    const currentRules = normalizeRulesList(await serverApi.getRules(activeServer));
    const botsRulesList = mergeBotRuleIntoList(currentRules, newRule);

    await serverApi.setBotsRulesList(activeServer, botsRulesList);

    const paused = Boolean(botParams.paused);
    await serverApi.setBotPause(activeServer, id, paused);

    if (!paused) {
      const botsBefore = await serverApi.getBots(activeServer);
      const snapshots = buildBotRuntimeSnapshots(
        botsBefore as Record<string, unknown>[],
        [id],
      );
      await serverApi.restartBot(activeServer, id);
      await refreshBotControlListAfterRestart(activeServer, [id], snapshots, dispatch);
    } else {
      await refreshBotControlListAfterRunningChange(activeServer, [id], false, dispatch);
    }

    await dispatch(loadRulesList());
    return { id, paused };
  },
);

export const saveServerRulesFromConfig = createAsyncThunk(
  'servers/saveServerRulesFromConfig',
  async (rawConfig: string, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const botsRulesList = parseServerRulesConfigJson(rawConfig);

    await serverApi.setBotsRulesList(activeServer, botsRulesList);

    await Promise.all(
      botsRulesList.map((rule) =>
        serverApi.setBotPause(activeServer, rule.id, Boolean(rule.botParams?.paused)),
      ),
    );

    const botsToRestart = botsRulesList
      .filter((rule) => !Boolean(rule.botParams?.paused))
      .map((rule) => rule.id);

    if (botsToRestart.length > 0) {
      const botsBefore = await serverApi.getBots(activeServer);
      const snapshots = buildBotRuntimeSnapshots(
        botsBefore as Record<string, unknown>[],
        botsToRestart,
      );
      await serverApi.restartBots(activeServer, botsToRestart);
      await refreshBotControlListAfterRestart(
        activeServer,
        botsToRestart,
        snapshots,
        dispatch,
      );
    } else {
      await dispatch(loadBotControlList({ silent: true }));
    }

    await dispatch(loadRulesList());
    return { total: botsRulesList.length, restarted: botsToRestart.length };
  },
);

const removeBotsFromServerRules = async (
  activeServer: string,
  botIds: string[],
  dispatch: (action: unknown) => unknown,
) => {
  const uniqueBotIds = [...new Set(botIds.map((id) => String(id).trim()).filter(Boolean))];
  if (uniqueBotIds.length === 0) {
    throw new Error('No bots selected for removal');
  }

  const currentRules = normalizeRulesList(await serverApi.getRules(activeServer));
  let botsRulesList = currentRules;
  const removedBotIds: string[] = [];

  uniqueBotIds.forEach((botId) => {
    const nextRules = removeBotRuleFromList(botsRulesList, botId);
    if (nextRules.length !== botsRulesList.length) {
      botsRulesList = nextRules;
      removedBotIds.push(botId);
    }
  });

  if (removedBotIds.length === 0) {
    throw new Error('Bot not found in server rules list');
  }

  await serverApi.setBotsPause(activeServer, removedBotIds, true);
  await serverApi.setBotsRulesList(activeServer, botsRulesList);
  await dispatch(loadBotControlList({ silent: true, serverKey: activeServer }));
  await dispatch(loadRulesList({ serverKey: activeServer }));
  return removedBotIds;
};

export const removeBotFromServer = createAsyncThunk(
  'servers/removeBotFromServer',
  async ({ botId, serverKey }: RemoveBotFromServerPayload, { dispatch }) => {
    const removedBotIds = await removeBotsFromServerRules(serverKey, [botId], dispatch);
    return removedBotIds[0] ?? botId;
  },
);

export const removeBotsFromServer = createAsyncThunk(
  'servers/removeBotsFromServer',
  async ({ botIds, serverKey }: RemoveBotsFromServerPayload, { dispatch }) => {
    return removeBotsFromServerRules(serverKey, botIds, dispatch);
  },
);

export const loadRulesList = createAsyncThunk(
  'servers/loadRulesList',
  async (options: { serverKey?: string } | void, { getState }) => {
    const serverKey =
      options?.serverKey ?? getActiveServerKey(getState() as { servers: ServersState });
    const response = await serverApi.getRules(serverKey);
    return {
      serverKey,
      rules: normalizeRulesList(response),
    };
  },
);

export const loadActiveBotAll = createAsyncThunk(
  'servers/loadActiveBotAll',
  async (botId: string, { getState }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const [info, params, errors, arbitrage] = await Promise.all([
      serverApi.getBotInfo(activeServer, botId),
      serverApi.getBotParams(activeServer, botId),
      serverApi.getBotErrors(activeServer, botId),
      serverApi.getBotArbitrage(activeServer, botId),
    ]);

    return { info, params, errors, arbitrage };
  },
);

export const setBotPaused = createAsyncThunk(
  'servers/setBotPaused',
  async ({ botId, pause }: { botId: string; pause: boolean }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.setBotPause(activeServer, botId, pause);
    await refreshBotControlListAfterRunningChange(activeServer, [botId], !pause, dispatch);
    await dispatch(loadActiveBotAll(botId));
    return response;
  },
);

export const setSingleBotPaused = createAsyncThunk(
  'servers/setSingleBotPaused',
  async ({ botId, pause }: { botId: string; pause: boolean }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.setBotPause(activeServer, botId, pause);
    await refreshBotControlListAfterRunningChange(activeServer, [botId], !pause, dispatch);
    return response;
  },
);

const pauseBotIds = async (
  activeServer: string,
  botIds: string[],
  pause: boolean,
  dispatch: (action: unknown) => unknown,
) => {
  const uniqueBotIds = normalizeBotIds(botIds);
  if (uniqueBotIds.length === 0) {
    throw new Error('No bots selected');
  }

  const results = await serverApi.setBotsPause(activeServer, uniqueBotIds, pause);
  const { successfulBotIds, failed: failedCount } = splitBulkBotResults(results, uniqueBotIds);

  if (successfulBotIds.length > 0) {
    await refreshBotControlListAfterRunningChange(
      activeServer,
      successfulBotIds,
      !pause,
      dispatch,
    );
  }

  if (successfulBotIds.length === 0) {
    throw new Error(
      `Failed to ${pause ? 'stop' : 'start'} all ${uniqueBotIds.length} bots`,
    );
  }

  return {
    action: pause ? 'stop-selected' : 'start-selected',
    botIds: uniqueBotIds,
    total: uniqueBotIds.length,
    success: successfulBotIds.length,
    failed: failedCount,
  };
};

const restartBotIds = async (
  activeServer: string,
  botIds: string[],
  dispatch: (action: unknown) => unknown,
) => {
  const uniqueBotIds = normalizeBotIds(botIds);
  if (uniqueBotIds.length === 0) {
    throw new Error('No bots selected');
  }

  const botsBefore = await serverApi.getBots(activeServer);
  const snapshots = buildBotRuntimeSnapshots(
    botsBefore as Record<string, unknown>[],
    uniqueBotIds,
  );

  const results = await serverApi.restartBots(activeServer, uniqueBotIds);
  const { successfulBotIds, failed: failedCount } = splitBulkBotResults(results, uniqueBotIds);

  if (successfulBotIds.length > 0) {
    await refreshBotControlListAfterRestart(
      activeServer,
      successfulBotIds,
      snapshots,
      dispatch,
    );
  }

  if (successfulBotIds.length === 0) {
    throw new Error(`Failed to restart all ${uniqueBotIds.length} bots`);
  }

  return {
    action: 'restart-selected',
    botIds: uniqueBotIds,
    total: uniqueBotIds.length,
    success: successfulBotIds.length,
    failed: failedCount,
  };
};

export const setSelectedBotsPaused = createAsyncThunk(
  'servers/setSelectedBotsPaused',
  async ({ botIds, pause }: { botIds: string[]; pause: boolean }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    return pauseBotIds(activeServer, botIds, pause, dispatch);
  },
);

export const setAllBotsPaused = createAsyncThunk(
  'servers/setAllBotsPaused',
  async ({ pause, botIds }: { pause: boolean; botIds: string[] }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const result = await pauseBotIds(activeServer, botIds, pause, dispatch);
    return { ...result, action: pause ? ('stop-all' as const) : ('start-all' as const) };
  },
);

export const restartSelectedBots = createAsyncThunk(
  'servers/restartSelectedBots',
  async (botIds: string[], { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    return restartBotIds(activeServer, botIds, dispatch);
  },
);

export const restartBot = createAsyncThunk(
  'servers/restartBot',
  async (botId: string, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const botsBefore = await serverApi.getBots(activeServer);
    const snapshots = buildBotRuntimeSnapshots(
      botsBefore as Record<string, unknown>[],
      [botId],
    );
    const response = await serverApi.restartBot(activeServer, botId);
    await refreshBotControlListAfterRestart(activeServer, [botId], snapshots, dispatch);
    await dispatch(loadActiveBotAll(botId));
    return response;
  },
);

export const restartAllBots = createAsyncThunk(
  'servers/restartAllBots',
  async (botIds: string[], { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const result = await restartBotIds(activeServer, botIds, dispatch);
    return { ...result, action: 'restart-all' as const };
  },
);

export const setBotSendData = createAsyncThunk(
  'servers/setBotSendData',
  async (
    { botId, isSendData }: { botId: string; isSendData: boolean },
    { getState, dispatch },
  ) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.setBotSendData(activeServer, botId, isSendData);
    await dispatch(loadActiveBotAll(botId));
    await dispatch(loadBotControlList());
    return response;
  },
);

export const saveBotSettings = createAsyncThunk(
  'servers/saveBotSettings',
  async ({ botId, data }: { botId: string; data: string }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.setBotSettings(activeServer, botId, data);
    await dispatch(loadActiveBotAll(botId));
    return response;
  },
);

export const refreshActiveBotTabData = createAsyncThunk(
  'servers/refreshActiveBotTabData',
  async (
    { botId, activeTab }: { botId: string; activeTab: 'control' | 'errors' | 'chart' | 'live-chart' },
    { getState },
  ) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    if (activeTab === 'control' || activeTab === 'chart' || activeTab === 'live-chart') {
      const [info, params] = await Promise.all([
        serverApi.getBotInfo(activeServer, botId),
        serverApi.getBotParams(activeServer, botId),
      ]);
      return { activeTab, info, params, errors: null };
    }

    const errors = await serverApi.getBotErrors(activeServer, botId);
    return { activeTab, info: null, params: null, errors };
  },
);

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    setActiveServer(state, action: PayloadAction<ServerItem>) {
      const nextKey = getServerKey(action.payload);
      const currentKey = getServerKey(state.activeServer);
      if (nextKey !== currentKey) {
        state.botControlList = createAsyncState<BotControlItem[]>([]);
        state.rulesList = createAsyncState<RuleItem[]>([]);
      }
      state.activeServer = action.payload;
    },
    clearActiveBotData(state) {
      state.activeBotInfo = createAsyncState<BotInfo | null>(null);
      state.activeBotParams = createAsyncState<Record<string, unknown> | null>(null);
      state.activeBotErrors = createAsyncState<Record<string, unknown>[]>([]);
      state.activeBotArbitrage = createAsyncState<Record<string, unknown>[]>([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadServerData.pending, (state) => {
        state.serverData.isLoading = true;
        state.serverData.error = null;
      })
      .addCase(loadServerData.fulfilled, (state, action) => {
        state.serverData.isLoading = false;
        state.serverData.isLoaded = true;
        state.serverData.data = action.payload;
      })
      .addCase(loadServerData.rejected, (state, action) => {
        state.serverData.isLoading = false;
        state.serverData.isLoaded = true;
        state.serverData.error = action.error.message ?? 'Failed to load server data';
      })
      .addCase(loadServersFromDb.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.serverList = action.payload;
          const matchingActive = action.payload.find(
            (server) =>
              server.ip === state.activeServer.ip && server.port === state.activeServer.port,
          );

          if (matchingActive) {
            state.activeServer = matchingActive;
          }
        }
      })
      .addCase(loadBotTypes.pending, (state) => {
        state.botTypes.isLoading = true;
        state.botTypes.error = null;
      })
      .addCase(loadBotTypes.fulfilled, (state, action) => {
        state.botTypes.isLoading = false;
        state.botTypes.isLoaded = true;
        state.botTypes.data = action.payload ?? [];
      })
      .addCase(loadBotTypes.rejected, (state, action) => {
        state.botTypes.isLoading = false;
        state.botTypes.isLoaded = true;
        state.botTypes.error = action.error.message ?? 'Failed to load bot types';
      })
      .addCase(loadJobTypes.pending, (state) => {
        state.jobTypes.isLoading = true;
        state.jobTypes.error = null;
      })
      .addCase(loadJobTypes.fulfilled, (state, action) => {
        state.jobTypes.isLoading = false;
        state.jobTypes.isLoaded = true;
        state.jobTypes.data = action.payload ?? [];
      })
      .addCase(loadJobTypes.rejected, (state, action) => {
        state.jobTypes.isLoading = false;
        state.jobTypes.isLoaded = true;
        state.jobTypes.error = action.error.message ?? 'Failed to load job types';
      })
      .addCase(loadBotControlList.pending, (state, action) => {
        if (!action.meta.arg?.silent) {
          state.botControlList.isLoading = true;
        }
        state.botControlList.error = null;
      })
      .addCase(loadBotControlList.fulfilled, (state, action) => {
        if (action.payload.serverKey !== getServerKey(state.activeServer)) {
          return;
        }
        state.botControlList.isLoading = false;
        state.botControlList.isLoaded = true;
        state.botControlList.data = action.payload.bots;
      })
      .addCase(loadBotControlList.rejected, (state, action) => {
        state.botControlList.isLoading = false;
        state.botControlList.isLoaded = true;
        state.botControlList.error = action.error.message ?? 'Failed to load bots';
      })
      .addCase(loadRulesList.pending, (state) => {
        state.rulesList.isLoading = true;
        state.rulesList.error = null;
      })
      .addCase(loadRulesList.fulfilled, (state, action) => {
        if (action.payload.serverKey !== getServerKey(state.activeServer)) {
          return;
        }
        state.rulesList.isLoading = false;
        state.rulesList.isLoaded = true;
        state.rulesList.data = action.payload.rules ?? [];
      })
      .addCase(loadRulesList.rejected, (state, action) => {
        state.rulesList.isLoading = false;
        state.rulesList.isLoaded = true;
        state.rulesList.error = action.error.message ?? 'Failed to load rules';
      })
      .addCase(loadActiveBotAll.pending, (state) => {
        state.activeBotInfo.isLoading = true;
        state.activeBotParams.isLoading = true;
        state.activeBotErrors.isLoading = true;
        state.activeBotArbitrage.isLoading = true;

        state.activeBotInfo.error = null;
        state.activeBotParams.error = null;
        state.activeBotErrors.error = null;
        state.activeBotArbitrage.error = null;
      })
      .addCase(loadActiveBotAll.fulfilled, (state, action) => {
        state.activeBotInfo.isLoading = false;
        state.activeBotInfo.isLoaded = true;
        state.activeBotInfo.data = action.payload.info;

        state.activeBotParams.isLoading = false;
        state.activeBotParams.isLoaded = true;
        state.activeBotParams.data = action.payload.params;

        state.activeBotErrors.isLoading = false;
        state.activeBotErrors.isLoaded = true;
        state.activeBotErrors.data = action.payload.errors ?? [];

        state.activeBotArbitrage.isLoading = false;
        state.activeBotArbitrage.isLoaded = true;
        state.activeBotArbitrage.data = action.payload.arbitrage ?? [];
      })
      .addCase(loadActiveBotAll.rejected, (state, action) => {
        const message = action.error.message ?? 'Failed to load bot details';

        state.activeBotInfo.isLoading = false;
        state.activeBotInfo.isLoaded = true;
        state.activeBotInfo.error = message;

        state.activeBotParams.isLoading = false;
        state.activeBotParams.isLoaded = true;
        state.activeBotParams.error = message;

        state.activeBotErrors.isLoading = false;
        state.activeBotErrors.isLoaded = true;
        state.activeBotErrors.error = message;

        state.activeBotArbitrage.isLoading = false;
        state.activeBotArbitrage.isLoaded = true;
        state.activeBotArbitrage.error = message;
      })
      .addCase(setBotPaused.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(setBotPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(setBotPaused.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to set bot pause state';
      })
      .addCase(setAllBotsPaused.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotIds(state, action.meta.arg.botIds);
      })
      .addCase(setAllBotsPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        removePendingBotIds(state, action.payload.botIds);
      })
      .addCase(setAllBotsPaused.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to set all bots pause state';
        removePendingBotIds(state, action.meta.arg.botIds);
      })
      .addCase(setSingleBotPaused.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotId(state, action.meta.arg.botId);
      })
      .addCase(setSingleBotPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        removePendingBotId(state, action.meta.arg.botId);
      })
      .addCase(setSingleBotPaused.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to set single bot pause state';
        removePendingBotId(state, action.meta.arg.botId);
      })
      .addCase(restartBot.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(restartBot.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(restartBot.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to restart bot';
      })
      .addCase(restartAllBots.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotIds(state, action.meta.arg);
      })
      .addCase(restartAllBots.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        removePendingBotIds(state, action.payload.botIds);
      })
      .addCase(restartAllBots.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to restart all bots';
        removePendingBotIds(state, action.meta.arg);
      })
      .addCase(setBotSendData.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(setBotSendData.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(setBotSendData.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to toggle send-data';
      })
      .addCase(saveBotSettings.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(saveBotSettings.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(saveBotSettings.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to save bot settings';
      })
      .addCase(refreshActiveBotTabData.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(refreshActiveBotTabData.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;

        if (action.payload.info) {
          state.activeBotInfo.data = action.payload.info;
          state.activeBotInfo.isLoaded = true;
        }
        if (action.payload.params) {
          state.activeBotParams.data = action.payload.params;
          state.activeBotParams.isLoaded = true;
        }
        if (action.payload.errors) {
          state.activeBotErrors.data = action.payload.errors;
          state.activeBotErrors.isLoaded = true;
        }
      })
      .addCase(refreshActiveBotTabData.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to refresh bot tab data';
      })
      .addCase(setBotFromConfig.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(setBotFromConfig.fulfilled, (state) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
      })
      .addCase(setBotFromConfig.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to apply bot config on server';
      })
      .addCase(updateBotFromConfig.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(updateBotFromConfig.fulfilled, (state) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
      })
      .addCase(updateBotFromConfig.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to update bot config on server';
      })
      .addCase(saveServerRulesFromConfig.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(saveServerRulesFromConfig.fulfilled, (state) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
      })
      .addCase(saveServerRulesFromConfig.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to save server config';
      })
      .addCase(removeBotFromServer.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotId(state, action.meta.arg.botId);
      })
      .addCase(removeBotFromServer.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        removePendingBotId(state, action.meta.arg.botId);
      })
      .addCase(removeBotFromServer.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to remove bot from server';
        removePendingBotId(state, action.meta.arg.botId);
      })
      .addCase(removeBotsFromServer.pending, (state, action) => {
        state.botControlAction.error = null;
        action.meta.arg.botIds.forEach((botId) => addPendingBotId(state, botId));
      })
      .addCase(removeBotsFromServer.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        action.meta.arg.botIds.forEach((botId) => removePendingBotId(state, botId));
      })
      .addCase(removeBotsFromServer.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to remove bots from server';
        action.meta.arg.botIds.forEach((botId) => removePendingBotId(state, botId));
      })
      .addCase(setSelectedBotsPaused.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotIds(state, action.meta.arg.botIds);
      })
      .addCase(setSelectedBotsPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        removePendingBotIds(state, action.payload.botIds);
      })
      .addCase(setSelectedBotsPaused.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error =
          action.error.message ?? 'Failed to set selected bots pause state';
        removePendingBotIds(state, action.meta.arg.botIds);
      })
      .addCase(restartSelectedBots.pending, (state, action) => {
        state.botControlAction.error = null;
        addPendingBotIds(state, action.meta.arg);
      })
      .addCase(restartSelectedBots.fulfilled, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        removePendingBotIds(state, action.payload.botIds);
      })
      .addCase(restartSelectedBots.rejected, (state, action) => {
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to restart selected bots';
        removePendingBotIds(state, action.meta.arg);
      });
  },
});

export const { setActiveServer, clearActiveBotData } = serversSlice.actions;
export const serversReducer = serversSlice.reducer;
