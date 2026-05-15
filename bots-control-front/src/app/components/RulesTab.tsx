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
    <div className="h-[calc(100vh-100px)] flex flex-col bg-background">
      <div className="h-11 shrink-0 border-b border-border bg-background flex items-center px-4">
        <h2 className="text-sm text-foreground">{t.rulesTab.title}</h2>
      </div>
      <div className="px-4 py-2 text-sm text-muted-foreground">{t.rulesTab.subtitle}</div>

      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        {rulesState.error ? (
          <div className="p-4 text-sm text-destructive">{rulesState.error}</div>
        ) : (
          <AppGrid<RuleRow> rowData={rows} columnDefs={colDefs} className="h-full" />
        )}
      </div>
      {rulesState.isLoading && <div className="text-sm text-muted-foreground px-4 py-2">Loading...</div>}
    </div>
  );
}
