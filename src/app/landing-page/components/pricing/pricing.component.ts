import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Precio } from '../../interfaces/Pricing.interface';
import { ServicioLanding } from '../../services/landing.service';
import { MessageCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  private servicioLanding = inject(ServicioLanding);

  MessageCircle = MessageCircle;

  datosPrecio: Precio = {
    insignia: 'Plan único',
    titulo: 'Todo incluido',
    subtitulo: 'Sin límites, sin complicaciones.',
    precio: '$xxxx',
    periodo: '/mes',
    textoBoton: 'Contactate',
    caracteristicas: [
      { icono: 'check_circle', texto: '7 días de prueba gratis' },
      { icono: 'check_circle', texto: 'Reservas ilimitadas' },
      { icono: 'check_circle', texto: 'Empleados ilimitados' },
      { icono: 'check_circle', texto: 'Soporte prioritario' },
      { icono: 'check_circle', texto: 'Link personalizado' },
    ],
  };

  irWhatsapp() {
    const mensaje = encodeURIComponent('Hola! Quiero probar Slation para mi negocio.');

    window.open(`https://wa.me/59899743316?text=${mensaje}`, '_blank');
  }

  alIniciarPlan() {
    this.servicioLanding.manejarIniciarPlan('standard');
  }
}
