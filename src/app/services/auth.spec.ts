import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
