import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServerDataService {
  constructor(private http: HttpClient) {}

  private apiUrl =  `${environment.hostUrl}/api/auth`;

  getServerData(): Observable<any> {
    return this.http.get(`/api/info`);
  }
  getBotTypesList(): Observable<any> {
    return this.http.get(`/api/info/bots-types-list`);
  }
  getActionTypesList(): Observable<any> {
    return this.http.get(`/api/info/bots-actions-list`);
  }
}

