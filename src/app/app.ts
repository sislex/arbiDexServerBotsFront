import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {QuoteWatcher} from './containers/quote-watcher/quote-watcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QuoteWatcher],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('new-project-bot');
}
