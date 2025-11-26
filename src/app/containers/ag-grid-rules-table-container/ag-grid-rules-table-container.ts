import { Component } from '@angular/core';
import {AgGridRulesTable} from '../../components/ag-grid-rules-table/ag-grid-rules-table';

@Component({
  selector: 'app-ag-grid-rules-table-container',
  imports: [
    AgGridRulesTable
  ],
  standalone: true,
  templateUrl: './ag-grid-rules-table-container.html',
  styleUrl: './ag-grid-rules-table-container.scss',
})
export class AgGridRulesTableContainer {

  events(event: any) {

  }
}
