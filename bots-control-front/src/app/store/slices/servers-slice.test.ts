import { describe, expect, it } from 'vitest';
import { loadServersFromDb, serversReducer, setActiveServer } from './servers-slice';

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
});
