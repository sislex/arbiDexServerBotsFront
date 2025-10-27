import { Component } from '@angular/core';
import {InputTextArea} from '../input-text-area/input-text-area';
import {SelectField} from '../select-field/select-field';
import {InputField} from '../input-field/input-field';
import {Toggle} from '../ag-grid-components/toggle/toggle';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-bot-edit-form',
  imports: [
    InputTextArea,
    SelectField,
    InputField,
    Toggle,
    MatDividerModule
  ],
  standalone: true,
  templateUrl: './bot-edit-form.html',
  styleUrl: './bot-edit-form.scss'
})
export class BotEditForm {
  data = {
    title: 'type',
    list: [
      {
        label: '1type',
      },
      {
        label: '2type',
      },
    ]
  };

  events(event: any) {
    if (event.event === 'InputField:INPUT_CHANGED') {
      console.log(event.event, event.data);
    } else if (event.event === 'SelectField:ITEM_SELECTED') {
      console.log(event.event, event.data);
    } else if (event.event === 'InputTextArea:INPUT_CHANGED') {
      console.log(event.event, event.data);
    } else if (event.event === 'Toggle:TOGGLE_CHANGED') {
      console.log(event.event, event.data);
    }
  }
}
