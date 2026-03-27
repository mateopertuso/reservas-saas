import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Paso } from '../../interfaces/Step.interface';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
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
      descripcion: 'Tus clientes eligen su horario y vos recibís una notificación instantánea.',
      icono: 'notifications_active',
    },
  ];
}
