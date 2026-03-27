import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaquetaHero } from '../../interfaces/HeroMockup.interface';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-6xl mx-auto px-6 text-center pb-24 md:pb-32">
      <!-- Badge -->
      <div class="animate-fade-in mb-6">
        <span
          class="inline-flex items-center gap-2 bg-surface-container-high text-on-surface-variant text-xs font-semibold px-4 py-1.5 rounded-full"
        >
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Más de 500 profesionales ya lo usan
        </span>
      </div>

      <!-- Título -->
      <h1
        class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-on-surface mb-6 max-w-4xl mx-auto leading-[1.1] animate-slide-up"
      >
        Gestioná tus turnos
        <span class="text-on-surface-variant">sin complicaciones</span>
      </h1>

      <!-- Subtítulo -->
      <p
        class="text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl mx-auto leading-relaxed animate-slide-up delay-100"
      >
        Tus clientes reservan online. Vos dejás de coordinar por mensajes.
      </p>

      <!-- CTAs -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-up delay-200"
      >
        <button
          (click)="alProbarGratis()"
          class="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary-hover transition-all duration-200 active:scale-95 shadow-elevated"
        >
          Probar gratis ->
        </button>
        <button
          (click)="alVerDemo()"
          class="w-full sm:w-auto bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-semibold text-base hover:bg-surface-container-highest transition-all duration-200 active:scale-95"
        >
          Ver cómo funciona
        </button>
      </div>

      <!-- Mockup de UI -->
      <div class="relative max-w-4xl mx-auto animate-scale-in delay-300">
        <div
          class="bg-white rounded-2xl shadow-hero border border-outline-subtle p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8"
        >
          <!-- Lado izquierdo: Servicio + Calendario -->
          <div class="w-full md:w-2/5 text-left">
            <div class="mb-6">
              <h3 class="text-base font-bold text-on-surface mb-1">
                {{ maqueta.servicio.nombre }}
              </h3>
              <p class="text-sm text-on-surface-variant">
                {{ maqueta.servicio.duracion }} · {{ maqueta.servicio.precio }}
              </p>
            </div>

            <div>
              <div
                class="uppercase tracking-widest text-[11px] font-semibold text-on-surface-variant mb-3"
              >
                {{ maqueta.calendario.mes }}
              </div>

              <div class="grid grid-cols-7 gap-1 text-center text-xs">
                <div
                  *ngFor="let dia of maqueta.calendario.diasSemana"
                  class="p-1.5 text-on-surface-variant font-medium"
                >
                  {{ dia }}
                </div>

                <div
                  *ngFor="let fecha of maqueta.calendario.fechas"
                  [ngClass]="{
                    'bg-primary text-on-primary font-bold': fecha.seleccionado,
                    'hover:bg-surface-container-high text-on-surface': !fecha.seleccionado,
                  }"
                  class="p-1.5 rounded-full cursor-pointer transition-colors duration-150 text-sm"
                >
                  {{ fecha.dia }}
                </div>
              </div>
            </div>
          </div>

          <!-- Lado derecho: Horarios -->
          <div
            class="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-outline-subtle pt-6 md:pt-0 md:pl-8 text-left"
          >
            <div
              class="uppercase tracking-widest text-[11px] font-semibold text-on-surface-variant mb-5"
            >
              Horarios disponibles
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                *ngFor="let franja of maqueta.franjasHorarias"
                [ngClass]="{
                  'bg-primary text-on-primary shadow-sm': franja.seleccionado,
                  'border border-outline hover:border-on-surface-variant text-on-surface':
                    !franja.seleccionado,
                }"
                class="py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                {{ franja.hora }}
              </button>
            </div>

            <!-- Reserva confirmada -->
            <div class="mt-8 p-4 bg-success-soft rounded-xl border border-success/20">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center shrink-0"
                >
                  <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                </div>
                <div>
                  <div class="text-sm font-semibold text-on-surface">
                    {{ maqueta.reserva.cliente }}
                  </div>
                  <div class="text-xs text-on-surface-variant">{{ maqueta.reserva.estado }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Glow decorativo detrás -->
        <div
          class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-linear-to-tr from-accent-soft/40 via-transparent to-surface-container-high/40 rounded-full blur-3xl"
        ></div>
      </div>
    </section>
  `,
  styles: [],
})
export class HeroComponent {
  private servicioLanding = inject(ServicioLanding);

  maqueta: MaquetaHero = {
    servicio: {
      nombre: 'Corte de Cabello',
      duracion: '45 min',
      precio: '$2.500',
    },
    calendario: {
      mes: 'Marzo 2026',
      diasSemana: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      fechas: [
        { dia: 23, seleccionado: false },
        { dia: 24, seleccionado: false },
        { dia: 25, seleccionado: false },
        { dia: 26, seleccionado: false },
        { dia: 27, seleccionado: true },
        { dia: 28, seleccionado: false },
        { dia: 29, seleccionado: false },
      ],
    },
    franjasHorarias: [
      { hora: '09:00', seleccionado: false },
      { hora: '10:00', seleccionado: false },
      { hora: '11:30', seleccionado: false },
      { hora: '13:00', seleccionado: true },
      { hora: '14:30', seleccionado: false },
      { hora: '16:00', seleccionado: false },
    ],
    reserva: {
      cliente: 'Reserva de Juan Pérez',
      estado: 'Confirmado hace 2 minutos',
    },
  };

  alProbarGratis() {
    this.servicioLanding.manejarComenzarGratis('hero');
  }

  alVerDemo() {
    this.servicioLanding.manejarVerDemo();
  }
}

