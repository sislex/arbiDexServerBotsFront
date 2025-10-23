import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-expansion-panel',
  imports: [MatExpansionModule],
  standalone: true,
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanel {
  @Input() blockList: any = [
    {
      blockTitle: '123',
    },
    {
      blockTitle: '2-123',
    },
    {
      blockTitle: '2-123',
    },
    {
      blockTitle: '2-123',
    }
  ];
  readonly panelOpenState = signal(false);
}
