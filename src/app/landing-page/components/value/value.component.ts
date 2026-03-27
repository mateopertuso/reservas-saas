import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemValor } from '../../interfaces/ValueItem.interface';

@Component({
  selector: 'app-value',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="value" class="py-20 border-t border-b border-outline-subtle">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div *ngFor="let item of itemsValor" class="flex items-start gap-4 group">
            <div
              class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:shadow-card"
            >
              <span
                class="material-symbols-outlined text-on-surface-variant transition-colors duration-300 group-hover:text-on-primary"
                >{{ item.icono }}</span
              >
            </div>
            <div>
              <h3 class="text-base font-bold text-on-surface mb-1">{{ item.titulo }}</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">
                {{ item.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class ValueComponent {
  itemsValor: ItemValor[] = [
    {
      icono: 'schedule',
      titulo: 'Reservas online 24/7',
      descripcion: 'Tus clientes reservan cuando quieran, incluso fuera de tu horario laboral.',
    },
    {
      icono: 'event_busy',
      titulo: 'Sin doble reservas',
      descripcion: 'El sistema controla la disponibilidad automáticamente. Cero superposiciones.',
    },
    {
      icono: 'dashboard',
      titulo: 'Todo en un solo lugar',
      descripcion: 'Agenda, clientes y servicios organizados en un panel limpio y simple.',
    },
  ];
}
