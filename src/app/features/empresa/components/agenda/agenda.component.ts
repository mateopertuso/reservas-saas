import { Component, inject, OnInit } from '@angular/core';
import { EmpresaStore } from '../../state/empresa.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-agenda',
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
})
export class AgendaComponent implements OnInit {
  store = inject(EmpresaStore);

  fecha = new Date().toISOString().slice(0, 10);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.store.cargarAgenda(this.fecha);
  }
}
