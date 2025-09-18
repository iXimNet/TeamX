import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for production
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');
  private userSocketMap = new Map<number, string>(); // Map<userId, socketId>

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const payload = this.jwtService.verify(token, { secret: 'YOUR_SECRET_KEY' });
      const userId = payload.sub;
      this.userSocketMap.set(userId, client.id);
      this.logger.log(`Client connected: ${client.id}, UserID: ${userId}`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Find userId by socketId and remove from map
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.logger.log(`Client disconnected: ${client.id}, UserID: ${userId}`);
        break;
      }
    }
  }

  sendNotificationToUser(userId: number, payload: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
      this.logger.log(`Sent notification to UserID: ${userId} on socket: ${socketId}`);
    } else {
      this.logger.warn(`Could not find active socket for UserID: ${userId}`);
    }
  }
}
