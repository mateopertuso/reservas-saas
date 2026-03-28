import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard.page';
import { roleGuard } from '../auth/guards/role.guard';

export const EMPRESA_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    canActivate: [roleGuard(['owner', 'professional'])],
  },
];
