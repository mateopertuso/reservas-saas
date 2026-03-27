import { Usuario } from './User.interface';

export interface EstadoAutenticacion {
  estaAutenticado: boolean;
  usuario: Usuario | null;
  token: string | null;
}
