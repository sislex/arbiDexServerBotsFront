import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsService {
  private socket: WebSocket | null = null;
  public messages$ = new Subject<any>();

  connect(url: string = 'ws://127.0.0.1:8080') {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log('✅ Соединение установлено!');

    this.socket.onmessage = (event) => {
      console.log('От сервера:', event.data);
      const data = JSON.parse(event.data);
      this.messages$.next(data);
    };

    this.socket.onerror = (err) => console.error('❌ Ошибка:', err);
    this.socket.onclose = () => console.warn('⚠️ Соединение закрыто');
  }

  send(data: any) {
    if (!this.socket) return;

    const msg = JSON.stringify({ event: 'message', data });

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(msg);
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      this.socket.addEventListener('open', () => this.socket?.send(msg), { once: true });
    }
  }

  emit(event: string, data: any) {
    if (!this.socket) return;

    const msg = JSON.stringify({ event, data });

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(msg);
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      this.socket.addEventListener('open', () => {
        this.socket?.send(msg);
      }, { once: true });
    }
  }


  subscribeToPairs(subscriptions: { chain: number; pairs: number[] }[]) {
    this.emit('subscribe', subscriptions);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Работа завершена");
      this.socket = null;
    }
  }
}
