import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'chat', component: Chat },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];