import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-drop-menu',
  imports: [MatButtonModule, MatMenuModule],
  standalone: true,
  templateUrl: './drop-menu.html',
  styleUrl: './drop-menu.scss'
})
export class DropMenu {

}
