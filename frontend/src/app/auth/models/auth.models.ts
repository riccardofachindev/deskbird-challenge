export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}