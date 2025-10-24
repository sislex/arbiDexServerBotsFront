import {Component, inject} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {getFeatureName} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {ExpansionPanelContainer} from '../expansion-panel-container/expansion-panel-container';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    AsyncPipe,
    ExpansionPanelContainer,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer {
  private store = inject(Store);

  featureName$ = this.store.select(getFeatureName);
}
