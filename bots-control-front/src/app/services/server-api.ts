import type { ServerData, TypeListItem, BotControlItem, RuleItem, BotInfo } from '../store/types';

const isValidServer = (value: string | null | undefined) =>
  Boolean(value && value.trim() && !value.includes('undefined') && value !== ':');

const buildUrl = (activeServer: string, endpoint: string) => {
  const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `http://${activeServer}${cleanedEndpoint}`;
};

async function request<T>(
  activeServer: string,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  if (!isValidServer(activeServer)) {
    throw new Error('Active server is not selected');
  }

  const response = await fetch(buildUrl(activeServer, endpoint), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export const serverApi = {
  getServerInfo(activeServer: string): Promise<ServerData> {
    return request<ServerData>(activeServer, '/info');
  },

  getBotTypes(activeServer: string): Promise<TypeListItem[]> {
    return request<TypeListItem[]>(activeServer, '/info/bots-types-list');
  },

  getJobTypes(activeServer: string): Promise<TypeListItem[]> {
    return request<TypeListItem[]>(activeServer, '/info/job-type-list');
  },

  getBots(activeServer: string): Promise<BotControlItem[]> {
    return request<BotControlItem[]>(activeServer, '/bots/get-all');
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

  getPriceKeys(activeServer: string): Promise<string[]> {
    return request<string[]>(activeServer, '/prices/keys');
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
};
