import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AgGridBotsControl} from '../ag-grid-bots-control/ag-grid-bots-control';
import {AgGridErrorList} from '../ag-grid-error-list/ag-grid-error-list';
import {TitleTableLayout} from '../title-table-layout/title-table-layout';
import {TitleContentLayout} from '../title-content-layout/title-content-layout';

interface IErrors {
  errors: any;
}
@Component({
  selector: 'app-bot-errors-page',
  imports: [
    AgGridBotsControl,
    AgGridErrorList,
    TitleTableLayout,
    TitleContentLayout
  ],
  standalone: true,
  templateUrl: './bot-errors-page.html',
  styleUrl: './bot-errors-page.scss',
})
export class BotErrorsPage {
  @Input() data: IErrors = {
    errors: [
      {
        id: '232',
        time: '123213',
        status: '404',
        message: 'MessageCHEEEEECK'
      }
    ]
  };

  @Output() emitter = new EventEmitter<any>();

  events($event: any) {
    console.log($event);
  }
}
