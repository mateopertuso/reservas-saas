import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Precio } from '../../interfaces/Pricing.interface';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  private servicioLanding = inject(ServicioLanding);

  datosPrecio: Precio = {
    insignia: 'Plan único',
    titulo: 'Todo incluido',
    subtitulo: 'Sin límites, sin complicaciones.',
    precio: '$xxxx',
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
