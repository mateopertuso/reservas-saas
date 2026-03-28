import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent {
  store = inject(EmpresaStore);

  empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

  nombre = '';

  crear() {
    if (!this.nombre) return;

    this.store.crearServicio(
      {
        nombre: this.nombre,
        sucursalId: 'b695e9c6-2a7b-4255-8cf9-5bc1b0ddf75a',
      },
      this.empresaId,
    );

    this.nombre = '';
  }

  eliminar(id: string) {
    this.store.eliminarServicio(id, this.empresaId);
  }
}
