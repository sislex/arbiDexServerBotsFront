import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-launch-control',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './launch-control.html',
  styleUrl: './launch-control.scss'
})
export class LaunchControl {
  @Input() isStarted: boolean = false;

  @Output() emitter = new EventEmitter();

  toggleLaunch() {
    this.emitter.emit({
      event: 'Toggle:TOGGLE_CLICKED',
    });
  }
}
