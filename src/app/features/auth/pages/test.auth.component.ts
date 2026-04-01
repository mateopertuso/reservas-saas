import { Component } from '@angular/core';
import { supabase } from '../../../core/supabase/supabase.client';

@Component({
  standalone: true,
  selector: 'app-test-auth',
  template: `
    <h2>Test Auth</h2>

    <button (click)="login()">Login</button>
    <button (click)="checkSession()">Check Session</button>
    <button (click)="testEdge()">Test Edge Function</button>
  `,
})
export class TestAuthComponent {
  async login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: '123456',
    });

    console.log('LOGIN:', data, error);
  }

  async checkSession() {
    const { data } = await supabase.auth.getSession();
    console.log('SESSION:', data);
  }

  async testEdge() {
    // 👇 este cliente YA tiene la sesión
    const { data, error } = await supabase.functions.invoke('create-owner-account', {
      body: {
        nombre: 'Test desde Angular',
        rubro: 'Barbería',
        color_tema: '#22C55E',
      },
    });

    console.log('EDGE DATA:', data);
    console.log('EDGE ERROR:', error);
  }
}
