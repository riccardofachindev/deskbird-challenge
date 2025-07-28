import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { UserListComponent } from './users/components/user-list/user-list.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
