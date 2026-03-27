import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Precio } from '../../interfaces/Pricing.interface';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="pricing" class="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div class="bg-primary text-on-primary rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div
          class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12"
        >
          <!-- Lado izquierdo -->
          <div class="max-w-md">
            <span
              class="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-white/80"
            >
              {{ datosPrecio.insignia }}
            </span>
            <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {{ datosPrecio.titulo }}
            </h2>
            <p class="text-white/60 text-lg">{{ datosPrecio.subtitulo }}</p>
          </div>

          <!-- Card de precio -->
          <div class="bg-white text-on-surface p-8 rounded-2xl w-full md:w-80 shadow-hero">
            <div class="text-4xl font-extrabold text-on-surface mb-1">
              {{ datosPrecio.precio }}
              <span class="text-base font-normal text-on-surface-variant">{{
                datosPrecio.periodo
              }}</span>
            </div>
            <p class="text-xs text-on-surface-variant mb-6">IVA incluido</p>

            <ul class="space-y-3 mb-8">
              <li
                *ngFor="let caracteristica of datosPrecio.caracteristicas"
                class="flex items-center gap-2.5 text-sm"
              >
                <span class="material-symbols-outlined text-success text-lg">{{
                  caracteristica.icono
                }}</span>
                <span class="text-on-surface font-medium">{{ caracteristica.texto }}</span>
              </li>
            </ul>

            <button
              (click)="alIniciarPlan()"
              class="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all duration-200 active:scale-[0.98]"
            >
              {{ datosPrecio.textoBoton }}
            </button>

            <p class="text-center text-xs text-on-surface-variant mt-3">
              Sin tarjeta de crédito para empezar
            </p>
          </div>
        </div>

        <!-- Decorative blurs -->
        <div
          class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16"
        ></div>
      </div>
    </section>
  `,
  styles: [],
})
export class PricingComponent {
  private servicioLanding = inject(ServicioLanding);

  datosPrecio: Precio = {
    insignia: 'Plan único',
    titulo: 'Todo incluido',
    subtitulo: 'Sin límites, sin complicaciones.',
    precio: '$xxx',
    periodo: '/mes',
    textoBoton: '7 días gratis',
    caracteristicas: [
      { icono: 'check_circle', texto: '7 días de prueba gratis' },
      { icono: 'check_circle', texto: 'Reservas ilimitadas' },
      { icono: 'check_circle', texto: 'Recordatorios automáticos' },
      { icono: 'check_circle', texto: 'Soporte prioritario' },
      { icono: 'check_circle', texto: 'Link personalizado' },
    ],
  };

  alIniciarPlan() {
    this.servicioLanding.manejarIniciarPlan('standard');
  }
}
