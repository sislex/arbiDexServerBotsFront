import { Routes } from '@angular/router';
import {SidebarContainer} from './containers/sidebar-container/sidebar-container';

export const routes: Routes = [
  {
    path: 'server/:ip/tab/:tabId',
    component: SidebarContainer,
  },
  {
    path: '**',
    redirectTo: 'server/:ip/tab/:tabId',
  },
];
