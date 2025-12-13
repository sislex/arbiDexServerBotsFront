import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TitleCasePipe} from '@angular/common';
import {TitleContentLayout} from '../title-content-layout/title-content-layout';
import {
  AgGridBotsControlContainer
} from '../../containers/ag-grid-bots-control-container/ag-grid-bots-control-container';
import {AgGridServerDataContainer} from '../../containers/ag-grid-server-data-container/ag-grid-server-data-container';
import {AgGridBotListContainer} from '../../containers/ag-grid-bot-list-container/ag-grid-bot-list-container';
import {AgGridActionListContainer} from '../../containers/ag-grid-action-list-container/ag-grid-action-list-container';
import {TitleTableLayout} from '../title-table-layout/title-table-layout';
import {LoaderContainer} from '../../containers/loader-container/loader-container';
import {AgGridRulesTableContainer} from '../../containers/ag-grid-rules-table-container/ag-grid-rules-table-container';
import {TitleTableButton} from '../title-table-button/title-table-button';
import {NotFoundPage} from '../not-found-page/not-found-page';

@Component({
  selector: 'app-tabs',
  imports: [
    MatTabsModule,
    TitleCasePipe,
    TitleContentLayout,
    AgGridBotsControlContainer,
    AgGridServerDataContainer,
    AgGridBotListContainer,
    AgGridActionListContainer,
    TitleTableLayout,
    LoaderContainer,
    AgGridRulesTableContainer,
    TitleTableButton,
    NotFoundPage
  ],
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs implements OnChanges {
  @Input() list: string[] = [];
  @Input() tabName: string = '';

  @Input() loadBotControlListError!: boolean;
  @Input() botControlListIsLoading!: boolean;
  @Input() botControlListIsLoaded!: boolean;
  @Input() allServerDataIsLoading!: boolean;
  @Input() allServerDataIsLoaded!: boolean;
  @Input() loadServerDataError!: boolean;
  @Input() loadBotTypesError!: boolean;
  @Input() loadActionTypesError!: boolean;
  @Input() ruleListIsLoaded!: boolean;
  @Input() ruleListIsLoading!: boolean;
  @Input() ruleListError!: boolean;

  @Output() emitter = new EventEmitter();

  selectedIndex = 0;

  ngOnChanges() {
    if (this.list && this.tabName) {
      this.selectedIndex = this.list.indexOf(this.tabName);
    }
  }

  onTabChange(index: number) {
    const selectedTab = this.list[index];

    this.emitter.emit({
      event: 'Tabs:TAB_CLICKED',
      data: selectedTab
    });
  }
}
