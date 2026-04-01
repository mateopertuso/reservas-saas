import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaStore } from '../../data/agenda.store';
import { CommonModule } from '@angular/common';
import { PasoSucursalComponent } from '../../components/paso-sucursal/paso-sucursal.component';
import { PasoServicioComponent } from '../../components/paso-servicio/paso-servicio.component';
import { PasoProfesionalComponent } from '../../components/paso-profesional/paso-profesional.component';
import { PasoFechaComponent } from '../../components/paso-fecha/paso-fecha.component';
import { PasoHorarioComponent } from '../../components/paso-horario/paso-horario.component';
import { PasoDatosComponent } from '../../components/paso-datos/paso-datos.component';
import { PasoConfirmacionComponent } from '../../components/paso-confirmacion/paso-confirmacion.component';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-agenda-page',
  imports: [
    CommonModule,
    PasoSucursalComponent,
    PasoServicioComponent,
    PasoProfesionalComponent,
    PasoFechaComponent,
    PasoHorarioComponent,
    PasoDatosComponent,
    PasoConfirmacionComponent,
    LucideAngularModule,
  ],
  templateUrl: './agenda-page.html',
  styleUrls: ['./agenda-page.css'],
})
export class AgendaPage implements OnInit {
  private route = inject(ActivatedRoute);
  store = inject(AgendaStore);
  paso = signal(1);
  animando = signal(false);

  arrowLeft = ArrowLeft;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.store.cargarAgenda(slug);
    }
  }

  get colorTema() {
    return this.store.empresa()?.color_tema || '#6366f1'; // fallback indigo
  }

  get tituloPaso() {
    return [
      'Seleccionar sucursal',
      'Elegir servicio',
      'Seleccionar profesional',
      'Elegir fecha',
      'Elegir horario',
      'Tus datos',
      'Confirmación',
    ][this.paso() - 1];
  }

  siguientePaso() {
    this.animar(() => this.paso.update((p) => p + 1));
  }

  volverPaso() {
    this.animar(() => this.paso.update((p) => p - 1));
  }

  animar(callback: () => void) {
    this.animando.set(true);

    setTimeout(() => {
      callback();

      setTimeout(() => {
        this.animando.set(false);
      }, 150);
    }, 150);
  }
}
