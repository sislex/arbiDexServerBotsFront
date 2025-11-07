import {Component, inject} from '@angular/core';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationPopUpContainer} from '../confirmation-pop-up-container/confirmation-pop-up-container';
import {Store} from '@ngrx/store';
import {deletingBot, isSendData, setIsStartedBot, updateBot} from '../../+state/servers/servers.actions';
import {BotEditFormContainer} from '../bot-edit-form-container/bot-edit-form-container';
import {actionTypesList, botData, botTypesList} from './stabs';
import {getBotsControlList} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';

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

  botsControlList$ = this.store.select(getBotsControlList)

  events($event: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog($event.row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog($event.row);
      } else if ($event.actionType === 'start') {
        this.store.dispatch(setIsStartedBot({isStarted: true, id: $event.row.id}))
      } else if ($event.actionType === 'stop') {
        this.store.dispatch(setIsStartedBot({isStarted: false, id: $event.row.id}))
      } else if ($event.actionType === 'add') {
        this.openAddDialog();
      }
    } else if ($event.event === 'Toggle:TOGGLE_CLICKED') {
      this.store.dispatch(isSendData({isSendData: $event.newValue, id: $event.row.id}))
    } else if ($event.event === 'AgGridBotsControl:CLICKED_ROW') {
      console.log($event)
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
        console.log('Deletion cancelled');
      }
    });
  }

  openAddDialog() {

  }

}
