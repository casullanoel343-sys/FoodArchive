
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },

  // Registration
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then(m => m.Register)
  },

  // Home - logged-in users only
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // Recipe Details - logged-in users only
  {
    path: 'recipe-details/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./recipe-details/recipe-details').then(m => m.RecipeDetails)
  },

  // Profile - logged-in users only
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  },

  // Admin Dashboard - admin only
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { adminOnly: true },
    loadComponent: () =>
      import('./admin/admin').then(m => m.Admin)
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }
];
