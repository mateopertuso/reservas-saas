import { Injectable, signal } from '@angular/core';
import { PublicAgendaApi } from './public-agenda.api';

@Injectable({
  providedIn: 'root',
})
export class AgendaStore {
  loading = signal(false);
  error = signal<string | null>(null);

  empresa = signal<any | null>(null);
  servicios = signal<any[]>([]);

  servicioSeleccionado = signal<any | null>(null);
  profesionales = signal<any[]>([]);

  profesionalSeleccionado = signal<any | null>(null);

  diasDisponibles = signal<string[]>([]);
  mesActual = signal<string | null>(null);
  horarios = signal<string[]>([]);

  fechaSeleccionada = signal<string | null>(null);

  horarioSeleccionado = signal<string | null>(null);
  sucursalSeleccionada = signal<any | null>(null);

  async cargarAgenda(slug: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await PublicAgendaApi.getAgenda(slug);

      const agenda = Array.isArray(data) ? data[0] : data;

      this.empresa.set(agenda?.empresa ?? null);
      this.servicios.set(agenda?.servicios ?? []);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al cargar la agenda');
    } finally {
      this.loading.set(false);
    }
  }

  async seleccionarServicio(servicio: any) {
    this.servicioSeleccionado.set(servicio);

    const profesionales = await PublicAgendaApi.getProfesionalesServicio(servicio.id);
    console.log('PROFESIONALES RPC', profesionales);
    this.profesionales.set(profesionales ?? []);
    this.horarios.set([]);
  }

  async seleccionarProfesional(profesional: any) {
    this.profesionalSeleccionado.set(profesional);

    // limpiar estado anterior
    this.diasDisponibles.set([]);
    this.horarios.set([]);
    this.fechaSeleccionada.set(null);

    const hoy = new Date();

    const mes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`;

    await this.cargarDiasDisponibles(mes);
  }

  async cargarDiasDisponibles(mes: string) {
    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();

    if (!profesional || !servicio) return;

    const dias = await PublicAgendaApi.getDiasDisponibles(profesional.id, servicio.id, mes);

    console.log('DIAS DISPONIBLES', dias);
    console.log('PARAMS DIAS', profesional.id, servicio.id, mes);

    this.mesActual.set(mes);
    this.diasDisponibles.set(dias ?? []);
  }

  async seleccionarDia(fecha: string) {
    console.log('CLICK DIA', fecha);

    this.fechaSeleccionada.set(fecha);

    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();

    if (!profesional || !servicio) return;

    const horarios = await PublicAgendaApi.getDisponibilidad(profesional.id, servicio.id, fecha);

    console.log('HORARIOS RPC', horarios);

    this.horarios.set(horarios ?? []);
  }

  async seleccionarHorario(horario: any) {
    this.horarioSeleccionado.set(horario);
  }

  async crearReserva(nombre: string, email: string, telefono: string) {
    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();
    const fechaHora = this.horarioSeleccionado();

    if (!profesional || !servicio || !fechaHora) return;

    const reserva = await PublicAgendaApi.crearReserva({
      nombre,
      email,
      telefono,
      profesionalId: profesional.id,
      servicioId: servicio.id,
      fechaHora,
    });

    console.log('RESERVA CREADA', reserva);
  }
}
