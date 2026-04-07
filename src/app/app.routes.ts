import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'agenda/:slug',
    loadChildren: () =>
      import('./features/public-agenda/public-agenda.routes').then((m) => m.PUBLIC_AGENDA_ROUTES),
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.component').then((m) => m.LoginPage),
    title: 'Slation | Iniciar sesión',
  },

  {
    path: '',
    component: LandingPageComponent,
    title: 'Slation | Gestión de turnos simple',
  },

  {
    path: 'empresa',
    canActivate: [authGuard],
    loadChildren: () => import('./features/empresa/empresa.routes').then((m) => m.EMPRESA_ROUTES),
  },

  {
    path: 'test-auth',
    loadComponent: () =>
      import('./features/auth/pages/test.auth.component').then((m) => m.TestAuthComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/pages/callback/callback-page.component').then((m) => m.CallbackPage),
  },

  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/auth/pages/onboarding/onboarding-page.component').then(
        (m) => m.OnboardingPage,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
