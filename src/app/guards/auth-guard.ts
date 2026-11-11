
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  // Check if the user is logged in
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Check if the page requires admin access
  const requiresAdmin = route.data['adminOnly'];

  if (requiresAdmin && !auth.isAdmin()) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
