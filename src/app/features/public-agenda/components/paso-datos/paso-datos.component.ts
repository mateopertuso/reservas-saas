import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paso-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paso-datos.component.html',
})
export class PasoDatosComponent {
  store = inject(AgendaStore);

  @Output() siguiente = new EventEmitter<void>();

  nombre = '';
  email = '';
  telefono = '';

  async confirmar() {
    if (!this.nombre || !this.email) return;

    await this.store.crearReserva(this.nombre, this.email, this.telefono);

    this.siguiente.emit();
  }
}
