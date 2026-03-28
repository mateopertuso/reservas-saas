import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profesional-servicios',
  imports: [CommonModule, FormsModule],
  templateUrl: './profesional-servicios.component.html',
})
export class ProfesionalServiciosComponent {
  store = inject(EmpresaStore);

  empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

  profesionalId = '';
  servicioId = '';
  duracion = 30;

  crear() {
    if (!this.profesionalId || !this.servicioId) return;

    this.store.asignarServicio(this.profesionalId, this.servicioId, this.duracion, this.empresaId);
  }

  eliminar(profId: string, servId: string) {
    this.store.eliminarAsignacion(profId, servId, this.empresaId);
  }
}
