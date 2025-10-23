import { Component } from '@angular/core';
import {ExpansionPanel} from '../../components/expansion-panel/expansion-panel';
import {TabsContainer} from '../tabs-container/tabs-container';

@Component({
  selector: 'app-expansion-panel-container',
  imports: [
    ExpansionPanel,
    TabsContainer
  ],
  standalone: true,
  templateUrl: './expansion-panel-container.html',
  styleUrl: './expansion-panel-container.scss'
})
export class ExpansionPanelContainer {

}
