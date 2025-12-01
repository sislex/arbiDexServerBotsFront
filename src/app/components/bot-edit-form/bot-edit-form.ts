import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InputTextArea} from '../input-text-area/input-text-area';
import {MatDividerModule} from '@angular/material/divider';
import {IBotInfo} from '../../models/servers';

@Component({
  selector: 'app-bot-edit-form',
  imports: [
    InputTextArea,
    MatDividerModule,
  ],
  standalone: true,
  templateUrl: './bot-edit-form.html',
  styleUrl: './bot-edit-form.scss'
})
export class BotEditForm implements OnInit {
  @Input() info!: IBotInfo ;
  @Input() botInfoTitle: string = '';
  @Input() jobInfoTitle: string = '';

  @Output() emitter = new EventEmitter();
  botData = '';
  jobData = '';

  ngOnInit() {
    this.botData = JSON.stringify(this.info.botParams, null, 2);
    this.jobData = JSON.stringify(this.info.jobParams, null, 2);
  };

  events(event: any, note: string) {
    if (event.event === 'InputTextArea:INPUT_CHANGED') {
      if (note === 'botTextArea') {
        console.log('просто отправляем все текущие данные об объекте');
      } else if (note === 'actionTextArea') {
        console.log('просто отправляем все текущие данные об объекте');
      }
    }

    this.emitter.emit({
      event: 'BotEditForm:CHANGE_DATA',
      data: {
        id: this.info.id,
        botParams: this.botData,
        jobParams: this.jobData
      }
    });
  }
}
