import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-input-field',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss'
})
export class InputField {
  @Input() label: string = '';
  @Input() placeholder: string = ''
  @Input() inputValue: string = ''
  @Input() title: string = ''

  @Output() emitter = new EventEmitter();

  onInputChange(data: any) {
    this.emitter.emit({
      event: 'InputField:INPUT_CHANGED',
      data
    });
  }
}
