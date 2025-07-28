import { AuthState } from './auth/auth.state';
import { UsersState } from './users/users.state';

export interface AppState {
  auth: AuthState;
  users: UsersState;
}