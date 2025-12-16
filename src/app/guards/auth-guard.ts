import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  return authService.ensureAuthenticated(state.url);
};
