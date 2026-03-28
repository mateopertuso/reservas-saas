import { Component, inject } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-disponibilidad',
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad.component.html',
})
export class DisponibilidadComponent {
  store = inject(EmpresaStore);

  profesionalId = '';
  fecha = '';
  inicio = '';
  fin = '';

  editandoId: string | null = null;

  editFecha = '';
  editInicio = '';
  editFin = '';

  editar(d: any) {
    this.editandoId = d.id;
    this.editFecha = d.fecha;
    this.editInicio = d.hora_inicio;
    this.editFin = d.hora_fin;
  }

  cancelar() {
    this.editandoId = null;
  }

  guardar(id: string) {
    this.store.actualizarDisponibilidad({
      id,
      fecha: this.editFecha,
      inicio: this.editInicio,
      fin: this.editFin,
    });

    this.editandoId = null;
  }

  cargar() {
    this.store.errorDisponibilidad.set(null);
    if (this.profesionalId) {
      this.store.cargarDisponibilidad(this.profesionalId);
    }
  }

  crear() {
    if (!this.profesionalId || !this.fecha) return;

    this.store.crearDisponibilidad({
      profesionalId: this.profesionalId,
      fecha: this.fecha,
      inicio: this.inicio,
      fin: this.fin,
    });
  }

  eliminar(id: string) {
    this.store.eliminarDisponibilidad(id);
  }
}
