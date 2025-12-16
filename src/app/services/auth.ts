import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';

export interface AuthSession {
  username: string;
  email: string;
  nomComplet: string;
  role: string;
  userId: number;
  loginTime: string;
}

interface AuthResponse {
  message: string;
  username: string;
  email: string;
  nomComplet: string;
  role: string;
  userId: number;
}

interface RegisterResponse {
  message: string;
  user: UserDto;
}

interface UserDto {
  id: number;
  username: string;
  email: string;
  nomComplet: string;
  role: string;
}

export interface RegisterPayload {
  nomComplet: string;
  email: string;
  username: string;
  password: string;
}

export interface UpdateProfilePayload {
  username: string;
  email: string;
  nomComplet: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'ride-the-trocking-session';
  private readonly baseUrl = `${API_BASE_URL}/auth`;
  private currentUserSubject = new BehaviorSubject<AuthSession | null>(this.getStoredSession());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthSession> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { username, password }, { withCredentials: true })
      .pipe(
        map(response => this.mapAuthResponse(response)),
        tap(session => this.persistSession(session))
      );
  }

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, payload, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      catchError(() => of(void 0)),
      tap(() => this.clearSession())
    );
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUsername(): string | null {
    return this.currentUserSubject.value?.username ?? null;
  }

  getEmail(): string | null {
    return this.currentUserSubject.value?.email ?? null;
  }

  getLoginTime(): string | null {
    return this.currentUserSubject.value?.loginTime ?? null;
  }

  getNomComplet(): string | null {
    return this.currentUserSubject.value?.nomComplet ?? null;
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  isUser(): boolean {
    return this.currentUserSubject.value?.role === 'USER';
  }

  checkSession(): Observable<AuthSession> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/check`, { withCredentials: true }).pipe(
      map(response => this.mapAuthResponse(response)),
      tap(session => this.persistSession(session))
    );
  }

  ensureAuthenticated(redirectUrl?: string): Observable<boolean | UrlTree> {
    if (this.isLoggedIn()) {
      return of(true);
    }

    return this.checkSession().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        const urlTree = this.router.createUrlTree(['/login'], {
          queryParams: redirectUrl ? { redirect: redirectUrl } : undefined
        });
        return of(urlTree);
      })
    );
  }

  updateProfile(payload: UpdateProfilePayload): Observable<AuthSession> {
    const session = this.currentUserSubject.value;
    if (!session) {
      return throwError(() => new Error('Aucun utilisateur connecté'));
    }

    const body: any = {
      username: payload.username,
      email: payload.email,
      nomComplet: payload.nomComplet,
      role: session.role
    };

    if (payload.newPassword) {
      body.password = payload.newPassword;
    }

    return this.http
      .put<UserDto>(`${API_BASE_URL}/users/${session.userId}`, body, { withCredentials: true })
      .pipe(
        map(user => this.mapUserToSession(user, session.loginTime)),
        tap(updatedSession => this.persistSession(updatedSession))
      );
  }

  private mapAuthResponse(response: AuthResponse): AuthSession {
    const existingLoginTime = this.currentUserSubject.value?.loginTime;
    return {
      username: response.username,
      email: response.email,
      nomComplet: response.nomComplet,
      role: response.role,
      userId: response.userId,
      loginTime: existingLoginTime ?? new Date().toISOString()
    };
  }

  private mapUserToSession(user: UserDto, loginTime?: string): AuthSession {
    return {
      username: user.username,
      email: user.email,
      nomComplet: user.nomComplet,
      role: user.role,
      userId: user.id,
      loginTime: loginTime ?? new Date().toISOString()
    };
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    this.currentUserSubject.next(session);
  }

  private getStoredSession(): AuthSession | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthSession) : null;
  }

  private clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }
}