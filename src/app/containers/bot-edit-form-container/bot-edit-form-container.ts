import {Component, inject} from '@angular/core';
import {BotEditForm} from '../../components/bot-edit-form/bot-edit-form';
import {FormLayout} from '../../components/form-layout/form-layout';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IBotInfo} from '../../models/servers';

@Component({
  selector: 'app-bot-edit-form-container',
  imports: [
    BotEditForm,
    FormLayout
  ],
  standalone: true,
  templateUrl: './bot-edit-form-container.html',
  styleUrl: './bot-edit-form-container.scss'
})
export class BotEditFormContainer {
  private dialogRef = inject(MatDialogRef<BotEditFormContainer>);
  public data = inject(MAT_DIALOG_DATA) as {
    title: string
    botData: IBotInfo,
    botInfoTitle: string
    jobInfoTitle: string,
  };

  newData: any = {...this.data.botData};

  setData($event: any) {
    if ($event.event === 'BotEditForm:CHANGE_DATA') {
      this.newData = $event.data
    }
  }

  events($event: any) {
    this.dialogRef.close({$event, data: this.newData});
  }
}
