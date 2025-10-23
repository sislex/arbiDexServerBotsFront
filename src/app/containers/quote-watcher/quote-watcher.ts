import { Component } from '@angular/core';
import {ToolbarContainer} from '../toolbar-container/toolbar-container';
import {SidebarContainer} from '../sidebar-container/sidebar-container';

@Component({
  selector: 'app-quote-watcher',
  imports: [
    ToolbarContainer,
    SidebarContainer
  ],
  standalone: true,
  templateUrl: './quote-watcher.html',
  styleUrl: './quote-watcher.scss'
})
export class QuoteWatcher {

}
