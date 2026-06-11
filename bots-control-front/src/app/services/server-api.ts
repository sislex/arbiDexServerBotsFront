import type { BotRuleItem } from './bot-control-adapter';
import type {
  ServerData,
  TypeListItem,
  RuleItem,
  BotInfo,
  DbServerItem,
  BotPauseBulkResultItem,
  BotRestartBulkResultItem,
} from '../store/types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL?.trim() || 'http://89.125.68.35:3001';
const SERVERS_ENDPOINT = `${SERVER_URL}/servers`;

const isValidServer = (value: string | null | undefined) =>
  Boolean(value && value.trim() && !value.includes('undefined') && value !== ':');

const buildUrl = (activeServer: string, endpoint: string) => {
  const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `http://${activeServer}${cleanedEndpoint}`;
};

const normalizeResponseError = async (response: Response) => {
  const raw = (await response.text()).trim();
  if (!raw) {
    return `HTTP ${response.status}`;
  }

  try {
    const parsed = JSON.parse(raw) as { message?: string; error?: string; details?: string };
    const message = parsed.message ?? parsed.error ?? parsed.details ?? raw;
    return `HTTP ${response.status}: ${message}`;
  } catch {
    return `HTTP ${response.status}: ${raw}`;
  }
};

async function request<T>(
  activeServer: string,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  if (!isValidServer(activeServer)) {
    throw new Error('Active server is not selected');
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(activeServer, endpoint), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    });
  } catch (error) {
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : 'request failed'}`,
    );
  }

  if (!response.ok) {
    throw new Error(await normalizeResponseError(response));
  }

  return (await response.json()) as T;
}

const isBulkEndpointNotFound = (error: unknown) =>
  error instanceof Error &&
  (error.message.includes('HTTP 404') ||
    error.message.includes('Not Found') ||
    error.message.includes('Cannot POST /bots/pause') ||
    error.message.includes('Cannot POST /bots/restart'));

const setBotsPauseOneByOne = async (
  activeServer: string,
  botIds: string[],
  pause: boolean,
): Promise<BotPauseBulkResultItem[]> =>
  Promise.all(
    botIds.map(async (botId) => {
      try {
        const response = await request<Record<string, unknown>>(activeServer, `/bot/${botId}/pause`, {
          method: 'POST',
          body: JSON.stringify({ pause }),
        });
        return {
          id: botId,
          paused: Boolean(response.paused ?? pause),
        };
      } catch (error) {
        return {
          id: botId,
          error: error instanceof Error ? error.message : 'request failed',
        };
      }
    }),
  );

const restartBotsOneByOne = async (
  activeServer: string,
  botIds: string[],
): Promise<BotRestartBulkResultItem[]> =>
  Promise.all(
    botIds.map(async (botId) => {
      try {
        await request<Record<string, unknown>>(activeServer, `/bot/${botId}/restart`, {
          method: 'POST',
        });
        return {
          id: botId,
          restarted: true,
        };
      } catch (error) {
        return {
          id: botId,
          error: error instanceof Error ? error.message : 'request failed',
        };
      }
    }),
  );

const requestBotsPause = async (
  activeServer: string,
  botIds: string[],
  pause: boolean,
): Promise<BotPauseBulkResultItem[]> => {
  if (botIds.length === 0) {
    return [];
  }

  try {
    return await request<BotPauseBulkResultItem[]>(activeServer, '/bots/pause', {
      method: 'POST',
      body: JSON.stringify({ botIds, pause }),
    });
  } catch (error) {
    if (!isBulkEndpointNotFound(error)) {
      throw error;
    }
    return setBotsPauseOneByOne(activeServer, botIds, pause);
  }
};

const requestBotsRestart = async (
  activeServer: string,
  botIds: string[],
): Promise<BotRestartBulkResultItem[]> => {
  if (botIds.length === 0) {
    return [];
  }

  try {
    return await request<BotRestartBulkResultItem[]>(activeServer, '/bots/restart', {
      method: 'POST',
      body: JSON.stringify({ botIds }),
    });
  } catch (error) {
    if (!isBulkEndpointNotFound(error)) {
      throw error;
    }
    return restartBotsOneByOne(activeServer, botIds);
  }
};

const unwrapSinglePauseResult = (
  botId: string,
  pause: boolean,
  results: BotPauseBulkResultItem[],
): Record<string, unknown> => {
  const result = results.find((item) => item.id === botId) ?? results[0];
  if (!result || result.error) {
    throw new Error(result?.error ?? `Failed to ${pause ? 'pause' : 'resume'} bot ${botId}`);
  }

  return { id: result.id, paused: result.paused };
};

const unwrapSingleRestartResult = (
  botId: string,
  results: BotRestartBulkResultItem[],
): Record<string, unknown> => {
  const result = results.find((item) => item.id === botId) ?? results[0];
  if (!result || result.error) {
    throw new Error(result?.error ?? `Failed to restart bot ${botId}`);
  }

  return { id: result.id, restarted: result.restarted };
};

export const serverApi = {
  getServersFromDb(): Promise<DbServerItem[]> {
    return fetch(SERVERS_ENDPOINT).then(async (response) => {
      if (!response.ok) {
        throw new Error(await normalizeResponseError(response));
      }
      return response.json() as Promise<DbServerItem[]>;
    });
  },

  getBotsByServerId(serverId: string): Promise<unknown[]> {
    const url = `${SERVER_URL}/bots/findAllByServerId?serverId=${encodeURIComponent(serverId)}`;
    return fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(await normalizeResponseError(response));
      }
      return response.json() as Promise<unknown[]>;
    });
  },

  getServerInfo(activeServer: string): Promise<ServerData> {
    return request<ServerData>(activeServer, '/info');
  },

  getApiList(activeServer: string): Promise<Record<string, unknown>[]> {
    return request<Record<string, unknown>[]>(activeServer, '/info/apis');
  },

  getBotTypes(activeServer: string): Promise<TypeListItem[]> {
    return request<TypeListItem[]>(activeServer, '/info/bots-types-list');
  },

  getJobTypes(activeServer: string): Promise<TypeListItem[]> {
    return request<TypeListItem[]>(activeServer, '/info/job-type-list');
  },

  getBots(activeServer: string): Promise<Record<string, unknown>[]> {
    return request<Record<string, unknown>[]>(activeServer, '/bots/get-all');
  },

  getRules(activeServer: string): Promise<RuleItem[]> {
    return request<RuleItem[]>(activeServer, '/rules/get-all');
  },

  getBotInfo(activeServer: string, botId: string): Promise<BotInfo> {
    return request<BotInfo>(activeServer, `/bot/${botId}/settings`);
  },

  getBotParams(activeServer: string, botId: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, `/bot/${botId}/params`);
  },

  getBotErrors(activeServer: string, botId: string): Promise<Record<string, unknown>[]> {
    return request<Record<string, unknown>[]>(activeServer, `/bot/${botId}/errors`);
  },

  getBotArbitrage(activeServer: string, botId: string): Promise<Record<string, unknown>[]> {
    return request<Record<string, unknown>[]>(activeServer, `/bot/${botId}/arbitrage`);
  },


  getPriceByKey(
    activeServer: string,
    key: string,
  ): Promise<{ key: string; points: { t: number; v: number }[]; count: number; last: { t: number; v: number } }> {
    return request(activeServer, `/prices/key/${encodeURIComponent(key)}`);
  },

  async setBotPause(
    activeServer: string,
    botId: string,
    pause: boolean,
  ): Promise<Record<string, unknown>> {
    const results = await requestBotsPause(activeServer, [botId], pause);
    return unwrapSinglePauseResult(botId, pause, results);
  },

  setBotsPause(
    activeServer: string,
    botIds: string[],
    pause: boolean,
  ): Promise<BotPauseBulkResultItem[]> {
    return requestBotsPause(activeServer, botIds, pause);
  },

  async restartBot(activeServer: string, botId: string): Promise<Record<string, unknown>> {
    const results = await requestBotsRestart(activeServer, [botId]);
    return unwrapSingleRestartResult(botId, results);
  },

  restartBots(activeServer: string, botIds: string[]): Promise<BotRestartBulkResultItem[]> {
    return requestBotsRestart(activeServer, botIds);
  },

  setBotSendData(
    activeServer: string,
    botId: string,
    isSend: boolean,
  ): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, `/bot/${botId}/send-data`, {
      method: 'POST',
      body: JSON.stringify({ isSend }),
    });
  },

  setBotSettings(
    activeServer: string,
    botId: string,
    data: string,
  ): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, `/bot/${botId}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  setBotsRulesList(
    activeServer: string,
    botsRulesList: BotRuleItem[],
  ): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, '/setBotsRulesList', {
      method: 'POST',
      body: JSON.stringify({ botsRulesList }),
    });
  },
};
