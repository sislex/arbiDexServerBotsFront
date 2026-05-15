import { useEffect, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import { Check, Circle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveServer, selectBotControlListState, selectServerList } from '../store/selectors';
import { setActiveServer } from '../store/slices/servers-slice';
import { AppGrid } from './shared/AppGrid';

interface BotRow {
  id: string;
  description: string;
  created: string;
  jobs: number;
  arbitrages: number;
  errors: number;
  avgReqTime: string;
  lastReqTime: string;
  status: string;
}

interface ServerUiItem {
  ip: string;
  port: string;
  name?: string;
}

type ServerHealthStatus = 'loading' | 'online' | 'offline';

interface BotsTabProps {
  onBotSelect?: (botId: string) => void;
  onServerSelect?: (ipPort: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BotsTab({
  onBotSelect,
  onServerSelect,
  onRefresh,
  isRefreshing = false,
}: BotsTabProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const servers = useAppSelector(selectServerList) as ServerUiItem[];
  const activeServer = useAppSelector(selectActiveServer);
  const botControlListState = useAppSelector(selectBotControlListState);
  const [selectedServer, setSelectedServer] = useState(`${activeServer.ip}:${activeServer.port}`);
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerHealthStatus>>({});
  const hasServers = servers.length > 0;

  useEffect(() => {
    setSelectedServer(`${activeServer.ip}:${activeServer.port}`);
  }, [activeServer.ip, activeServer.port]);

  useEffect(() => {
    if (servers.length === 0) {
      setServerStatuses({});
      return;
    }

    let isCancelled = false;
    const nextStatuses: Record<string, ServerHealthStatus> = {};
    servers.forEach((server) => {
      nextStatuses[`${server.ip}:${server.port}`] = 'loading';
    });
    setServerStatuses(nextStatuses);

    const checkServerHealth = async (server: ServerUiItem) => {
      const key = `${server.ip}:${server.port}`;
      try {
        const response = await fetch(`http://${key}/bots/get-all`);
        if (isCancelled) {
          return;
        }

        setServerStatuses((prev) => ({
          ...prev,
          [key]: response.ok ? 'online' : 'offline',
        }));
      } catch {
        if (isCancelled) {
          return;
        }

        setServerStatuses((prev) => ({
          ...prev,
          [key]: 'offline',
        }));
      }
    };

    servers.forEach((server) => {
      void checkServerHealth(server);
    });

    return () => {
      isCancelled = true;
    };
  }, [servers]);

  const rows: BotRow[] = botControlListState.data.map((item) => ({
    id: String(item.id ?? ''),
    description: (() => {
      const fromBotParams = String(
        ((item as Record<string, unknown>).botParams as Record<string, unknown> | undefined)
          ?.description ?? '',
      ).trim();
      if (fromBotParams) {
        return fromBotParams;
      }

      const fromItemDescription = (item.description as string | undefined)?.trim();
      if (fromItemDescription) {
        return fromItemDescription;
      }

      return (
        t.botsTab.botDescriptions[String(item.id) as keyof typeof t.botsTab.botDescriptions] ?? '-'
      );
    })(),
    created: String(item.createdAt ?? '-'),
    jobs: Number(item.jobCount ?? 0),
    arbitrages: Number((item as Record<string, unknown>).arbitragesCount ?? 0),
    errors: Number(item.errorCount ?? 0),
    avgReqTime: `${Number((item as Record<string, unknown>).averageLatency ?? item.lastLatency ?? 0)}ms`,
    lastReqTime: `${Number(item.lastLatency ?? 0)}ms`,
    status: String(item.status ?? 'pause'),
  }));

  const colDefs: ColDef<BotRow>[] = [
    {
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: 'id', headerName: t.botsTab.table.id, minWidth: 130 },
    { field: 'description', headerName: t.botsTab.table.description, minWidth: 220, flex: 1 },
    { field: 'created', headerName: t.botsTab.table.created, minWidth: 160 },
    { field: 'jobs', headerName: t.botsTab.table.jobs, minWidth: 100 },
    { field: 'arbitrages', headerName: t.botsTab.table.arbitrages, minWidth: 110 },
    { field: 'errors', headerName: t.botsTab.table.errors, minWidth: 100 },
    { field: 'avgReqTime', headerName: t.botsTab.table.avgRequestTime, minWidth: 160 },
    { field: 'lastReqTime', headerName: t.botsTab.table.lastRequestTime, minWidth: 160 },
    {
      field: 'status',
      headerName: t.botsTab.table.status,
      maxWidth: 100,
      cellRenderer: (params: { value: string }) => {
        const isActive = params.value === 'active';
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Circle
              size={10}
              className={isActive ? 'fill-green-500 text-green-500' : 'fill-yellow-500 text-yellow-500'}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex h-[calc(100vh-128px)]">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {!hasServers && (
            <div className="text-sm text-gray-500 px-2 py-1">Loading servers from DB...</div>
          )}
          <div className="space-y-1">
            {servers.map((server) => (
              <button
                key={`${server.ip}:${server.port}`}
                onClick={() => {
                  const key = `${server.ip}:${server.port}`;
                  setSelectedServer(key);
                  dispatch(setActiveServer(server));
                  onServerSelect?.(key);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  selectedServer === `${server.ip}:${server.port}`
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Circle
                  size={8}
                  className={`${
                    serverStatuses[`${server.ip}:${server.port}`] === 'online'
                      ? 'fill-green-500 text-green-500'
                      : serverStatuses[`${server.ip}:${server.port}`] === 'offline'
                        ? 'fill-red-500 text-red-500'
                        : 'fill-yellow-500 text-yellow-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{server.ip}</div>
                  <div className="text-xs text-gray-500">{t.botsTab.port}: {server.port}</div>
                </div>
                {selectedServer === `${server.ip}:${server.port}` && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            {t.botsTab.apiInfo}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-gray-900">{t.botsTab.title}</h2>
          <button
            onClick={onRefresh}
            disabled={!onRefresh || isRefreshing}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
            title={t.header.refresh}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="text-sm">{t.header.refresh}</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-220px)]">
          {botControlListState.error ? (
            <div className="p-4 text-sm text-red-600">{botControlListState.error}</div>
          ) : (
            <AppGrid<BotRow>
              rowData={rows}
              columnDefs={colDefs}
              className="h-full"
              onRowClicked={(event) => {
                if (event.data?.id) {
                  onBotSelect?.(event.data.id);
                }
              }}
            />
          )}
        </div>
        {botControlListState.isLoading && (
          <div className="text-sm text-gray-500 mt-2">{t.botsTab.loading ?? 'Loading...'}</div>
        )}
        {!botControlListState.isLoading && rows.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            {t.botsTab.openBotHint}
          </div>
        )}
      </div>
    </div>
  );
}
