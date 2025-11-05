import {Component, inject, OnInit} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {
  getActiveServerIpPort,
  getActiveTab,
  getFeatureName,
  getIsSidebarOpen,
  getServerList
} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {TabsContainer} from '../tabs-container/tabs-container';
import {setActiveServer, setActiveTab, toggleSidebar} from '../../+state/servers/servers.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    AsyncPipe,
    TabsContainer,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route=inject(ActivatedRoute);

  featureName$ = this.store.select(getFeatureName);
  isSidebarOpen$ = this.store.select(getIsSidebarOpen);
  serverList$ = this.store.select(getServerList);
  ipPort$ = this.store.select(getActiveServerIpPort);
  activeTab$ = this.store.select(getActiveTab);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const ipPort = params.get('ipPort');
      const tabId = params.get('tabId');

      if (ipPort && tabId !== null) {
        const [ip, port] = ipPort.split(':');
        this.store.dispatch(setActiveTab({ tab: tabId }));
        this.store.dispatch(setActiveServer({ ip, port }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      this.store.dispatch(toggleSidebar())
    } else if ($event.event === 'Sidebar:SET_ACTIVE_ITEM_CLICKED') {
      const ipPort = $event.data.ipPort;
      const [ip, port] = ipPort.split(':');

      this.activeTab$.pipe(take(1)).subscribe(activeTab => {
        if (activeTab) {
          this.router.navigate([`/server/${ip}:${port}/tab/${activeTab}`]);
        }
      });
    }
  }
}
