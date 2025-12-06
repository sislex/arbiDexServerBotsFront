import {Component, inject} from '@angular/core';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {getActiveServerIpPort, getBotsControlList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';
import {take} from 'rxjs';

@Component({
  selector: 'app-ag-grid-bots-control-container',
  imports: [
    AgGridBotsControl,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-bots-control-container.html',
  styleUrl: './ag-grid-bots-control-container.scss'
})
export class AgGridBotsControlContainer {
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store);
  private router = inject(Router);

  botsControlList$ = this.store.select(getBotsControlList)
  ipPort$ = this.store.select(getActiveServerIpPort)

  events($event: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'add') {
        this.openAddDialog();
      }
    } else if ($event.event === 'AgGridBotsControl:DOUBLE_CLICKED_ROW') {
      this.ipPort$.pipe(take(1)).subscribe(ipPort => {
        this.router.navigate([`/server/${ipPort}/${$event.row.data.id}`]);
      });
    }
  }

  openAddDialog() {
  }

}
