import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedUsers;
    private messageHistory;
    private guestInfo;
    private autoRepliedSessions;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(data: {
        userId: string;
        userName: string;
        isGuest?: boolean;
        email?: string;
    }, client: Socket): void;
    handleMessage(data: {
        userId: string;
        userName: string;
        text: string;
        isGuest?: boolean;
    }, client: Socket): void;
    handleSupportReply(data: {
        targetUserId: string;
        text: string;
        supportName: string;
    }, client: Socket): void;
}
export declare class ChatModule {
}
