"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let ChatGateway = class ChatGateway {
    constructor() {
        this.connectedUsers = new Map();
    }
    handleConnection(client) {
        console.log(`Chat client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.connectedUsers.forEach((value, key) => {
            if (value.socketId === client.id)
                this.connectedUsers.delete(key);
        });
        console.log(`Chat client disconnected: ${client.id}`);
    }
    handleJoin(data, client) {
        this.connectedUsers.set(data.userId, { socketId: client.id, userName: data.userName });
        client.join(`user-${data.userId}`);
        client.emit('joined', { message: `Welcome ${data.userName}! Support is available.` });
    }
    handleMessage(data, client) {
        const userMsg = {
            id: Date.now().toString(),
            from: 'user',
            text: data.text,
            userId: data.userId,
            userName: data.userName,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };
        this.server.emit('new-message', userMsg);
        setTimeout(() => {
            const supportMsg = {
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
    handleSupportReply(data, client) {
        const msg = {
            id: Date.now().toString(),
            from: 'support',
            text: data.text,
            userId: 'support',
            userName: data.supportName,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };
        this.server.to(`user-${data.targetUserId}`).emit('new-message', msg);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('support-reply'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleSupportReply", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true },
        namespace: '/chat',
    })
], ChatGateway);
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        providers: [ChatGateway],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map