import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {AgGridErrorList} from '../../components/ag-grid-error-list/ag-grid-error-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {AsyncPipe} from '@angular/common';
import {getDataActiveBot} from '../../+state/servers/servers.selectors';
import {TitleContentLayout} from '../../components/title-content-layout/title-content-layout';
import {Actions} from '../../components/ag-grid-components/actions/actions';

@Component({
  selector: 'app-bot-info-page-container',
    imports: [
        AgGridBotsControl,
        AgGridErrorList,
        TitleTableLayout,
        AgGridBotDataList,
        AsyncPipe,
        TitleContentLayout,
        Actions,
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

  dataActiveBot$ = this.store.select(getDataActiveBot)

  ngOnInit() {
    console.log('тут вызвать диспатч - делаем следующее:')

    console.log('сохраняю id в стейт')
    console.log('в эффекте делаю запросы на данные о боте, его ответы, его ошибки по ip, port и id из стэйта')
  }

  events($event: any) {
    console.log($event)
  }
}
