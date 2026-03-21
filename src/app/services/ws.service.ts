import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WsService {
  private socket: WebSocket | null = null;

  // Метод для открытия соединения
  connect(url: string = 'ws://127.0.0.1:8080') {
    // Если сокет уже открыт, не создаем дубль
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log('✅ Соединение установлено!');
    this.socket.onmessage = (event) => console.log('От сервера:', event.data);
    this.socket.onerror = (err) => console.error('❌ Ошибка:', err);
    this.socket.onclose = () => console.warn('⚠️ Соединение закрыто');
  }

  send(data: any) {
    if (!this.socket) return;

    const msg = JSON.stringify({ event: 'message', data });

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(msg);
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      // Используем addEventListener, чтобы не затирать старые колбэки
      this.socket.addEventListener('open', () => this.socket?.send(msg), { once: true });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Работа завершена");
      this.socket = null; // Обязательно обнуляем ссылку
    }
  }
}
