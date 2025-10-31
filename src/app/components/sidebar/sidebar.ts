import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {setActiveServer} from '../../+state/servers/servers.actions';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    UpperCasePipe,
    MatButtonToggleModule,
    TitleCasePipe,
  ],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit{
  @Input() sidebarTitle: string = '';
  @Input() isSidebarOpen: boolean = true;
  @Input() list: any[] = [
    {
      name: "server-1",
      status: true,
      ip: 3
    },
    {
      name: "server-2",
      status: true,
      ip: 4
    },
    {
      name: "server three",
      status: true,
      ip: 5
    },
    {
      name: "serverThree",
      status: true,
      ip: 6
    },
  ];

  @Output() emitter = new EventEmitter();

  private route=inject(ActivatedRoute);
  private store=inject(Store);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const ip = params.get('ip');
      if (ip) {
        this.store.dispatch(setActiveServer({ ip }));
      }
    });
  }

  togglePanel() {
    this.emitter.emit({
      event: 'Sidebar:TOGGLE_CLICKED',
    });
  }

  setActiveItem(event$: any) {
    this.emitter.emit({
      event: 'Sidebar:SET_ACTIVE_ITEM_CLICKED',
      data: event$
    });
  }

}
