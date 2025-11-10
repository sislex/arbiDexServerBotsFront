import { Routes } from '@angular/router';
import {SidebarContainer} from './containers/sidebar-container/sidebar-container';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'server/45.135.182.251:1005/tab/gates',
  },
  {
    path: 'server/:ipPort/tab/:tabId',
    component: SidebarContainer,
  },
  {
    path: '**',
    redirectTo: 'server/45.135.182.251:1005/tab/gates',
  },
];
