import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../../../core/supabase/supabase.client';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return router.parseUrl('/login');
  }

  return true;
};
