import {Component, inject} from '@angular/core';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getActionParams} from '../../+state/servers/servers.selectors';
import {TitleTableButton} from '../../components/title-table-button/title-table-button';

@Component({
  selector: 'app-job-container',
  imports: [
    AgGridBotDataList,
    TitleTableLayout,
    FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, AsyncPipe, TitleTableButton
  ],
  standalone: true,
  templateUrl: './job-container.html',
  styleUrl: './job-container.scss',
})
export class JobContainer {
  private store = inject(Store)

  actionParams$ = this.store.select(getActionParams)
}
