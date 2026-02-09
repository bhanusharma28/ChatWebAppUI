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

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  constructor(
    private signalr: Signalr,
    private api: Api,
    private user: User,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  showUsers = false;   // controls mobile hamburger menu
  get username() {
    return this.user.getUsername();
  }

  get userId() {
    return this.user.getUserId();
  }

  async ngOnInit() {

    // Wait for login
    await this.waitForUser();

    await this.signalr.startConnection();

    // Load users
    this.api.getAllUsers().subscribe(users => {
      this.ngZone.run(() => {
        this.users = users.filter(u => u.userId !== this.userId);
        this.isReady = true;
        this.cdr.detectChanges();
      });
    });

    // Listen for live messages
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

    this.api.getChatHistory(this.userId, u.userId)
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

    //this.messages.push("You: " + this.message);

    this.signalr.sendMessage(
      this.userId,
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