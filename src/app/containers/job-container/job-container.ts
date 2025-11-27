import {Component, inject} from '@angular/core';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getActionParams} from '../../+state/servers/servers.selectors';
import {TitleTableButton} from '../../components/title-table-button/title-table-button';
import {JobFormContainer} from '../job-form-container/job-form-container';

@Component({
  selector: 'app-job-container',
  imports: [
    AgGridBotDataList,
    TitleTableLayout,
    TitleTableButton,
    JobFormContainer,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './job-container.html',
  styleUrl: './job-container.scss',
})
export class JobContainer {
  private store = inject(Store)

  actionParams$ = this.store.select(getActionParams)
}
