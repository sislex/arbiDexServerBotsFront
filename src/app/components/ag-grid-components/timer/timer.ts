import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-timer',
  imports: [],
  standalone: true,
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class Timer {
  @Input() displayTime: string = '--:--';
  @Input() isPast: boolean = false;
}
