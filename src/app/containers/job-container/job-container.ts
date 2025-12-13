import {Component, inject} from '@angular/core';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getActionParams} from '../../+state/servers/servers.selectors';
import {TitleTableButton} from '../../components/title-table-button/title-table-button';
import {JobFormContainer} from '../job-form-container/job-form-container';
import {AgGridBotDataListContainer} from '../ag-grid-bot-data-list-container/ag-grid-bot-data-list-container';

@Component({
  selector: 'app-job-container',
  imports: [
    TitleTableLayout,
    TitleTableButton,
    JobFormContainer,
    AsyncPipe,
    AgGridBotDataListContainer
  ],
  standalone: true,
  templateUrl: './job-container.html',
  styleUrl: './job-container.scss',
})
export class JobContainer {
  private store = inject(Store)

  actionParams$ = this.store.select(getActionParams)
}
