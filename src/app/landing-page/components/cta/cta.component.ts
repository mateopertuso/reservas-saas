import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="cta" class="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div class="text-center max-w-2xl mx-auto">
        <h2
          class="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4"
        >
          Empezá hoy
        </h2>

        <p class="text-on-surface-variant text-lg mb-10 leading-relaxed">
          Creá tu agenda en menos de 2 minutos y empezá a recibir reservas automáticamente.
        </p>

        <button
          (click)="alCrearAgenda()"
          class="bg-primary text-on-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all duration-200 active:scale-95 shadow-elevated"
        >
          Crear mi agenda gratis
        </button>

        <p class="mt-5 text-on-surface-variant text-sm">
          No requiere tarjeta de crédito · Cancelá cuando quieras
        </p>
      </div>
    </section>
  `,
  styles: [],
})
export class CtaComponent {
  private servicioLanding = inject(ServicioLanding);

  alCrearAgenda() {
    this.servicioLanding.manejarComenzarGratis('cta');
  }
}

