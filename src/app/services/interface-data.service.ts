import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServerDataService {
  private http = inject(HttpClient);
  private store = inject(Store);

  getServers(): Observable<any> {
    return this.http.get(`http://45.135.182.251:3001/servers`);
  }

}
