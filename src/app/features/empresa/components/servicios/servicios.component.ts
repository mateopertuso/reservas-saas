import { Component, inject, effect, computed } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../auth/services/session.service';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../shared/components/app-select/app-select.component';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, AppSelectComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent {
  store = inject(EmpresaStore);
  session = inject(SessionService);
  feedback: { type: 'success' | 'error'; message: string; detail?: string } | null = null;

  nombre = '';
  sucursalId = '';

  sucursalesOptions = computed<SelectOption[]>(() =>
    this.store.sucursales().map((s) => ({ label: s.nombre, value: s.id })),
  );

  constructor() {
    effect(() => {
      const sucursales = this.store.sucursales();

      if (sucursales.length === 1 && !this.sucursalId) {
        this.sucursalId = sucursales[0].id;
      }
    });
  }

  canCreate() {
    return Boolean(this.nombre.trim() && this.sucursalId);
  }

  sucursalNombre(id: string) {
    return this.store.sucursales().find((s) => String(s.id) === String(id))?.nombre ?? 'Sin sucursal';
  }

  async crear() {
    const ctx = this.session.context();

    if (!ctx || !this.nombre.trim() || !this.sucursalId) return;

    const nombre = this.nombre.trim();
    const sucursalId = this.sucursalId;

    await this.store.crearServicio(
      {
        nombre,
        sucursalId,
      },
      ctx.empresa_id,
    );

    this.nombre = '';
    if (this.store.sucursales().length !== 1) {
      this.sucursalId = '';
    }

    this.showFeedback('success', 'Servicio creado', `${nombre} · ${this.sucursalNombre(sucursalId)}`);
  }

  async eliminar(id: string) {
    const ctx = this.session.context();
    if (!ctx) return;

    const servicio = this.store.servicios().find((item) => item.id === id);

    await this.store.eliminarServicio(id, ctx.empresa_id);
    this.showFeedback(
      'success',
      'Servicio eliminado',
      servicio?.nombre ?? 'El servicio se elimino correctamente',
    );
  }

  private showFeedback(type: 'success' | 'error', message: string, detail?: string) {
    this.feedback = { type, message, detail };
    window.setTimeout(() => {
      if (this.feedback?.message === message) {
        this.feedback = null;
      }
    }, 3200);
  }
}
