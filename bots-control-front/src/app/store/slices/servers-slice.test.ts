import { describe, expect, it } from 'vitest';
import {
  loadBotControlList,
  loadServersFromDb,
  serversReducer,
  setActiveServer,
} from './servers-slice';

describe('servers-slice reducer', () => {
  it('sets active server', () => {
    const state = serversReducer(undefined, { type: '@@INIT' });
    const next = serversReducer(
      state,
      setActiveServer({ ip: '1.2.3.4', port: '9999', name: 'SERVER_1.2.3.4:9999' }),
    );

    expect(next.activeServer).toEqual({
      ip: '1.2.3.4',
      port: '9999',
      name: 'SERVER_1.2.3.4:9999',
    });
  });

  it('enriches active server with serverId after loading servers from DB', () => {
    const state = serversReducer(undefined, { type: '@@INIT' });
    const next = serversReducer(
      state,
      loadServersFromDb.fulfilled(
        [
          {
            ip: '89.125.68.35',
            port: '1001',
            name: 'germany-4-8-60',
            serverId: '12',
          },
        ],
        '',
        undefined,
      ),
    );

    expect(next.activeServer).toEqual({
      ip: '89.125.68.35',
      port: '1001',
      name: 'germany-4-8-60',
      serverId: '12',
    });
  });

  it('keeps active server from URL when it is missing in DB server list', () => {
    const state = serversReducer(
      undefined,
      setActiveServer({ ip: '10.0.0.5', port: '8080', name: 'SERVER_10.0.0.5:8080' }),
    );
    const next = serversReducer(
      state,
      loadServersFromDb.fulfilled(
        [
          {
            ip: '89.125.68.35',
            port: '1001',
            name: 'germany-4-8-60',
            serverId: '12',
          },
        ],
        '',
        undefined,
      ),
    );

    expect(next.activeServer).toEqual({
      ip: '10.0.0.5',
      port: '8080',
      name: 'SERVER_10.0.0.5:8080',
    });
  });

  it('ignores stale bot list responses for a previous server', () => {
    const withServerA = serversReducer(
      undefined,
      setActiveServer({ ip: '10.0.0.1', port: '1001', name: 'SERVER_A' }),
    );
    const withServerB = serversReducer(
      withServerA,
      setActiveServer({ ip: '10.0.0.2', port: '1002', name: 'SERVER_B' }),
    );
    const next = serversReducer(
      withServerB,
      loadBotControlList.fulfilled(
        {
          serverKey: '10.0.0.1:1001',
          bots: [{ id: 'stale-bot', running: true, status: 'active' }],
        },
        '',
        undefined,
      ),
    );

    expect(next.botControlList.data).toEqual([]);
  });
});
