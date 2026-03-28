import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaStore } from '../../state/empresa.store';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
})
export class ReservasComponent {
  store = inject(EmpresaStore);

  empresaId = '3b80b251-1581-438e-a4fb-9dec140b9039';

  ngOnInit(): void {
    this.store.cargarReservas(this.empresaId);
  }

  cancelar(id: string) {
    this.store.cancelarReserva(id, this.empresaId);
    console.log('ID RESERVA', id);
  }
}
