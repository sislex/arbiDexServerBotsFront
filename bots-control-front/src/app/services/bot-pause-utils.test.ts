import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  buildBotRuntimeSnapshot,
  hasBotRestartCompleted,
  hasBotRuntimeChanged,
  waitForBotsRestart,
} from './bot-pause-utils';
import { serverApi } from './server-api';

vi.mock('./server-api', () => ({
  serverApi: {
    getBots: vi.fn(),
  },
}));

const baseSnapshot = buildBotRuntimeSnapshot({
  id: 'bot-1',
  running: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  jobCount: 10,
  lastJobTimeFinish: '2024-01-01T01:00:00.000Z',
  lastJobTimeStart: '2024-01-01T00:59:00.000Z',
});

describe('hasBotRuntimeChanged', () => {
  it('detects createdAt change', () => {
    expect(
      hasBotRuntimeChanged(baseSnapshot, {
        running: true,
        createdAt: '2024-01-02T00:00:00.000Z',
        jobCount: 10,
      }),
    ).toBe(true);
  });

  it('detects jobCount change', () => {
    expect(
      hasBotRuntimeChanged(baseSnapshot, {
        running: true,
        createdAt: baseSnapshot.createdAt,
        jobCount: 11,
      }),
    ).toBe(true);
  });

  it('returns false when nothing meaningful changed', () => {
    expect(
      hasBotRuntimeChanged(baseSnapshot, {
        running: true,
        createdAt: baseSnapshot.createdAt,
        jobCount: baseSnapshot.jobCount,
        lastJobTimeFinish: baseSnapshot.lastJobTimeFinish,
        lastJobTimeStart: baseSnapshot.lastJobTimeStart,
      }),
    ).toBe(false);
  });
});

describe('hasBotRestartCompleted', () => {
  it('completes after running -> stopped -> running cycle', () => {
    expect(
      hasBotRestartCompleted(
        baseSnapshot,
        { running: true, createdAt: baseSnapshot.createdAt, jobCount: baseSnapshot.jobCount },
        true,
      ),
    ).toBe(true);
  });

  it('does not complete while bot stays running without snapshot change', () => {
    expect(
      hasBotRestartCompleted(
        baseSnapshot,
        { running: true, createdAt: baseSnapshot.createdAt, jobCount: baseSnapshot.jobCount },
        false,
      ),
    ).toBe(false);
  });

  it('completes when createdAt changes after restart', () => {
    expect(
      hasBotRestartCompleted(
        baseSnapshot,
        { running: true, createdAt: '2024-01-02T00:00:00.000Z', jobCount: 0 },
        false,
      ),
    ).toBe(true);
  });
});

describe('waitForBotsRestart', () => {
  beforeEach(() => {
    vi.mocked(serverApi.getBots).mockReset();
  });

  it('waits until runtime snapshot changes instead of accepting stale running state', async () => {
    const snapshots = new Map([['bot-1', baseSnapshot]]);

    vi.mocked(serverApi.getBots)
      .mockResolvedValueOnce([
        {
          id: 'bot-1',
          running: true,
          createdAt: baseSnapshot.createdAt,
          jobCount: baseSnapshot.jobCount,
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'bot-1',
          running: false,
          createdAt: baseSnapshot.createdAt,
          jobCount: baseSnapshot.jobCount,
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'bot-1',
          running: true,
          createdAt: '2024-01-02T00:00:00.000Z',
          jobCount: 0,
        },
      ]);

    const bots = await waitForBotsRestart('127.0.0.1:3000', ['bot-1'], snapshots, {
      intervalMs: 0,
    });

    expect(bots).toHaveLength(1);
    expect(bots[0].createdAt).toBe('2024-01-02T00:00:00.000Z');
    expect(serverApi.getBots).toHaveBeenCalledTimes(3);
  });
});
