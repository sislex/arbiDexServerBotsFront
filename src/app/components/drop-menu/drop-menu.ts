import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {IMenuData} from '../../models/view';

@Component({
  selector: 'app-drop-menu',
  imports: [MatButtonModule, MatMenuModule],
  standalone: true,
  templateUrl: './drop-menu.html',
  styleUrl: './drop-menu.scss'
})
export class DropMenu {
  @Input() menuData!: IMenuData;

  @Output() emitter = new EventEmitter();

  click(data: any) {
    this.emitter.emit({
      event: 'DropMenu:ITEM_CLICKED',
      data
    });
  }
}
