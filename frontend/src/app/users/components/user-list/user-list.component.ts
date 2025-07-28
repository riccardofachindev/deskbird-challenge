import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppState } from '../../../store/app.state';
import { User } from '../../../auth/models/auth.models';
import * as UsersActions from '../../../store/users/users.actions';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAllUsers, selectUsersLoading } from '../../../store/users/users.selectors';
import { selectIsAdmin, selectCurrentUser } from '../../../store/auth/auth.selectors';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, DialogService, ConfirmationService],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  users: User[] = [];
  loading$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  ref: DynamicDialogRef | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private actions$: Actions
  ) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());

    // Subscribe to users to maintain a local mutable copy for sorting
    this.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.users = [...users];
    });

    this.actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User updated successfully',
        life: 3000
      });
    });

    this.actions$.pipe(
      ofType(UsersActions.createUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User created successfully',
        life: 3000
      });
    });

    this.actions$.pipe(
      ofType(UsersActions.seedTestDataSuccess),
      takeUntil(this.destroy$)
    ).subscribe(({ message, count }) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
      });
    });

    this.actions$.pipe(
      ofType(
        UsersActions.updateUserFailure,
        UsersActions.createUserFailure,
        UsersActions.deleteUserFailure,
        UsersActions.seedTestDataFailure
      ),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: action.error,
        life: 4000
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUser(user: User) {
    let currentUser: User | null = null;
    this.currentUser$.subscribe(u => currentUser = u).unsubscribe();

    this.ref = this.dialogService.open(UserEditDialogComponent, {
      header: user ? 'Edit user' : 'Add user',
      width: '500px',
      data: { user, currentUser },
      modal: true,
      dismissableMask: false,
      closable: true,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        if (user) {
          this.store.dispatch(UsersActions.updateUser({ id: user.id, user: result }));
        } else {
          this.store.dispatch(UsersActions.createUser({ user: result }));
        }
      }
    });
  }

  addNewUser() {
    this.editUser(null as any);
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Delete confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.store.dispatch(UsersActions.deleteUser({ id: user.id }));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          life: 3000
        });
      }
    });
  }

  seedTestUsers() {
    this.confirmationService.confirm({
      message: 'This will add 25 test users to the database (all with password: "password123"). Continue?',
      header: 'Seed test data',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Yes, seed data',
      rejectLabel: 'Cancel',
      accept: () => {
        this.store.dispatch(UsersActions.seedTestData());
      }
    });
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Log out confirmation',
      icon: 'pi pi-sign-out',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Yes, log out',
      rejectLabel: 'Cancel',
      accept: () => {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }

  getRoleSeverity(role: string): string {
    return role === 'admin' ? 'danger' : 'info';
  }
}