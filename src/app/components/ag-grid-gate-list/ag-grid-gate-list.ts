import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GetDataPath } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  RowGroupingModule,
  TreeDataModule
} from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
  AllCommunityModule,
  RowGroupingModule,
  TreeDataModule
]);

@Component({
  selector: 'app-ag-grid-gate-list',
  imports: [AgGridAngular],
  templateUrl: './ag-grid-gate-list.html',
  styleUrl: './ag-grid-gate-list.scss'
})
export class AgGridGateList implements OnChanges {
  @Input() rowData: any[] = [];
  gridData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData'] && this.rowData) {
      this.gridData = this.prepareData(this.rowData);
    }
  }

  private prepareData(data: any[]) {
    const grouped: any[] = [];
    const gatesMap = new Map<string, any[]>();

    data.forEach(item => {
      if (!gatesMap.has(item.gate)) {
        gatesMap.set(item.gate, []);
      }
      gatesMap.get(item.gate)?.push(item);
    });

    gatesMap.forEach((bots, gate) => {
      grouped.push({
        gate,
        isParent: true,
        path: [gate]
      });
      bots.forEach(bot => {
        grouped.push({
          ...bot,
          path: [gate, bot.bots]
        });
      });
    });

    return grouped;
  }

  autoGroupColumnDef: ColDef = {
    headerName: "Gate",
    field: "gate",
    cellRendererParams: { suppressCount: true },
    valueGetter: params => {
      return params.node?.group ? params.data?.gate : '';
    },
    cellStyle: params =>
      params.node?.group ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
  };

  getDataPath: GetDataPath = (data) => data.path;

  colDefs: ColDef[] = [
    {
      field: "bots",
      headerName: 'Bot Name',
      cellStyle: params => params.node.group ? { fontWeight: 'bold', textAlign: 'center' } : { fontWeight: 'normal', textAlign: 'center' }
    },
    {
      field: "requests",
      aggFunc: "sum",
      headerName: 'Requests',
      cellStyle: params => params.node.group ? { fontWeight: 'bold', textAlign: 'center' } : { fontWeight: 'normal', textAlign: 'center' }
    },
    {
      field: "errors",
      aggFunc: "sum",
      headerName: 'Errors',
      cellStyle: params => params.node.group ? { fontWeight: 'bold', textAlign: 'center' } : { fontWeight: 'normal', textAlign: 'center' }
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    headerClass: 'align-center',
    resizable: false,
    suppressMovable: true,
    flex: 1
  };
}
