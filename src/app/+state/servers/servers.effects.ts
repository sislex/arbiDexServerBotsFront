import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, forkJoin, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  setActionTypesList,
  setActiveServer,
  setActiveServerData,
  setBotControlList,
  setBotTypesList,
} from './servers.actions';
import { ServerDataService } from '../../services/server-data.service';
import { getActiveTab } from '../view/view.selectors';

@Injectable()
export class ServersEffects {
  private actions$ = inject(Actions);
  private serverDataService = inject(ServerDataService);
  private store = inject(Store);

  loadServerData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'server data'),
        switchMap(([action]) => {
          return forkJoin({
            info: this.serverDataService.getServerData().pipe(
              catchError(err => {
                console.error('info error', err);
                return of(null);
              })
            ),
            botTypes: this.serverDataService.getBotTypesList().pipe(
              catchError(err => {
                console.error('botTypes error', err);
                return of([]);
              })
            ),
            actions: this.serverDataService.getActionTypesList().pipe(
              catchError(err => {
                console.error('actions error', err);
                return of([]);
              })
            ),
          }).pipe(
            tap(({ info, botTypes, actions }) => {

              const responseServerData = {
                ip: action.ip,
                port: action.port,
                version: info?.appVersion ?? '-',
                timestampFinish: info?.timestampFinish ?? 0,
                timestampStart: 0,
                status: info ? 'active' : 'unknown',
                botsCount: info?.botsCount ?? 0,
              };

              const responseBotTypesList = (botTypes || []).map((item: any) => ({
                id: item.id ?? '-',
                label: item.label ?? '-',
                type: item.type ?? '-',
                description: item.description ?? '-',
              }));

              const responseActionTypesList = (actions || []).map((item: any) => ({
                id: item.id ?? '-',
                label: item.label ?? '-',
                type: item.type ?? '-',
                description: item.description ?? '-',
              }));

              this.store.dispatch(setActiveServerData({ response: responseServerData }));
              this.store.dispatch(setBotTypesList({ response: responseBotTypesList }));
              this.store.dispatch(setActionTypesList({ response: responseActionTypesList }));
            }),
            map(() => ({ done: true }))
          );
        })
      ),
    { dispatch: false }
  );

  loadBotsControl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'bots'),
        switchMap(([action]) => {

          return this.serverDataService.getBotsControl().pipe(
            tap((response: any[]) => {

              if (!Array.isArray(response)) {
                console.warn('Expected array but got:', response);
                return;
              }

              const responseBotControlList = response.map(item => ({
                id: item.id ?? '-',
                createdAt: item.createdAt ?? '-',
                actionCount: item.actionCount ?? 0,
                errorCount: item.errorCount ?? 0,
                lastActionTimeStart: item.lastActionTimeStart ?? 0,
                status: 'warn',
                isSendData: false,
                running: item.running ?? false,
              }));

              this.store.dispatch(setBotControlList({ response: responseBotControlList }));
            }),
            catchError(err => {
              console.error('botsControl error', err);
              return of([]);
            }),
            map(() => ({ done: true }))
          );
        })
      ),
    { dispatch: false }
  );
}
