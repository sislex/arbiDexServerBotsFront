import {Component, Input} from '@angular/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-title-table-layout',
  imports: [
    UpperCasePipe
  ],
  standalone: true,
  templateUrl: './title-table-layout.html',
  styleUrl: './title-table-layout.scss'
})
export class TitleTableLayout {
  @Input() title: string = '';

}
