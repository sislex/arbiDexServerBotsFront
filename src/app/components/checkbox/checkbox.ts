import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [MatCheckboxModule, FormsModule],
  standalone: true,
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss'
})
export class Checkbox {

}
