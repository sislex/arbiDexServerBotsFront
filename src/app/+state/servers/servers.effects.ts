import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs';
import {Store} from '@ngrx/store';
import {
  setActionTypesList,
  setActiveServer,
  setActiveServerData,
  setBotTypesList,
  setGateList
} from './servers.actions';
import {serversStabs} from './stabs';

@Injectable()
export class ServersEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  setSelectedPlayerList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setActiveServer),
        tap(({ ip, port }) => {
          console.log('Активный сервер:', ip, port);

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

          console.log('server', server)
          console.log('responseServerData', responseServerData)
          console.log('responseBotTypesList', responseBotTypesList)
          console.log('responseActionTypesList', responseActionTypesList)
          console.log('responseGateList', responseGateList)
        })
      ),
    { dispatch: false }
  );

}
