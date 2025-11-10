import { Component } from '@angular/core';
import {Loader} from '../../components/loader/loader';

@Component({
  selector: 'app-loader-container',
  imports: [
    Loader
  ],
  standalone: true,
  templateUrl: './loader-container.html',
  styleUrl: './loader-container.scss',
})
export class LoaderContainer {

}
