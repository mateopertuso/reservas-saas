import { FechaCalendario } from './CalendarDate.interface';

export interface Calendario {
  mes: string;
  diasSemana: string[];
  fechas: FechaCalendario[];
}
