import {Component, inject} from '@angular/core';
import {BotInfoPageTabs} from '../../components/bot-info-page-tabs/bot-info-page-tabs';
import {getActiveBotIsLoaded, getActiveBotIsLoading, getDataActiveBot} from '../../+state/servers/servers.selectors';
import {Store} from '@ngrx/store';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {
  AgGridBotControlPanelContainer
} from '../ag-grid-bot-control-panel-container/ag-grid-bot-control-panel-container';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {AgGridErrorList} from '../../components/ag-grid-error-list/ag-grid-error-list';
import {LoaderContainer} from '../loader-container/loader-container';
import {AsyncPipe} from '@angular/common';
import {JobContainer} from '../job-container/job-container';
import {TransformObjectToKeyValuePipe} from '../../custom-pipes/transform-object-to-key-value.pipe';

@Component({
  selector: 'app-bot-info-page-tabs-container',
  imports: [
    BotInfoPageTabs,
    TitleTableLayout,
    AgGridBotControlPanelContainer,
    AgGridBotDataList,
    AgGridErrorList,
    LoaderContainer,
    AsyncPipe,
    JobContainer,
    TransformObjectToKeyValuePipe
  ],
  standalone: true,
  templateUrl: './bot-info-page-tabs-container.html',
  styleUrl: './bot-info-page-tabs-container.scss',
})
export class BotInfoPageTabsContainer {
  private store = inject(Store);

  dataActiveBot$ = this.store.select(getDataActiveBot)

  activeBotIsLoaded$ = this.store.select(getActiveBotIsLoaded);
  activeBotIsLoading$ = this.store.select(getActiveBotIsLoading);
}
