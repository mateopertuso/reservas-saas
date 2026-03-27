import { Reserva } from './Booking.interface';
import { Calendario } from './Calendar.interface';
import { Servicio } from './Service.interface';
import { FranjaHoraria } from './TimeSlot.interface';

export interface MaquetaHero {
  servicio: Servicio;
  calendario: Calendario;
  franjasHorarias: FranjaHoraria[];
  reserva: Reserva;
}
