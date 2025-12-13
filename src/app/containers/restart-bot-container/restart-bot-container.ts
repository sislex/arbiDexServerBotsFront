import { Component } from '@angular/core';
import {Actions} from '../../components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-restart-bot-container',
    imports: [
        Actions
    ],
  standalone: true,
  templateUrl: './restart-bot-container.html',
  styleUrl: './restart-bot-container.scss',
})
export class RestartBotContainer implements ICellRendererAngularComp {
  params: any;
  // isStarted: boolean = false;

  agInit(params: any): void {
    this.params = params;
    // this.isStarted = params.value ?? false;
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
