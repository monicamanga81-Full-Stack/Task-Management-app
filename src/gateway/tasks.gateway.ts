import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TasksGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private redis: RedisService) {}

  afterInit() {
    console.log('WebSocket Gateway Initialized');

    // Subscribe to Redis task updates
    this.redis.subscribe('task_updates', (message) => {
      console.log('Broadcasting Redis event:', message);

      // Emit to all connected WebSocket clients
      this.server.emit('task_update', message);
    });
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}
