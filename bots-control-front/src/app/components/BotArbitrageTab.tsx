import type { ColDef } from 'ag-grid-community';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectActiveBotArbitrageState } from '../store/selectors';
import { AppGrid } from './shared/AppGrid';

interface ArbitrageRow {
  block: number;
  profit: string;
  time: string;
  spend: string;
  sentBuyGas: string;
  sentSellGas: string;
  routesIn: string;
  routesOut: string;
}

export function BotArbitrageTab() {
  const { t } = useLanguage();
  const arbitrageState = useAppSelector(selectActiveBotArbitrageState);

  const rows: ArbitrageRow[] = arbitrageState.data.map((item) => {
    const map = item as Record<string, unknown>;
    const details = (map.details as Record<string, unknown> | undefined) ?? {};
    return {
      block: Number(details.block ?? map.blockNumber ?? 0),
      profit: String(details.profit ?? map.profit ?? '-'),
      time: String(map.createdAt ?? map.time ?? '-'),
      spend: String(details.spend ?? '-'),
      sentBuyGas: String(details.sentBuyGas ?? '-'),
      sentSellGas: String(details.sentSellGas ?? '-'),
      routesIn: String(details.routesIn ?? '-'),
      routesOut: String(details.routesOut ?? '-'),
    };
  });

  const colDefs: ColDef<ArbitrageRow>[] = [
    { field: 'block', headerName: t.botDetail.arbitrageTab.block, minWidth: 120 },
    { field: 'profit', headerName: t.botDetail.arbitrageTab.profit, minWidth: 120 },
    { field: 'time', headerName: t.botDetail.arbitrageTab.time, minWidth: 180 },
    { field: 'spend', headerName: t.botDetail.arbitrageTab.spend, minWidth: 120 },
    { field: 'sentBuyGas', headerName: t.botDetail.arbitrageTab.sentBuyGas, minWidth: 130 },
    { field: 'sentSellGas', headerName: t.botDetail.arbitrageTab.sentSellGas, minWidth: 130 },
    { field: 'routesIn', headerName: t.botDetail.arbitrageTab.routesIn, minWidth: 160 },
    { field: 'routesOut', headerName: t.botDetail.arbitrageTab.routesOut, minWidth: 160 },
  ];

  return (
    <div className="p-6 h-[calc(100vh-176px)] flex flex-col">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
        {arbitrageState.error ? (
          <div className="p-4 text-sm text-red-600">{arbitrageState.error}</div>
        ) : rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-lg">
            {t.botDetail.arbitrageTab.noData}
          </div>
        ) : (
          <AppGrid<ArbitrageRow> rowData={rows} columnDefs={colDefs} className="h-full" />
        )}
      </div>
      {arbitrageState.isLoading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
    </div>
  );
}
