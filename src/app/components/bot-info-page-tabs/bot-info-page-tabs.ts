import {Component, Input} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-bot-info-page-tabs',
  imports: [MatTabsModule],
  standalone: true,
  templateUrl: './bot-info-page-tabs.html',
  styleUrl: './bot-info-page-tabs.scss',
})
export class BotInfoPageTabs {
  @Input() firstLabel = '';
  @Input() secondLabel = '';
  @Input() thirdLabel = '';

}
