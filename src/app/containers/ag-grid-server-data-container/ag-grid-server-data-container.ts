import { Component } from '@angular/core';
import {AgGridServerData} from '../../components/ag-grid-server-data/ag-grid-server-data';

@Component({
  selector: 'app-ag-grid-server-data-container',
  imports: [
    AgGridServerData
  ],
  standalone: true,
  templateUrl: './ag-grid-server-data-container.html',
  styleUrl: './ag-grid-server-data-container.scss'
})
export class AgGridServerDataContainer {
  serverData  = []
}
