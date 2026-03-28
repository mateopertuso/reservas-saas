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

  async ngOnInit() {
    console.log('sucursales: ', this.sucursales);
    this.sucursales = await EmpresaApi.getSucursales();
  }

  crear() {
    if (!this.profesionalId || !this.servicioId) return;

    this.store.asignarServicio(this.profesionalId, this.servicioId, this.duracion, this.empresaId);
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
}
