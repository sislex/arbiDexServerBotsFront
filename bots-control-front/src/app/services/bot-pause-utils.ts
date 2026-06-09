import { serverApi } from './server-api';

const DEFAULT_MAX_ATTEMPTS = 40;
const DEFAULT_INTERVAL_MS = 500;

const getBotId = (bot: Record<string, unknown>) =>
  String(bot.id ?? bot.botId ?? '').trim();

const isBotRunning = (bot: Record<string, unknown> | undefined) =>
  Boolean(bot?.running);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForBotsRunningState(
  activeServer: string,
  botIds: string[],
  expectedRunning: boolean,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<Record<string, unknown>[]> {
  const uniqueBotIds = [...new Set(botIds.map((id) => String(id).trim()).filter(Boolean))];
  if (uniqueBotIds.length === 0) {
    return [];
  }

  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const pending = new Set(uniqueBotIds);
  let lastBots: Record<string, unknown>[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const bots = await serverApi.getBots(activeServer);
    lastBots = Array.isArray(bots) ? (bots as Record<string, unknown>[]) : [];
    const botList = lastBots;

    botList.forEach((item) => {
      const id = getBotId(item);
      if (!pending.has(id)) {
        return;
      }

      if (isBotRunning(item) === expectedRunning) {
        pending.delete(id);
      }
    });

    if (pending.size === 0) {
      return lastBots;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  throw new Error(
    expectedRunning
      ? `Some bots did not start within the expected time: ${Array.from(pending).join(', ')}`
      : `Some bots did not pause within the expected time: ${Array.from(pending).join(', ')}`,
  );
}

export async function waitForBotPauseState(
  activeServer: string,
  botId: string,
  pause: boolean,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<Record<string, unknown>[]> {
  return waitForBotsRunningState(activeServer, [botId], !pause, options);
}

export async function waitForAllBotsPauseState(
  activeServer: string,
  botIds: string[],
  pause: boolean,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<Record<string, unknown>[]> {
  return waitForBotsRunningState(activeServer, botIds, !pause, options);
}
