import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UsersService } from '../../users/services/users.service';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ 
              error: error.error?.message || 'Failed to load users' 
            }))
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap(({ user }) =>
        this.usersService.createUser(user).pipe(
          map((createdUser) => UsersActions.createUserSuccess({ user: createdUser })),
          catchError((error) =>
            of(UsersActions.createUserFailure({ 
              error: error.error?.message || 'Failed to create user' 
            }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ id, user }) =>
        this.usersService.updateUser(id, user).pipe(
          map((updatedUser) => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) =>
            of(UsersActions.updateUserFailure({ 
              error: error.error?.message || 'Failed to update user' 
            }))
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((error) =>
            of(UsersActions.deleteUserFailure({ 
              error: error.error?.message || 'Failed to delete user' 
            }))
          )
        )
      )
    )
  );

  seedTestData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.seedTestData),
      switchMap(() =>
        this.usersService.seedTestData().pipe(
          switchMap((result) => [
            UsersActions.seedTestDataSuccess(result),
            UsersActions.loadUsers()
          ]),
          catchError((error) =>
            of(UsersActions.seedTestDataFailure({ 
              error: error.error?.message || 'Failed to seed test data' 
            }))
          )
        )
      )
    )
  );
}