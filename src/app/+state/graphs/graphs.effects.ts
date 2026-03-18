import { inject, Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as GraphsActions from './graphs.actions';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {GraphDataService} from '../../services/graph-data.service';

@Injectable()
export class GraphsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private graphDataService = inject(GraphDataService);

  loadServerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphsActions.setQuotesCostData),
      switchMap((action) =>
        this.graphDataService.getQuotes('client_1').pipe(
          tap(response => console.log('Данные из сервиса:', response)),

          map(response => GraphsActions.setQuotesCostDataSuccess({ response })),

          catchError(error =>
            of(GraphsActions.setQuotesCostDataFailure({ error }))
          )
        )
      )
    )
  );


}
