import { Component } from '@angular/core';
import {FormLayout} from '../../components/form-layout/form-layout';

@Component({
  selector: 'app-form-layout-container',
  imports: [
    FormLayout
  ],
  standalone: true,
  templateUrl: './form-layout-container.html',
  styleUrl: './form-layout-container.scss'
})
export class FormLayoutContainer {
  title = '';
  itemData = {}
  events($event: any) {
    console.log('event', $event);
  }
}
