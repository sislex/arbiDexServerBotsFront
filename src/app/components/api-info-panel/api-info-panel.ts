import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Actions} from '../actions/actions';

@Component({
  selector: 'app-api-info-panel',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './api-info-panel.html',
  styleUrl: './api-info-panel.scss',
})
export class ApiInfoPanel {
  @Input() title: string = '';
  @Input() icon: string = '';

  @Output() emitter = new EventEmitter();
}
