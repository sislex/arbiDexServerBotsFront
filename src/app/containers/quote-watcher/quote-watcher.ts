import { Component } from '@angular/core';
import {ToolbarContainer} from '../toolbar-container/toolbar-container';
import {RouterOutlet} from '@angular/router';
import {HeaderContentLayout} from '../../components/header-content-layout/header-content-layout';

@Component({
  selector: 'app-quote-watcher',
  imports: [
    ToolbarContainer,
    RouterOutlet,
    HeaderContentLayout
  ],
  standalone: true,
  templateUrl: './quote-watcher.html',
  styleUrl: './quote-watcher.scss'
})
export class QuoteWatcher {

}
