import { supabase } from '../../../core/supabase/supabase.client';

export class PublicAgendaApi {
  static async getAgenda(slug: string) {
    const { data, error } = await supabase.rpc('get_agenda_publica', {
      p_slug: slug,
    });

    console.log('AGENDA RCP', data, error);

    if (error) {
      throw error;
    }

    return data;
  }

  static async getProfesionalesServicio(servicioId: string) {
    const { data, error } = await supabase.rpc('get_profesionales_servicio', {
      p_servicio: servicioId,
    });

    if (error) throw error;

    return data;
  }

  static async getDiasDisponibles(profesionalId: string, servicioId: string, mes: string) {
    const { data, error } = await supabase.rpc('get_dias_disponibles', {
      p_profesional: profesionalId,
      p_servicio: servicioId,
      p_mes: mes,
    });

    console.log('RPC DIAS RAW', { data, error, profesionalId, servicioId, mes });

    if (error) {
      console.error(error);
      return [];
    }

    return data?.map((d: any) => d.dia) ?? [];
  }

  static async getDisponibilidad(profesionalId: string, servicioId: string, fecha: string) {
    const { data, error } = await supabase.rpc('get_disponibilidad', {
      p_profesional: profesionalId,
      p_servicio: servicioId,
      p_fecha: fecha,
    });

    console.log('DISPONIBILIDAD RAW', { data, error });

    if (error) {
      console.error(error);
      return [];
    }

    return data?.map((h: any) => h.slot_inicio) ?? [];
  }

  static async crearReserva(data: any) {
    const { data: result, error } = await supabase.rpc('crear_reserva_publica', {
      p_nombre: data.nombre,
      p_email: data.email,
      p_telefono: data.telefono,
      p_profesional: data.profesionalId,
      p_servicio: data.servicioId,
      p_fecha: data.fechaHora,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return result;
  }
}
