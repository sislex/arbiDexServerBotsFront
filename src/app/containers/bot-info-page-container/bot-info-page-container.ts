import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {AgGridErrorList} from '../../components/ag-grid-error-list/ag-grid-error-list';
import {TitleTableLayout} from '../../components/title-table-layout/title-table-layout';
import {AgGridBotDataList} from '../../components/ag-grid-bot-data-list/ag-grid-bot-data-list';
import {AsyncPipe} from '@angular/common';
import {
  getActiveBotIsLoaded,
  getActiveBotIsLoading,
  getActiveServerIpPort,
  getDataActiveBot
} from '../../+state/servers/servers.selectors';
import {TitleContentLayout} from '../../components/title-content-layout/title-content-layout';
import {Actions} from '../../components/ag-grid-components/actions/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {clearActiveElementData, setActiveBot, setActiveServer} from '../../+state/servers/servers.actions';
import {LoaderContainer} from '../loader-container/loader-container';
import {
  AgGridBotControlPanelContainer
} from '../ag-grid-bot-control-panel-container/ag-grid-bot-control-panel-container';

@Component({
  selector: 'app-bot-info-page-container',
  imports: [
    AgGridBotsControl,
    AgGridErrorList,
    TitleTableLayout,
    AgGridBotDataList,
    AsyncPipe,
    TitleContentLayout,
    Actions,
    LoaderContainer,
    AgGridBotControlPanelContainer,
  ],
  standalone: true,
  templateUrl: './bot-info-page-container.html',
  styleUrl: './bot-info-page-container.scss',
})
export class BotInfoPageContainer implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  private route=inject(ActivatedRoute);

  dataActiveBot$ = this.store.select(getDataActiveBot)
  ipPort$ = this.store.select(getActiveServerIpPort);

  activeBotIsLoaded$ = this.store.select(getActiveBotIsLoaded);
  activeBotIsLoading$ = this.store.select(getActiveBotIsLoading);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const ipPort = params.get('ipPort');
      const botId = params.get('botId');

      if (ipPort !== null) {
        const [ip, port] = ipPort.split(':');
        this.store.dispatch(clearActiveElementData());
        this.store.dispatch(setActiveServer({ ip, port }));
      }
      if (botId !== null) {
        this.store.dispatch(setActiveBot({ botId }));
      }
    });
  }

  events($event: any) {
    console.log($event)
  }

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.ipPort$.pipe(take(1)).subscribe(ipPort => {
          if (ipPort) {
            this.router.navigate([`/server/${ipPort}/tab/bots`]);
          }
        });
      }
    }
  }
}
