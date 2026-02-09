import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Injectable({ providedIn: 'root' })
export class Signalr {

  connection!: signalR.HubConnection;

  startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7261/chathub")   // <-- your .NET port
      .build();

    return this.connection.start();
  }

  // SINGLE METHOD THAT DOES EVERYTHING ON SERVER
  sendMessage(senderId: string, receiverId: string, message: string) {
    return this.connection.invoke(
      "SendMessage",
      senderId,
      receiverId,
      message
    );
  }

  // Listen for messages from SignalR
  onMessage(callback: (senderId: string, msg: string) => void) {
    this.connection.on("ReceiveMessage", callback);
  }
}