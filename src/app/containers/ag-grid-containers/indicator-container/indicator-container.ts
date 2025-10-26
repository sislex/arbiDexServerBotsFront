import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {Indicator} from '../../../components/ag-grid-components/indicator/indicator';

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

  agInit(params: any): void {
    this.status = params.value || '';
  }

  refresh(): boolean {
    return false;
  }
}
