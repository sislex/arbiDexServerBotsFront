import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import {
  Check,
  ChevronDown,
  Circle,
  ExternalLink,
  Loader2,
  Menu,
  Pause,
  Play,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectActiveServer,
  selectBotControlListState,
  selectPendingBotIds,
  selectRulesListState,
  selectServerList,
} from '../store/selectors';
import {
  loadRulesList,
  restartAllBots,
  restartSelectedBots,
  removeBotFromServer,
  removeBotsFromServer,
  setActiveServer,
  setAllBotsPaused,
  setSelectedBotsPaused,
  setSingleBotPaused,
  setBotFromConfig,
} from '../store/slices/servers-slice';
import { showDelayedActionToast, showToast } from '../services/toast';
import { mapBotItemToListRow } from '../services/bot-control-adapter';
import { AppGrid } from './shared/AppGrid';
import { ApiInfoModal } from './ApiInfoModal';
import { SetBotForm } from './SetBotForm';
import { buildConfigPanelServerUrl } from '../store/constants';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { BotsGridCheckboxCell, BotsGridCheckboxHeader } from './bots-grid-checkbox';

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
  serverId?: string;
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
  const rulesListState = useAppSelector(selectRulesListState);
  const pendingBotIds = useAppSelector(selectPendingBotIds);
  const [selectedServer, setSelectedServer] = useState(`${activeServer.ip}:${activeServer.port}`);
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerHealthStatus>>({});
  const [isApiInfoOpen, setIsApiInfoOpen] = useState(false);
  const [isSetBotFormOpen, setIsSetBotFormOpen] = useState(false);
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());
  const [hiddenBotIds, setHiddenBotIds] = useState<string[]>([]);
  const scheduledRemovalsRef = useRef<Map<string, () => void>>(new Map());
  const hasServers = servers.length > 0;
  const ruleIds = useMemo(
    () => new Set(rulesListState.data.map((rule) => String(rule.id))),
    [rulesListState.data],
  );

  const { workingServers, notWorkingServers } = useMemo(() => {
    const working: ServerUiItem[] = [];
    const notWorking: ServerUiItem[] = [];

    servers.forEach((server) => {
      const status = serverStatuses[`${server.ip}:${server.port}`];
      if (status === 'online') {
        working.push(server);
      } else {
        notWorking.push(server);
      }
    });

    return { workingServers: working, notWorkingServers: notWorking };
  }, [servers, serverStatuses]);

  const renderServerItem = (server: ServerUiItem) => {
    const serverKey = `${server.ip}:${server.port}`;
    const isSelected = selectedServer === serverKey;
    const configUrl = server.serverId ? buildConfigPanelServerUrl(server.serverId) : null;

    return (
      <div
        key={serverKey}
        className={`rounded transition-colors ${
          isSelected ? 'bg-accent border border-border' : 'hover:bg-muted'
        }`}
      >
        <button
          onClick={() => {
            setSelectedServer(serverKey);
            dispatch(setActiveServer(server));
            onServerSelect?.(serverKey);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          <Circle
            size={8}
            className={`${
              serverStatuses[serverKey] === 'online'
                ? 'fill-green-500 text-green-500'
                : serverStatuses[serverKey] === 'offline'
                  ? 'fill-red-500 text-red-500'
                  : 'fill-yellow-500 text-yellow-500'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground truncate">{server.ip}</div>
            <div className="text-xs text-muted-foreground">
              {t.botsTab.port}: {server.port}
            </div>
          </div>
          {isSelected && <Check size={16} className="text-primary shrink-0" />}
        </button>
        {configUrl && (
          <div className="px-4 pb-2">
            <a
              href={configUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink size={12} />
              {t.botsTab.toConfig}
            </a>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    dispatch(loadRulesList());
  }, [activeServer.ip, activeServer.port, dispatch]);

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

  const allRows: BotRow[] = botControlListState.data.map((item) =>
    mapBotItemToListRow(
      item,
      t.botsTab.botDescriptions[String(item.id) as keyof typeof t.botsTab.botDescriptions] ?? '-',
    ),
  );
  const rows = allRows.filter((row) => !hiddenBotIds.includes(row.id));

  const totalBots = rows.length;
  const runningBots = rows.filter((row) => row.status === 'active').length;
  const allBotIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const deletableBotIds = useMemo(
    () => allBotIds.filter((id) => ruleIds.has(id)),
    [allBotIds, ruleIds],
  );
  const selectedBotIdsList = useMemo(() => [...selectedBotIds], [selectedBotIds]);
  const selectedCount = selectedBotIds.size;
  const selectedDeletableBotIds = useMemo(
    () => selectedBotIdsList.filter((id) => ruleIds.has(id)),
    [selectedBotIdsList, ruleIds],
  );
  const allSelected = allBotIds.length > 0 && allBotIds.every((id) => selectedBotIds.has(id));
  const someSelected = allBotIds.some((id) => selectedBotIds.has(id));

  const formatCountMessage = (template: string, count: number) =>
    template.replace('{count}', String(count));

  const formatTemplateMessage = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (message, [key, value]) => message.replace(`{${key}}`, String(value)),
      template,
    );

  const getBotRemovalLabel = useCallback(
    (botId: string) => {
      const row = allRows.find((item) => item.id === botId);
      if (!row) {
        return botId;
      }

      const description = row.description.trim();
      if (description && description !== '-') {
        return `${description} (${botId})`;
      }

      return botId;
    },
    [allRows],
  );

  const toggleBotSelection = useCallback((botId: string) => {
    setSelectedBotIds((prev) => {
      const next = new Set(prev);
      if (next.has(botId)) {
        next.delete(botId);
      } else {
        next.add(botId);
      }
      return next;
    });
  }, []);

  const toggleAllBotsSelection = useCallback(() => {
    setSelectedBotIds(allSelected ? new Set() : new Set(allBotIds));
  }, [allBotIds, allSelected]);

  const isBotCheckboxDisabled = useCallback(
    (botId: string) => pendingBotIds.includes(botId) || hiddenBotIds.includes(botId),
    [hiddenBotIds, pendingBotIds],
  );

  const isBotRowPending = useCallback(
    (botId: string) => pendingBotIds.includes(botId),
    [pendingBotIds],
  );

  const isBotSelected = useCallback(
    (botId: string) => selectedBotIds.has(botId),
    [selectedBotIds],
  );

  useEffect(() => {
    setSelectedBotIds((prev) => {
      const validIds = new Set(allBotIds);
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [allBotIds]);

  useEffect(() => {
    scheduledRemovalsRef.current.forEach((cancelScheduledRemoval) => cancelScheduledRemoval());
    scheduledRemovalsRef.current.clear();
    setHiddenBotIds([]);
  }, [activeServer.ip, activeServer.port]);

  const scheduleBotsRemoval = (botIds: string[]) => {
    const uniqueBotIds = [...new Set(botIds.filter((id) => ruleIds.has(id)))];
    if (uniqueBotIds.length === 0) {
      return;
    }

    const pendingIds = uniqueBotIds.filter((id) => !hiddenBotIds.includes(id));
    if (pendingIds.length === 0) {
      return;
    }

    const scheduleKey = pendingIds.join('|');
    if (scheduledRemovalsRef.current.has(scheduleKey)) {
      return;
    }

    setHiddenBotIds((prev) => [...new Set([...prev, ...pendingIds])]);
    setSelectedBotIds((prev) => {
      const next = new Set(prev);
      pendingIds.forEach((id) => next.delete(id));
      return next;
    });

    const restoreHiddenBots = () => {
      scheduledRemovalsRef.current.delete(scheduleKey);
      setHiddenBotIds((prev) => prev.filter((id) => !pendingIds.includes(id)));
    };

    const removalLabels = pendingIds.map((botId) => getBotRemovalLabel(botId));
    const removalMessage =
      pendingIds.length === 1
        ? formatTemplateMessage(t.botsTab.removeBot.confirm, { label: removalLabels[0] })
        : formatTemplateMessage(t.botsTab.removeBot.confirmBulk, {
            count: pendingIds.length,
            labels: removalLabels.join(', '),
          });

    const cancelScheduledRemoval = showDelayedActionToast({
      message: removalMessage,
      cancelLabel: t.botsTab.removeBot.cancel,
      onCancel: restoreHiddenBots,
      onConfirm: async () => {
        scheduledRemovalsRef.current.delete(scheduleKey);
        const result = await dispatch(
          pendingIds.length === 1
            ? removeBotFromServer(pendingIds[0])
            : removeBotsFromServer(pendingIds),
        );
        if (removeBotFromServer.fulfilled.match(result) || removeBotsFromServer.fulfilled.match(result)) {
          setHiddenBotIds((prev) => prev.filter((id) => !pendingIds.includes(id)));
          showToast(
            'success',
            pendingIds.length === 1
              ? formatTemplateMessage(t.botsTab.removeBot.success, { label: removalLabels[0] })
              : formatCountMessage(t.botsTab.removeBot.successBulk, pendingIds.length),
          );
        } else {
          restoreHiddenBots();
          showToast(
            'error',
            result.error.message ??
              (pendingIds.length === 1
                ? t.botsTab.removeBot.error
                : t.botsTab.removeBot.errorBulk),
          );
        }
      },
    });

    scheduledRemovalsRef.current.set(scheduleKey, cancelScheduledRemoval);
  };

  const scheduleBotRemoval = (botId: string) => {
    scheduleBotsRemoval([botId]);
  };

  const showBulkPauseToast = (
    result: Awaited<ReturnType<typeof dispatch>>,
    pause: boolean,
    scope: 'all' | 'selected',
  ) => {
    const matcher = scope === 'all' ? setAllBotsPaused.fulfilled : setSelectedBotsPaused.fulfilled;
    const errorMessage =
      scope === 'all'
        ? pause
          ? t.botsTab.stopAllError
          : t.botsTab.startAllError
        : pause
          ? t.botsTab.stopSelectedError
          : t.botsTab.startSelectedError;
    const successMessage =
      scope === 'all'
        ? pause
          ? t.botsTab.stopAllSuccess
          : t.botsTab.startAllSuccess
        : pause
          ? t.botsTab.stopSelectedSuccess
          : t.botsTab.startSelectedSuccess;

    if (!matcher.match(result)) {
      showToast('error', result.error.message ?? errorMessage);
      return;
    }

    const success = result.payload.success ?? 0;
    const failed = result.payload.failed ?? 0;
    const total = result.payload.total ?? success;

    if (failed > 0) {
      showToast('info', `${successMessage} (${success}/${total})`);
      return;
    }

    showToast(
      'success',
      scope === 'all' ? successMessage : formatCountMessage(successMessage, success),
    );
  };

  const showBulkRestartToast = (
    result: Awaited<ReturnType<typeof dispatch>>,
    scope: 'all' | 'selected',
  ) => {
    const matcher = scope === 'all' ? restartAllBots.fulfilled : restartSelectedBots.fulfilled;
    const errorMessage =
      scope === 'all' ? t.botsTab.restartAllError : t.botsTab.restartSelectedError;
    const successMessage =
      scope === 'all' ? t.botsTab.restartAllSuccess : t.botsTab.restartSelectedSuccess;

    if (!matcher.match(result)) {
      showToast('error', result.error.message ?? errorMessage);
      return;
    }

    const success = result.payload.success ?? 0;
    const failed = result.payload.failed ?? 0;
    const total = result.payload.total ?? success;

    if (failed > 0) {
      showToast('info', `${successMessage} (${success}/${total})`);
      return;
    }

    showToast(
      'success',
      scope === 'all' ? successMessage : formatCountMessage(successMessage, success),
    );
  };

  const runSelectedPause = async (pause: boolean) => {
    if (selectedBotIdsList.length === 0) {
      return;
    }
    const result = await dispatch(
      setSelectedBotsPaused({ botIds: selectedBotIdsList, pause }),
    );
    showBulkPauseToast(result, pause, 'selected');
  };

  const runAllPause = async (pause: boolean) => {
    if (allBotIds.length === 0) {
      return;
    }
    const result = await dispatch(setAllBotsPaused({ pause, botIds: allBotIds }));
    showBulkPauseToast(result, pause, 'all');
  };

  const runSelectedRestart = async () => {
    if (selectedBotIdsList.length === 0) {
      return;
    }
    const result = await dispatch(restartSelectedBots(selectedBotIdsList));
    showBulkRestartToast(result, 'selected');
  };

  const runAllRestart = async () => {
    if (allBotIds.length === 0) {
      return;
    }
    const result = await dispatch(restartAllBots(allBotIds));
    showBulkRestartToast(result, 'all');
  };

  const formatActionLabel = (label: string, count?: number) =>
    count && count > 0 ? `${label} (${count})` : label;

  const colDefs: ColDef<BotRow>[] = [
    {
      colId: 'checkbox',
      headerName: '',
      pinned: 'left',
      width: 56,
      minWidth: 56,
      maxWidth: 56,
      sortable: false,
      resizable: false,
      suppressMovable: true,
      headerComponent: BotsGridCheckboxHeader,
      headerComponentParams: {
        checked: allSelected,
        indeterminate: someSelected && !allSelected,
        onToggle: toggleAllBotsSelection,
      },
      cellRenderer: BotsGridCheckboxCell,
      cellRendererParams: {
        isSelected: isBotSelected,
        onToggle: toggleBotSelection,
        isDisabled: isBotCheckboxDisabled,
      },
    },
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
      pinned: 'right',
      lockPinned: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      resizable: false,
      suppressMovable: true,
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
    {
      headerName: t.botsTab.table.control,
      colId: 'control',
      pinned: 'right',
      lockPinned: true,
      minWidth: 90,
      maxWidth: 90,
      width: 90,
      sortable: false,
      resizable: false,
      suppressMovable: true,
      cellRenderer: (params: { data?: BotRow }) => {
        const row = params.data;
        if (!row) {
          return null;
        }

        const isActive = row.status === 'active';
        const isPending = isBotRowPending(row.id);
        const isDisabled = isPending;
        const title = isActive ? t.botDetail.controlTab.pause : t.botsTab.startAll;

        return (
          <div className="w-full h-full flex items-center justify-center">
            <button
              type="button"
              title={title}
              disabled={isDisabled}
              onClick={async (event) => {
                event.stopPropagation();
                const result = await dispatch(setSingleBotPaused({ botId: row.id, pause: isActive }));
                if (setSingleBotPaused.fulfilled.match(result)) {
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
              className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
                isDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : isActive
                    ? 'bg-warning text-warning-foreground hover:opacity-90'
                    : 'bg-success text-success-foreground hover:opacity-90'
              }`}
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isActive ? (
                <Pause size={14} />
              ) : (
                <Play size={14} />
              )}
            </button>
          </div>
        );
      },
    },
    {
      headerName: t.botsTab.table.delete,
      colId: 'delete',
      pinned: 'right',
      lockPinned: true,
      minWidth: 80,
      maxWidth: 80,
      width: 80,
      sortable: false,
      resizable: false,
      suppressMovable: true,
      cellRenderer: (params: { data?: BotRow }) => {
        const row = params.data;
        if (!row || !ruleIds.has(row.id)) {
          return null;
        }

        const isPending = isBotRowPending(row.id);
        const isDisabled = isPending;

        return (
          <div className="w-full h-full flex items-center justify-center">
            <button
              type="button"
              title={t.botsTab.removeBot.button}
              disabled={isDisabled}
              onClick={(event) => {
                event.stopPropagation();
                scheduleBotRemoval(row.id);
              }}
              onDoubleClick={(event) => event.stopPropagation()}
              className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
                isDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-destructive/15 text-destructive hover:bg-destructive/25'
              }`}
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
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
          <div className="space-y-3">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded transition-colors [&[data-state=open]>svg]:rotate-180">
                <span>
                  {t.botsTab.workingServers} ({workingServers.length})
                </span>
                <ChevronDown size={16} className="text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 pt-1">
                  {workingServers.length > 0 ? (
                    workingServers.map(renderServerItem)
                  ) : (
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      {t.botsTab.noWorkingServers}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded transition-colors [&[data-state=open]>svg]:rotate-180">
                <span>
                  {t.botsTab.notWorkingServers} ({notWorkingServers.length})
                </span>
                <ChevronDown size={16} className="text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 pt-1">
                  {notWorkingServers.length > 0 ? (
                    notWorkingServers.map(renderServerItem)
                  ) : (
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      {t.botsTab.noNotWorkingServers}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
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
          <h2 className="text-sm text-foreground">
            {t.botsTab.title} ({totalBots}/{runningBots})
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSetBotFormOpen(true)}
              className="px-3 py-1.5 rounded text-sm transition-colors bg-secondary text-secondary-foreground hover:opacity-90"
            >
              {t.botsTab.setBot.button}
            </button>
            <button
              type="button"
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center p-2 rounded transition-colors bg-muted text-foreground hover:bg-accent"
                  aria-label={t.botsTab.actions}
                  title={t.botsTab.actions}
                >
                  <Menu size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={allBotIds.length === 0}
                  onClick={() => void runAllPause(false)}
                >
                  {t.botsTab.startAll}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={allBotIds.length === 0}
                  onClick={() => void runAllPause(true)}
                >
                  {t.botsTab.stopAll}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={allBotIds.length === 0}
                  onClick={() => void runAllRestart()}
                >
                  {t.botsTab.restartAll}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={deletableBotIds.length === 0}
                  onClick={() => scheduleBotsRemoval(deletableBotIds)}
                >
                  {t.botsTab.deleteAll}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={selectedCount === 0}
                  onClick={() => void runSelectedPause(false)}
                >
                  {formatActionLabel(t.botsTab.startSelected, selectedCount)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={selectedCount === 0}
                  onClick={() => void runSelectedPause(true)}
                >
                  {formatActionLabel(t.botsTab.stopSelected, selectedCount)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={selectedCount === 0}
                  onClick={() => void runSelectedRestart()}
                >
                  {formatActionLabel(t.botsTab.restartSelected, selectedCount)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={selectedDeletableBotIds.length === 0}
                  onClick={() => scheduleBotsRemoval(selectedDeletableBotIds)}
                >
                  {formatActionLabel(t.botsTab.deleteSelected, selectedDeletableBotIds.length)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSetBotFormOpen ? (
          <SetBotForm
            onBack={() => setIsSetBotFormOpen(false)}
            onSave={async (config) => {
              const result = await dispatch(setBotFromConfig(config));
              if (setBotFromConfig.fulfilled.match(result)) {
                showToast('success', t.botsTab.setBot.saveSuccess);
                setIsSetBotFormOpen(false);
              } else {
                showToast('error', result.error.message ?? t.botsTab.setBot.saveError);
              }
            }}
          />
        ) : (
          <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
            {botControlListState.error ? (
              <div className="p-4 text-sm text-destructive">{botControlListState.error}</div>
            ) : (
              <AppGrid<BotRow>
                rowData={rows}
                columnDefs={colDefs}
                className="h-full"
                onRowDoubleClicked={(event) => {
                  const botId = event.data?.id;
                  if (botId && !pendingBotIds.includes(botId)) {
                    onBotSelect?.(botId);
                  }
                }}
              />
            )}
          </div>
        )}
        {!isSetBotFormOpen && botControlListState.isLoading && (
          <div className="text-sm text-muted-foreground mt-2 px-4">{t.botsTab.loading ?? 'Loading...'}</div>
        )}
        {!isSetBotFormOpen && !botControlListState.isLoading && rows.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2 px-4">
            {t.botsTab.openBotHintDoubleClick ?? t.botsTab.openBotHint}
          </div>
        )}
      </div>
      <ApiInfoModal open={isApiInfoOpen} onOpenChange={setIsApiInfoOpen} />
    </div>
  );
}
