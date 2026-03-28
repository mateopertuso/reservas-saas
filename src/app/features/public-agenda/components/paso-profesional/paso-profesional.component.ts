import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';

@Component({
  selector: 'app-paso-profesional',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-profesional.component.html',
})
export class PasoProfesionalComponent {
  store = inject(AgendaStore);

  @Output() siguiente = new EventEmitter<void>();

  profesionales = this.store.profesionales;

  async seleccionarProfesional(prof: any) {
    await this.store.seleccionarProfesional(prof);
    this.siguiente.emit();
  }
}
