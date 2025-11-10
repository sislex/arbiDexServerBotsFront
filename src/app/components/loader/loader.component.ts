import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class Loader {
  @Input() title: string = '';
}
