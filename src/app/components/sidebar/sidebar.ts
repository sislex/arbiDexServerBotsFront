import {Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatDividerModule],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Input() sidebarTitle: string = '';
  isPanelOpen = true;

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  getPanelClass(): string {
    return this.isPanelOpen ? 'panel-open' : 'panel-closed';
  }

}
