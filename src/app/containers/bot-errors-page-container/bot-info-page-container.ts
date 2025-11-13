import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {AgGridErrorList} from '../../components/ag-grid-error-list/ag-grid-error-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {AsyncPipe} from '@angular/common';
import {getBotsControlList} from '../../+state/servers/servers.selectors';

@Component({
  selector: 'app-bot-errors-page-container',
  imports: [
    AgGridBotsControl,
    AgGridErrorList,
    TitleTableLayout,
    AgGridBotDataList,
    AsyncPipe,
  ],
  standalone: true,
  templateUrl: './bot-info-page-container.html',
  styleUrl: './bot-info-page-container.scss',
})
export class BotInfoPageContainer implements OnInit {
  private store = inject(Store)
  data = {
    errors: [],
    params: []
  };

  botsControlList$ = this.store.select(getBotsControlList)
  ngOnInit() {
    console.log('тут вызвать диспатч на запуск апишки получения errors по ip, port, id-бота')
  }

  events($event: any) {
    console.log($event)
  }
}
