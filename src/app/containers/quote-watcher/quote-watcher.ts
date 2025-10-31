import { Component } from '@angular/core';
import {ToolbarContainer} from '../toolbar-container/toolbar-container';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-quote-watcher',
  imports: [
    ToolbarContainer,
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './quote-watcher.html',
  styleUrl: './quote-watcher.scss'
})
export class QuoteWatcher {

}
