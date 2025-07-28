import { createAction, props } from '@ngrx/store';
import { User } from '../../auth/models/auth.models';
import { CreateUserRequest, UpdateUserRequest } from '../../users/models/user.models';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

export const createUser = createAction(
  '[Users] Create User',
  props<{ user: CreateUserRequest }>()
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: string; user: UpdateUserRequest }>()
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>()
);

export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ id: string }>()
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: string }>()
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>()
);

export const seedTestData = createAction('[Users] Seed Test Data');

export const seedTestDataSuccess = createAction(
  '[Users] Seed Test Data Success',
  props<{ message: string; count: number }>()
);

export const seedTestDataFailure = createAction(
  '[Users] Seed Test Data Failure',
  props<{ error: string }>()
);