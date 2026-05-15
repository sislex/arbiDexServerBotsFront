import type { ColDef } from 'ag-grid-community';
import { Circle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import {
  selectBotTypesState,
  selectJobTypesState,
  selectServerDataState,
} from '../store/selectors';
import { AppGrid } from './shared/AppGrid';

interface ServerDataRow {
  ip: string;
  authData: string;
  version: string;
  timeToClose: string;
  timeAfterClose: string;
  bots: number;
  status: string;
}

interface TypeRow {
  id: string;
  type: string;
  description: string;
}

function formatTimeDelta(targetIso?: string, mode: 'toClose' | 'afterClose' = 'toClose') {
  if (!targetIso) {
    return '-';
  }

  const delta = Date.parse(targetIso) - Date.now();
  if (mode === 'toClose' && delta <= 0) {
    return '-';
  }
  if (mode === 'afterClose' && delta >= 0) {
    return '-';
  }

  const seconds = Math.floor(Math.abs(delta) / 1000);
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  if (hours > 0) {
    return `${hours}h ${mins % 60}m`;
  }
  if (mins > 0) {
    return `${mins}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function ServerDataTab() {
  const { t } = useLanguage();
  const serverDataState = useAppSelector(selectServerDataState);
  const botTypesState = useAppSelector(selectBotTypesState);
  const jobTypesState = useAppSelector(selectJobTypesState);

  const serverRows: ServerDataRow[] = serverDataState.data
    ? [
        {
          ip: serverDataState.data.ip,
          authData: serverDataState.data.authorizationData ?? '-',
          version: serverDataState.data.version ?? '-',
          timeToClose: formatTimeDelta(serverDataState.data.timestampFinish, 'toClose'),
          timeAfterClose: formatTimeDelta(serverDataState.data.timestampFinish, 'afterClose'),
          bots: Number(serverDataState.data.botsCount ?? 0),
          status: serverDataState.data.status ?? 'unknown',
        },
      ]
    : [];

  const botTypes: TypeRow[] = botTypesState.data.map((item) => ({
    id: String(item.id ?? ''),
    type: String(item.type ?? item.label ?? '-'),
    description: String(item.description ?? '-'),
  }));

  const jobTypes: TypeRow[] = jobTypesState.data.map((item) => ({
    id: String(item.id ?? ''),
    type: String(item.type ?? item.label ?? '-'),
    description: String(item.description ?? '-'),
  }));

  const serverColDefs: ColDef<ServerDataRow>[] = [
    { field: 'ip', headerName: t.serverDataTab.serverData.ip, minWidth: 140 },
    { field: 'authData', headerName: t.serverDataTab.serverData.authData, minWidth: 180, flex: 1 },
    { field: 'version', headerName: t.serverDataTab.serverData.version, minWidth: 120 },
    { field: 'timeToClose', headerName: t.serverDataTab.serverData.timeToClose, minWidth: 150 },
    { field: 'timeAfterClose', headerName: t.serverDataTab.serverData.timeAfterClose, minWidth: 160 },
    { field: 'bots', headerName: t.serverDataTab.serverData.bots, minWidth: 90 },
    {
      field: 'status',
      headerName: t.serverDataTab.serverData.status,
      maxWidth: 100,
      cellRenderer: (params: { value: string }) => {
        const isActive = ['active', 'running', 'online'].includes(params.value);
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Circle
              size={10}
              className={isActive ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'}
            />
          </div>
        );
      },
    },
  ];

  const typesColDefs = (titleType: string, titleDesc: string): ColDef<TypeRow>[] => [
    {
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: 'type', headerName: titleType, minWidth: 220 },
    { field: 'description', headerName: titleDesc, minWidth: 280, flex: 1 },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-background">
      <div className="h-11 shrink-0 border-b border-border bg-background flex items-center px-4">
        <h2 className="text-sm text-foreground">{t.serverDataTab.title}</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-6">

      {/* Server Data Table */}
      <div>
        <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.serverData.title}</h3>
        <div className="bg-card border border-border rounded overflow-hidden h-56">
          {serverDataState.error ? (
            <div className="p-4 text-sm text-destructive">{serverDataState.error}</div>
          ) : (
            <AppGrid<ServerDataRow> rowData={serverRows} columnDefs={serverColDefs} className="h-full" />
          )}
        </div>
      </div>

      {/* Bot Types Table */}
      <div>
        <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.botTypes.title}</h3>
        <div className="bg-card border border-border rounded overflow-hidden h-72">
          {botTypesState.error ? (
            <div className="p-4 text-sm text-destructive">{botTypesState.error}</div>
          ) : (
            <AppGrid<TypeRow>
              rowData={botTypes}
              columnDefs={typesColDefs(t.serverDataTab.botTypes.type, t.serverDataTab.botTypes.description)}
              className="h-full"
            />
          )}
        </div>
      </div>

      {/* Job Types Table */}
      <div>
        <h3 className="text-sm text-muted-foreground mb-2">{t.serverDataTab.jobTypes.title}</h3>
        <div className="bg-card border border-border rounded overflow-hidden h-72">
          {jobTypesState.error ? (
            <div className="p-4 text-sm text-destructive">{jobTypesState.error}</div>
          ) : (
            <AppGrid<TypeRow>
              rowData={jobTypes}
              columnDefs={typesColDefs(t.serverDataTab.jobTypes.type, t.serverDataTab.jobTypes.description)}
              className="h-full"
            />
          )}
        </div>
      </div>
      {(serverDataState.isLoading || botTypesState.isLoading || jobTypesState.isLoading) && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}
      </div>
    </div>
  );
}
