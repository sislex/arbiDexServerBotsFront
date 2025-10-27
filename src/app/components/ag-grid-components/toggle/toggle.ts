import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-toggle',
  imports: [MatSlideToggleModule, FormsModule],
  standalone: true,
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
  encapsulation: ViewEncapsulation.None
})

export class Toggle {
  @Input() isChecked: boolean = false;
  @Input() description: string = '';
  @Input() title: string = '';

  @Output() emitter = new EventEmitter();

  onToggle() {
    this.emitter.emit({
      event: 'Toggle:TOGGLE_CLICKED',
    });
  }
}
