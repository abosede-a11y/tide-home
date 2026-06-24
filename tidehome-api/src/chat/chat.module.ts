import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { Module } from '@nestjs/common';

interface ChatMessage {
  id: string;
  from: 'user' | 'support';
  text: string;
  userId: string;
  userName: string;
  time: string;
}

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<string, { socketId: string; userName: string }>();

  handleConnection(client: Socket) {
    console.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.forEach((value, key) => {
      if (value.socketId === client.id) this.connectedUsers.delete(key);
    });
    console.log(`Chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { userId: string; userName: string }, @ConnectedSocket() client: Socket) {
    this.connectedUsers.set(data.userId, { socketId: client.id, userName: data.userName });
    client.join(`user-${data.userId}`);
    client.emit('joined', { message: `Welcome ${data.userName}! Support is available.` });
  }

  @SubscribeMessage('send-message')
  handleMessage(@MessageBody() data: { userId: string; userName: string; text: string }, @ConnectedSocket() client: Socket) {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: data.text,
      userId: data.userId,
      userName: data.userName,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    // Broadcast to support staff (in production, route to available staff)
    this.server.emit('new-message', userMsg);

    // Auto-acknowledge receipt
    setTimeout(() => {
      const supportMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: 'support',
        text: 'Thank you for your message. A member of our support team will respond shortly. For urgent matters please call +44 800 123 4567.',
        userId: 'support',
        userName: 'Tide Home Support',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      };
      client.emit('new-message', supportMsg);
    }, 1500);
  }

  @SubscribeMessage('support-reply')
  handleSupportReply(@MessageBody() data: { targetUserId: string; text: string; supportName: string }, @ConnectedSocket() client: Socket) {
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: 'support',
      text: data.text,
      userId: 'support',
      userName: data.supportName,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
    this.server.to(`user-${data.targetUserId}`).emit('new-message', msg);
  }
}

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
