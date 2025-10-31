import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideState, provideStore} from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import {SERVERS_FEATURE_KEY, serversReducer} from './+state/servers/servers.reducer';
import {ServersEffects} from './+state/servers/servers.effects';
import {AgGridModule} from 'ag-grid-angular';
import {ViewEffects} from './+state/view/view.effects';
import {VIEW_FEATURE_KEY, viewReducer} from './+state/view/view.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideState(SERVERS_FEATURE_KEY, serversReducer),
    provideState(VIEW_FEATURE_KEY, viewReducer),
    provideStore(),
    provideEffects(ServersEffects, ViewEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    importProvidersFrom(
      AgGridModule
    )
  ]
};
