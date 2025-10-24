import { Component, signal } from '@angular/core';
import {QuoteWatcher} from './containers/quote-watcher/quote-watcher';

@Component({
  selector: 'app-root',
  imports: [QuoteWatcher],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('new-project-bot');
}
