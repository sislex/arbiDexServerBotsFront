import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuoteGraphData {
  id: number;
  chainId: number;
  timestamp: string;
  costBuy: string;
  costSell: string;
  token0Id: number | null;
  token1Id: number | null;
}

@Injectable({ providedIn: 'root' })
export class GraphDataService {
  private readonly apiUrl = 'http://localhost:3001/quotes_graph/cost'

  constructor(private http: HttpClient) {}

  getQuotes(project: string, start?: number, finish?: number): Observable<QuoteGraphData[]> {
    let params = new HttpParams().set('project', project);

    if (start) {
      params = params.set('start', start.toString());
    }
    if (finish) {
      params = params.set('finish', finish.toString());
    }

    return this.http.get<QuoteGraphData[]>(this.apiUrl, { params });
  }

}
