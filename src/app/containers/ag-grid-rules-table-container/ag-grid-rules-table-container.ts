import {Component, inject} from '@angular/core';
import {AgGridRulesTable} from '../../components/ag-grid-rules-table/ag-grid-rules-table';
import {Store} from '@ngrx/store';
import {getActiveServerIpPort, getBotsControlList, getRuleList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {take} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ag-grid-rules-table-container',
  imports: [
    AgGridRulesTable,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-rules-table-container.html',
  styleUrl: './ag-grid-rules-table-container.scss',
})
export class AgGridRulesTableContainer {
  private store = inject(Store)
  private router = inject(Router);

  botsControlList$ = this.store.select(getBotsControlList)
  ipPort$ = this.store.select(getActiveServerIpPort)
  ruleList$ = this.store.select(getRuleList)

  events($event: any) {
    if ($event.event === 'AgGridRulesTable:DOUBLE_CLICKED_ROW') {
      this.ipPort$.pipe(take(1)).subscribe(ipPort => {
        this.router.navigate([`/server/${ipPort}/${$event.row.data.id}`]);
      });
    }
  }
}
