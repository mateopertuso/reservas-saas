import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaStore } from '../../data/agenda.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-page.html',
  styleUrls: ['./agenda-page.css'],
})
export class AgendaPage implements OnInit {
  private route = inject(ActivatedRoute);
  store = inject(AgendaStore);

  ngOnInit(): void {
    const hoy = new Date();

    const mes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`;

    this.store.cargarDiasDisponibles(mes);
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.store.cargarAgenda(slug);
    }
  }
}
