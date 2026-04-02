import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ServicioLanding } from '../../services/landing.service';
import { LucideAngularModule, MessageCircle } from 'lucide-angular';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cta.component.html',
})
export class CtaComponent {
  private servicioLanding = inject(ServicioLanding);
  MessageCircle = MessageCircle;

  alCrearAgenda() {
    this.servicioLanding.manejarComenzarGratis('cta');
  }

  irWhatsapp() {
    const mensaje = encodeURIComponent('Hola! Quiero mas información sobre Slation.');

    window.open(`https://wa.me/59899743316?text=${mensaje}`, '_blank');
  }
}
