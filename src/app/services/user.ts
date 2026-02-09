import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class User {

  private username = '';
  private userId = '';

  setUser(name: string, id: string) {
    this.username = name;
    this.userId = id;   // REAL DB USER ID
  }

  getUsername() {
    return this.username;
  }

  getUserId() {
    return this.userId;
  }
}