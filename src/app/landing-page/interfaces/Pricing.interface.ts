import { Caracteristica } from './Feature.interface';

export interface Precio {
  insignia: string;
  titulo: string;
  subtitulo: string;
  precio: string;
  periodo: string;
  textoBoton: string;
  caracteristicas: Caracteristica[];
}
