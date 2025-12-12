import {Component, inject} from '@angular/core';
import {BotInfoPageTabs} from '../../components/bot-info-page-tabs/bot-info-page-tabs';
import {getActiveBotIsLoaded, getActiveBotIsLoading, getDataActiveBot} from '../../+state/servers/servers.selectors';
import {Store} from '@ngrx/store';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {
  AgGridBotControlPanelContainer
} from '../ag-grid-bot-control-panel-container/ag-grid-bot-control-panel-container';
import {LoaderContainer} from '../loader-container/loader-container';
import {AsyncPipe} from '@angular/common';
import {JobContainer} from '../job-container/job-container';
import {TransformObjectToKeyValuePipe} from '../../custom-pipes/transform-object-to-key-value.pipe';
import {TitleTableButton} from '../../components/title-table-button/title-table-button';
import {AgGridArbitrageListContainer} from '../ag-grid-arbitrage-list-container/ag-grid-arbitrage-list-container';
import {AgGridBotDataListContainer} from '../ag-grid-bot-data-list-container/ag-grid-bot-data-list-container';
import {AgGridErrorListContainer} from '../ag-grid-error-list-container/ag-grid-error-list-container';

@Component({
  selector: 'app-bot-info-page-tabs-container',
  imports: [
    BotInfoPageTabs,
    TitleTableLayout,
    AgGridBotControlPanelContainer,
    LoaderContainer,
    AsyncPipe,
    JobContainer,
    TransformObjectToKeyValuePipe,
    TitleTableButton,
    AgGridArbitrageListContainer,
    AgGridBotDataListContainer,
    AgGridErrorListContainer
  ],
  templateUrl: './bot-info-page-tabs-container.html',
  styleUrl: './bot-info-page-tabs-container.scss',
})
export class BotInfoPageTabsContainer {
  private store = inject(Store);

  dataActiveBot$ = this.store.select(getDataActiveBot);

  activeBotIsLoaded$ = this.store.select(getActiveBotIsLoaded);
  activeBotIsLoading$ = this.store.select(getActiveBotIsLoading);
}
