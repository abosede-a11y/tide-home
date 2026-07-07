import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Module } from '@nestjs/common';

interface ChatMessage {
  id: string;
  from: 'user' | 'support';
  text: string;
  userId: string;
  userName: string;
  time: string;
  isGuest?: boolean;
  guestLabel?: string;
  email?: string;
  _forGuest?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  namespace: '/chat',
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<string, { socketId: string; userName: string }>();
  private messageHistory: ChatMessage[] = [];
  private guestInfo = new Map<string, { name: string; email?: string }>();
  private autoRepliedSessions = new Set<string>();

  handleConnection(client: Socket) {
    console.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.forEach((value, key) => {
      if (value.socketId === client.id) this.connectedUsers.delete(key);
    });
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { userId: string; userName: string; isGuest?: boolean; email?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(data.userId, { socketId: client.id, userName: data.userName });
    client.join(`user-${data.userId}`);

    if (data.isGuest) {
      this.guestInfo.set(data.userId, { name: data.userName, email: data.email });
    }

    client.emit('message-history', this.messageHistory);

    if (!data.isGuest) {
      client.emit('joined', { message: `Welcome ${data.userName}! You are now in the support chat.` });
    } else {
      client.emit('joined', { message: `Welcome ${data.userName}! Support is available.` });
    }
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() data: { userId: string; userName: string; text: string; isGuest?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const guest = this.guestInfo.get(data.userId);

    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: data.text,
      userId: data.userId,
      userName: data.userName,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isGuest: data.isGuest,
      guestLabel: data.isGuest
        ? `${data.userName}${guest?.email ? ' · ' + guest.email : ''}`
        : null,
    };

    this.messageHistory.push(msg);
    if (this.messageHistory.length > 100) this.messageHistory.shift();

    // Broadcast to admins/staff only — NOT back to the sender
    client.broadcast.emit('new-message', msg);

    // Auto-reply only ONCE per guest session
    if (!this.autoRepliedSessions.has(data.userId)) {
      this.autoRepliedSessions.add(data.userId);
      setTimeout(() => {
        const supportMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          from: 'support',
          text: `Thank you for your message! A member of our support team will respond shortly. For urgent matters please call +44 800 123 4567.`,
          userId: 'support',
          userName: 'Tide Home Support',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          _forGuest: data.userId,
        };
        this.messageHistory.push(supportMsg);
        // Only send auto-reply to the guest
        client.emit('new-message', supportMsg);
      }, 1500);
    }
  }

  @SubscribeMessage('support-reply')
  handleSupportReply(
    @MessageBody() data: { targetUserId: string; text: string; supportName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: 'support',
      text: data.text,
      userId: 'support',
      userName: data.supportName,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      _forGuest: data.targetUserId,
    };

    this.messageHistory.push(msg);
    if (this.messageHistory.length > 100) this.messageHistory.shift();

    // Send ONLY to the target guest
    this.server.to(`user-${data.targetUserId}`).emit('new-message', msg);
    // Do NOT emit back to admin — frontend adds it locally
  }
}

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}