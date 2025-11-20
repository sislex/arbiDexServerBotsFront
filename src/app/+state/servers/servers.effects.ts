import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, forkJoin, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ServersActions from './servers.actions';
import { ServerDataService } from '../../services/server-data.service';
import { getActiveTab } from '../view/view.selectors';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class ServersEffects {
  private actions$ = inject(Actions);
  private serverDataService = inject(ServerDataService);
  private store = inject(Store);

  loadServerData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ServersActions.setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'server data'),
        switchMap(([action]) => {
          this.store.dispatch(ServersActions.loadServerList());
          this.store.dispatch(ServersActions.loadBotTypesList());
          this.store.dispatch(ServersActions.loadActionTypesList());
          return forkJoin({
            info: this.serverDataService.getServerData().pipe(
              catchError(err => {
                this.store.dispatch(ServersActions.loadServerListFailure({error: err}));
                return of(null);
              })
            ),
            botTypes: this.serverDataService.getBotTypesList().pipe(
              catchError(err => {
                this.store.dispatch(ServersActions.loadBotTypesListFailure({error: err}));
                return of([]);
              })
            ),
            actions: this.serverDataService.getActionTypesList().pipe(
              catchError(err => {
                this.store.dispatch(ServersActions.loadActionTypesListFailure({error: err}));
                return of([]);
              })
            ),
          }).pipe(
            tap(({ info, botTypes, actions }) => {

              const responseServerData = {
                ip: action.ip,
                port: action.port,
                version: info?.appVersion ?? '-',
                timestampFinish: info?.timestampFinish ?? '',
                timestampStart: '',
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

              this.store.dispatch(ServersActions.loadServerListSuccess({ response: responseServerData }));
              this.store.dispatch(ServersActions.loadBotTypesListSuccess({ response: responseBotTypesList }));
              this.store.dispatch(ServersActions.loadActionTypesListSuccess({ response: responseActionTypesList }));
            }),
            map(() => ({ done: true }))
          );
        })
      ),
    { dispatch: false }
  );

  loadBotsControl$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'bots'),
        switchMap(() => {
          this.store.dispatch(ServersActions.loadBotControlList());

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

              this.store.dispatch(ServersActions.loadBotControlListSuccess({response: responseBotControlList}));
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.loadBotControlListFailure({error: err}));
              return of([]);
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  loadBotParams$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ServersActions.setActiveBot),
        switchMap((action) => {
          const botId = action.botId;

          // Запуск индикаторов загрузки
          this.store.dispatch(ServersActions.loadBotControl());
          this.store.dispatch(ServersActions.loadBotParams());
          this.store.dispatch(ServersActions.loadBotErrors());

          return forkJoin({
            botControl: this.serverDataService.getBotControlById(botId).pipe(
              catchError(err => {
                this.store.dispatch(
                  ServersActions.loadBotControlFailure({ error: err })
                );
                return of(null);
              })
            ),
            botParamsData: this.serverDataService.getBotParamsById(botId).pipe(
              catchError(err => {
                this.store.dispatch(
                  ServersActions.loadBotParamsFailure({ error: err })
                );
                return of([]);
              })
            ),
            botErrors: this.serverDataService.getBotErrorsById(botId).pipe(
              catchError(err => {
                this.store.dispatch(
                  ServersActions.loadBotErrorsFailure({ error: err })
                );
                return of([]);
              })
            ),
          }).pipe(
            tap(({ botControl, botParamsData, botErrors }) => {

              const mappedBotParams = Object.entries(botControl.botParams || {}).map(
                ([key, value]) => ({ key, value })
              );

              this.store.dispatch(
                ServersActions.loadBotControlSuccess({
                  response: {
                    ...botControl,
                    botParams: mappedBotParams
                  }
                })
              );

              this.store.dispatch(
                ServersActions.loadBotParamsSuccess({
                  response: botParamsData
                })
              );

              this.store.dispatch(
                ServersActions.loadBotErrorsSuccess({ response: botErrors })
              );
            }),
            map(() => ({ done: true }))
          );
        })
      ),
    { dispatch: false }
  );
  private _snackBar = inject(MatSnackBar);

  // Устанавливаем паузу/запускаем работу бота
  setIsStartedBot$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.setIsStartedBot),
        switchMap((action) => {

          return this.serverDataService.setBotPause(action.id, !action.isStarted).pipe(
            tap((response: any) => {
              this.store.dispatch(ServersActions.setIsStartedBotSuccess({response}));

              const isPause = response.paused.pause
              if (!isPause) {
                this._snackBar.open('Bot is started', '', { duration: 5000 });
              } else {
                this._snackBar.open('Bot is paused', '', { duration: 5000 });
              }

            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setIsStartedBotFailure({error: err}));
              this._snackBar.open(`Bot is started, ${err}`, '', { duration: 5000 });

              console.log('setIsStartedBotFailure диспатч должен вызывать окно с ошибкой')
              return of({ error: true });
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  // Устанавливаем паузу/запускаем работу бота
  setSendDataBot$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.isSendData),
        switchMap((action) => {

          return this.serverDataService.setSendDataBot(action.id, action.isSendData).pipe(
            tap((response: any) => {
              this.store.dispatch(ServersActions.setSendDataBotSuccess({response}));
              console.log('setSendDataBotSuccess диспатч должен вызывать окно с подтверждением что поставили на паузу или запустили')
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setSendDataBotFailure({error: err}));
              const error = err.error.error
              console.log('setSendDataBotFailure диспатч должен вызывать окно с ошибкой', error)
              this._snackBar.open(`${error}`, '', { duration: 5000 });

              return of({ error: true });
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  // перезапускаем работу бота
  restartBot$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.restartedBot),
        switchMap((action) => {

          return this.serverDataService.restartBot(action.id).pipe(
            tap((response: any) => {
              this.store.dispatch(ServersActions.restartBotSuccess({response}));
              console.log('restartBotSuccess диспатч должен вызывать окно с подтверждением что поставили на паузу или запустили')
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.restartBotFailure({error: err}));
              console.log('restartBotFailure диспатч должен вызывать окно с ошибкой')
              return of({ error: true });
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

}
