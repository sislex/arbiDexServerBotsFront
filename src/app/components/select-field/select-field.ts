import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {IMenuData} from '../../models/view';

@Component({
  selector: 'app-select-field',
  imports: [MatFormFieldModule, MatSelectModule
  ],
  standalone: true,
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss'
})
export class SelectField {
  @Input() menuData: IMenuData = { title: '', list: [{label: ''}] };
  @Input() selected: any;

  @Output() emitter = new EventEmitter();

  click(data: any) {
    this.emitter.emit({
      event: 'SelectField:ITEM_SELECTED',
      data
    });
  }

}
