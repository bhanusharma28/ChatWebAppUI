import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class User {

  private readonly KEY = 'chatUser';
  private readonly SELECTED_CHAT_KEY = 'selectedChatUser';

  setUser(name: string, id: string) {
    const payload = {
      username: name,
      userId: id,
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
    };

    sessionStorage.setItem(this.KEY, JSON.stringify(payload));
  }

  getUsername() {
    const data = sessionStorage.getItem(this.KEY);
    if (!data) return '';

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(this.KEY);
      return '';
    }

    return parsed.username;
  }

  getUserId() {
    const data = sessionStorage.getItem(this.KEY);
    if (!data) return '';

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(this.KEY);
      return '';
    }

    return parsed.userId;
  }

  clearUser() {
    sessionStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.SELECTED_CHAT_KEY);
  }

  // Remember last opened chat
  saveSelectedChatUser(userId: string) {
    sessionStorage.setItem(this.SELECTED_CHAT_KEY, userId);
  }

  getSelectedChatUser(): string | null {
    return sessionStorage.getItem(this.SELECTED_CHAT_KEY);
  }

  clearSelectedChatUser() {
    sessionStorage.removeItem(this.SELECTED_CHAT_KEY);
  }
}