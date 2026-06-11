import { serverApi } from './server-api';

const DEFAULT_MAX_ATTEMPTS = 40;
const DEFAULT_INTERVAL_MS = 500;

export interface BotRuntimeSnapshot {
  running: boolean;
  createdAt: string;
  jobCount: number;
  lastJobTimeFinish: string;
  lastJobTimeStart: string;
}

const getBotId = (bot: Record<string, unknown>) =>
  String(bot.id ?? bot.botId ?? '').trim();

const isBotRunning = (bot: Record<string, unknown> | undefined) =>
  Boolean(bot?.running);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findBotById = (bots: Record<string, unknown>[], botId: string) =>
  bots.find((bot) => getBotId(bot) === botId);

export const buildBotRuntimeSnapshot = (bot: Record<string, unknown>): BotRuntimeSnapshot => ({
  running: isBotRunning(bot),
  createdAt: String(bot.createdAt ?? ''),
  jobCount: Number(bot.jobCount ?? NaN),
  lastJobTimeFinish: String(bot.lastJobTimeFinish ?? ''),
  lastJobTimeStart: String(bot.lastJobTimeStart ?? ''),
});

export const buildBotRuntimeSnapshots = (
  bots: Record<string, unknown>[],
  botIds: string[],
): Map<string, BotRuntimeSnapshot> => {
  const targetIds = new Set(botIds.map((id) => String(id).trim()).filter(Boolean));
  const snapshots = new Map<string, BotRuntimeSnapshot>();

  bots.forEach((bot) => {
    const id = getBotId(bot);
    if (!targetIds.has(id)) {
      return;
    }
    snapshots.set(id, buildBotRuntimeSnapshot(bot));
  });

  return snapshots;
};

export const hasBotRuntimeChanged = (
  before: BotRuntimeSnapshot | undefined,
  bot: Record<string, unknown>,
): boolean => {
  if (!before) {
    return false;
  }

  const after = buildBotRuntimeSnapshot(bot);

  if (before.createdAt && after.createdAt && before.createdAt !== after.createdAt) {
    return true;
  }

  if (
    before.lastJobTimeFinish &&
    after.lastJobTimeFinish &&
    before.lastJobTimeFinish !== after.lastJobTimeFinish
  ) {
    return true;
  }

  if (
    before.lastJobTimeStart &&
    after.lastJobTimeStart &&
    before.lastJobTimeStart !== after.lastJobTimeStart
  ) {
    return true;
  }

  if (
    Number.isFinite(before.jobCount) &&
    Number.isFinite(after.jobCount) &&
    before.jobCount !== after.jobCount
  ) {
    return true;
  }

  return false;
};

export const hasBotRestartCompleted = (
  before: BotRuntimeSnapshot | undefined,
  bot: Record<string, unknown>,
  sawStopped: boolean,
): boolean => {
  if (!before) {
    return false;
  }

  if (hasBotRuntimeChanged(before, bot)) {
    return true;
  }

  const running = isBotRunning(bot);

  if (!before.running && running) {
    return true;
  }

  if (before.running && sawStopped && running) {
    return true;
  }

  return false;
};

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

    lastBots.forEach((item) => {
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

export async function waitForBotsRestart(
  activeServer: string,
  botIds: string[],
  snapshotsBefore: Map<string, BotRuntimeSnapshot>,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<Record<string, unknown>[]> {
  const uniqueBotIds = [...new Set(botIds.map((id) => String(id).trim()).filter(Boolean))];
  if (uniqueBotIds.length === 0) {
    return [];
  }

  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const pending = new Set(uniqueBotIds);
  const sawStopped = new Map<string, boolean>();
  let lastBots: Record<string, unknown>[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const bots = await serverApi.getBots(activeServer);
    lastBots = Array.isArray(bots) ? (bots as Record<string, unknown>[]) : [];

    uniqueBotIds.forEach((botId) => {
      if (!pending.has(botId)) {
        return;
      }

      const bot = findBotById(lastBots, botId);
      if (!bot) {
        return;
      }

      const before = snapshotsBefore.get(botId);
      if (before?.running && !isBotRunning(bot)) {
        sawStopped.set(botId, true);
      }

      if (hasBotRestartCompleted(before, bot, Boolean(sawStopped.get(botId)))) {
        pending.delete(botId);
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
    `Some bots did not restart within the expected time: ${Array.from(pending).join(', ')}`,
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
