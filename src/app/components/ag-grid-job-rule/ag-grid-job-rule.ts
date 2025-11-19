import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IndicatorContainer} from '../../containers/ag-grid-containers/indicator-container/indicator-container';
import {RunActionOnceContainer} from '../../containers/run-action-once-container/run-action-once-container';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-job-rule',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid-job-rule.html',
  styleUrl: './ag-grid-job-rule.scss',
})
export class AgGridJobRule {
  @Input() rowData: any[] = [];

  @Output() emitter = new EventEmitter<any>();

  onAction(event: any, row: any) {
    this.emitter.emit({ ...event, row });
  }

  onRowDoubleClicked($event: any) {
    this.emitter.emit({
      event: 'AgGridBotsControl:DOUBLE_CLICKED_ROW',
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
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      cellRenderer: IndicatorContainer,
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
    // {
    //   headerName: 'Actions',
    //   width: 125,
    //   cellRenderer: ActionsContainer,
    //   cellRendererParams: {
    //     onAction: this.onAction.bind(this),
    //   },
    // },
    {
      headerName: 'Start once',
      flex: 1,
      cellRenderer: RunActionOnceContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
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
