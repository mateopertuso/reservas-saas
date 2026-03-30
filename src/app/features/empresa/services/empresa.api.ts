import { supabase } from '../../../core/supabase/supabase.client';

export class EmpresaApi {
  static async getReservas() {
    const { data, error } = await supabase.rpc('get_mis_reservas');

    if (error) {
      console.error('GET RESERVAS EMPRESA', error);
      throw error;
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
      p_precio: payload.precio,
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

  static async crearProfesional(nombre: string, sucursalId: string) {
    const { data, error } = await supabase.rpc('crear_profesional_empresa', {
      p_nombre: nombre,
      p_sucursal: sucursalId,
    });

    if (error) {
      console.error('CREAR PROFESIONAL', error);
      throw error;
    }

    return data;
  }

  static async getSucursales() {
    const { data, error } = await supabase.rpc('get_sucursales_mias');

    if (error) throw error;

    return data;
  }

  static async crearUsuarioProfesional(data: any) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.access_token) throw new Error('No hay sesion activa para invocar la funcion');

    const { data: result, error } = await supabase.functions.invoke('create-user-professional', {
      body: data,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('🔥 EDGE ERROR:', error);
      console.error('🔥 MESSAGE:', error.message);
      console.error('🔥 FULL:', JSON.stringify(error, null, 2));

      if ((error as any).context) {
        console.error('🔥 CONTEXT:', (error as any).context);
      }

      throw error;
    }

    return result;
  }

  static async getMiContexto() {
    const { data, error } = await supabase.rpc('get_mi_contexto');

    if (error) throw error;

    return data;
  }

  static async getAgendaDia(fecha: string) {
    const { data, error } = await supabase.rpc('get_agenda_dia', {
      p_fecha: fecha,
    });

    if (error) throw error;

    return data;
  }
}
