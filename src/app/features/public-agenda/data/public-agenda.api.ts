import { supabase } from '../../../core/supabase/supabase.client';
import { safeRpc } from '../../../core/supabase/supabase-safe';

export class PublicAgendaApi {
  static async getAgenda(slug: string) {
    return await safeRpc(() =>
      supabase.rpc('get_agenda_publica', {
        p_slug: slug,
      }),
    );
  }

  static async getProfesionalesServicio(servicioId: string) {
    return await safeRpc(() =>
      supabase.rpc('get_profesionales_servicio', {
        p_servicio: servicioId,
      }),
    );
  }

  static async getDiasDisponibles(profesionalId: string, servicioId: string, mes: string) {
    const data = await safeRpc(() =>
      supabase.rpc('get_dias_disponibles', {
        p_profesional: profesionalId,
        p_servicio: servicioId,
        p_mes: mes,
      }),
    );

    console.log('RPC DIAS RAW', { data, profesionalId, servicioId, mes });

    return data?.map((d: any) => d.dia) ?? [];
  }

  static async getDisponibilidad(profesionalId: string, servicioId: string, fecha: string) {
    const data = await safeRpc(() =>
      supabase.rpc('get_disponibilidad', {
        p_profesional: profesionalId,
        p_servicio: servicioId,
        p_fecha: fecha,
      }),
    );

    console.log('DISPONIBILIDAD RAW', { data });

    return data?.map((h: any) => h.slot_inicio) ?? [];
  }

  static async crearReserva(data: any) {
    return await safeRpc(() =>
      supabase.rpc('crear_reserva_publica', {
        p_nombre: data.nombre,
        p_email: data.email,
        p_telefono: data.telefono,
        p_profesional: data.profesionalId,
        p_servicio: data.servicioId,
        p_fecha: data.fechaHora,
      }),
    );
  }
}
