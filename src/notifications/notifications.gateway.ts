import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage("new-message")
  handleChange(client: Socket, message: any) {
    this.server.emit('receive-message', message)
  }
  // send notifications
  sendNotification(user: any) {
    console.log(`Sending notification to user: ${user.name}`);
    this.server.emit('notification', {
      user: user.name,
      email: user.email,
      role: user.role
    })
  }
}