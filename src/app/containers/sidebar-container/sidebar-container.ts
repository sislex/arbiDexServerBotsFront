import {Component, inject, OnInit} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {
  getActiveServerIpPort,
  getFeatureName,
  getServerList
} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {TabsContainer} from '../tabs-container/tabs-container';
import {clearActiveElementData, setActiveServer} from '../../+state/servers/servers.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {getActiveTab, getIsSidebarOpen} from '../../+state/view/view.selectors';
import {setActiveTab, toggleSidebar} from '../../+state/view/view.actions';
import {Actions} from '../../components/actions/actions';
import {ApiInfoPanel} from '../../components/api-info-panel/api-info-panel';
import {MatDialog} from '@angular/material/dialog';
import {ApiListContainer} from '../api-list-container/api-list-container';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    AsyncPipe,
    TabsContainer,
    Actions,
    ApiInfoPanel,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route=inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

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
        this.store.dispatch(clearActiveElementData());
        this.store.dispatch(setActiveServer({ ip, port }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      this.store.dispatch(toggleSidebar())
    } else if ($event.event === 'Sidebar:SET_ACTIVE_ITEM_CLICKED') {
      const ipPort = $event.data.ipPort;
      if (ipPort) {
        const [ip, port] = ipPort.split(':');

        this.activeTab$.pipe(take(1)).subscribe(activeTab => {
          if (activeTab) {
            this.router.navigate([`/server/${ip}:${port}/tab/${activeTab}`]);
          }
        });
      }
    }
  }

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'info' ) {
        this.openEditDialog()
      }
    }
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(ApiListContainer, {
      width: '90vw',
      maxWidth: '100vw',
      minWidth: '800px',
      height: '600px',
      minHeight: '600px',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.$event?.data === 'save') {
          // this.store.dispatch(updateBot({isSendData: result.data, id: rowData.id}));
        }
      } else {
        console.log('Info Closed');
      }
    });
  }

}
