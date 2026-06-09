import type { ServerItem } from './types';

export const DEFAULT_SERVER_LIST: ServerItem[] = [
  { ip: '127.0.0.1', port: '3001', name: 'LOCAL_SERVER' },
  { ip: '89.125.68.35', port: '1001', name: 'FIRST_REAL_SERVER' },
];

export const DEFAULT_ACTIVE_TAB = 'bots';

export const CONFIG_PANEL_URL =
  import.meta.env.VITE_CONFIG_PANEL_URL?.trim() || 'http://89.125.68.35:4203';

export const buildConfigPanelServerUrl = (serverId: string) =>
  `${CONFIG_PANEL_URL}/server/${serverId}`;
