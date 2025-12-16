import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';

export interface User {
  id: number;
  username: string;
  email: string;
  nomComplet: string;
  role: 'USER' | 'ADMIN';
}

export interface CreateUserPayload {
  username: string;
  email: string;
  nomComplet: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  nomComplet?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly baseUrl = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient) {}

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, { withCredentials: true });
  }

  // Get user by ID (admin only)
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // Create user (admin only)
  createUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload, { withCredentials: true });
  }

  // Update user (admin only)
  updateUser(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, payload, { withCredentials: true });
  }

  // Delete user (admin only)
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}

