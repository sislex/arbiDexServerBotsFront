import { Component } from '@angular/core';
import {Actions} from '../../components/ag-grid-components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-pause-bot-container',
    imports: [
        Actions
    ],
  standalone: true,
  templateUrl: './pause-bot-container.html',
  styleUrl: './pause-bot-container.scss',
})
export class PauseBotContainer implements ICellRendererAngularComp {
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
