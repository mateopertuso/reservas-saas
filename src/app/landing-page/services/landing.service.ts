import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

type PropiedadesAnalitica = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class ServicioLanding {
  private readonly documento = inject(DOCUMENT);
  private readonly idPlataforma = inject(PLATFORM_ID);

  private clicksCtaSujeto = new BehaviorSubject<number>(0);
  public clicksCta$: Observable<number> = this.clicksCtaSujeto.asObservable();

  constructor(private enrutador: Router) {}

  manejarComenzarGratis(origen: string): void {
    this.registrarEvento('comenzar_gratis', { origen });
    this.clicksCtaSujeto.next(this.clicksCtaSujeto.value + 1);

    this.navegarARutaOAlternativa('/signup', {
      parametrosConsulta: { origen },
      idSeccionAlternativa: 'cta',
    });
  }

  manejarIniciarSesion(): void {
    this.registrarEvento('intento_inicio_sesion', {});

    this.navegarARutaOAlternativa('/login', {
      idSeccionAlternativa: 'cta',
    });
  }

  manejarVerDemo(): void {
    this.registrarEvento('ver_demo', {});
    this.desplazarASeccion('how-it-works');
  }

  manejarIniciarPlan(nombrePlan: string = 'standard'): void {
    this.registrarEvento('iniciar_plan', { plan: nombrePlan });

    this.navegarARutaOAlternativa('/signup', {
      parametrosConsulta: {
        plan: nombrePlan,
        trial: true,
      },
      idSeccionAlternativa: 'pricing',
    });
  }

  obtenerClicksCta(): number {
    return this.clicksCtaSujeto.value;
  }

  desplazarASeccion(idSeccion: string): void {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return;
    }

    const elemento = this.documento.getElementById(idSeccion);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  private navegarARutaOAlternativa(
    ruta: string,
    opciones: {
      parametrosConsulta?: PropiedadesAnalitica;
      idSeccionAlternativa: string;
    },
  ): void {
    if (this.existeRutaDePrimerNivel(ruta)) {
      this.enrutador.navigate([ruta], { queryParams: opciones.parametrosConsulta });
      return;
    }

    this.registrarEvento('ruta_faltante_alternativa', {
      ruta,
      idSeccionAlternativa: opciones.idSeccionAlternativa,
    });
    this.desplazarASeccion(opciones.idSeccionAlternativa);
  }

  private existeRutaDePrimerNivel(ruta: string): boolean {
    const rutaNormalizada = ruta.replace(/^\//, '');
    return this.enrutador.config.some((definicionRuta) => definicionRuta.path === rutaNormalizada);
  }

  private registrarEvento(nombreEvento: string, propiedades: PropiedadesAnalitica): void {
    console.log('Evento registrado:', nombreEvento, propiedades);
  }
}

