import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-agenda',
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
})
export class AgendaComponent {
  store = inject(EmpresaStore);

  fecha = new Date().toISOString().slice(0, 10);

  cambiarFecha() {
    this.store.cargarAgenda(this.fecha);
  }
}
