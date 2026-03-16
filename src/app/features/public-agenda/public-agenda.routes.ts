import { Routes } from '@angular/router';
import { AgendaPage } from './pages/agenda-page/agenda-page';

export const PUBLIC_AGENDA_ROUTES: Routes = [
  {
    path: '',
    component: AgendaPage,
  },
];
