import { serverApi } from './server-api';

const DEFAULT_MAX_ATTEMPTS = 40;
const DEFAULT_INTERVAL_MS = 500;

const getBotId = (bot: Record<string, unknown>) =>
  String(bot.id ?? bot.botId ?? '').trim();

const isBotRunning = (bot: Record<string, unknown> | undefined) =>
  Boolean(bot?.running);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForBotPauseState(
  activeServer: string,
  botId: string,
  pause: boolean,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<void> {
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const expectedRunning = !pause;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const bots = await serverApi.getBots(activeServer);
    const bot = (Array.isArray(bots) ? bots : []).find(
      (item) => getBotId(item as Record<string, unknown>) === botId,
    ) as Record<string, unknown> | undefined;

    if (bot && isBotRunning(bot) === expectedRunning) {
      return;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  throw new Error(
    pause
      ? `Bot ${botId} did not pause within the expected time`
      : `Bot ${botId} did not start within the expected time`,
  );
}

export async function waitForAllBotsPauseState(
  activeServer: string,
  botIds: string[],
  pause: boolean,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<void> {
  if (botIds.length === 0) {
    return;
  }

  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const expectedRunning = !pause;
  const pending = new Set(botIds);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const bots = await serverApi.getBots(activeServer);
    const botList = Array.isArray(bots) ? bots : [];

    botList.forEach((item) => {
      const id = getBotId(item as Record<string, unknown>);
      if (!pending.has(id)) {
        return;
      }

      if (isBotRunning(item as Record<string, unknown>) === expectedRunning) {
        pending.delete(id);
      }
    });

    if (pending.size === 0) {
      return;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  throw new Error(
    pause
      ? `Some bots did not pause within the expected time: ${Array.from(pending).join(', ')}`
      : `Some bots did not start within the expected time: ${Array.from(pending).join(', ')}`,
  );
}
