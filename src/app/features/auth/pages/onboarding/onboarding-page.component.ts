import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from '../../../../core/supabase/supabase.client';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './onboarding-page.component.html',
})
export class OnboardingPage {
  nombre = '';
  rubro = '';
  color = '#3B82F6';

  paso = 1;
  loading = false;

  constructor(private router: Router) {}

  siguiente() {
    if (this.paso < 3) this.paso++;
  }

  volver() {
    if (this.paso > 1) this.paso--;
  }

  async crear() {
    this.loading = true;

    console.log('🚀 creando empresa...');

    try {
      const { data, error } = await supabase.functions.invoke('create-owner-account', {
        body: {
          nombre: this.nombre,
          rubro: this.rubro,
          color_tema: this.color,
        },
      });

      console.log('RESPONSE:', data);
      console.log('ERROR:', error);

      if (error) {
        throw error;
      }

      console.log('✅ empresa creada');

      this.router.navigate(['/empresa']);
    } catch (err: any) {
      console.error('💥 ERROR:', err);
      alert(err.message);
    } finally {
      this.loading = false;
    }
  }
}
