import {Component, inject} from '@angular/core';
import {AgGridActionList} from '../../components/ag-grid-action-list/ag-grid-action-list';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {ITypesList} from '../../models/servers';
import {getJobTypesList} from '../../+state/servers/servers.selectors';

@Component({
  selector: 'app-ag-grid-action-list-container',
  imports: [
    AgGridActionList,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-action-list-container.html',
  styleUrl: './ag-grid-action-list-container.scss'
})
export class AgGridActionListContainer {
  private store = inject(Store);
  jobTypesList$: Observable<ITypesList[]> = this.store.select(getJobTypesList);
}
