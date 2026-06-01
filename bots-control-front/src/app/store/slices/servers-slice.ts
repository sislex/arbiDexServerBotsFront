import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  mergeBotRuleIntoList,
  normalizeRulesList,
  parseBotConfigJson,
  removeBotRuleFromList,
} from '../../services/bot-control-adapter';
import { waitForAllBotsPauseState, waitForBotPauseState } from '../../services/bot-pause-utils';
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
  pendingBotPauseId: string | null;
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
  pendingBotPauseId: null,
};

const getActiveServerKey = (state: { servers: ServersState }) =>
  `${state.servers.activeServer.ip}:${state.servers.activeServer.port}`;

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
    return {
      ip,
      port,
      name: serverName || `SERVER_${ip}:${port}`,
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

export const loadBotControlList = createAsyncThunk(
  'servers/loadBotControlList',
  async (_, { getState }) => {
    const serverKey = getActiveServerKey(getState() as { servers: ServersState });
    const items = await serverApi.getBots(serverKey);
    return mapApiBotsToControlItems(Array.isArray(items) ? items : []);
  },
);

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
    await waitForBotPauseState(activeServer, id, paused);

    if (!paused) {
      await serverApi.restartBot(activeServer, id);
    }

    await dispatch(loadBotControlList());
    await dispatch(loadRulesList());
    return { id, paused };
  },
);

export const removeBotFromServer = createAsyncThunk(
  'servers/removeBotFromServer',
  async (botId: string, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const currentRules = normalizeRulesList(await serverApi.getRules(activeServer));
    const botsRulesList = removeBotRuleFromList(currentRules, botId);

    if (botsRulesList.length === currentRules.length) {
      throw new Error('Bot not found in server rules list');
    }

    try {
      await serverApi.setBotPause(activeServer, botId, true);
    } catch {
      // Bot may already be stopped or absent from runtime.
    }

    await serverApi.setBotsRulesList(activeServer, botsRulesList);
    await dispatch(loadBotControlList());
    await dispatch(loadRulesList());
    return botId;
  },
);

export const loadRulesList = createAsyncThunk('servers/loadRulesList', async (_, { getState }) => {
  const response = await serverApi.getRules(getActiveServerKey(getState() as { servers: ServersState }));
  return normalizeRulesList(response);
});

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
    await waitForBotPauseState(activeServer, botId, pause);
    await dispatch(loadActiveBotAll(botId));
    await dispatch(loadBotControlList());
    return response;
  },
);

export const setAllBotsPaused = createAsyncThunk(
  'servers/setAllBotsPaused',
  async ({ pause }: { pause: boolean }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const bots = await serverApi.getBots(activeServer);
    const botIds = (Array.isArray(bots) ? bots : [])
      .map((bot) => String(bot.id ?? (bot as Record<string, unknown>).botId ?? ''))
      .filter((id) => id.trim().length > 0);

    const results = await Promise.allSettled(
      botIds.map((botId) => serverApi.setBotPause(activeServer, botId, pause)),
    );
    const failedCount = results.filter((result) => result.status === 'rejected').length;
    const successfulBotIds = botIds.filter((_, index) => results[index].status === 'fulfilled');

    if (successfulBotIds.length > 0) {
      await waitForAllBotsPauseState(activeServer, successfulBotIds, pause);
    }

    await dispatch(loadBotControlList());

    if (failedCount > 0) {
      throw new Error(
        `Failed to ${pause ? 'stop' : 'start'} ${failedCount} of ${botIds.length} bots`,
      );
    }

    return {
      action: pause ? 'stop-all' : 'start-all',
      total: botIds.length,
      success: botIds.length - failedCount,
      failed: failedCount,
    };
  },
);

export const setSingleBotPaused = createAsyncThunk(
  'servers/setSingleBotPaused',
  async ({ botId, pause }: { botId: string; pause: boolean }, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.setBotPause(activeServer, botId, pause);
    await waitForBotPauseState(activeServer, botId, pause);
    await dispatch(loadBotControlList());
    return response;
  },
);

export const restartBot = createAsyncThunk(
  'servers/restartBot',
  async (botId: string, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    const response = await serverApi.restartBot(activeServer, botId);
    await dispatch(loadActiveBotAll(botId));
    await dispatch(loadBotControlList());
    return response;
  },
);

export const restartAllBots = createAsyncThunk(
  'servers/restartAllBots',
  async (_, { getState, dispatch }) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });
    const bots = await serverApi.getBots(activeServer);
    const botIds = (Array.isArray(bots) ? bots : [])
      .map((bot) => String(bot.id ?? (bot as Record<string, unknown>).botId ?? ''))
      .filter((id) => id.trim().length > 0);

    const results = await Promise.allSettled(
      botIds.map((botId) => serverApi.restartBot(activeServer, botId)),
    );
    const failedCount = results.filter((result) => result.status === 'rejected').length;

    await dispatch(loadBotControlList());

    if (failedCount > 0) {
      throw new Error(`Failed to restart ${failedCount} of ${botIds.length} bots`);
    }

    return {
      action: 'restart-all',
      total: botIds.length,
      success: botIds.length - failedCount,
      failed: failedCount,
    };
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
    { botId, activeTab }: { botId: string; activeTab: 'control' | 'errors' | 'job' | 'chart' | 'live-chart' },
    { getState },
  ) => {
    const activeServer = getActiveServerKey(getState() as { servers: ServersState });

    if (activeTab === 'control' || activeTab === 'job' || activeTab === 'chart' || activeTab === 'live-chart') {
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
          const activeExists = action.payload.some(
            (s) => s.ip === state.activeServer.ip && s.port === state.activeServer.port,
          );
          if (!activeExists) {
            state.activeServer = action.payload[0];
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
      .addCase(loadBotControlList.pending, (state) => {
        state.botControlList.isLoading = true;
        state.botControlList.error = null;
      })
      .addCase(loadBotControlList.fulfilled, (state, action) => {
        state.botControlList.isLoading = false;
        state.botControlList.isLoaded = true;
        state.botControlList.data = action.payload;
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
        state.rulesList.isLoading = false;
        state.rulesList.isLoaded = true;
        state.rulesList.data = action.payload ?? [];
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
      .addCase(setAllBotsPaused.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(setAllBotsPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(setAllBotsPaused.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to set all bots pause state';
      })
      .addCase(setSingleBotPaused.pending, (state, action) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
        state.pendingBotPauseId = action.meta.arg.botId;
      })
      .addCase(setSingleBotPaused.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
        state.pendingBotPauseId = null;
      })
      .addCase(setSingleBotPaused.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to set single bot pause state';
        state.pendingBotPauseId = null;
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
      .addCase(restartAllBots.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(restartAllBots.fulfilled, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.data = action.payload;
      })
      .addCase(restartAllBots.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to restart all bots';
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
      .addCase(removeBotFromServer.pending, (state) => {
        state.botControlAction.isLoading = true;
        state.botControlAction.error = null;
      })
      .addCase(removeBotFromServer.fulfilled, (state) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
      })
      .addCase(removeBotFromServer.rejected, (state, action) => {
        state.botControlAction.isLoading = false;
        state.botControlAction.isLoaded = true;
        state.botControlAction.error = action.error.message ?? 'Failed to remove bot from server';
      });
  },
});

export const { setActiveServer, clearActiveBotData } = serversSlice.actions;
export const serversReducer = serversSlice.reducer;
