import type { BotRuleItem } from './bot-control-adapter';
import type {
  ServerData,
  TypeListItem,
  RuleItem,
  BotInfo,
  DbServerItem,
} from '../store/types';

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

export const serverApi = {
  getServersFromDb(): Promise<DbServerItem[]> {
    return fetch('http://45.159.181.39:3001/servers').then(async (response) => {
      if (!response.ok) {
        throw new Error(await normalizeResponseError(response));
      }
      return response.json() as Promise<DbServerItem[]>;
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

  setBotPause(activeServer: string, botId: string, pause: boolean): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, `/bot/${botId}/pause`, {
      method: 'POST',
      body: JSON.stringify({ pause }),
    });
  },

  restartBot(activeServer: string, botId: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(activeServer, `/bot/${botId}/restart`, {
      method: 'POST',
    });
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
