import {Component, ViewEncapsulation} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-toggle',
  imports: [MatSlideToggleModule, FormsModule],
  standalone: true,
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
  encapsulation: ViewEncapsulation.None
})

export class Toggle implements ICellRendererAngularComp {
  description: string = '';
  isChecked: boolean = false;
  params: any;

  agInit(params: any): void {
    this.params = params;
    this.description = params.description || '';
    this.isChecked = params.value || false;
  }

  refresh(params: any): boolean {
    this.agInit(params);
    return true;
  }

  onToggle(value: boolean) {
    // Обновляем значение в AG Grid
    if (this.params && this.params.node) {
      this.params.node.setDataValue(this.params.colDef.field, value);
    }
  }
}
