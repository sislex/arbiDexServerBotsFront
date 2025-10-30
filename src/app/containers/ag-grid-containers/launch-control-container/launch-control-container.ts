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
  params: any;
  isStarted: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.isStarted = params.value ?? false;
  }

  refresh(): boolean {
    return false;
  }

  onAction($event: any, actionType: string) {
    if (this.params?.onAction) {
      this.params.onAction(
        {
          event: $event.event,
          actionType
        },
        this.params.data
      );
    }
  }
}
