import { Component } from '@angular/core';
import {Actions} from '../../../components/ag-grid-components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-launch-control-container',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './launch-control-container.html',
  styleUrl: './launch-control-container.scss'
})
export class LaunchControlContainer implements ICellRendererAngularComp {
  isStarted: boolean = false;

  agInit(params: any): void {
    this.isStarted = params.value || '';
  }

  refresh(): boolean {
    return false;
  }

  events(event: any) {

  }
}
