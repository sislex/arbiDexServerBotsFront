import {Component, inject} from '@angular/core';
import {AgGridApiList} from '../../components/ag-grid-api-list/ag-grid-api-list';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getApiList} from '../../+state/servers/servers.selectors';

@Component({
  selector: 'app-ag-grid-api-list-container',
  imports: [
    AgGridApiList,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-api-list-container.html',
  styleUrl: './ag-grid-api-list-container.scss',
})
export class AgGridApiListContainer {
  private store = inject(Store);
  apiList$ = this.store.select(getApiList);
}
