import { describe, expect, it } from 'vitest';
import { serversReducer, setActiveServer } from './servers-slice';

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
});
