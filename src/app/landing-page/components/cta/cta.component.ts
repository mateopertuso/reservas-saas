import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta.component.html',
})
export class CtaComponent {
  private servicioLanding = inject(ServicioLanding);

  alCrearAgenda() {
    this.servicioLanding.manejarComenzarGratis('cta');
  }
}
