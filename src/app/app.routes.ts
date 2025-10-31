import { Routes } from '@angular/router';
import {SidebarContainer} from './containers/sidebar-container/sidebar-container';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'server/192.169.0.1/tab/gates',
  },
  {
    path: 'server/:ip/tab/:tabId',
    component: SidebarContainer,
  },
  {
    path: '**',
    redirectTo: 'server/192.169.0.1/tab/gates',
  },
];
