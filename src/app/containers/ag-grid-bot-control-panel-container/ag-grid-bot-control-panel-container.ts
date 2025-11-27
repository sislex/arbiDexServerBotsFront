import {Component, inject} from '@angular/core';
import {AgGridBotControlPanel} from '../../components/ag-grid-bot-control-panel/ag-grid-bot-control-panel';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {getDataActiveBot} from '../../+state/servers/servers.selectors';
import {deletingBot, isSendData, restartedBot, setIsStartedBot, updateBot} from '../../+state/servers/servers.actions';
import {ConfirmationPopUpContainer} from '../confirmation-pop-up-container/confirmation-pop-up-container';
import {BotEditFormContainer} from '../bot-edit-form-container/bot-edit-form-container';
import {actionTypesList, botData, botTypesList} from '../ag-grid-bots-control-container/stabs';
import {AsyncPipe} from '@angular/common';
import {map} from 'rxjs';

@Component({
  selector: 'app-ag-grid-bot-control-panel-container',
  imports: [
    AgGridBotControlPanel,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './ag-grid-bot-control-panel-container.html',
  styleUrl: './ag-grid-bot-control-panel-container.scss',
})
export class AgGridBotControlPanelContainer {
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store);

  dataActiveBot$ = this.store.select(getDataActiveBot).pipe(
    map(list => ({
      ...list.botResultList.response,
      paused: list.botInfo.response.botParams.paused
    }))
  );

  events($event: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog($event.row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog($event.row);
      } else if ($event.actionType === 'start') {
        this.store.dispatch(setIsStartedBot({isStarted: false, id: $event.row.id}))
      } else if ($event.actionType === 'pause') {
        this.store.dispatch(setIsStartedBot({isStarted: true, id: $event.row.id}))
      }else if ($event.actionType === 'restart') {
        this.store.dispatch(restartedBot({id: $event.row.id}))
      }
    } else if ($event.event === 'Toggle:TOGGLE_CLICKED') {
      this.store.dispatch(isSendData({isSendData: $event.newValue, id: $event.row.id}))
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

  openEditDialog(rowData: any) {
    const dialogRef = this.dialog.open(BotEditFormContainer, {
      width: '800px',
      height: '500px',
      data: {
        title: 'Change bot settings',
        botData: botData,
        botTypesList: botTypesList,
        actionTypesList: actionTypesList,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.$event.data === 'save') {
          this.store.dispatch(updateBot({isSendData: result.data, id: rowData.id}))
        } else {
        }
      } else {
        console.log('Edit cancelled');
      }
    });
  }
}
