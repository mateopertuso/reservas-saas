import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemValor } from '../../interfaces/ValueItem.interface';

@Component({
  selector: 'app-value',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value.component.html',
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
