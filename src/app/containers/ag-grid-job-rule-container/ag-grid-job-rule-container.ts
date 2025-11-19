import { Component } from '@angular/core';
import {AgGridJobRule} from '../../components/ag-grid-job-rule/ag-grid-job-rule';

@Component({
  selector: 'app-ag-grid-job-rule-container',
  imports: [
    AgGridJobRule
  ],
  standalone: true,
  templateUrl: './ag-grid-job-rule-container.html',
  styleUrl: './ag-grid-job-rule-container.scss',
})
export class AgGridJobRuleContainer {
  events($event: any) {

  }
}
