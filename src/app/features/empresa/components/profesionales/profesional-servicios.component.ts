import { Component, effect, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../auth/services/session.service';

@Component({
  standalone: true,
  selector: 'app-profesional-servicios',
  imports: [CommonModule, FormsModule],
  templateUrl: './profesional-servicios.component.html',
})
export class ProfesionalServiciosComponent {
  store = inject(EmpresaStore);
  session = inject(SessionService);

  profesionalId = '';
  servicioId = '';
  duracion = 30;
  nombreNuevo = '';
  sucursalSeleccionada = '';

  email = '';
  password = '';
  precio = 0;

  get contexto() {
    return this.session.context();
  }

  get empresaId() {
    return this.contexto?.empresa_id;
  }

  get sucursales() {
    return this.store.sucursales();
  }

  constructor() {
    effect(() => {
      const ctx = this.contexto;
      const sucursales = this.store.sucursales();

      if (!ctx) return;

      if (ctx.rol === 'professional' && ctx.profesional_id) {
        this.profesionalId = ctx.profesional_id;
      }

      if (sucursales.length === 1 && !this.sucursalSeleccionada) {
        this.sucursalSeleccionada = sucursales[0].id;
      }
    });

    effect(() => {
      const sucursal = this.sucursalSeleccionada;
      const servicio = this.servicioId;

      if (!sucursal) return;

      const servicios = this.store.servicios();

      const valido = servicios.some((s) => s.id === servicio && s.sucursal_id === sucursal);

      if (!valido) {
        this.servicioId = '';
      }
    });
  }

  crear() {
    const ctx = this.contexto;

    if (!ctx) return;

    const profesionalId = ctx.rol === 'professional' ? ctx.profesional_id : this.profesionalId;

    if (!profesionalId || !this.servicioId) {
      console.warn('Faltan datos');
      return;
    }

    this.store.asignarServicio(
      profesionalId,
      this.servicioId,
      this.duracion,
      this.precio,
      this.empresaId!,
    );
  }

  eliminar(profId: string, servId: string) {
    if (!this.empresaId) return;

    this.store.eliminarAsignacion(profId, servId, this.empresaId);
  }

  async crearProfesional() {
    if (!this.nombreNuevo || !this.sucursalSeleccionada) {
      console.warn('Faltan datos');
      return;
    }

    await this.store.crearProfesional(this.nombreNuevo, this.sucursalSeleccionada);

    this.nombreNuevo = '';
  }

  async crearUsuario() {
    if (!this.email || !this.password || !this.nombreNuevo || !this.sucursalSeleccionada) {
      console.warn('Faltan datos');
      return;
    }

    await this.store.crearUsuarioProfesional({
      email: this.email,
      password: this.password,
      nombre: this.nombreNuevo,
      sucursal_id: this.sucursalSeleccionada,
    });
  }

  get serviciosFiltrados() {
    const servicios = this.store.servicios();

    if (!this.sucursalSeleccionada) return servicios;

    return servicios.filter((s) => s.sucursal_id === this.sucursalSeleccionada);
  }
}
