import { computed, effect, Injectable, signal } from '@angular/core';
import { PublicAgendaApi } from './public-agenda.api';

@Injectable({
  providedIn: 'root',
})
export class AgendaStore {
  loading = signal(false);
  error = signal<string | null>(null);

  empresa = signal<any | null>(null);
  sucursales = signal<any[]>([]);
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

  reservaCreada = signal<boolean>(false);

  constructor() {
    effect(() => {
      const sucursal = this.sucursalSeleccionada();

      if (!sucursal) return;

      console.log('Sucursal cambió → limpiando flujo');

      this.servicioSeleccionado.set(null);
      this.profesionalSeleccionado.set(null);
      this.horarios.set([]);
    });
  }

  async cargarAgenda(slug: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await PublicAgendaApi.getAgenda(slug);

      const agenda = Array.isArray(data) ? data[0] : data;

      this.empresa.set(agenda?.empresa ?? null);
      this.sucursales.set(agenda?.sucursales ?? []);
      this.servicios.set(agenda?.servicios ?? []);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al cargar la agenda');
    } finally {
      this.loading.set(false);
    }
  }

  seleccionarSucursal(sucursal: any) {
    this.sucursalSeleccionada.set(sucursal);

    // limpio todo lo que depende de sucursal
    this.servicioSeleccionado.set(null);
    this.profesionalSeleccionado.set(null);
    this.diasDisponibles.set([]);
    this.horarios.set([]);
    this.fechaSeleccionada.set(null);
    this.horarioSeleccionado.set(null);
  }

  async seleccionarServicio(servicio: any) {
    this.servicioSeleccionado.set(servicio);

    // limpiar inmediatamente
    this.profesionales.set([]);
    this.profesionalSeleccionado.set(null);
    this.diasDisponibles.set([]);
    this.horarios.set([]);
    this.fechaSeleccionada.set(null);
    this.horarioSeleccionado.set(null);

    this.loading.set(true);

    try {
      const profesionales = await PublicAgendaApi.getProfesionalesServicio(servicio.id);
      this.profesionales.set(profesionales ?? []);
    } catch {
      this.profesionales.set([]);
    } finally {
      this.loading.set(false);
    }
  }
  async seleccionarProfesional(profesional: any) {
    this.profesionalSeleccionado.set(profesional);

    // limpiar estado anterior
    this.diasDisponibles.set([]);
    this.horarios.set([]);
    this.fechaSeleccionada.set(null);

    const hoy = new Date();

    const mes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`;

    this.loading.set(true);
    await this.cargarDiasDisponibles(mes);
    this.loading.set(false);
  }

  async cargarDiasDisponibles(mes: string) {
    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();

    if (!profesional || !servicio) return;

    const dias = await PublicAgendaApi.getDiasDisponibles(profesional.id, servicio.id, mes);

    this.mesActual.set(mes);
    this.diasDisponibles.set(dias ?? []);
  }

  async seleccionarDia(fecha: string) {
    this.fechaSeleccionada.set(fecha);

    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();

    if (!profesional || !servicio) return;

    this.loading.set(true);

    try {
      const horarios = await PublicAgendaApi.getDisponibilidad(profesional.id, servicio.id, fecha);

      this.horarios.set(horarios ?? []);
    } catch {
      this.horarios.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async seleccionarHorario(horario: any) {
    this.horarioSeleccionado.set(horario);
  }

  async crearReserva(nombre: string, email: string, telefono: string) {
    const profesional = this.profesionalSeleccionado();
    const servicio = this.servicioSeleccionado();
    const fechaHora = this.horarioSeleccionado();

    if (!profesional || !servicio || !fechaHora) return;

    try {
      this.loading.set(true);

      await PublicAgendaApi.crearReserva({
        nombre,
        email,
        telefono,
        profesionalId: profesional.id,
        servicioId: servicio.id,
        fechaHora,
      });

      this.reservaCreada.set(true);
    } catch (err: any) {
      this.error.set('No se pudo crear la reserva');
    } finally {
      this.loading.set(false);
    }
  }

  serviciosFiltrados = computed(() => {
    const servicios = this.servicios();
    const sucursal = this.sucursalSeleccionada();

    if (!sucursal) return servicios;

    return servicios.filter((s) => s.sucursal_id === sucursal.id);
  });
}
