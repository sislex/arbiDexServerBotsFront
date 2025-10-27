import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-form-layout',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './form-layout.html',
  styleUrl: './form-layout.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormLayout {
  @Input() title: string = '';
  @Input() itemData: any;

  @Output() emitter = new EventEmitter();

  event(event: string) {
    this.emitter.emit({
      event: 'FormLayout:TOGGLE_CLICKED',
      data: event
    });
  }
}
