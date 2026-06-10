import { useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectRulesListState } from '../store/selectors';
import {
  RulesConfigCell,
  RulesFullConfigCopyCell,
  type RuleRowData,
} from './rules-config-cell';
import { AppGrid } from './shared/AppGrid';

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

export function RulesTab() {
  const { t } = useLanguage();
  const rulesState = useAppSelector(selectRulesListState);

  const rows: RuleRowData[] = rulesState.data.map((rule) => ({
    id: String(rule.id ?? '-'),
    botParams: (rule.botParams as Record<string, unknown> | undefined) ?? null,
    jobParams: (rule.jobParams as Record<string, unknown> | undefined) ?? null,
  }));

  const colDefs = useMemo<ColDef<RuleRowData>[]>(
    () => [
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
        valueFormatter: (params) => formatJson(params.value),
        cellRenderer: RulesConfigCell,
        cellRendererParams: {
          copyTitle: t.rulesTab.copyBotRule,
        },
      },
      {
        field: 'jobParams',
        headerName: t.rulesTab.table.jobRule,
        flex: 1,
        minWidth: 280,
        wrapText: true,
        autoHeight: true,
        valueFormatter: (params) => formatJson(params.value),
        cellRenderer: RulesConfigCell,
        cellRendererParams: {
          copyTitle: t.rulesTab.copyJobRule,
        },
      },
      {
        headerName: t.rulesTab.table.copyConfig,
        pinned: 'right',
        width: 72,
        minWidth: 72,
        maxWidth: 72,
        sortable: false,
        resizable: false,
        suppressMovable: true,
        cellRenderer: RulesFullConfigCopyCell,
        cellRendererParams: {
          copyTitle: t.rulesTab.copyRuleConfig,
        },
      },
    ],
    [t],
  );

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
          <AppGrid<RuleRowData>
            rowData={rows}
            columnDefs={colDefs}
            className="h-full"
            enableTextSelection
          />
        )}
      </div>
      {rulesState.isLoading && <div className="text-sm text-muted-foreground px-4 py-2">Loading...</div>}
    </div>
  );
}
