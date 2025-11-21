import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, EventEmitter, Input, Output} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-ag-grid-rules-table',
  imports: [
    AgGridAngular
  ],
  standalone: true,
  templateUrl: './ag-grid-rules-table.html',
  styleUrl: './ag-grid-rules-table.scss',
})
export class AgGridRulesTable {
  @Input() rowData: any[] = [];

  @Output() emitter = new EventEmitter<any>();

  onAction(event: any, row: any) {
    this.emitter.emit({ ...event, row });
  }

  onRowDoubleClicked($event: any) {
    this.emitter.emit({
      event: 'AgGridRulesTable:DOUBLE_CLICKED_ROW',
      row: $event
    });
  }

  colDefs: ColDef[] = [
    {
      headerName: '#',
      width: 50,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: "id",
      headerName: 'ID',
      width: 150,
    },
    {
      field: "botParams",
      headerName: 'Bot Rule',
      flex: 1,
      valueFormatter: p => JSON.stringify(p.value),
    },
    {
      field: "actionParams",
      headerName: 'Job Rule',
      flex: 1,
      valueFormatter: p => JSON.stringify(p.value),
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
  };
}
