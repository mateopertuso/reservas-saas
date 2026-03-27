import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { ItemNavegacion } from '../../interfaces/NavItem.interface';
import { ServicioLanding } from '../../services/landing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private servicioLanding = inject(ServicioLanding);
  private idPlataforma = inject(PLATFORM_ID);

  estaDesplazado = false;
  menuMovilAbierto = false;

  itemsNavegacion: ItemNavegacion[] = [
    { etiqueta: 'Características', enlace: '#value' },
    { etiqueta: 'Cómo funciona', enlace: '#how-it-works' },
    { etiqueta: 'Precios', enlace: '#pricing' },
  ];

  @HostListener('window:scroll')
  alDesplazar() {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return;
    }

    this.estaDesplazado = window.scrollY > 20;
  }

  @HostListener('window:keydown.escape')
  alPresionarEscape() {
    this.cerrarMenuMovil();
  }

  alternarMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  cerrarMenuMovil() {
    this.menuMovilAbierto = false;
  }

  alIniciarSesion() {
    this.servicioLanding.manejarIniciarSesion();
  }

  alComenzarGratis() {
    this.servicioLanding.manejarComenzarGratis('navbar');
  }

  alClickNavegacion(evento: Event, enlace: string) {
    if (enlace.startsWith('#')) {
      evento.preventDefault();
      const idSeccion = enlace.substring(1);
      this.servicioLanding.desplazarASeccion(idSeccion);
    }
  }

  desplazarAlInicio() {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cerrarMenuMovil();
  }
}
