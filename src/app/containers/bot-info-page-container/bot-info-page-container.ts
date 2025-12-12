import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {
  getActiveServerIpPort,
  getDataActiveBot
} from '../../+state/servers/servers.selectors';
import {TitleContentLayout} from '../../components/title-content-layout/title-content-layout';
import {Actions} from '../../components/actions/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {clearActiveElementData, setActiveBot, setActiveServer} from '../../+state/servers/servers.actions';
import {BotInfoPageTabsContainer} from '../bot-info-page-tabs-container/bot-info-page-tabs-container';

@Component({
  selector: 'app-bot-info-page-container',
  imports: [
    AsyncPipe,
    TitleContentLayout,
    Actions,
    BotInfoPageTabsContainer,
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


  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.ipPort$.pipe(take(1)).subscribe(ipPort => {
          if (ipPort) {
            this.router.navigate([`/server/${ipPort}/tab/bots`]);
          }
        });
      } else if (note === 'refresh') {
        this.dataActiveBot$.pipe(
          take(1)
        ).subscribe(data => {
          if (data?.botResultList?.response?.id) {
            this.store.dispatch(setActiveBot({botId: data.botResultList.response.id}));
          }
        });
      }
    }
  }
}
