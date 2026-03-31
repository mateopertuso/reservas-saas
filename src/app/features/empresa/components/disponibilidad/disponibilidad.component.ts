import { Component, inject, OnInit, signal } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaApi } from '../../services/empresa.api';

@Component({
  standalone: true,
  selector: 'app-disponibilidad',
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad.component.html',
})
export class DisponibilidadComponent implements OnInit {
  store = inject(EmpresaStore);

  profesionalId = '';
  fecha = '';
  inicio = '';
  fin = '';

  editandoId: string | null = null;

  editFecha = '';
  editInicio = '';
  editFin = '';

  disponibilidadPorProfesional = signal<Record<string, any[]>>({});

  async ngOnInit() {
  const contexto = this.store.contexto();

  if (contexto?.rol === 'professional') {
    this.profesionalId = contexto.profesional_id;
    this.store.cargarDisponibilidad(this.profesionalId);
  }

  if (contexto?.rol === 'owner') {
    console.log('PROFESIONALES:', this.store.profesionales());

    await this.cargarTodos(); // 🔥 ESTO FALTABA
  }
}


  async cargarTodos() {
  const profesionales = this.store.profesionales();

  const result: Record<string, any[]> = {};

  for (const p of profesionales) {
    try {
      const data = await EmpresaApi.getDisponibilidadProfesional(p.id);
      console.log('DISPONIBILIDAD', p.nombre, data);

      result[p.id] = data ?? [];
    } catch (e) {
      console.error('Error en', p.nombre, e);
      result[p.id] = [];
    }
  }

  this.disponibilidadPorProfesional.set(result);
}
  


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
    if (!this.fecha) return;

    const contexto = this.store.contexto();

    const profesionalId =
      contexto?.rol === 'professional' ? contexto.profesional_id : this.profesionalId;

    if (!profesionalId) return;

    this.store.crearDisponibilidad({
      profesionalId,
      fecha: this.fecha,
      inicio: this.inicio,
      fin: this.fin,
    });
  }

  eliminar(id: string) {
    this.store.eliminarDisponibilidad(id);
  }

  
}
