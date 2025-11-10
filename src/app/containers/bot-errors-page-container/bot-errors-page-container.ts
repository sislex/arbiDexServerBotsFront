import {Component, inject, OnInit} from '@angular/core';
import {BotErrorsPage} from '../../components/bot-errors-page/bot-errors-page';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-bot-errors-page-container',
  imports: [
    BotErrorsPage,
  ],
  standalone: true,
  templateUrl: './bot-errors-page-container.html',
  styleUrl: './bot-errors-page-container.scss',
})
export class BotErrorsPageContainer implements OnInit {
  private store = inject(Store)
  data = {
    errors: []
  };

  // botData$ = this.store.select(selectBotData())
  ngOnInit() {
    console.log('тут вызвать диспатч на запуск апишки получения errors по ip, port, id-бота')
  }

  events($event: any) {
    console.log($event)
  }
}
