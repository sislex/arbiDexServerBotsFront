import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type RowClickedEvent,
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AppGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  className?: string;
  onRowClicked?: (event: RowClickedEvent<T>) => void;
}

export function AppGrid<T extends object>({
  rowData,
  columnDefs,
  className,
  onRowClicked,
}: AppGridProps<T>) {
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: false,
      resizable: true,
      suppressMovable: true,
    }),
    [],
  );

  return (
    <div className={`ag-theme-alpine w-full h-full ${className ?? ''}`}>
      <AgGridReact<T>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onRowClicked={onRowClicked}
      />
    </div>
  );
}
