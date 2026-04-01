import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-sucursales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursales.component.html',
})
export class SucursalesComponent {
  store = inject(EmpresaStore);

  nombre = '';
  direccion = '';
  ciudad = '';
  telefono = '';

  async crear() {
    if (!this.nombre || !this.direccion) return;

    await this.store.crearSucursal({
      nombre: this.nombre,
      direccion: this.direccion,
      ciudad: this.ciudad,
      telefono: this.telefono,
    });

    // limpiar form
    this.nombre = '';
    this.direccion = '';
    this.ciudad = '';
    this.telefono = '';
  }
}
