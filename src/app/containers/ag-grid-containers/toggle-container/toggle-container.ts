import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {Toggle} from '../../../components/ag-grid-components/toggle/toggle';

@Component({
  selector: 'app-toggle-container',
  imports: [
    Toggle
  ],
  standalone: true,
  templateUrl: './toggle-container.html',
  styleUrl: './toggle-container.scss'
})
export class ToggleContainer implements ICellRendererAngularComp {
  description: string = '';
  params: any;
  isChecked: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.isChecked = !!params.value;
  }

  refresh(params: any): boolean {
    this.agInit(params);
    return true;
  }

  onToggleChange($event: any) {
    if (this.params?.onAction) {
      this.params.onAction(
        {
          event: $event.event,
          newValue: $event.data,
        },
        this.params.data
      );
    }
  }
}
