import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpresaStore } from '../state/empresa.store';

@Component({
  standalone: true,
  selector: 'app-empresa-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './empresa-layout.component.html',
})
export class EmpresaLayoutComponent implements OnInit {
  store = inject(EmpresaStore);

  empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

  ngOnInit() {
    this.store.cargarContexto();
    this.store.cargarReservas();
    this.store.cargarServicios(this.empresaId);
    this.store.cargarProfesionales(this.empresaId);
    this.store.cargarProfesionalServicios(this.empresaId);
  }
}
