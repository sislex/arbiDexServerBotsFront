import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {Indicator} from '../../components/indicator/indicator';

@Component({
  selector: 'app-indicator-container',
  imports: [
    Indicator
  ],
  standalone: true,
  templateUrl: './indicator-container.html',
  styleUrl: './indicator-container.scss'
})
export class IndicatorContainer implements ICellRendererAngularComp {
  status = '';
  color = 'gray';

  agInit(params: any): void {
    this.status = params.value || '';

    if (params.colorMapping && params.colorMapping[this.status]) {
      this.color = params.colorMapping[this.status];
    }
  }

  refresh(): boolean {
    return false;
  }
}
