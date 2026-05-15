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
    <div className="p-6 overflow-auto h-[calc(100vh-176px)]">
      <h3 className="text-lg text-gray-900 mb-4">{t.botDetail.errorsTab.title}</h3>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-250px)]">
        {errorsState.error ? (
          <div className="p-4 text-sm text-red-600">{errorsState.error}</div>
        ) : (
          <AppGrid<ErrorRow> rowData={rows} columnDefs={colDefs} className="h-full" />
        )}
      </div>
      {errorsState.isLoading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
    </div>
  );
}
