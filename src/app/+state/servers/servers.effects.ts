import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap, withLatestFrom} from 'rxjs';
import {Store} from '@ngrx/store';
import {
  setActionTypesList,
  setActiveServer,
  setActiveServerData, setBotControlList,
  setBotTypesList,
} from './servers.actions';
import {ServerDataService} from '../../services/server-data.service';
import {getActiveTab} from '../view/view.selectors';

@Injectable()
export class ServersEffects {
  private actions$ = inject(Actions);
  private serverDataService = inject(ServerDataService);
  private store = inject(Store);

  setSelectedPlayerList$ = createEffect(() =>
      this.actions$.pipe(
        ofType(setActiveServer),
        withLatestFrom(this.store.select(getActiveTab)),
        tap(([action, activeTab]) => {
          const { ip, port } = action;

          if (activeTab === 'server data') {
            this.serverDataService.getServerData().subscribe({
              next: (response) => {
                const responseServerData = {
                  ip: ip,
                  port: port,
                  version: response.appVersion,
                  timestampFinish: response.timestampFinish,
                  timestampStart: 0,
                  status: 'active',
                  botsCount: response.botsCount,
                };
                console.log('вызов')
                this.store.dispatch(setActiveServerData({ response: responseServerData }));
              },
              error: (error) => {
                console.error('Error loading server data:', error);
              }
            });

            this.serverDataService.getBotTypesList().subscribe({
              next: (response) => {
                if (Array.isArray(response)) {
                  const responseBotTypesList = response.map(item => ({
                    id: item.id ?? "-",
                    label: item.label ?? "-",
                    type: item.type ?? "-",
                    description: item.description ?? "-",
                  }));

                  this.store.dispatch(setBotTypesList({ response: responseBotTypesList }));
                } else {
                  console.warn('getBotTypesList: expected an array, but it arrived:', response);
                }
              },
              error: (error) => {
                console.error('Error loading bot types:', error);
              }
            });

            this.serverDataService.getActionTypesList().subscribe({
              next: (response) => {
                if (Array.isArray(response)) {
                  const responseActionTypesList = response.map(item => ({
                    id: item.id ?? "-",
                    label: item.label ?? "-",
                    type: item.type ?? "-",
                    description: item.description ?? "-",
                  }));

                  this.store.dispatch(setActionTypesList({ response: responseActionTypesList }));
                } else {
                  console.warn('getActionTypesList: expected an array, but it arrived:', response);
                }
              },
              error: (error) => {
                console.error('Error loading action types:', error);
              }
            });
          } else if (activeTab === 'bots') {

            this.serverDataService.getBotsControl().subscribe({
              next: (response) => {
                if (Array.isArray(response)) {
                  console.log(response)
                  const responseBotControlList = response.map(item => ({
                    id: item.id,
                    createdAt: item.createdAt,
                    actionCount: item.actionCount,
                    errorCount: item.errorCount,
                    lastActionTimeStart: item.lastActionTimeStart,
                    status: 'warn',
                    isSendData: false,
                    running: item.running,
                  }));

                  this.store.dispatch(setBotControlList({ response: responseBotControlList }));
                } else {
                  console.warn('getBotsControl: expected an array, but it arrived:', response);
                }
              },
              error: (error) => {
                console.error('Error loading bot control list:', error);
              }
            });

          }


          // Находим сервер из stab-данных
          // const server = serversStabs.find(
          //   (s) => s.ip === ip && s.port === port
          // );
          //
          // if (!server) {
          //   console.warn('Сервер не найден в stabs.ts');
          //   return;
          // }

          // Вместо /server/info
          // const responseServerData = {
          //   ip: server.ip,
          //   port: server.port,
          //   version: server.version,
          //   timestampFinish: server.timestampFinish,
          //   timestampStart: server.timestampStart,
          //   status: server.status,
          //   botsControl: server.botsControl,
          // };
          // this.store.dispatch(setActiveServerData({ response: responseServerData }));

          // Вместо /server/types
          // const responseBotTypesList = server.botTypesList;
          // this.store.dispatch(setBotTypesList({ response: responseBotTypesList }));
          //
          // const responseActionTypesList = server.actionTypesList;
          // this.store.dispatch(setActionTypesList({ response: responseActionTypesList }));
          //
          // // Вместо /gates/list
          // const responseGateList = server.gateList;
          // this.store.dispatch(setGateList({ response: responseGateList }));

        })
      ),
    { dispatch: false }
  );

}
