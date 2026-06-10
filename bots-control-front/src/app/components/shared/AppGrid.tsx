import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type GridReadyEvent,
  type FirstDataRenderedEvent,
  type RowClickedEvent,
  type RowDoubleClickedEvent,
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AppGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  className?: string;
  enableTextSelection?: boolean;
  onRowClicked?: (event: RowClickedEvent<T>) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent<T>) => void;
  onGridReady?: (event: GridReadyEvent<T>) => void;
  onFirstDataRendered?: (event: FirstDataRenderedEvent<T>) => void;
}

export function AppGrid<T extends object>({
  rowData,
  columnDefs,
  className,
  enableTextSelection = true,
  onRowClicked,
  onRowDoubleClicked,
  onGridReady,
  onFirstDataRendered,
}: AppGridProps<T>) {
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: false,
      resizable: true,
      suppressMovable: true,
    }),
    [],
  );

  const gridOptions = useMemo(
    () =>
      enableTextSelection
        ? {
            enableCellTextSelection: true,
            ensureDomOrder: true,
          }
        : undefined,
    [enableTextSelection],
  );

  return (
    <div
      className={`ag-theme-alpine arb-dex-grid w-full h-full ${
        enableTextSelection ? 'arb-dex-grid--selectable ' : ''
      }${className ?? ''}`}
    >
      <AgGridReact<T>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        onRowClicked={onRowClicked}
        onRowDoubleClicked={onRowDoubleClicked}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
      />
    </div>
  );
}
