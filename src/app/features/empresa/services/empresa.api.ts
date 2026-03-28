import { supabase } from '../../../core/supabase/supabase.client';

export class EmpresaApi {
  static async getReservas(empresaId: string) {
    const { data, error } = await supabase.rpc('get_reservas_empresa', {
      p_empresa: empresaId,
    });

    if (error) {
      console.error('GET RESERVAS EMPRESA', error);
      return [];
    }

    return data ?? [];
  }

  static async cancelarReservaEmpresa(id: string) {
    const { error } = await supabase.rpc('cancelar_reserva_empresa', {
      p_reserva: id,
    });

    if (error) throw error;
  }

  static async getServicios(empresaId: string) {
    const { data, error } = await supabase.rpc('get_servicios_empresa', {
      p_empresa: empresaId,
    });

    if (error) {
      console.error(error);
      return [];
    }

    return data ?? [];
  }

  static async crearServicio(payload: any) {
    const { error } = await supabase.rpc('crear_servicio', {
      p_nombre: payload.nombre,
      p_sucursal: payload.sucursalId,
    });

    if (error) throw error;
  }

  static async eliminarServicio(id: string) {
    const { error } = await supabase.rpc('eliminar_servicio', {
      p_id: id,
    });

    if (error) throw error;
  }

  static async getProfesionalServicios(empresaId: string) {
    const { data, error } = await supabase.rpc('get_profesional_servicios', {
      p_empresa: empresaId,
    });

    if (error) {
      console.error(error);
      return [];
    }

    return data ?? [];
  }

  static async upsertProfesionalServicio(payload: any) {
    const { error } = await supabase.rpc('upsert_profesional_servicio', {
      p_profesional: payload.profesionalId,
      p_servicio: payload.servicioId,
      p_duracion: payload.duracion,
    });

    if (error) throw error;
  }

  static async eliminarProfesionalServicio(profId: string, servId: string) {
    const { error } = await supabase.rpc('eliminar_profesional_servicio', {
      p_profesional: profId,
      p_servicio: servId,
    });

    if (error) throw error;
  }

  static async getProfesionales(empresaId: string) {
    const { data, error } = await supabase.rpc('get_profesionales_empresa', {
      p_empresa: empresaId,
    });

    if (error) {
      console.error(error);
      return [];
    }

    return data ?? [];
  }

  static async getDisponibilidadProfesional(profId: string) {
    const { data, error } = await supabase.rpc('get_disponibilidad_profesional', {
      p_profesional: profId,
    });

    if (error) {
      console.error(error);
      return [];
    }

    return data ?? [];
  }

  static async crearDisponibilidad(payload: any) {
    const { error } = await supabase.rpc('crear_disponibilidad', {
      p_profesional: payload.profesionalId,
      p_fecha: payload.fecha,
      p_inicio: payload.inicio,
      p_fin: payload.fin,
    });

    if (error) throw error;
  }

  static async eliminarDisponibilidad(id: string) {
    const { error } = await supabase.rpc('eliminar_disponibilidad', {
      p_id: id,
    });

    if (error) throw error;
  }

  static async actualizarDisponibilidad(payload: any) {
    const { error } = await supabase.rpc('actualizar_disponibilidad', {
      p_id: payload.id,
      p_fecha: payload.fecha,
      p_inicio: payload.inicio,
      p_fin: payload.fin,
    });

    if (error) throw error;
  }
}
