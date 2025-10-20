import {Component, signal} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-filter',
  imports: [
    MatDividerModule, MatExpansionModule, MatIconModule, MatButtonModule
  ],
  standalone: true,
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  readonly panelOpenState = signal(false);
}
