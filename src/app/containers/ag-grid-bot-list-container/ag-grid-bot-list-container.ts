import {Component, Inject} from '@angular/core';
import {AgGridBotList} from '../../components/ag-grid-bot-list/ag-grid-bot-list';
import {Store} from '@ngrx/store';
import {getBotTypesList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {ITypesList} from '../../+state/servers/servers.reducer';

@Component({
  selector: 'app-ag-grid-bot-list-container',
  imports: [
    AgGridBotList,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-bot-list-container.html',
  styleUrl: './ag-grid-bot-list-container.scss'
})
export class AgGridBotListContainer {
  private store=Inject(Store)
  botTypesList$: Observable<ITypesList[]> = this.store.select(getBotTypesList)
}
