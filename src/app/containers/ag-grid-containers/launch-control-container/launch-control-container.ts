import { Component } from '@angular/core';
import {LaunchControl} from '../../../components/ag-grid-components/launch-control/launch-control';

@Component({
  selector: 'app-launch-control-container',
  imports: [
    LaunchControl
  ],
  standalone: true,
  templateUrl: './launch-control-container.html',
  styleUrl: './launch-control-container.scss'
})
export class LaunchControlContainer {
  isStarted: boolean = false;
  events(event: any) {

  }
}
