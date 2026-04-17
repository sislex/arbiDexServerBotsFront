import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {UpperCasePipe} from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {HttpClient} from '@angular/common/http';
import {catchError, interval, map, of, startWith, Subject, takeUntil} from 'rxjs';
import { forkJoin } from 'rxjs';

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
  ],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit, OnDestroy {
  @Input() sidebarTitle: string = '';
  @Input() isSidebarOpen: boolean = true;
  @Input() list: any[] = [];
  @Input() activeItem: string = '';

  @Output() emitter = new EventEmitter();

  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.list = this.list.map(item => ({ ...item, status: 'pending' }));
    this.startStatusPolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startStatusPolling() {
    interval(5000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkAllStatuses();
      });
  }
  private checkAllStatuses() {
    const requests = this.list.map(item => {
      const url = `http://${item.ip}:${item.port}/bots/get-all`;
      return this.http.get(url).pipe(
        map(() => ({ ...item, status: 'online' })),
        catchError(() => of({ ...item, status: 'offline' })),
        takeUntil(this.destroy$)
      );
    });

    forkJoin(requests).subscribe(newList => {
      this.list = newList;
      this.cdr.markForCheck();
    });
  }

  togglePanel() {
    this.emitter.emit({
      event: 'Sidebar:TOGGLE_CLICKED',
    });
  }

  setActiveItem(ipPort: string) {
    this.emitter.emit({
      event: 'Sidebar:SET_ACTIVE_ITEM_CLICKED',
      data: { ipPort },
    });
  }

}
