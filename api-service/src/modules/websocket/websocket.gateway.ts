import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(WebsocketGateway.name);

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    this.logger.debug(`message ${payload}`);
    this.server.emit('message', payload);
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: Socket, payload: string): void {
    this.logger.debug(`broadcast ${payload}`);
    this.server.sockets.emit('broadcast', payload);
  }

  afterInit(server: Server) {
    this.logger.debug(`${WebsocketGateway.name} init`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.sockets.emit('broadcast', 'hello world');
  }
}
