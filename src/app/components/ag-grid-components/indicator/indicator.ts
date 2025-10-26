import {Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-indicator',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './indicator.html',
  styleUrl: './indicator.scss'
})
export class Indicator {
  @Input() status: string = '';

  private readonly statusColorMap: { [key: string]: string } = {
    'active': 'var(--true-color)',
    'pending': 'var(--warn-color)',
    'error': 'var(--error-color)',
    'closed': 'var(--neutral-color)'
  };

  get computedColor(): string {
    const normalizedStatus = this.status?.toLowerCase();
    return this.statusColorMap[normalizedStatus] || 'var(--neutral-color)';
  }
}
