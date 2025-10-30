import { Component } from '@angular/core';
import {AgGridBotsControl} from '../../components/ag-grid-bots-control/ag-grid-bots-control';
import {botsControlStabs_1} from '../../components/ag-grid-bots-control/stabs';

@Component({
  selector: 'app-ag-grid-bots-control-container',
  imports: [
    AgGridBotsControl
  ],
  standalone: true,
  templateUrl: './ag-grid-bots-control-container.html',
  styleUrl: './ag-grid-bots-control-container.scss'
})
export class AgGridBotsControlContainer {
  data = botsControlStabs_1
  events(event: any) {
    console.log('🔹 Событие из грид-кнопки:', event);
    // здесь твоя бизнес-логика
  }
}
