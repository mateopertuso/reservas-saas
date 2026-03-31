import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

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
  supabase = createClient(
    'https://jjouurmszygviwpeucei.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb3V1cm1zenlndml3cGV1Y2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mjg1NDIsImV4cCI6MjA4ODMwNDU0Mn0.N1VGV6tDyyIZJ8Zb-phOQr0bxjMalXt3Wl1qeHQ_tC4',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

  async login() {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: 'test@test.com',
      password: '123456',
    });

    console.log('LOGIN:', data, error);
  }

  async checkSession() {
    const { data } = await this.supabase.auth.getSession();
    console.log('SESSION:', data);
  }

  async testEdge() {
  // 👇 este cliente YA tiene la sesión
  const { data, error } = await this.supabase.functions.invoke(
    'create-owner-account',
    {
      body: {
        nombre: 'Test desde Angular',
        rubro: 'Barbería',
        color_tema: '#22C55E',
      },
    }
  );

  console.log('EDGE DATA:', data);
  console.log('EDGE ERROR:', error);
}
}