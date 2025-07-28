import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import * as AuthActions from './auth.actions';
import * as UsersActions from '../users/users.actions';

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.accessToken,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logoutSuccess, () => initialState),
  // Update current user when they update their own information
  on(UsersActions.updateUserSuccess, (state, { user }) => {
    if (state.user && state.user.id === user.id) {
      return {
        ...state,
        user: {
          ...state.user,
          ...user,
        },
      };
    }
    return state;
  })
);