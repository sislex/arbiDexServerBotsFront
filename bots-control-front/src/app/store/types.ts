export interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export interface ServerItem {
  ip: string;
  port: string;
  name: string;
  serverId?: string;
}

export interface DbServerItem {
  serverId?: string;
  ip?: string;
  port?: string;
  serverName?: string;
  ipPort?: string;
  [key: string]: unknown;
}

export interface ServerData {
  ip: string;
  port: string;
  version: string;
  status: string;
  timestampStart: string;
  timestampFinish: string;
  botsCount: number;
  authorizationData?: string;
}

export interface TypeListItem {
  id: string;
  label: string;
  type: string;
  description: string;
}

export interface BotControlItem {
  id: string;
  running: boolean;
  status: string;
  createdAt?: string;
  jobCount?: number;
  errorCount?: number;
  lastLatency?: number;
  lastJobTimeFinish?: string;
  [key: string]: unknown;
}

export interface RuleItem {
  id: string;
  botParams?: Record<string, unknown>;
  jobParams?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BotInfo {
  id: string;
  botParams?: Record<string, unknown>;
  jobParams?: Record<string, unknown>;
  [key: string]: unknown;
}
