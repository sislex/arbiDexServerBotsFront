import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap, withLatestFrom} from 'rxjs';
import {Store} from '@ngrx/store';
import {
  setActionTypesList,
  setActiveServer,
  setActiveServerData,
  setBotTypesList,
  setGateList
} from './servers.actions';
import {serversStabs} from './stabs';
import {ServerDataService} from '../../services/server-data.service';
import {getActiveTab} from './servers.selectors';

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
          console.log('Активный сервер:', ip, port);
          if (activeTab === 'server data') {
            this.serverDataService.getServerData().subscribe({
              next: (response) => {
                console.log('response Servers', response)
                // this.store.dispatch(getGameTypesSuccess({data: response.gameTypes}))
              },
              error: (error) => {
                console.error('Error creating game:', error);
                // this.store.dispatch(loadGameDataFailure({ error }));
              }
            });

            this.serverDataService.getBotTypesList().subscribe({
              next: (response) => {
                console.log('response Bots', response)
                // this.store.dispatch(getGameTypesSuccess({data: response.gameTypes}))
              },
              error: (error) => {
                console.error('Error creating game:', error);
                // this.store.dispatch(loadGameDataFailure({ error }));
              }
            });

            this.serverDataService.getActionTypesList().subscribe({
              next: (response) => {
                console.log('response Types', response)
                // this.store.dispatch(getGameTypesSuccess({data: response.gameTypes}))
              },
              error: (error) => {
                console.error('Error creating game:', error);
                // this.store.dispatch(loadGameDataFailure({ error }));
              }
            });
          }


          // Находим сервер из stab-данных
          const server = serversStabs.find(
            (s) => s.ip === ip && s.port === port
          );

          if (!server) {
            console.warn('Сервер не найден в stabs.ts');
            return;
          }

          // Вместо /server/info
          const responseServerData = {
            ip: server.ip,
            port: server.port,
            version: server.version,
            timestampFinish: server.timestampFinish,
            timestampStart: server.timestampStart,
            status: server.status,
            botsControl: server.botsControl,
          };
          this.store.dispatch(setActiveServerData({ response: responseServerData }));

          // Вместо /server/types
          const responseBotTypesList = server.botTypesList;
          this.store.dispatch(setBotTypesList({ response: responseBotTypesList }));

          const responseActionTypesList = server.actionTypesList;
          this.store.dispatch(setActionTypesList({ response: responseActionTypesList }));

          // Вместо /gates/list
          const responseGateList = server.gateList;
          this.store.dispatch(setGateList({ response: responseGateList }));

          // console.log('server', server)
          // console.log('responseServerData', responseServerData)
          // console.log('responseBotTypesList', responseBotTypesList)
          // console.log('responseActionTypesList', responseActionTypesList)
          // console.log('responseGateList', responseGateList)
        })
      ),
    { dispatch: false }
  );

}
