import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnlacePie } from '../../interfaces/FooterLink.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  anioActual = new Date().getFullYear();

  enlacesPie: EnlacePie[] = [
    { etiqueta: 'Privacidad', enlace: '#privacy' },
    { etiqueta: 'Términos', enlace: '#terms' },
    { etiqueta: 'Contacto', enlace: '#contact' },
  ];
}
