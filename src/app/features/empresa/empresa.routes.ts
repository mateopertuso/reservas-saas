import { Routes } from '@angular/router';
import { EmpresaLayoutComponent } from './layout/empresa-layout.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { ProfesionalServiciosComponent } from './components/profesionales/profesional-servicios.component';

export const EMPRESA_ROUTES: Routes = [
  {
    path: '',
    component: EmpresaLayoutComponent,
    children: [
      { path: 'agenda', component: AgendaComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'disponibilidad', component: DisponibilidadComponent },
      { path: 'profesional-servicios', component: ProfesionalServiciosComponent },
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
    ],
  },
];
