import { Component } from '@angular/core';
import {Actions} from '../../../components/ag-grid-components/actions/actions';

@Component({
  selector: 'app-launch-control-container',
  imports: [
    Actions
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
