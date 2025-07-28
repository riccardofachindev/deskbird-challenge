import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { User, UserRole } from '../../../auth/models/auth.models';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  isEditingCurrentUser: boolean = false;
  roles = [
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'User', value: UserRole.USER }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    const user: User = this.config.data?.user;
    const currentUser: User = this.config.data?.currentUser;
    this.isEditMode = !!user;
    this.isEditingCurrentUser = !!(user && currentUser && user.id === currentUser.id);

    this.userForm = this.fb.group({
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      role: [user?.role || UserRole.USER, Validators.required]
    });
    
    if (this.isEditingCurrentUser) {
      this.userForm.get('role')?.disable();
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue();
      
      if (this.isEditMode && !formValue.password) {
        delete formValue.password;
      }
      
      this.ref.close(formValue);
    }
  }

  onCancel() {
    this.ref.close();
  }
}