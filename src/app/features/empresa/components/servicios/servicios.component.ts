import { Component, inject, effect } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../auth/services/session.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent {
  store = inject(EmpresaStore);
  session = inject(SessionService);

  nombre = '';
  sucursalId = '';

  constructor() {
    effect(() => {
      const sucursales = this.store.sucursales();

      if (sucursales.length === 1 && !this.sucursalId) {
        this.sucursalId = sucursales[0].id;
      }
    });
  }

  crear() {
    const ctx = this.session.context();

    if (!ctx || !this.nombre || !this.sucursalId) return;

    this.store.crearServicio(
      {
        nombre: this.nombre,
        sucursalId: this.sucursalId,
      },
      ctx.empresa_id,
    );

    this.nombre = '';
  }

  eliminar(id: string) {
    const ctx = this.session.context();
    if (!ctx) return;

    this.store.eliminarServicio(id, ctx.empresa_id);
  }
}
