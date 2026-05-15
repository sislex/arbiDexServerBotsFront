import type { ColDef } from 'ag-grid-community';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectActiveBotErrorsState } from '../store/selectors';
import { AppGrid } from './shared/AppGrid';

interface ErrorRow {
  createdAt: string;
  durationMs: number;
  errorCode: string;
  message: string;
}

export function BotErrorsTab() {
  const { t } = useLanguage();
  const errorsState = useAppSelector(selectActiveBotErrorsState);

  const rows: ErrorRow[] = errorsState.data.map((item) => {
    const map = item as Record<string, unknown>;
    return {
      createdAt: String(map.createdAt ?? map.time ?? ''),
      durationMs: Number(map.durationMs ?? map.duration ?? 0),
      errorCode: String(map.errorCode ?? map.code ?? ''),
      message: String(map.message ?? ''),
    };
  });

  const colDefs: ColDef<ErrorRow>[] = [
    {
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: 'createdAt', headerName: t.botDetail.errorsTab.time, minWidth: 170 },
    { field: 'durationMs', headerName: t.botDetail.errorsTab.duration, minWidth: 130 },
    { field: 'errorCode', headerName: t.botDetail.errorsTab.errorCode, minWidth: 190 },
    {
      field: 'message',
      headerName: t.botDetail.errorsTab.errorMessage,
      minWidth: 300,
      flex: 1,
      wrapText: true,
      autoHeight: true,
    },
  ];

  return (
    <div className="p-4 overflow-auto h-[calc(100vh-122px)]">
      <h3 className="text-sm text-foreground mb-2">{t.botDetail.errorsTab.title}</h3>

      <div className="bg-card border border-border rounded overflow-hidden h-[calc(100vh-180px)]">
        {errorsState.error ? (
          <div className="p-4 text-sm text-destructive">{errorsState.error}</div>
        ) : (
          <AppGrid<ErrorRow> rowData={rows} columnDefs={colDefs} className="h-full" />
        )}
      </div>
      {errorsState.isLoading && <div className="text-sm text-muted-foreground mt-2">Loading...</div>}
    </div>
  );
}
