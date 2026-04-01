import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../../core/supabase/supabase.client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginPage {
  email = '';
  password = '';

  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.auth.user()) {
      this.router.navigateByUrl('/auth/callback');
    }
  }

  async login() {
    this.loading = true;

    try {
      // 🔥 intento login
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        // 🔥 si falla → intento registro automático
        const { error: signUpError } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });

        if (signUpError) {
          throw signUpError;
        }
      }

      // 🔥 redirigir al callback
      this.router.navigate(['/auth/callback']);
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.loading = false;
    }
  }

  async loginGoogle() {
    await this.auth.loginWithGoogle();
  }
}
