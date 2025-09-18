import { io, Socket } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;

  connect(token: string) {
    if (this.socket) {
      // Already connected
      return;
    }

    this.socket = io('http://localhost:3001', { // Backend URL
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.socket = null;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.socket?.on(eventName, callback);
  }
}

// Export a singleton instance
export const socketService = new SocketService();
