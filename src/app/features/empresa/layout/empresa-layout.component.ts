import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpresaStore } from '../state/empresa.store';
import { SessionService } from '../../auth/services/session.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  LucideAngularModule,
  Calendar,
  ClipboardList,
  Clock,
  Settings,
  FileText,
  Users,
  Building2,
  LogOut,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-empresa-layout',
  imports: [CommonModule, RouterOutlet, RouterModule, LucideAngularModule],
  templateUrl: './empresa-layout.component.html',
})
export class EmpresaLayoutComponent implements OnInit {
  store = inject(EmpresaStore);

  Calendar = Calendar;
  ClipboardList = ClipboardList;
  Clock = Clock;
  Settings = Settings;
  FileText = FileText;
  Users = Users;
  Building2 = Building2;
  LogOut = LogOut;
  appReady = signal(false);

  constructor(
    private session: SessionService,
    private auth: AuthService,
  ) {}

  async ngOnInit() {
    await this.session.loadContext();
    await this.store.cargarEstadoSuscripcion();

    this.appReady.set(true);

    const ctx = this.session.context();

    if (!ctx) {
      console.error('No hay contexto de usuario');
      return;
    }

    const empresaId = ctx.empresa_id;

    const color = ctx.color_tema || '#3B82F6';
    document.documentElement.style.setProperty('--color-primary', color);

    this.store.cargarContexto();
    this.store.cargarSucursales();
    this.store.cargarReservas();
    this.store.cargarServicios(empresaId);
    this.store.cargarProfesionalServicios(empresaId);
    this.store.cargarAgenda(new Date().toISOString().slice(0, 10));

    await this.store.cargarProfesionales(empresaId);

    const profesionales = this.store.profesionales();

    if (profesionales.length) {
      await this.store.cargarDisponibilidadTodos(profesionales);
    }
  }

  async logout() {
    await this.auth.logout();
    this.session.clear();

    window.location.href = '/';
  }

  puedeUsarSistema() {
    return this.store.puedeUsarSistema();
  }

  estadoSuscripcion() {
    return this.store.estadoSuscripcion();
  }

  irWhatsapp() {
    const mensaje = encodeURIComponent('Hola! Quiero activar mi cuenta de Slation.');

    window.open(`https://wa.me/59899743316?text=${mensaje}`, '_blank');
  }

  diasRestantes() {
    return this.estadoSuscripcion()?.dias_restantes ?? 0;
  }

  enTrial() {
    return this.estadoSuscripcion()?.en_trial;
  }

  trialColor() {
    const dias = this.diasRestantes();

    if (dias <= 0) return 'red';
    if (dias <= 3) return 'yellow';
    return 'slate';
  }
}
