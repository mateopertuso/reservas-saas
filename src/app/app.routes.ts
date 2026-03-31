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
  },

  {
    path: '',
    component: LandingPageComponent,
    title: 'TurnoSimple | Gestión de turnos minimalista',
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
    path: '**',
    redirectTo: '',
  },

];
