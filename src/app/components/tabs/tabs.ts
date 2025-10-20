import { Component } from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule],
  standalone: true,
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs {
  activeTab = 0;

  onTabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;
  }
}
