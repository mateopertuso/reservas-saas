import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaStore } from '../../data/agenda.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-confirmacion.component.html',
})
export class PasoConfirmacionComponent {
  store = inject(AgendaStore);
  router = inject(Router);
  volver() {
    const slug = this.store.empresa()?.slug;
    this.router.navigate(['/agenda', slug]);
  }
}
