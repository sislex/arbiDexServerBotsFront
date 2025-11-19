import { Component } from '@angular/core';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridJobRuleContainer} from '../ag-grid-job-rule-container/ag-grid-job-rule-container';

@Component({
  selector: 'app-job-container',
  imports: [
    AgGridBotDataList,
    TitleTableLayout,
    AgGridJobRuleContainer
  ],
  standalone: true,
  templateUrl: './job-container.html',
  styleUrl: './job-container.scss',
})
export class JobContainer {

}
