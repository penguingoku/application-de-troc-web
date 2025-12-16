import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, AuthSession } from '../services/auth';
import { UsersService, User } from '../services/users.service';

  @Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string | null = '';
  email: string | null = '';
  nomComplet: string | null = '';
  role: string | null = '';
  loginTime = '';

  showProfileModal = false;
  editUsername = '';
  editEmail = '';
  editNomComplet = '';
  newPassword = '';
  confirmPassword = '';
  changePassword = false;
  errorMessage = '';
  successMessage = '';
  saving = false;

  // Admin features
  allUsers: User[] = [];
  loadingUsers = false;
  showUsersModal = false;

  private sessionSub?: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.sessionSub = this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.applySession(user);
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
  }

  private applySession(session: AuthSession): void {
    this.username = session.username;
    this.email = session.email;
    this.nomComplet = session.nomComplet;
    this.role = session.role;
    this.loginTime = session.loginTime
      ? new Date(session.loginTime).toLocaleString()
      : new Date().toLocaleString();
    
    if (this.isAdmin()) {
      this.loadAllUsers();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadAllUsers(): void {
    this.loadingUsers = true;
    this.usersService.getAllUsers().subscribe({
      next: users => {
        this.allUsers = users;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
      }
    });
  }

  openUsersModal(): void {
    this.showUsersModal = true;
    this.loadAllUsers();
  }

  closeUsersModal(): void {
    this.showUsersModal = false;
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  openProfileModal(): void {
    this.editUsername = this.username || '';
    this.editEmail = this.email || '';
    this.editNomComplet = this.nomComplet || '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.changePassword = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.resetProfileForm();
  }

  resetProfileForm(): void {
    this.editUsername = '';
    this.editEmail = '';
    this.editNomComplet = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.changePassword = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.editUsername.trim() || !this.editEmail.trim() || !this.editNomComplet.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editEmail)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    if (this.changePassword) {
      if (!this.newPassword || !this.confirmPassword) {
        this.errorMessage = 'Veuillez renseigner les deux champs mot de passe';
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas';
        return;
      }

      if (this.newPassword.length < 4) {
        this.errorMessage = 'Le nouveau mot de passe doit contenir au moins 4 caractères';
        return;
      }
    }

    this.saving = true;
    this.authService
      .updateProfile({
        username: this.editUsername,
        email: this.editEmail,
        nomComplet: this.editNomComplet,
        newPassword: this.changePassword ? this.newPassword : undefined
      })
      .subscribe({
        next: updatedSession => {
          this.applySession(updatedSession);
          this.successMessage = 'Profil mis à jour avec succès !';
          this.saving = false;
          setTimeout(() => this.closeProfileModal(), 1200);
        },
        error: err => {
          this.errorMessage = err?.error ?? 'Mise à jour impossible pour le moment.';
          this.saving = false;
        }
      });
  }
}
