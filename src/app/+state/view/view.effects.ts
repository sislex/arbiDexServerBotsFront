import {inject, Injectable} from '@angular/core';
import * as ViewActions from './view.actions';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, withLatestFrom} from 'rxjs';
import {getServersDataResponse} from './view.selectors';
import {Store} from '@ngrx/store';
import {ServerDataService} from '../../services/interface-data.service';

@Injectable()
export class ViewEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private serverDataService = inject(ServerDataService);



  setServersData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ViewActions.setServersData),
      withLatestFrom(this.store.select(getServersDataResponse)),
      exhaustMap(([_, cachedResponse]) => {
        if (cachedResponse && cachedResponse.length > 0) {
          return of(ViewActions.setServersDataSuccess({ response: cachedResponse }));
        }

        return this.serverDataService.getServers().pipe(
          map(response => ViewActions.setServersDataSuccess({ response })),
          catchError(error => of(ViewActions.setServersDataFailure({ error })))
        );
      })
    )
  );
}
