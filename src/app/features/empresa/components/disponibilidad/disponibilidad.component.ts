import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaApi } from '../../services/empresa.api';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../shared/components/app-select/app-select.component';

type DisponibilidadItem = {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
};

type WeekDayColumn = {
  key: string;
  label: string;
  shortLabel: string;
  dateNumber: string;
  fullDate: string;
  isToday: boolean;
  isSelected: boolean;
  entries: DisponibilidadItem[];
};

@Component({
  standalone: true,
  selector: 'app-disponibilidad',
  imports: [CommonModule, FormsModule, AppSelectComponent],
  templateUrl: './disponibilidad.component.html',
  styleUrl: './disponibilidad.component.css',
})
export class DisponibilidadComponent implements OnInit {
  store = inject(EmpresaStore);
  selectedOwnerProfessionalId = signal('');
  selectedDate = signal(this.todayKey());
  feedback = signal<{ type: 'success' | 'error'; message: string; detail?: string } | null>(null);

  profesionalId = '';
  fecha = '';
  inicio = '';
  fin = '';

  editandoId: string | null = null;

  editFecha = '';
  editInicio = '';
  editFin = '';

  profesionalesOptions = computed<SelectOption[]>(() =>
    this.store.profesionales().map((p) => ({ label: p.nombre, value: p.id })),
  );

  ngOnInit() {
    const contexto = this.store.contexto();

    if (contexto?.rol === 'professional') {
      this.profesionalId = contexto.profesional_id;
      this.store.cargarDisponibilidad(contexto.profesional_id);
    } else {
      const firstProfessional = this.store.profesionales()[0];

      if (firstProfessional) {
        this.selectedOwnerProfessionalId.set(String(firstProfessional.id));
        this.profesionalId = String(firstProfessional.id);
      }
    }
  }

  get disponibilidadPorProfesional() {
    return this.store.disponibilidadPorProfesional();
  }

  ownerSelectedProfessional = computed(() => {
    const id = this.selectedOwnerProfessionalId();
    return this.store.profesionales().find((p) => String(p.id) === id) ?? null;
  });

  currentAvailability = computed<DisponibilidadItem[]>(() => {
    if (this.store.contexto()?.rol === 'professional') {
      return (this.store.disponibilidad() ?? []) as DisponibilidadItem[];
    }

    const id = this.selectedOwnerProfessionalId();
    if (!id) return [];

    return (this.disponibilidadPorProfesional[id] ?? []) as DisponibilidadItem[];
  });

  weekColumns = computed<WeekDayColumn[]>(() => {
    const entries = [...this.currentAvailability()].sort((a, b) => {
      const dateDiff = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
    const start = this.startOfWeek(this.parseLocalDate(this.selectedDate()));

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = this.formatDateKey(day);

      return {
        key,
        label: new Intl.DateTimeFormat('es-UY', { weekday: 'long' }).format(day),
        shortLabel: new Intl.DateTimeFormat('es-UY', { weekday: 'short' }).format(day),
        dateNumber: new Intl.DateTimeFormat('es-UY', { day: '2-digit' }).format(day),
        fullDate: new Intl.DateTimeFormat('es-UY', {
          day: '2-digit',
          month: 'short',
        }).format(day),
        isToday: key === this.todayKey(),
        isSelected: key === this.selectedDate(),
        entries: entries.filter((entry) => entry.fecha === key),
      };
    });
  });

  selectedDayEntries = computed(() => {
    const key = this.selectedDate();
    return [...this.currentAvailability()]
      .filter((entry) => entry.fecha === key)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  });

  selectedDayLabel = computed(() => {
    const date = this.parseLocalDate(this.selectedDate());
    return new Intl.DateTimeFormat('es-UY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  });

  selectedProfessionalName() {
    if (this.store.contexto()?.rol === 'professional') {
      return this.store.contexto()?.nombre ?? 'Mi disponibilidad';
    }

    return this.ownerSelectedProfessional()?.nombre ?? 'Seleccionar profesional';
  }

  selectOwnerProfessional(id: string) {
    this.selectedOwnerProfessionalId.set(id);
    this.profesionalId = id;
  }

  formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('es-UY', {
      day: '2-digit',
      month: 'short',
    });
  }

  isRangeInvalid(inicio: string, fin: string) {
    return Boolean(inicio && fin && inicio >= fin);
  }

  previousWeek() {
    const next = this.parseLocalDate(this.selectedDate());
    next.setDate(next.getDate() - 7);
    this.selectedDate.set(this.formatDateKey(next));
  }

  nextWeek() {
    const next = this.parseLocalDate(this.selectedDate());
    next.setDate(next.getDate() + 7);
    this.selectedDate.set(this.formatDateKey(next));
  }

  selectDate(dateKey: string) {
    this.selectedDate.set(dateKey);
  }

  weekRangeLabel() {
    const days = this.weekColumns();
    if (!days.length) return '';

    const first = this.parseLocalDate(days[0].key);
    const last = this.parseLocalDate(days[6].key);
    const firstLabel = new Intl.DateTimeFormat('es-UY', {
      day: 'numeric',
      month: 'short',
    }).format(first);
    const lastLabel = new Intl.DateTimeFormat('es-UY', {
      day: 'numeric',
      month: 'short',
    }).format(last);

    return `${firstLabel} - ${lastLabel}`;
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

  async guardar(id: string) {
    await this.store.actualizarDisponibilidad({
      id,
      fecha: this.editFecha,
      inicio: this.editInicio,
      fin: this.editFin,
    });

    if (!this.store.errorDisponibilidad()) {
      await this.refreshCurrentAvailability();
      this.editandoId = null;
      this.selectDate(this.editFecha);
      this.showFeedback(
        'success',
        'Franja actualizada',
        `${this.formatDate(this.editFecha)} · ${this.editInicio} - ${this.editFin}`,
      );
      return;
    }

    this.showFeedback('error', 'No se pudo actualizar la franja');
  }

  async crear() {
    if (!this.fecha) return;

    const contexto = this.store.contexto();

    const profesionalId =
      contexto?.rol === 'professional' ? contexto.profesional_id : this.profesionalId;

    if (!profesionalId) return;
    if (this.isRangeInvalid(this.inicio, this.fin)) return;

    const fechaCreada = this.fecha;
    const inicioCreado = this.inicio;
    const finCreado = this.fin;

    await this.store.crearDisponibilidad({
      profesionalId,
      fecha: this.fecha,
      inicio: this.inicio,
      fin: this.fin,
    });

    if (!this.store.errorDisponibilidad()) {
      await this.refreshCurrentAvailability();
      this.selectDate(fechaCreada);
      this.fecha = '';
      this.inicio = '';
      this.fin = '';

      this.showFeedback(
        'success',
        'Franja agregada',
        `${this.formatDate(fechaCreada)} · ${inicioCreado} - ${finCreado}`,
      );
      return;
    }

    this.showFeedback('error', 'No se pudo agregar la franja');
  }

  async eliminar(id: string) {
    await this.store.eliminarDisponibilidad(id);

    if (!this.store.errorDisponibilidad()) {
      await this.refreshCurrentAvailability();
      this.showFeedback('success', 'Franja eliminada');
      return;
    }

    this.showFeedback('error', 'No se pudo eliminar la franja');
  }

  private todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  private parseLocalDate(dateKey: string) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private startOfWeek(date: Date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private showFeedback(type: 'success' | 'error', message: string, detail?: string) {
    this.feedback.set({ type, message, detail });
    window.setTimeout(() => {
      if (this.feedback()?.message === message) {
        this.feedback.set(null);
      }
    }, 3200);
  }

  private async refreshCurrentAvailability() {
    const contexto = this.store.contexto();

    if (contexto?.rol === 'professional') {
      await this.store.cargarDisponibilidad(contexto.profesional_id);
      return;
    }

    const professionalId = this.selectedOwnerProfessionalId();
    if (!professionalId) return;

    const data = await EmpresaApi.getDisponibilidadProfesional(professionalId);

    this.store.disponibilidadPorProfesional.update((current) => ({
      ...current,
      [professionalId]: data ?? [],
    }));
  }
}
