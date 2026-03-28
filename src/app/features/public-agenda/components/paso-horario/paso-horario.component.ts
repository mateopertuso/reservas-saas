import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';

@Component({
  selector: 'app-paso-horario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-horario.component.html',
})
export class PasoHorarioComponent {
  store = inject(AgendaStore);

  @Output() siguiente = new EventEmitter<void>();

  seleccionarHorario(horario: string) {
    this.store.seleccionarHorario(horario);
    this.siguiente.emit();
  }
}
