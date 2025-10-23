import { Component } from '@angular/core';
import {Tabs} from '../../components/tabs/tabs';

@Component({
  selector: 'app-tabs-container',
  imports: [
    Tabs
  ],
  standalone: true,
  templateUrl: './tabs-container.html',
  styleUrl: './tabs-container.scss'
})
export class TabsContainer {

}
