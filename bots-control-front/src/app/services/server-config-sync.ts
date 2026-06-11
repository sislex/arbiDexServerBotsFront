import { areBotRulesEqual } from './bot-config-compare';
import { buildBotRulesFromDbBots } from './db-config-builder';
import { normalizeRulesList } from './bot-control-adapter';
import { serverApi } from './server-api';

export async function isServerConfigChanged(
  serverId: string,
  ip: string,
  port: string,
): Promise<boolean> {
  const [dbBots, serverRulesRaw] = await Promise.all([
    serverApi.getBotsByServerId(serverId),
    serverApi.getRules(`${ip}:${port}`),
  ]);

  const dbRules = buildBotRulesFromDbBots(Array.isArray(dbBots) ? dbBots : []);
  const serverRules = normalizeRulesList(serverRulesRaw);
  return !areBotRulesEqual(dbRules, serverRules);
}
