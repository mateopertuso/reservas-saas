import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // esperar a que termine de cargar
  if (auth.loading()) return false;

  if (!auth.user()) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
