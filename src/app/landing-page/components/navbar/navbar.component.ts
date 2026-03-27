import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { ItemNavegacion } from '../../interfaces/NavItem.interface';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="fixed top-0 w-full z-50 transition-all duration-300"
      [class.shadow-soft]="estaDesplazado"
      [class.bg-white]="estaDesplazado"
      [class.bg-transparent]="!estaDesplazado"
    >
      <div class="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <!-- Logo -->
        <button
          type="button"
          class="text-xl font-bold tracking-tight text-on-surface cursor-pointer"
          (click)="desplazarAlInicio()"
          aria-label="Volver al inicio"
        >
          Turno<span class="text-on-surface-variant">Simple</span>
        </button>

        <!-- Nav Desktop -->
        <nav class="hidden md:flex items-center gap-8">
          <a
            *ngFor="let item of itemsNavegacion"
            [href]="item.enlace"
            (click)="alClickNavegacion($event, item.enlace)"
            class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-200"
          >
            {{ item.etiqueta }}
          </a>
        </nav>

        <!-- Botones Desktop -->
        <div class="hidden md:flex items-center gap-3">
          <button
            (click)="alIniciarSesion()"
            class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-200 px-4 py-2"
          >
            Iniciar sesión
          </button>
          <button
            (click)="alComenzarGratis()"
            class="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-all duration-200 active:scale-95"
          >
            Comenzar gratis
          </button>
        </div>

        <!-- Hamburguesa Mobile -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          (click)="alternarMenuMovil()"
          [attr.aria-expanded]="menuMovilAbierto"
          aria-controls="mobile-menu"
          aria-label="Menú"
        >
          <span
            class="block w-5 h-0.5 bg-on-surface transition-all duration-300"
            [class.rotate-45]="menuMovilAbierto"
            [class.translate-y-2]="menuMovilAbierto"
          ></span>
          <span
            class="block w-5 h-0.5 bg-on-surface transition-all duration-300"
            [class.opacity-0]="menuMovilAbierto"
          ></span>
          <span
            class="block w-5 h-0.5 bg-on-surface transition-all duration-300"
            [class.-rotate-45]="menuMovilAbierto"
            [class.-translate-y-2]="menuMovilAbierto"
          ></span>
        </button>
      </div>

      <!-- Menú Mobile -->
      <div
        *ngIf="menuMovilAbierto"
        id="mobile-menu"
        class="md:hidden bg-white border-t border-outline-subtle px-6 py-6 animate-slide-up"
      >
        <nav class="flex flex-col gap-4 mb-6">
          <a
            *ngFor="let item of itemsNavegacion"
            [href]="item.enlace"
            (click)="alClickNavegacion($event, item.enlace); cerrarMenuMovil()"
            class="text-base font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {{ item.etiqueta }}
          </a>
        </nav>
        <div class="flex flex-col gap-3">
          <button
            (click)="alIniciarSesion(); cerrarMenuMovil()"
            class="text-sm font-medium text-on-surface-variant hover:text-on-surface py-2"
          >
            Iniciar sesión
          </button>
          <button
            (click)="alComenzarGratis(); cerrarMenuMovil()"
            class="bg-primary text-on-primary py-3 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-all"
          >
            Comenzar gratis
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class NavbarComponent {
  private servicioLanding = inject(ServicioLanding);
  private idPlataforma = inject(PLATFORM_ID);

  estaDesplazado = false;
  menuMovilAbierto = false;

  itemsNavegacion: ItemNavegacion[] = [
    { etiqueta: 'Características', enlace: '#value' },
    { etiqueta: 'Cómo funciona', enlace: '#how-it-works' },
    { etiqueta: 'Precios', enlace: '#pricing' },
  ];

  @HostListener('window:scroll')
  alDesplazar() {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return;
    }

    this.estaDesplazado = window.scrollY > 20;
  }

  @HostListener('window:keydown.escape')
  alPresionarEscape() {
    this.cerrarMenuMovil();
  }

  alternarMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  cerrarMenuMovil() {
    this.menuMovilAbierto = false;
  }

  alIniciarSesion() {
    this.servicioLanding.manejarIniciarSesion();
  }

  alComenzarGratis() {
    this.servicioLanding.manejarComenzarGratis('navbar');
  }

  alClickNavegacion(evento: Event, enlace: string) {
    if (enlace.startsWith('#')) {
      evento.preventDefault();
      const idSeccion = enlace.substring(1);
      this.servicioLanding.desplazarASeccion(idSeccion);
    }
  }

  desplazarAlInicio() {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cerrarMenuMovil();
  }
}

