import { 
  Component, 
  OnInit, 
  NgZone, 
  ChangeDetectorRef, 
  ViewChild, 
  ElementRef 
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Signalr } from '../services/signalr';
import { Api } from '../services/api';
import { User } from '../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit {

  users: any[] = [];
  selectedUser: any = null;
  message = '';
  messages: string[] = [];
  isReady = false;

  // ---- YOUR RULE (IDs) ----
  private bhanuId = '0BF3B663-2FA5-4B12-B4D9-CAAB1E5B6AD6';      // Bhanu
  private akankshaId = '7C668F42-338F-4F50-ADE9-0D6B62E4FED6'; // Akanksha
  // -------------------------

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  constructor(
    private signalr: Signalr,
    private api: Api,
    private user: User,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  logout() {
    this.user.clearUser();
    this.router.navigate(['/']);
  }

  get username() {
    return this.user.getUsername();
  }

  get userId() {
    return this.user.getUserId();
  }

  async ngOnInit() {

    if (!this.user.getUserId()) {
      alert("Session expired. Please login again.");
      this.router.navigate(['/']);
      return;
    }

    await this.waitForUser();
    await this.signalr.startConnection();

    this.api.getAllUsers().subscribe(users => {
      this.ngZone.run(() => {

        const currentUserId = (this.userId || '').toUpperCase();

        console.log('Logged in user:', currentUserId);

        // --------- FIXED FILTER (THIS IS THE IMPORTANT PART) ---------
        this.users = users
          .filter(u => u.userId?.toUpperCase() !== currentUserId) // never show yourself
          .filter(u => {

            // If Bhanu is logged in → show Akanksha
            if (currentUserId === this.bhanuId) {
              return true;
            }

            // Otherwise hide Akanksha
            return u.userId?.toUpperCase() !== this.akankshaId;
          });

        console.log('Final visible users:', this.users);
        // -------------------------------------------------------------

        const lastChatUserId = this.user.getSelectedChatUser();
        if (lastChatUserId) {
          const found = this.users.find(u => u.userId === lastChatUserId);
          if (found) {
            setTimeout(() => this.selectUser(found), 100);
          }
        }

        this.isReady = true;
        this.cdr.detectChanges();
      });
    });

    this.signalr.onMessage((senderId: string, msg: string) => {
      this.ngZone.run(() => {
        this.messages.push(msg);
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 50);
      });
    });
  }

  private async waitForUser() {
    while (!this.user.getUserId()) {
      await new Promise(res => setTimeout(res, 200));
    }
  }

  selectUser(u: any) {
    this.selectedUser = u;
    this.messages = [];

    this.user.saveSelectedChatUser(u.userId);

    this.api.getChatHistory(this.userId!, u.userId)
      .subscribe(history => {
        this.ngZone.run(() => {
          this.messages = history.map(h => h.encryptedMessage);
          this.cdr.detectChanges();
          setTimeout(() => this.scrollToBottom(), 100);
        });
      });
  }

  send() {
    if (!this.selectedUser) {
      alert("Select a user first");
      return;
    }

    this.signalr.sendMessage(
      this.userId!,
      this.selectedUser.userId,
      `${this.username}: ${this.message}`
    );

    this.message = '';
    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }
}