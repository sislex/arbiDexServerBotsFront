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
  isChecked: boolean = false;
  params: any;

  agInit(params: any): void {
    this.params = params;
    this.description = params.description || '';
    this.isChecked = params.value || false;
  }

  refresh(params: any): boolean {
    this.agInit(params);
    return true;
  }

  events(event: any) {
    // Обновляем значение в AG Grid
    if(event.event === 'Toggle:TOGGLE_CLICKED') {
      if (this.params && this.params.node) {
        this.params.node.setDataValue(this.params.colDef.field, event.event.data);
      }
      // this.store.dispatch(toggleSendData({data: event.data})); //передаем потом сюда не значение toggle а просто id для смены
    }
  }

}
