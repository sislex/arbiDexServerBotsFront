import { useEffect, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import { Check, Circle, Pause, Play, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectActiveServer,
  selectBotControlActionState,
  selectBotControlListState,
  selectServerList,
} from '../store/selectors';
import { restartAllBots, setActiveServer, setAllBotsPaused } from '../store/slices/servers-slice';
import { showToast } from '../services/toast';
import { mapBotItemToListRow } from '../services/bot-control-adapter';
import { AppGrid } from './shared/AppGrid';
import { ApiInfoModal } from './ApiInfoModal';

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
  const botControlActionState = useAppSelector(selectBotControlActionState);
  const [selectedServer, setSelectedServer] = useState(`${activeServer.ip}:${activeServer.port}`);
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerHealthStatus>>({});
  const [isApiInfoOpen, setIsApiInfoOpen] = useState(false);
  const hasServers = servers.length > 0;
  const isBulkActionLoading = botControlActionState.isLoading;

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

  const rows: BotRow[] = botControlListState.data.map((item) =>
    mapBotItemToListRow(
      item,
      t.botsTab.botDescriptions[String(item.id) as keyof typeof t.botsTab.botDescriptions] ?? '-',
    ),
  );

  const colDefs: ColDef<BotRow>[] = [
    {
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    {
      headerName: '',
      colId: 'control',
      minWidth: 120,
      maxWidth: 140,
      sortable: false,
      resizable: false,
      suppressMovable: true,
      cellRenderer: (params: { data?: BotRow }) => {
        const row = params.data;
        if (!row) {
          return null;
        }

        const isActive = row.status === 'active';
        const isDisabled = botControlActionState.isLoading;
        const title = isActive ? t.botDetail.controlTab.pause : t.botsTab.startAll;

        return (
          <div className="w-full h-full flex items-center justify-center">
            <button
              type="button"
              title={title}
              disabled={isDisabled}
              onClick={async (event) => {
                event.stopPropagation();
                const result = await dispatch(setBotPaused({ botId: row.id, pause: isActive }));
                if (setBotPaused.fulfilled.match(result)) {
                  showToast(
                    'success',
                    isActive ? t.botDetail.controlTab.pausedSuccess : t.botDetail.controlTab.startedSuccess,
                  );
                } else {
                  showToast(
                    'error',
                    result.error.message ??
                      (isActive ? t.botDetail.controlTab.pausedError : t.botDetail.controlTab.startedError),
                  );
                }
              }}
              onDoubleClick={(event) => event.stopPropagation()}
              className={`inline-flex h-7 w-20 items-center justify-center gap-1 rounded text-xs transition-colors ${
                isDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : isActive
                    ? 'bg-warning text-warning-foreground hover:opacity-90'
                    : 'bg-success text-success-foreground hover:opacity-90'
              }`}
            >
              {isActive ? <Pause size={12} /> : <Play size={12} />}
              <span>{isActive ? t.botsTab.stopAll : t.botsTab.startAll}</span>
            </button>
          </div>
        );
      },
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
    <div className="flex h-[calc(100vh-100px)] bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {!hasServers && (
            <div className="text-sm text-muted-foreground px-2 py-1">Loading servers from DB...</div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${
                  selectedServer === `${server.ip}:${server.port}`
                    ? 'bg-accent border border-border'
                    : 'hover:bg-muted'
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
                  <div className="text-sm text-foreground">{server.ip}</div>
                  <div className="text-xs text-muted-foreground">{t.botsTab.port}: {server.port}</div>
                </div>
                {selectedServer === `${server.ip}:${server.port}` && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsApiInfoOpen(true)}
            className="text-sm text-primary hover:underline"
          >
            {t.botsTab.apiInfo}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        <div className="h-11 shrink-0 border-b border-border bg-background flex items-center justify-between gap-3 px-4">
          <h2 className="text-sm text-foreground">{t.botsTab.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const result = await dispatch(setAllBotsPaused({ pause: false }));
                if (setAllBotsPaused.fulfilled.match(result)) {
                  showToast('success', t.botsTab.startAllSuccess);
                } else {
                  showToast('error', result.error.message ?? t.botsTab.startAllError);
                }
              }}
              disabled={isBulkActionLoading || rows.length === 0}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                isBulkActionLoading || rows.length === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-success text-success-foreground hover:opacity-90'
              }`}
            >
              {t.botsTab.startAll}
            </button>
            <button
              onClick={async () => {
                const result = await dispatch(setAllBotsPaused({ pause: true }));
                if (setAllBotsPaused.fulfilled.match(result)) {
                  showToast('success', t.botsTab.stopAllSuccess);
                } else {
                  showToast('error', result.error.message ?? t.botsTab.stopAllError);
                }
              }}
              disabled={isBulkActionLoading || rows.length === 0}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                isBulkActionLoading || rows.length === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-warning text-warning-foreground hover:opacity-90'
              }`}
            >
              {t.botsTab.stopAll}
            </button>
            <button
              onClick={async () => {
                const result = await dispatch(restartAllBots());
                if (restartAllBots.fulfilled.match(result)) {
                  showToast('success', t.botsTab.restartAllSuccess);
                } else {
                  showToast('error', result.error.message ?? t.botsTab.restartAllError);
                }
              }}
              disabled={isBulkActionLoading || rows.length === 0}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                isBulkActionLoading || rows.length === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {t.botsTab.restartAll}
            </button>
            <button
              onClick={onRefresh}
              disabled={!onRefresh || isRefreshing}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm ${
                isRefreshing
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
              title={t.header.refresh}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="text-sm">{t.header.refresh}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
          {botControlListState.error ? (
            <div className="p-4 text-sm text-destructive">{botControlListState.error}</div>
          ) : (
            <AppGrid<BotRow>
              rowData={rows}
              columnDefs={colDefs}
              className="h-full"
              onRowDoubleClicked={(event) => {
                if (event.data?.id) {
                  onBotSelect?.(event.data.id);
                }
              }}
            />
          )}
        </div>
        {botControlListState.isLoading && (
          <div className="text-sm text-muted-foreground mt-2 px-4">{t.botsTab.loading ?? 'Loading...'}</div>
        )}
        {!botControlListState.isLoading && isBulkActionLoading && (
          <div className="text-sm text-muted-foreground mt-2 px-4">{t.botsTab.applyingAll}</div>
        )}
        {botControlActionState.error && (
          <div className="text-sm text-destructive mt-2 px-4">{botControlActionState.error}</div>
        )}
        {!botControlListState.isLoading && rows.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2 px-4">
            {t.botsTab.openBotHintDoubleClick ?? t.botsTab.openBotHint}
          </div>
        )}
      </div>
      <ApiInfoModal open={isApiInfoOpen} onOpenChange={setIsApiInfoOpen} />
    </div>
  );
}
