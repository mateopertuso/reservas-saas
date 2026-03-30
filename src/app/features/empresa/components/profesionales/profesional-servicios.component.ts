import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaApi } from '../../services/empresa.api';

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
  nombreNuevo = '';
  sucursalSeleccionada = '';
  sucursales: any[] = [];

  email = '';
  password = '';
  precio = 0;

  async ngOnInit() {
    const contexto = this.store.contexto();
    if (contexto?.rol === 'professional') {
      this.profesionalId = contexto.profesional_id;
    }
    try {
      this.sucursales = await EmpresaApi.getSucursales();
      console.log('sucursales cargadas:', this.sucursales);
    } catch (error) {
      console.error('ERROR SUCURSALES:', error);
    }
  }

  crear() {
    const contexto = this.store.contexto();

    const profesionalId =
      contexto?.rol === 'professional' ? contexto.profesional_id : this.profesionalId;

    console.log('PROF FINAL:', profesionalId);

    if (!profesionalId || !this.servicioId) return;

    this.store.asignarServicio(
      profesionalId,
      this.servicioId,
      this.duracion,
      this.precio,
      this.empresaId,
    );
  }

  eliminar(profId: string, servId: string) {
    this.store.eliminarAsignacion(profId, servId, this.empresaId);
  }

  async crearProfesional() {
    if (!this.nombreNuevo || !this.sucursalSeleccionada) {
      console.warn('Faltan datos');
      return;
    }

    try {
      await this.store.crearProfesional(this.nombreNuevo, this.sucursalSeleccionada);

      this.nombreNuevo = '';

      console.log('Profesional creado');
    } catch (e) {
      console.error(e);
    }
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
}
