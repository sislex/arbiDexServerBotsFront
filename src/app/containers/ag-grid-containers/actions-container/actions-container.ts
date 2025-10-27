import { Component } from '@angular/core';
import {Actions} from '../../../components/ag-grid-components/actions/actions';

@Component({
  selector: 'app-actions-container',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './actions-container.html',
  styleUrl: './actions-container.scss'
})
export class ActionsContainer {
  data: any;
  events(event: any) {

  }
}
