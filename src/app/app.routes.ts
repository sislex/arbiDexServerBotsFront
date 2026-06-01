import { Routes } from '@angular/router';
import {SidebarContainer} from './containers/sidebar-container/sidebar-container';
import {BotInfoPageContainer} from './containers/bot-info-page-container/bot-info-page-container';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'server/89.125.68.35:1001/tab/bots',
  },
  {
    path: 'server/:ipPort/tab/:tabId',
    component: SidebarContainer,
  },
  {
    path: 'server/:ipPort/:botId',
    component: BotInfoPageContainer,
  },
  {
    path: '**',
    redirectTo: 'server/89.125.68.35:1001/tab/bots',
  },
];
