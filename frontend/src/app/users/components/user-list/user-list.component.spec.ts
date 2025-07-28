import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { User, UserRole } from '../../../auth/models/auth.models';
import * as UsersActions from '../../../store/users/users.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<Action>;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@deskbird.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const initialState = {
    users: {
      users: mockUsers,
      loading: false,
      error: null
    },
    auth: {
      user: mockUsers[0],
      isAuthenticated: true,
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>(1);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
        { provide: DialogService, useValue: jasmine.createSpyObj('DialogService', ['open']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers action on init', () => {
    spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers());
  });

  it('should return correct role severity', () => {
    expect(component.getRoleSeverity('admin')).toBe('danger');
    expect(component.getRoleSeverity('user')).toBe('info');
  });
});