// auth/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const roleGuard = (roles: Array<'owner' | 'professional'>): CanActivateFn => {
  return () => {
    const session = inject(SessionService);
    const router = inject(Router);

    const ctx = session.context();

    if (!ctx) {
      router.navigateByUrl('/login');
      return false;
    }

    if (!roles.includes(ctx.rol)) {
      router.navigateByUrl('/empresa'); // o landing
      return false;
    }

    return true;
  };
};
