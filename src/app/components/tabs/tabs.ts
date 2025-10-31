import {Component, Input} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TitleCasePipe} from '@angular/common';
import {TitleContentLayout} from '../title-content-layout/title-content-layout';
import {
  AgGridBotsControlContainer
} from '../../containers/ag-grid-bots-control-container/ag-grid-bots-control-container';
import {AgGridServerDataContainer} from '../../containers/ag-grid-server-data-container/ag-grid-server-data-container';
import {AgGridGateListContainer} from '../../containers/ag-grid-gate-list-container/ag-grid-gate-list-container';

@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule, TitleCasePipe, TitleContentLayout, AgGridBotsControlContainer, AgGridServerDataContainer, AgGridGateListContainer],
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs {
  @Input() list: any[] = [
    {
      name: 'bots'
    },
    {
      name: 'gates',
    },
    {
      name: 'server data'
    }
  ]
}
