import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5040, {
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('join')
  handleJoinEvent(
    @MessageBody() data: { chatRoom: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`room-${data.chatRoom}`); // Join a specific channel (chatRoom)
    this.server.to(`room-${data.chatRoom}`).emit('message', {
      message: 'You have joined the chat!',
      chatRoom: data.chatRoom,
      sender: client.id,
    });
  }

  @SubscribeMessage('message')
  handleMessageEvent(
    @MessageBody() data: { message: string; chatRoom: string },
    @ConnectedSocket() client: Socket,
  ): void {
    // Broadcast the message to everyone in the 'chatRoom' channel
    this.server
      .to(`room-${data.chatRoom}`)
      .emit('message', { text: data.message, sender: client.id });
  }
}
