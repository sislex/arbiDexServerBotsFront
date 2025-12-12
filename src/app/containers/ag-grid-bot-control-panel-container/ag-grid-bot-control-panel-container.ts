import {Component, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {
  getDataActiveBot,
} from '../../+state/servers/servers.selectors';
import {
  deletingBot,
  isSendData,
  restartedBot, setBotSettings,
  setIsStartedBot,
} from '../../+state/servers/servers.actions';
import {ConfirmationPopUpContainer} from '../confirmation-pop-up-container/confirmation-pop-up-container';
import {BotEditFormContainer} from '../bot-edit-form-container/bot-edit-form-container';
import {AsyncPipe} from '@angular/common';
import {combineLatest, map, take} from 'rxjs';
import {AgGrid} from '../../components/ag-grid/ag-grid';
import type {ColDef} from 'ag-grid-community';
import {IndicatorContainer} from '../ag-grid-containers/indicator-container/indicator-container';
import {PauseBotContainer} from '../pause-bot-container/pause-bot-container';
import {RestartBotContainer} from '../restart-bot-container/restart-bot-container';
import {ActionsContainer} from '../ag-grid-containers/actions-container/actions-container';

@Component({
  selector: 'app-ag-grid-bot-control-panel-container',
  imports: [
    AsyncPipe,
    AgGrid
  ],
  standalone: true,
  templateUrl: './ag-grid-bot-control-panel-container.html',
  styleUrl: './ag-grid-bot-control-panel-container.scss',
})
export class AgGridBotControlPanelContainer {
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store);

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      cellRenderer: IndicatorContainer,
      cellRendererParams: {
        colorMapping: {
          'active': 'green',
          '': 'red',
          'finished': 'gray',
          'pause': 'yellow',
        }
      },
      cellStyle: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
      headerClass: 'align-center little-width',
    },
    {
      field: "paused",
      headerName: 'Start/Pause',
      flex: 1,
      cellRenderer: PauseBotContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      headerName: 'Restart',
      flex: 1,
      cellRenderer: RestartBotContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      headerName: 'Edit',
      width: 125,
      cellRenderer: ActionsContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', border: '1px solid #e0e0e0' },
    headerClass: 'align-center',
    suppressMovable: true,
    autoHeight: true,
  };

  dataActiveBot$ = this.store.select(getDataActiveBot).pipe(
    map(list => ({
      ...list.botResultList.response,
      paused: list.botInfo.response.botParams.paused
    }))
  );

  botInfo$ = this.store.select(getDataActiveBot).pipe(
    map(list => ({
      ...list.botInfo.response,
    }))
  );

  onAction($event: any, row: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog(row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog();
      } else if ($event.actionType === 'start') {
        this.store.dispatch(setIsStartedBot({isStarted: false, id: row.id}))
      } else if ($event.actionType === 'pause') {
        this.store.dispatch(setIsStartedBot({isStarted: true, id: row.id}))
      }else if ($event.actionType === 'restart') {
        this.store.dispatch(restartedBot({id: row.id}))
      }
    } else if ($event.event === 'Toggle:TOGGLE_CLICKED') {
      this.store.dispatch(isSendData({isSendData: $event.newValue, id: row.id}))
    }
  }

  openDeleteDialog(rowData: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpContainer, {
      width: '400px',
      height: '300px',
      data: {
        title: 'Delete bot',
        message: `Are you sure you want to delete "${rowData?.name}"?`,
        buttons: ['yes', 'no']
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'yes') {
          this.store.dispatch(deletingBot({id: rowData.id}))
        } else {
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  openEditDialog() {
    combineLatest([
      this.botInfo$.pipe(take(1))
    ])
      .subscribe(([botInfo]) => {

        const dialogRef = this.dialog.open(BotEditFormContainer, {
          width: '90%',
          maxWidth: '100%',
          height: '90%',
          data: {
            title: 'Change bot settings',
            botInfoTitle: 'Bot Params',
            jobInfoTitle: 'Job Params',
            botData: botInfo,
          },
          panelClass: 'custom-dialog-container',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.$event.data === 'save') {
            this.store.dispatch(setBotSettings({id: result.data.id, settings: result.data}))
          }
        });
      });
  }
}
