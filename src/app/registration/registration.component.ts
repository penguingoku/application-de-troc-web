import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class RegistrationComponent {
  nomComplet = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.nomComplet.trim()) {
      this.errorMessage = 'Veuillez saisir votre nom complet.';
      return;
    }

    this.loading = true;
    this.authService
      .register({
        nomComplet: this.nomComplet,
        email: this.email,
        username: this.username,
        password: this.password
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Compte créé avec succès ! Vous pouvez vous connecter.';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err?.error?.error ?? 'Inscription impossible, veuillez réessayer.';
        }
      });
  }
}
