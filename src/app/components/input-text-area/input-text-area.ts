import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-input-text-area',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './input-text-area.html',
  styleUrl: './input-text-area.scss'
})
export class InputTextArea {
  @Input() label: string = '';
  @Input() placeholder: string = ''
  @Input() inputValue: string = ''
  @Input() title: string = ''

  @Output() emitter = new EventEmitter();

  onInputChange(data: any) {
    this.emitter.emit({
      event: 'InputTextArea:INPUT_CHANGED',
      data
    });
  }
}
