import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Paso } from '../../interfaces/Step.interface';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="how-it-works" class="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <!-- Título de sección -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-4">
          Cómo funciona
        </h2>
        <p class="text-on-surface-variant text-lg max-w-xl mx-auto">
          En 3 simples pasos pasás de coordinar por WhatsApp a tener una agenda profesional.
        </p>
      </div>

      <!-- Pasos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
        <!-- Línea conectora (solo desktop) -->
        <div
          class="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-outline"
        ></div>

        <div *ngFor="let paso of pasos" class="flex flex-col items-center text-center relative">
          <!-- Número con ícono -->
          <div
            class="w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 relative z-10"
          >
            <span class="material-symbols-outlined text-on-surface text-3xl">{{ paso.icono }}</span>
          </div>

          <div
            class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
          >
            Paso {{ paso.numero }}
          </div>
          <h3 class="text-xl font-bold text-on-surface mb-3">{{ paso.titulo }}</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm max-w-xs">
            {{ paso.descripcion }}
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class HowItWorksComponent {
  pasos: Paso[] = [
    {
      numero: 1,
      titulo: 'Creás tu agenda',
      descripcion:
        'Definí tus servicios, duraciones y horarios de disponibilidad en menos de 2 minutos.',
      icono: 'edit_calendar',
    },
    {
      numero: 2,
      titulo: 'Compartís tu link',
      descripcion:
        'Enviá tu enlace personalizado por WhatsApp o ponelo en tu biografía de Instagram.',
      icono: 'share',
    },
    {
      numero: 3,
      titulo: 'Recibís reservas',
      descripcion:
        'Tus clientes eligen su horario y vos recibís una notificación instantánea.',
      icono: 'notifications_active',
    },
  ];
}
