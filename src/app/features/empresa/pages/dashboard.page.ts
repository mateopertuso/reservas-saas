import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaStore } from '../state/empresa.store';
import { ServiciosComponent } from '../components/servicios/servicios.component';
import { ProfesionalServiciosComponent } from '../components/profesionales/profesional-servicios.component';
import { DisponibilidadComponent } from '../components/disponibilidad/disponibilidad.component';
import { ReservasComponent } from '../components/reservas/reservas.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    ServiciosComponent,
    ProfesionalServiciosComponent,
    DisponibilidadComponent,
    ReservasComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  store = inject(EmpresaStore);

  empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

  ngOnInit(): void {
    this.store.cargarReservas(this.empresaId);
    this.store.cargarServicios(this.empresaId);
    this.store.cargarProfesionales(this.empresaId);
    this.store.cargarProfesionalServicios(this.empresaId);
  }

  cancelar(id: string) {
    this.store.cancelarReserva(id, this.empresaId);
    console.log('ID RESERVA', id);
  }
}
