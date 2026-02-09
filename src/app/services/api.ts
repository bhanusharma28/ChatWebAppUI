import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Api {

  // private baseUrl = "https://localhost:7261/api"; // your .NET port
  private baseUrl = "https://chatwebapp-zz5t.onrender.com/api";

  constructor(private http: HttpClient) {}

  getUserByName(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/byname/${name}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  getChatHistory(senderId: string, receiverId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/chat/history/${senderId}/${receiverId}`
    );
  }
}