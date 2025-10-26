import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-indicator',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './indicator.html',
  styleUrl: './indicator.scss'
})
export class Indicator implements ICellRendererAngularComp {
  color = 'gray';

  agInit(params: any): void {
    const value = params.value?.toLowerCase();
    if (value === 'active') this.color = 'green';
    else if (value === 'pending') this.color = 'orange';
    else if (value === 'error') this.color = 'red';
    else if (value === 'closed') this.color = 'gray';
  }

  refresh(): boolean {
    return false;
  }
}
