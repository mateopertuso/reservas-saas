import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';

@Component({
  selector: 'app-paso-fecha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-fecha.component.html',
})
export class PasoFechaComponent {
  store = inject(AgendaStore);

  @Output() siguiente = new EventEmitter<void>();

  async seleccionarDia(dia: string) {
    await this.store.seleccionarDia(dia);
    this.siguiente.emit();
  }
}
