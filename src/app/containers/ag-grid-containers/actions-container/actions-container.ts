import { Component } from '@angular/core';
import {Actions} from '../../../components/ag-grid-components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-actions-container',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './actions-container.html',
  styleUrl: './actions-container.scss'
})
export class ActionsContainer implements ICellRendererAngularComp {
  data: any;

  agInit(params: any): void {
    this.data = params.value || '';
  }

  refresh(): boolean {
    return false;
  }

  events(event: any) {

  }
}
