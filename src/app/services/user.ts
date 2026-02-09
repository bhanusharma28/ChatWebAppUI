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

    localStorage.setItem(this.KEY, JSON.stringify(payload));
  }

  getUsername() {
    const data = localStorage.getItem(this.KEY);
    if (!data) return '';

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(this.KEY);
      return '';
    }

    return parsed.username;
  }

  getUserId() {
    const data = localStorage.getItem(this.KEY);
    if (!data) return '';

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(this.KEY);
      return '';
    }

    return parsed.userId;
  }

  clearUser() {
    localStorage.removeItem(this.KEY);
    localStorage.removeItem(this.SELECTED_CHAT_KEY);
  }

  // -------- NEW PART: remember last opened chat --------

  saveSelectedChatUser(userId: string) {
    localStorage.setItem(this.SELECTED_CHAT_KEY, userId);
  }

  getSelectedChatUser(): string | null {
    return localStorage.getItem(this.SELECTED_CHAT_KEY);
  }

  clearSelectedChatUser() {
    localStorage.removeItem(this.SELECTED_CHAT_KEY);
  }
}