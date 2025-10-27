import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-actions',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions {
  @Input() data: any;
  @Output() emitter = new EventEmitter();

  click(action: string) {
    this.emitter.emit({
      event: 'Actions:ACTION_CLICKED',
      data: {
        action,
        rowData: this.data
      }
    });
  }
}
