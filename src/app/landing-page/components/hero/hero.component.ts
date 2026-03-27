import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaquetaHero } from '../../interfaces/HeroMockup.interface';
import { ServicioLanding } from '../../services/landing.service';
import { OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit, OnDestroy {
  private servicioLanding = inject(ServicioLanding);
  private intervalId!: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.animarMockup();
    }, 2500);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  animarMockup() {
    const fechas = this.maqueta.calendario.fechas;

    fechas.forEach((f) => (f.seleccionado = false));

    const randomDia = Math.floor(Math.random() * fechas.length);
    fechas[randomDia].seleccionado = true;

    const horarios = this.maqueta.franjasHorarias;
    horarios.forEach((h) => (h.seleccionado = false));

    const randomHora = Math.floor(Math.random() * horarios.length);
    horarios[randomHora].seleccionado = true;

    const clientes = ['Priscila', 'Fernanda', 'Yamila', 'Sofia', 'Micaela'];

    const randomCliente = clientes[Math.floor(Math.random() * clientes.length)];

    this.maqueta.reserva = {
      cliente: randomCliente,
      estado: 'Confirmado recién',
    };
  }

  maqueta: MaquetaHero = {
    servicio: {
      nombre: 'Corte de Cabello',
      duracion: '45 min',
      precio: '$2.500',
    },
    calendario: {
      mes: 'Marzo 2026',
      diasSemana: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      fechas: [
        { dia: 23, seleccionado: false },
        { dia: 24, seleccionado: false },
        { dia: 25, seleccionado: false },
        { dia: 26, seleccionado: false },
        { dia: 27, seleccionado: true },
        { dia: 28, seleccionado: false },
        { dia: 29, seleccionado: false },
      ],
    },
    franjasHorarias: [
      { hora: '09:00', seleccionado: false },
      { hora: '10:00', seleccionado: false },
      { hora: '11:30', seleccionado: false },
      { hora: '13:00', seleccionado: true },
      { hora: '14:30', seleccionado: false },
      { hora: '16:00', seleccionado: false },
    ],
    reserva: {
      cliente: 'María López',
      estado: 'Confirmado recién',
    },
  };

  alProbarGratis() {
    this.servicioLanding.manejarComenzarGratis('hero');
  }

  alVerDemo() {
    this.servicioLanding.manejarVerDemo();
  }
}
