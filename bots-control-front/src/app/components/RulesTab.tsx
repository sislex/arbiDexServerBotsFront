import type { ColDef } from 'ag-grid-community';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectRulesListState } from '../store/selectors';
import { AppGrid } from './shared/AppGrid';

interface RuleRow {
  id: string;
  botParams: Record<string, unknown> | null;
  jobParams: Record<string, unknown> | null;
}

export function RulesTab() {
  const { t } = useLanguage();
  const rulesState = useAppSelector(selectRulesListState);

  const rows: RuleRow[] = rulesState.data.map((rule) => ({
    id: String(rule.id ?? '-'),
    botParams: (rule.botParams as Record<string, unknown> | undefined) ?? null,
    jobParams: (rule.jobParams as Record<string, unknown> | undefined) ?? null,
  }));

  const colDefs: ColDef<RuleRow>[] = [
    {
      headerName: '#',
      maxWidth: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    { field: 'id', headerName: t.rulesTab.table.id, minWidth: 140 },
    {
      field: 'botParams',
      headerName: t.rulesTab.table.botRule,
      flex: 1,
      minWidth: 280,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => JSON.stringify(params.value, null, 2),
      cellRenderer: (params: { valueFormatted: string }) => (
        <pre className="whitespace-pre-wrap text-xs m-0">{params.valueFormatted ?? '-'}</pre>
      ),
    },
    {
      field: 'jobParams',
      headerName: t.rulesTab.table.jobRule,
      flex: 1,
      minWidth: 280,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => JSON.stringify(params.value, null, 2),
      cellRenderer: (params: { valueFormatted: string }) => (
        <pre className="whitespace-pre-wrap text-xs m-0">{params.valueFormatted ?? '-'}</pre>
      ),
    },
  ];

  return (
    <div className="p-6 overflow-auto h-[calc(100vh-128px)]">
      <h2 className="text-xl text-gray-900 mb-2">{t.rulesTab.title}</h2>
      <h3 className="text-lg text-gray-700 mb-6">{t.rulesTab.subtitle}</h3>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[calc(100vh-230px)]">
        {rulesState.error ? (
          <div className="p-4 text-sm text-red-600">{rulesState.error}</div>
        ) : (
          <AppGrid<RuleRow> rowData={rows} columnDefs={colDefs} className="h-full" />
        )}
      </div>
      {rulesState.isLoading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
    </div>
  );
}
