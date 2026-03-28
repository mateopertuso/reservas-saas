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

  ngOnInit(): void {
    this.store.cargarReservas();
  }

  cancelar(id: string) {
    this.store.cancelarReserva(id);
    console.log('ID RESERVA', id);
  }
}
