import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'agenda/:slug',
    loadChildren: () =>
      import('./features/public-agenda/public-agenda.routes').then((m) => m.PUBLIC_AGENDA_ROUTES),
  },

  //   {
  //     path: 'app',
  //     loadChildren: () => import('./features/empresa/empresa.routes').then((m) => m.EMPRESA_ROUTES),
  //   },
  //   {
  //     path: 'profesional',
  //     loadChildren: () =>
  //       import('./features/profesional/profesional.routes').then((m) => m.PROFESIONAL_ROUTES),
  //   },

  //   {
  //     path: 'login',
  //     loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  //   },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
