import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'agenda/:slug',
    loadChildren: () =>
      import('./features/public-agenda/public-agenda.routes').then((m) => m.PUBLIC_AGENDA_ROUTES),
  },

  {
    path: '',
    component: LandingPageComponent,
    title: 'TurnoSimple | Gestión de turnos minimalista',
  },

  {
    path: 'empresa',
    loadChildren: () => import('./features/empresa/empresa.routes').then((m) => m.EMPRESA_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
