import { Injectable, signal } from '@angular/core';
import { EmpresaApi } from '../services/empresa.api';

@Injectable({
  providedIn: 'root',
})
export class EmpresaStore {
  loading = signal(false);
  error = signal<string | null>(null);
  reservas = signal<any[]>([]);
  servicios = signal<any[]>([]);
  profesionalServicios = signal<any[]>([]);
  profesionales = signal<any[]>([]);
  disponibilidad = signal<any[]>([]);
  profesionalSeleccionadoDisponibilidad = signal<string | null>(null);
  errorDisponibilidad = signal<string | null>(null);
  contexto = signal<any | null>(null);
  agenda = signal<any[]>([]);
  sucursales = signal<any[]>([]);
  disponibilidadPorProfesional = signal<Record<string, any[]>>({});
  disponibilidadLoaded = signal(false);

  loadingSucursales = signal(false);
  errorSucursales = signal<string | null>(null);

  async cargarContexto() {
    try {
      const data = await EmpresaApi.getMiContexto();
      this.contexto.set(data);
    } catch (e) {
      console.error('Error cargando contexto', e);
    }
  }

  async cargarReservas() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await EmpresaApi.getReservas();
      this.reservas.set(data);
      console.log('RESERVAS DATA:', data);
    } catch (err: any) {
      this.error.set('No se pudieron cargar las reservas');
      this.reservas.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async cancelarReserva(id: string) {
    await EmpresaApi.cancelarReservaEmpresa(id);
    await this.cargarReservas();
  }

  async actualizarEstadoReserva(id: string, estado: string) {
    console.log('👉 cambiar estado', id, estado);

    try {
      this.reservas.update((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));

      await EmpresaApi.actualizarEstadoReserva(id, estado);

      console.log('✅ RPC OK');
    } catch (err) {
      console.error('❌ ERROR STORE', err);
      this.error.set('Error actualizando estado');
    }
  }
  async cargarServicios(empresaId: string) {
    this.loading.set(true);

    try {
      const data = await EmpresaApi.getServicios(empresaId);
      this.servicios.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  async crearServicio(payload: any, empresaId: string) {
    await EmpresaApi.crearServicio(payload);
    await this.cargarServicios(empresaId);
  }

  async eliminarServicio(id: string, empresaId: string) {
    await EmpresaApi.eliminarServicio(id);
    await this.cargarServicios(empresaId);
  }

  async cargarProfesionalServicios(empresaId: string) {
    const data = await EmpresaApi.getProfesionalServicios(empresaId);
    this.profesionalServicios.set(data);
  }

  async asignarServicio(
    profId: string,
    servId: string,
    duracion: number,
    precio: number,
    empresaId: string,
  ) {
    await EmpresaApi.upsertProfesionalServicio({
      profesionalId: profId,
      servicioId: servId,
      duracion,
      precio,
    });

    await this.cargarProfesionalServicios(empresaId);
  }

  async eliminarAsignacion(profId: string, servId: string, empresaId: string) {
    await EmpresaApi.eliminarProfesionalServicio(profId, servId);
    await this.cargarProfesionalServicios(empresaId);
  }

  async cargarProfesionales(empresaId: string) {
    const data = await EmpresaApi.getProfesionales(empresaId);
    this.profesionales.set(data ?? []);
  }

  async cargarDisponibilidad(profId: string) {
    this.profesionalSeleccionadoDisponibilidad.set(profId);

    const data = await EmpresaApi.getDisponibilidadProfesional(profId);
    this.disponibilidad.set(data);
  }

  async crearDisponibilidad(payload: any) {
    this.errorDisponibilidad.set(null);

    try {
      await EmpresaApi.crearDisponibilidad(payload);

      if (this.profesionalSeleccionadoDisponibilidad()) {
        await this.cargarDisponibilidad(this.profesionalSeleccionadoDisponibilidad()!);
      }
    } catch (err: any) {
      this.errorDisponibilidad.set(err?.message ?? 'Error al crear disponibilidad');
    }
  }

  async eliminarDisponibilidad(id: string) {
    this.errorDisponibilidad.set(null);

    try {
      await EmpresaApi.eliminarDisponibilidad(id);

      if (this.profesionalSeleccionadoDisponibilidad()) {
        await this.cargarDisponibilidad(this.profesionalSeleccionadoDisponibilidad()!);
      }
    } catch (err: any) {
      this.errorDisponibilidad.set(err?.message ?? 'Error al eliminar disponibilidad');
    }
  }

  async actualizarDisponibilidad(payload: any) {
    this.errorDisponibilidad.set(null);

    try {
      await EmpresaApi.actualizarDisponibilidad(payload);

      if (this.profesionalSeleccionadoDisponibilidad()) {
        await this.cargarDisponibilidad(this.profesionalSeleccionadoDisponibilidad()!);
      }
    } catch (err: any) {
      this.errorDisponibilidad.set(err?.message ?? 'Error al actualizar disponibilidad');
    }
  }

  async crearProfesional(nombre: string, sucursalId: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const id = await EmpresaApi.crearProfesional(nombre, sucursalId);

      return id;
    } catch (err: any) {
      console.error(err);
      this.error.set('No se pudo crear el profesional');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async crearUsuarioProfesional(payload: any) {
    this.loading.set(true);

    try {
      await EmpresaApi.crearUsuarioProfesional(payload);
      console.log('Usuario creado correctamente');
    } catch (e) {
      console.error(e);
      this.error.set('Error creando usuario');
    } finally {
      this.loading.set(false);
    }
  }

  async cargarAgenda(fecha: string) {
    this.loading.set(true);

    try {
      const data = await EmpresaApi.getAgendaDia(fecha);
      this.agenda.set(data ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async cargarDisponibilidadTodos(profesionales: any[]) {
    if (this.disponibilidadLoaded()) return;

    const result: Record<string, any[]> = {};

    for (const p of profesionales) {
      try {
        const data = await EmpresaApi.getDisponibilidadProfesional(p.id);
        result[p.id] = data ?? [];
      } catch {
        result[p.id] = [];
      }
    }

    this.disponibilidadPorProfesional.set(result);
    this.disponibilidadLoaded.set(true);
  }

  async cargarSucursales() {
    this.loadingSucursales.set(true);
    this.errorSucursales.set(null);

    try {
      const data = await EmpresaApi.getSucursales();
      this.sucursales.set(data);
    } catch (err) {
      this.errorSucursales.set('Error cargando sucursales');
      this.sucursales.set([]);
    } finally {
      this.loadingSucursales.set(false);
    }
  }

  async crearSucursal(data: {
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono?: string;
  }) {
    try {
      await EmpresaApi.crearSucursal(data);

      // 🔥 recargar lista
      await this.cargarSucursales();
    } catch (err) {
      console.error(err);
      this.errorSucursales.set('Error creando sucursal');
    }
  }
}
