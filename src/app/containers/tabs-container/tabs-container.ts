import { Component, inject } from '@angular/core';
import { Tabs } from '../../components/tabs/tabs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import {getActiveServer, getActiveTab, getTabList} from '../../+state/servers/servers.selectors';
import { setActiveTab } from '../../+state/servers/servers.actions';
import {take} from 'rxjs';

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
  ip$ = this.store.select(getActiveServer);

  events($event: any) {
    if ($event.event === 'Tabs:TAB_CLICKED') {
      const tab = $event.data;

      this.store.dispatch(setActiveTab({ tab }));

      this.ip$.pipe(take(1)).subscribe(ip => {
        if (ip) {
          this.router.navigate([`/server/${ip}/tab/${tab}`]);
        }
      });
    }
  }
}
