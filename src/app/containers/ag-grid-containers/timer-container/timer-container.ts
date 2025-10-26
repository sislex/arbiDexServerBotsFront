import {Component, OnDestroy} from '@angular/core';
import {Timer} from '../../../components/ag-grid-components/timer/timer';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-timer-container',
  imports: [
    Timer
  ],
  standalone: true,
  templateUrl: './timer-container.html',
  styleUrl: './timer-container.scss'
})
export class TimerContainer implements ICellRendererAngularComp, OnDestroy {
  private intervalId: any;
  private timestamp: number = 0;
  displayTime = '--:--';
  isPast = false;

  agInit(params: any): void {
    if (!params.value) {
      this.displayTime = '—';
      return;
    }

    this.timestamp = Number(params.value);
    this.updateDisplay();
    this.startTimer();
  }

  refresh(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private startTimer(): void {
    this.intervalId = setInterval(() => this.updateDisplay(), 1000);
  }

  private updateDisplay(): void {
    const now = Date.now();
    const diff = this.timestamp - now;

    this.isPast = diff < 0;

    const absDiff = Math.abs(diff);
    const seconds = Math.floor((absDiff / 1000) % 60);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    const pad = (n: number) => (n < 10 ? '0' + n : n);

    if (days > 0) {
      this.displayTime = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      this.displayTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
  }
}
