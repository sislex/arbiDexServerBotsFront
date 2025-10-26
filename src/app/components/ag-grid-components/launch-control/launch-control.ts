import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-launch-control',
  imports: [],
  standalone: true,
  templateUrl: './launch-control.html',
  styleUrl: './launch-control.scss'
})
export class LaunchControl {
  @Input() isStarted: boolean = false;


}
