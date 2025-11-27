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
          this.store.dispatch(ServersActions.loadJobTypesList());
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
                this.store.dispatch(ServersActions.loadJobTypesListFailure({error: err}));
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
              this.store.dispatch(ServersActions.loadJobTypesListSuccess({ response: responseActionTypesList }));
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

              const responseBotControlList = response.map(item => {
                let status = '';
                if (!item.running) {
                  status = 'pause';
                } else if (item.running) {
                  status = 'active';
                }

                return {
                  ...item,
                  status: status
                };
              });

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
          this.store.dispatch(ServersActions.loadBotInfo());
          this.store.dispatch(ServersActions.loadBotParams());
          this.store.dispatch(ServersActions.loadBotErrors());

          return forkJoin({
            botInfo: this.serverDataService.getBotInfo(botId).pipe(
              catchError(err => {
                this.store.dispatch(
                  ServersActions.loadBotInfoFailure({ error: err })
                );
                return of([]);
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
            tap(({ botInfo, botParamsData, botErrors }) => {
              let status = '';

              if (botInfo.botParams.paused) {
                status = 'pause';
              } else if (!botInfo.botParams.paused) {
                status = 'active';
              }

              const responseBotControlList = {
                ...botParamsData,
                status: status,
              };

              this.store.dispatch(
                ServersActions.loadBotParamsSuccess({
                  response: responseBotControlList
                })
              );

              this.store.dispatch(
                ServersActions.loadBotInfoSuccess({
                  response: botInfo
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
          return this.serverDataService.setBotPause(action.id, action.isStarted).pipe(
            tap((response: any) => {

              let status = '';
              if (response.paused) {
                status = 'pause';
              } else if (!response.paused) {
                status = 'active';
              }

              const responsePause = {
                paused: response.paused,
                status: status,
              };

              this.store.dispatch(ServersActions.setIsStartedBotSuccess({response: responsePause}));
              if (response.paused) {
                this._snackBar.open(`Bot is paused, ${response.id}`, '', { duration: 5000 });
              } else {
                this._snackBar.open(`Bot is started, ${response.id}`, '', { duration: 5000 });
              }
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setIsStartedBotFailure({error: err}));
              this._snackBar.open(`Bot is started, ${err.error.message}`, '', { duration: 5000 });

              console.log('setIsStartedBotFailure диспатч должен вызывать окно с ошибкой')
              return of([]);
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  // устанавливаем отправку данных бота
  setSendDataBot$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.isSendData),
        switchMap((action) => {

          return this.serverDataService.setSendDataBot(action.id, action.isSendData).pipe(
            tap((response: any[]) => {
              this.store.dispatch(ServersActions.setSendDataBotSuccess({response}));
              this._snackBar.open(`Bot is send data, ${response}`, '', { duration: 5000 });
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setSendDataBotFailure({error: err}));
              const error = err.error.message
              this._snackBar.open(`${error}`, '', { duration: 5000 });

              return of([]);
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
            tap((response: any[]) => {
              this.store.dispatch(ServersActions.restartBotSuccess({response}));
              this._snackBar.open(`Bot is restarted`, '', { duration: 5000 });
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.restartBotFailure({error: err}));
              this._snackBar.open(`Bot is error, ${err.error.message}`, '', { duration: 5000 });
              return of([]);
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  // Получаем лист доступных API
  setApiList$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.setApiList),
        switchMap(() => {

          return this.serverDataService.getApiList().pipe(
            tap((response: any[]) => {
              this.store.dispatch(ServersActions.setApiListSuccess({response}));
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setApiListFailure({error: err}));
              return of([]);
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

  // Устанавливаем новые настройки бота
  setBotSettings$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.setBotSettings),
        switchMap((action) => {

          return this.serverDataService.setNewSettingsBot(action.id, action.settings).pipe(
            tap((response: any[]) => {
              this.store.dispatch(ServersActions.setBotSettingsSuccess({response}));
              this._snackBar.open(`Changing bot settings was successful`, '', { duration: 5000 });
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.setBotSettingsFailure({error: err}));
              this._snackBar.open(`Error changing bot settings: ${err.error.message}`, '', { duration: 5000 });
              return of([]);
            }),
            map(() => ({done: true}))
          );
        })
      );
    },
    { dispatch: false }
  );

}
