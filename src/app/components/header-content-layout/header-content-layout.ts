import { Component } from '@angular/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-header-content-layout',
  imports: [
    UpperCasePipe
  ],
  templateUrl: './header-content-layout.html',
  styleUrl: './header-content-layout.scss',
})
export class HeaderContentLayout {

}
