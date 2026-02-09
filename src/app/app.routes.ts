import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'chat', component: Chat }
];