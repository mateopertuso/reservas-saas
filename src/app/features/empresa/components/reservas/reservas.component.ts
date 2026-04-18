import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaStore } from '../../state/empresa.store';
import { EmpresaApi } from '../../services/empresa.api';
import { DatePickerDirective } from '../../../../shared/directives/date-picker.directive';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../shared/components/app-select/app-select.component';

type ReservaEstado = 'pendiente' | 'confirmada' | 'cancelada';

type TimelineReservation = {
  id: string;
  fecha_hora: string;
  cliente_nombre: string;
  servicio_nombre: string;
  profesional_nombre?: string | null;
  profesional_id?: string | number | null;
  estado: ReservaEstado | string;
  duracion_min?: number | null;
  precio?: number | null;
  precio_total?: number | null;
  precio_final?: number | null;
  total?: number | null;
};

type WeekDay = {
  key: string;
  label: string;
  shortLabel: string;
  dayNumber: string;
  isToday: boolean;
  isSelected: boolean;
};

type ProfessionalLane = {
  id: string;
  name: string;
  reservations: TimelineReservation[];
};

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, DatePickerDirective, AppSelectComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css',
})
export class ReservasComponent {
  store = inject(EmpresaStore);

  fechaSeleccionada = signal<string | null>(new Date().toISOString().slice(0, 10));
  profesionalSeleccionado = signal<string | null>(null);
  selectedReservationId = signal<string | null>(null);
  agendaDayReservations = signal<any[]>([]);

  readonly dayStartHour = 7;
  readonly dayEndHour = 21;
  readonly slotMinutes = 60;
  readonly hourCount = this.dayEndHour - this.dayStartHour;
  readonly totalTimelineMinutes = this.hourCount * 60;

  profesionalesOptions = computed<SelectOption[]>(() =>
    this.store.profesionales().map((p) => ({ label: p.nombre, value: p.id })),
  );

  estadoOptions: SelectOption[] = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Confirmada', value: 'confirmada' },
    { label: 'Cancelada', value: 'cancelada' },
  ];

  readonly selectedDate = computed(() => this.fechaSeleccionada() ?? this.todayKey());

  readonly reservasFiltradas = computed(() => {
    const reservas = this.store.reservas() as TimelineReservation[];

    const prioridadEstado: Record<string, number> = {
      pendiente: 0,
      confirmada: 1,
      cancelada: 2,
    };

    return reservas
      .map((reservation) => ({
        ...reservation,
        precio:
          reservation.precio ??
          reservation.precio_total ??
          reservation.precio_final ??
          reservation.total ??
          null,
      }))
      .filter((r) => {
        const matchFecha = this.toDateKey(r.fecha_hora) === this.selectedDate();
        const matchProfesional = this.profesionalSeleccionado()
          ? String(r.profesional_id) === String(this.profesionalSeleccionado())
          : true;

        return matchFecha && matchProfesional;
      })
      .sort((a, b) => {
        const estadoDiff =
          (prioridadEstado[a.estado] ?? 9) - (prioridadEstado[b.estado] ?? 9);

        if (estadoDiff !== 0) return estadoDiff;

        return new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime();
      });
  });

  readonly weekDays = computed<WeekDay[]>(() => {
    const selected = this.parseLocalDate(this.selectedDate());
    const start = this.startOfWeek(selected);

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);

      const key = this.formatDateKey(day);

      return {
        key,
        label: new Intl.DateTimeFormat('es-UY', { weekday: 'long' }).format(day),
        shortLabel: new Intl.DateTimeFormat('es-UY', { weekday: 'short' }).format(day),
        dayNumber: new Intl.DateTimeFormat('es-UY', { day: '2-digit' }).format(day),
        isToday: key === this.todayKey(),
        isSelected: key === this.selectedDate(),
      };
    });
  });

  readonly timeLabels = computed(() =>
    Array.from({ length: this.hourCount + 1 }, (_, index) => {
      const hour = this.dayStartHour + index;
      return `${String(hour).padStart(2, '0')}:00`;
    }),
  );

  readonly professionalLanes = computed<ProfessionalLane[]>(() => {
    const filteredProfessionals = this.store.profesionales().filter((p) =>
      this.profesionalSeleccionado() ? String(p.id) === String(this.profesionalSeleccionado()) : true,
    );

    const reservations = this.reservasFiltradas();
    const map = new Map<string, ProfessionalLane>();

    for (const professional of filteredProfessionals) {
      map.set(String(professional.id), {
        id: String(professional.id),
        name: professional.nombre,
        reservations: [],
      });
    }

    for (const reservation of reservations) {
      const key = reservation.profesional_id
        ? String(reservation.profesional_id)
        : reservation.profesional_nombre || 'sin-profesional';

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: reservation.profesional_nombre || 'Sin asignar',
          reservations: [],
        });
      }

      map.get(key)!.reservations.push(reservation);
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  });

  readonly selectedReservation = computed<TimelineReservation | null>(() => {
    const id = this.selectedReservationId();
    if (!id) return null;
    const reservation = this.reservasFiltradas().find((item) => item.id === id) ?? null;
    if (!reservation) return null;

    const agendaReservation = this.findAgendaReservation(reservation);

    return agendaReservation
      ? {
          ...reservation,
          precio: agendaReservation.precio ?? reservation.precio ?? null,
        }
      : reservation;
  });

  constructor() {
    effect(() => {
      const dateKey = this.selectedDate();
      void this.loadAgendaDayPrices(dateKey);
    });
  }

  previousDay() {
    this.shiftSelectedDay(-1);
  }

  nextDay() {
    this.shiftSelectedDay(1);
  }

  selectDay(dateKey: string | null) {
    if (!dateKey) return;
    this.fechaSeleccionada.set(dateKey);
    this.selectedReservationId.set(null);
  }

  openReservation(reservationId: string) {
    this.selectedReservationId.set(reservationId);
  }

  closeReservation() {
    this.selectedReservationId.set(null);
  }

  cancelar(id: string) {
    this.store.cancelarReserva(id);
  }

  cambiarEstado(id: string, estado: string) {
    this.store.actualizarEstadoReserva(id, estado);
  }

  timelineCardStyle(reserva: TimelineReservation) {
    const startMinutes = this.minutesFromTimelineStart(reserva.fecha_hora);
    const duration = this.getReservationDuration(reserva);
    const rawTop = (startMinutes / this.totalTimelineMinutes) * 100;
    const rawHeight = (duration / this.totalTimelineMinutes) * 100;
    const top = rawTop + 0.35;
    const height = Math.max(rawHeight - 0.7, 5.2);

    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  }

  reservationStateClass(estado: string) {
    return {
      'timeline-card__status--pendiente': estado === 'pendiente',
      'timeline-card__status--confirmada': estado === 'confirmada',
      'timeline-card__status--cancelada': estado === 'cancelada',
    };
  }

  hasReservationsForHour(lane: ProfessionalLane, hourOffset: number) {
    const hourStart = this.dayStartHour * 60 + hourOffset * 60;
    const hourEnd = hourStart + 60;

    return lane.reservations.some((reservation) => {
      const start = this.toMinutes(reservation.fecha_hora);
      const end = start + this.getReservationDuration(reservation);

      return start < hourEnd && end > hourStart;
    });
  }

  private shiftSelectedDay(days: number) {
    const next = this.parseLocalDate(this.selectedDate());
    next.setDate(next.getDate() + days);
    this.fechaSeleccionada.set(this.formatDateKey(next));
  }

  private getReservationDuration(reservation: TimelineReservation) {
    return reservation.duracion_min && reservation.duracion_min > 0 ? reservation.duracion_min : 60;
  }

  private minutesFromTimelineStart(dateValue: string) {
    const minutes = this.toMinutes(dateValue);
    return Math.max(0, minutes - this.dayStartHour * 60);
  }

  private toMinutes(dateValue: string) {
    const date = new Date(dateValue);
    return date.getHours() * 60 + date.getMinutes();
  }

  private toDateKey(dateValue: string) {
    return new Date(dateValue).toISOString().slice(0, 10);
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

  private async loadAgendaDayPrices(dateKey: string) {
    try {
      const data = await EmpresaApi.getAgendaDia(dateKey);
      this.agendaDayReservations.set(data ?? []);
    } catch {
      this.agendaDayReservations.set([]);
    }
  }

  private findAgendaReservation(reservation: TimelineReservation) {
    const agendaReservations = this.agendaDayReservations();

    return (
      agendaReservations.find((item) => String(item.id) === String(reservation.id)) ??
      agendaReservations.find((item) => {
        const sameDateTime = item.fecha_hora === reservation.fecha_hora;
        const sameClient = item.cliente_nombre === reservation.cliente_nombre;
        const sameService = item.servicio_nombre === reservation.servicio_nombre;
        const sameProfessional =
          (item.profesional_nombre ?? null) === (reservation.profesional_nombre ?? null);

        return sameDateTime && sameClient && sameService && sameProfessional;
      }) ??
      null
    );
  }
}
