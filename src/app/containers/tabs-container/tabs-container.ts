import { Component, inject } from '@angular/core';
import { Tabs } from '../../components/tabs/tabs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  getActiveServerIpPort,
  getAllServerDataIsLoaded,
  getAllServerDataIsLoading,
  getBotControlListError,
  getBotControlListIsLoaded,
  getBotControlListIsLoading,
  getLoadBotTypesError, getLoadJobTypesError,
  getLoadServerDataError, getRuleListError, getRuleListIsLoaded, getRuleListIsLoading,
} from '../../+state/servers/servers.selectors';
import {take} from 'rxjs';
import {getActiveTab, getTabList} from '../../+state/view/view.selectors';
import {setActiveTab} from '../../+state/view/view.actions';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [Tabs, AsyncPipe],
  templateUrl: './tabs-container.html',
  styleUrl: './tabs-container.scss',
})
export class TabsContainer {
  private store = inject(Store);
  private router = inject(Router);

  activeTab$ = this.store.select(getActiveTab);
  tabList$ = this.store.select(getTabList);
  ipPort$ = this.store.select(getActiveServerIpPort);

  getBotControlListIsLoading$ = this.store.select(getBotControlListIsLoading);
  botControlListIsLoaded$ = this.store.select(getBotControlListIsLoaded);
  botControlListError$ = this.store.select(getBotControlListError);
  allServerDataIsLoading$ = this.store.select(getAllServerDataIsLoading);
  allServerDataIsLoaded$ = this.store.select(getAllServerDataIsLoaded);
  loadServerDataError$ = this.store.select(getLoadServerDataError);
  loadBotTypesError$ = this.store.select(getLoadBotTypesError);
  loadActionTypesError$ = this.store.select(getLoadJobTypesError);

  ruleListIsLoaded$ = this.store.select(getRuleListIsLoaded);
  ruleListIsLoading$ = this.store.select(getRuleListIsLoading);
  ruleListError$ = this.store.select(getRuleListError);

  events($event: any) {
    if ($event.event === 'Tabs:TAB_CLICKED') {
      const tab = $event.data;

      this.store.dispatch(setActiveTab({ tab }));

      this.ipPort$.pipe(take(1)).subscribe(ipPort => {
        if (ipPort) {
          this.router.navigate([`/server/${ipPort}/tab/${tab}`]);
        }
      });
    }
  }
}
