import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InputTextArea} from '../input-text-area/input-text-area';
import {SelectField} from '../select-field/select-field';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-bot-edit-form',
  imports: [
    InputTextArea,
    SelectField,
    MatDividerModule
  ],
  standalone: true,
  templateUrl: './bot-edit-form.html',
  styleUrl: './bot-edit-form.scss'
})
export class BotEditForm implements OnInit {
  @Input() botList: string[] = [];
  @Input() botTitle: string = '';
  @Input() textAreaBotTitle: string = '';

  @Input() jobList: string[] = [];
  @Input() jobTitle: string = '';
  @Input() textAreaJobTitle: string = '';

  @Input() data: any = {};

  @Output() emitter = new EventEmitter();

  formData: any = {};

  ngOnInit() {
    this.formData = { ...this.data };
  };

  events(event: any, note: string) {
    if (event.event === 'InputField:INPUT_CHANGED') {
      console.log(event.event, event.data);
    } else if (event.event === 'SelectField:ITEM_SELECTED') {
      if (note === 'botSelect') {
        this.formData = {
          ...this.formData,
          botSelect: event.data.label
        }
      } else if (note === 'actionSelect') {
        this.formData = {
          ...this.formData,
          actionSelect: event.data.label
        }
      }
    } else if (event.event === 'InputTextArea:INPUT_CHANGED') {
      if (note === 'botTextArea') {
        this.formData = {
          ...this.formData,
          botJSON: event.data
        }
      } else if (note === 'actionTextArea') {
        this.formData = {
          ...this.formData,
          actionJSON: event.data
        }
      }
    } else if (event.event === 'Toggle:TOGGLE_CHANGED') {
      console.log(event.event, event.data);
    }

    this.emitter.emit({
      event: 'BotEditForm:CHANGE_DATA',
      data: this.formData
    });
  }
}
