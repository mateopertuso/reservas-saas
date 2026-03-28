import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private session: SessionService,
  ) {}

  ngOnInit() {
    if (this.auth.user()) {
      this.router.navigateByUrl('/empresa');
    }
  }

  async login() {
    try {
      await this.auth.login(this.email, this.password);

      // 👇 esperar a que cargue el contexto
      await this.session.loadContext();

      const ctx = this.session.context();

      if (ctx?.rol === 'owner') {
        this.router.navigateByUrl('/empresa');
      } else if (ctx?.rol === 'professional') {
        this.router.navigateByUrl('/empresa'); // después podemos separar
      } else {
        this.router.navigateByUrl('/');
      }
    } catch (err) {
      console.error(err);
    }
  }
}
