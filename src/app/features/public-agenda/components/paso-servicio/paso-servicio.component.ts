import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';

@Component({
  selector: 'app-paso-servicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-servicio.component.html',
})
export class PasoServicioComponent {
  private store = inject(AgendaStore);

  @Output() siguiente = new EventEmitter<void>();

  servicios = this.store.serviciosFiltrados;

  seleccionarServicio(servicio: any) {
    this.store.seleccionarServicio(servicio);
    this.siguiente.emit();
  }
}
