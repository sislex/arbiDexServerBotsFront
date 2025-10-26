import {Component, inject} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {getFeatureName, getIsSidebarOpen} from '../../+state/servers/servers.selectors';
import {AsyncPipe} from '@angular/common';
import {TabsContainer} from '../tabs-container/tabs-container';
import {toggleSidebar} from '../../+state/servers/servers.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    AsyncPipe,
    TabsContainer,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer {
  private store = inject(Store);
  private router = inject(Router);

  featureName$ = this.store.select(getFeatureName);
  isSidebarOpen$ = this.store.select(getIsSidebarOpen);

  events($event: any) {
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      this.store.dispatch(toggleSidebar())
    } else if ($event.event === 'Sidebar:SET_ACTIVE_ITEM_CLICKED') {
      this.router.navigate([$event.data.name]).then(r => console.log('tyda', r));
    }
  }
}
