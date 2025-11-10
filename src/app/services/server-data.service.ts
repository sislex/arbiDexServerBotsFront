import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, switchMap, take, filter} from 'rxjs';
import { Store } from '@ngrx/store';
import { getActiveServerIpPort } from '../+state/servers/servers.selectors';

@Injectable({ providedIn: 'root' })
export class ServerDataService {
  private http = inject(HttpClient);
  private store = inject(Store);

  //Универсальный url
  private baseUrl$ = this.store.select(getActiveServerIpPort).pipe(
    map(ipPort => {
      if (!ipPort || ipPort.includes('undefined') || ipPort === ':' || ipPort.trim() === '') {
        return null;
      }
      return `http://${ipPort}`;
    }),
    filter((item: string | null) => !!item)
    // startWith(environment.hostUrl)
  );

  private get<T>(endpoint: string): Observable<T> {
    return this.baseUrl$.pipe(
      take(1),
      switchMap(baseUrl => this.http.get<T>(`${baseUrl}${endpoint}`))
    );
  }

  // Получить основную информацию о сервере
  getServerData(): Observable<any> {
    return this.get('/info');
  }

  // Получить список типов ботов
  getBotTypesList(): Observable<any> {
    return this.get('/info/bots-types-list');
  }

  // Получить список типов action ботов
  getActionTypesList(): Observable<any> {
    return this.get('/info/bots-actions-list');
  }

  // Получить список ботов и их состояния
  getBotsControl(): Observable<any> {
    return this.get('/bots/get-all');
  }

  // Получить список ошибок по конкретному боту
  getBotErrorsById(id: string): Observable<any> {
    return this.get(`/bots/errors/${id}`);
  }
}
