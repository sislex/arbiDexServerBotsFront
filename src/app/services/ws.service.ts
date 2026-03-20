import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WsService {
  private socket = new WebSocket('ws://127.0.0.1:8080');
  constructor() {
    this.socket.onmessage = (event) => console.log('От сервера:', event.data);

    this.socket.onopen = (event) => {
      console.log('✅ Соединение установлено!');
    };

    // 2. Ошибка
    this.socket.onerror = (error) => {
      console.error('❌ Ошибка сокета:', error);
    };

    // 3. Закрытие
    this.socket.onclose = (event) => {
      console.warn('⚠️ Соединение закрыто:', event.reason);
    };
  }

  // В ws.service.ts
  send(data: any) {
    const msg = JSON.stringify({ event: 'message', data });

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(msg);
    } else {
      // Если сокет еще соединяется, ждем события open
      this.socket.onopen = () => this.socket.send(msg);
    }
  }

  // ws.service.ts
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Работа завершена");
      // 1000 — это стандартный код "Normal Closure"
    }
  }



}
