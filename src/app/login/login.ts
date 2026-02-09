import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { User } from '../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {

  username = '';

  constructor(
    private api: Api,
    private user: User,
    private router: Router
  ) {}

  login() {
    if (!this.username.trim()) return;

    this.api.getUserByName(this.username).subscribe({
      next: (dbUser) => {
        // store REAL database userId
        this.user.setUser(dbUser.name, dbUser.userId);
        this.router.navigate(['/chat']);
      },
      error: () => {
        alert("User not found in database");
      }
    });
  }
}