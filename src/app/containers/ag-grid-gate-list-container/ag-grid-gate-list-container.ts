import { Component } from '@angular/core';
import {AgGridGateList} from '../../components/ag-grid-gate-list/ag-grid-gate-list';

@Component({
  selector: 'app-ag-grid-gate-list-container',
  imports: [
    AgGridGateList
  ],
  standalone: true,
  templateUrl: './ag-grid-gate-list-container.html',
  styleUrl: './ag-grid-gate-list-container.scss'
})
export class AgGridGateListContainer {

}
