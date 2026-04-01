import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaStore } from '../../state/empresa.store';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
})
export class ReservasComponent {
  store = inject(EmpresaStore);

  fechaSeleccionada = signal<string | null>(null);
  profesionalSeleccionado = signal<string | null>(null);

  reservasFiltradas = computed(() => {
    const reservas = this.store.reservas();

    const prioridadEstado = {
      pendiente: 0,
      confirmada: 1,
      cancelada: 2,
    };

    return reservas
      .filter((r) => {
        const matchFecha = this.fechaSeleccionada()
          ? new Date(r.fecha_hora).toISOString().slice(0, 10) === this.fechaSeleccionada()
          : true;

        const matchProfesional = this.profesionalSeleccionado()
          ? String(r.profesional_id) === String(this.profesionalSeleccionado())
          : true;

        return matchFecha && matchProfesional;
      })
      .sort((a, b) => {
        const estadoDiff =
          prioridadEstado[a.estado as keyof typeof prioridadEstado] -
          prioridadEstado[b.estado as keyof typeof prioridadEstado];

        if (estadoDiff !== 0) return estadoDiff;

        return new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime();
      });
  });

  cancelar(id: string) {
    this.store.cancelarReserva(id);
  }

  cambiarEstado(id: string, estado: string) {
    this.store.actualizarEstadoReserva(id, estado);
  }
}
