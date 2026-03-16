export interface EmpresaAgenda {
  id: string;
  nombre: string;
  slug: string;
}

export interface ServicioAgenda {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface AgendaPublicaResponse {
  empresa: EmpresaAgenda | null;
  servicios: ServicioAgenda[];
  sucursales?: unknown[];
}
