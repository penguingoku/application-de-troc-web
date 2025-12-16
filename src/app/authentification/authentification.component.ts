import { Component } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './authentification.html',
  styleUrls: ['./authentification.css']
})
export class AuthentificationComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  private redirectUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirect'] || null;
    });
  }

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez saisir vos identifiants.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.redirectUrl || '/']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err?.error?.error ?? 'Identifiants incorrects.';
      }
    });
  }
}