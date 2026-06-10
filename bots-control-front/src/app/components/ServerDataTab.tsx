import { useEffect, useMemo, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import { Circle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectActiveServer, selectRulesListState } from '../store/selectors';
import {
  buildBotTypeRowsFromRules,
  buildJobTypeRowsFromRules,
  type ServerConfigTypeRow,
} from '../services/bot-control-adapter';
import { checkServerHealth, type ServerHealthStatus } from '../services/server-health';
import { AppGrid } from './shared/AppGrid';

interface ServerDataRow {
  ip: string;
  port: string;
  status: ServerHealthStatus;
}

const statusLabel = (
  status: ServerHealthStatus,
  labels: { online: string; offline: string; loading: string },
) => {
  if (status === 'online') {
    return labels.online;
  }
  if (status === 'offline') {
    return labels.offline;
  }
  return labels.loading;
};

export function ServerDataTab() {
  const { t } = useLanguage();
  const activeServer = useAppSelector(selectActiveServer);
  const rulesState = useAppSelector(selectRulesListState);
  const [serverStatus, setServerStatus] = useState<ServerHealthStatus>('loading');

  useEffect(() => {
    let isCancelled = false;
    setServerStatus('loading');

    void checkServerHealth(activeServer.ip, activeServer.port).then((status) => {
      if (!isCancelled) {
        setServerStatus(status);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeServer.ip, activeServer.port, rulesState.isLoading]);

  const serverRows: ServerDataRow[] = useMemo(
    () => [
      {
        ip: activeServer.ip,
        port: activeServer.port,
        status: serverStatus,
      },
    ],
    [activeServer.ip, activeServer.port, serverStatus],
  );

  const botTypes = useMemo(
    () => buildBotTypeRowsFromRules(rulesState.data),
    [rulesState.data],
  );

  const jobTypes = useMemo(
    () => buildJobTypeRowsFromRules(rulesState.data),
    [rulesState.data],
  );

  const statusLabels = useMemo(
    () => ({
      online: t.serverDataTab.serverData.statusOnline,
      offline: t.serverDataTab.serverData.statusOffline,
      loading: t.serverDataTab.serverData.statusLoading,
    }),
    [t],
  );

  const serverColDefs = useMemo<ColDef<ServerDataRow>[]>(
    () => [
      { field: 'ip', headerName: t.serverDataTab.serverData.ip, minWidth: 160, flex: 1 },
      { field: 'port', headerName: t.serverDataTab.serverData.port, minWidth: 120, flex: 1 },
      {
        field: 'status',
        headerName: t.serverDataTab.serverData.status,
        minWidth: 140,
        flex: 1,
        cellRenderer: (params: { value: ServerHealthStatus }) => {
          const status = params.value ?? 'loading';
          const isOnline = status === 'online';
          const isOffline = status === 'offline';
          return (
            <div className="w-full h-full flex items-center justify-center gap-2">
              <Circle
                size={10}
                className={
                  isOnline
                    ? 'fill-green-500 text-green-500'
                    : isOffline
                      ? 'fill-red-500 text-red-500'
                      : 'fill-yellow-500 text-yellow-500'
                }
              />
              <span className="text-xs text-foreground select-text">{statusLabel(status, statusLabels)}</span>
            </div>
          );
        },
      },
    ],
    [statusLabels, t],
  );

  const typesColDefs = useMemo(
    () =>
      (titleType: string, titleDesc: string): ColDef<ServerConfigTypeRow>[] => [
        {
          headerName: '#',
          maxWidth: 70,
          valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
        },
        { field: 'type', headerName: titleType, minWidth: 220 },
        { field: 'description', headerName: titleDesc, minWidth: 280, flex: 1, wrapText: true, autoHeight: true },
      ],
    [],
  );

  const rulesError = rulesState.error;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-background">
      <div className="h-11 shrink-0 border-b border-border bg-background flex items-center px-4">
        <h2 className="text-sm text-foreground">{t.serverDataTab.title}</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.serverData.title}</h3>
          <div className="bg-card border border-border rounded overflow-hidden h-28">
            <AppGrid<ServerDataRow> rowData={serverRows} columnDefs={serverColDefs} className="h-full" />
          </div>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.botTypes.title}</h3>
          <div className="bg-card border border-border rounded overflow-hidden h-72">
            {rulesError ? (
              <div className="p-4 text-sm text-destructive">{rulesError}</div>
            ) : (
              <AppGrid<ServerConfigTypeRow>
                rowData={botTypes}
                columnDefs={typesColDefs(
                  t.serverDataTab.botTypes.type,
                  t.serverDataTab.botTypes.description,
                )}
                className="h-full"
              />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.jobTypes.title}</h3>
          <div className="bg-card border border-border rounded overflow-hidden h-72">
            {rulesError ? (
              <div className="p-4 text-sm text-destructive">{rulesError}</div>
            ) : (
              <AppGrid<ServerConfigTypeRow>
                rowData={jobTypes}
                columnDefs={typesColDefs(
                  t.serverDataTab.jobTypes.type,
                  t.serverDataTab.jobTypes.description,
                )}
                className="h-full"
              />
            )}
          </div>
        </div>

        {rulesState.isLoading && (
          <div className="text-sm text-muted-foreground">{t.botsTab.loading}</div>
        )}
      </div>
    </div>
  );
}
