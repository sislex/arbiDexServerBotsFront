import {Component, inject} from '@angular/core';
import {AgGridServerData} from '../../components/ag-grid-server-data/ag-grid-server-data';
import {Store} from '@ngrx/store';
import {getServerData} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {IServerData} from '../../+state/servers/servers.reducer';

@Component({
  selector: 'app-ag-grid-server-data-container',
  imports: [
    AgGridServerData,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-server-data-container.html',
  styleUrl: './ag-grid-server-data-container.scss'
})
export class AgGridServerDataContainer {
  private store = inject(Store);
  serverData$: Observable<IServerData[]> = this.store.select(getServerData);
}
