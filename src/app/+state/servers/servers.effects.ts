import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, forkJoin, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ServersActions from './servers.actions';
import { ServerDataService } from '../../services/server-data.service';
import { getActiveTab } from '../view/view.selectors';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ITypesList} from '../../models/servers';

@Injectable()
export class ServersEffects {
  private actions$ = inject(Actions);
  private serverDataService = inject(ServerDataService);
  private store = inject(Store);

  loadServerDataOnTab$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ServersActions.setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'server data'),
        tap(([action]) => {
          this.store.dispatch(ServersActions.loadServerList({ip: action.ip, port: action.port}));
          this.store.dispatch(ServersActions.loadBotTypesList());
          this.store.dispatch(ServersActions.loadJobTypesList());
        })
      ),
    { dispatch: false }
  );

  loadServerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServersActions.loadServerList),
      switchMap((action) =>
        this.serverDataService.getServerData().pipe(
          map(info => {
            const response = {
              ip: action.ip,
              port: action.port,
              version: info?.appVersion ?? '-',
              timestampFinish: info?.timestampFinish ?? '',
              timestampStart: info?.timestampStart ?? '',
              status: info ? 'active' : 'unknown',
              botsCount: info?.botsCount ?? 0,
            };
            return ServersActions.loadServerListSuccess({ response });
          }),
          catchError(error => of(ServersActions.loadServerListFailure({ error })))
        )
      )
    )
  );

  loadBotTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServersActions.loadBotTypesList),
      switchMap(() =>
        this.serverDataService.getBotTypesList().pipe(
          map(items => {
            const response = items.map((item: ITypesList) => ({
              id: item.id ?? '-',
              label: item.label ?? '-',
              type: item.type ?? '-',
              description: item.description ?? '-',
            }));
            return ServersActions.loadBotTypesListSuccess({ response });
          }),
          catchError(error => of(ServersActions.loadBotTypesListFailure({ error })))
        )
      )
    )
  );

  loadJobTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServersActions.loadJobTypesList),
      switchMap(() =>
        this.serverDataService.getActionTypesList().pipe(
          map(items => {
            const response = items.map((item: ITypesList) => ({
              id: item.id ?? '-',
              label: item.label ?? '-',
              type: item.type ?? '-',
              description: item.description ?? '-',
            }));
            return ServersActions.loadJobTypesListSuccess({ response });
          }),
          catchError(error => of(ServersActions.loadJobTypesListFailure({ error })))
        )
      )
    )
  );

  loadBotsControlOnTab$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ServersActions.setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'bots'),
        tap(() => {
          this.store.dispatch(ServersActions.loadBotControlList());
        })
      ),
    { dispatch: false }
  );

  loadRuleListOnTab$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ServersActions.setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        filter(([_, tab]) => tab === 'rules'),
        tap(() => {
          this.store.dispatch(ServersActions.getRulesList());
        })
      ),
    { dispatch: false }
  );

  loadBotControlList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServersActions.loadBotControlList),
      switchMap(() =>
        this.serverDataService.getBotsControl().pipe(
          map((items: any[]) => {
            if (!Array.isArray(items)) {
              console.warn('Expected array but got:', items);
              return ServersActions.loadBotControlListSuccess({ response: [] });
            }

            const response = items.map(item => {
              let status = '';
              if (!item.running) {
                status = 'pause'
              } else {
                status = 'active'
              }

              return { ...item, status };
            });

            return ServersActions.loadBotControlListSuccess({ response });
          }),
          catchError(error =>
            of(ServersActions.loadBotControlListFailure({ error }))
          )
        )
      )
    )
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

  // Устанавливаем новые настройки бота
  getRulesList$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ServersActions.getRulesList),
        switchMap((_) => {
          return this.serverDataService.getRulesList().pipe(
            tap((response: any[]) => {
              this.store.dispatch(ServersActions.getRulesListSuccess({response}));
            }),
            catchError(err => {
              this.store.dispatch(ServersActions.getRulesListFailure({error: err}));
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
