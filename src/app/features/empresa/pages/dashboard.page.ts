// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { EmpresaStore } from '../state/empresa.store';
// import { ServiciosComponent } from '../components/servicios/servicios.component';
// import { ProfesionalServiciosComponent } from '../components/profesionales/profesional-servicios.component';
// import { DisponibilidadComponent } from '../components/disponibilidad/disponibilidad.component';
// import { ReservasComponent } from '../components/reservas/reservas.component';
// import { SessionService } from '../../auth/services/session.service';
// import { supabase } from '../../../core/supabase/supabase.client';
// import { AgendaComponent } from '../components/agenda/agenda.component';

// @Component({
//   standalone: true,
//   selector: 'app-dashboard-page',
//   imports: [
//     CommonModule,
//     ServiciosComponent,
//     ProfesionalServiciosComponent,
//     DisponibilidadComponent,
//     ReservasComponent,
//     AgendaComponent,
//   ],
//   templateUrl: './dashboard.page.html',
// })
// export class DashboardPage implements OnInit {
//   store = inject(EmpresaStore);

//   constructor(private session: SessionService) {}

//   empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

//   async ngOnInit(): Promise<void> {
//     this.store.cargarContexto();
//     this.store.cargarReservas();
//     this.store.cargarServicios(this.empresaId);
//     this.store.cargarProfesionales(this.empresaId);
//     this.store.cargarProfesionalServicios(this.empresaId);
//   }

//   cancelar(id: string) {
//     this.store.cancelarReserva(id);
//     console.log('ID RESERVA', id);
//   }
// }
