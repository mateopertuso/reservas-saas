import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../../../core/supabase/supabase.client';

@Component({
  standalone: true,
  template: `<p>Cargando...</p>`,
})
export class CallbackPage implements OnInit {
  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  async ngOnInit() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      this.zone.run(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    await new Promise((res) => setTimeout(res, 300));

    const { data: ctx } = await supabase.rpc('get_mi_contexto');

    console.log('CTX:', ctx);

    this.zone.run(() => {
      if (ctx?.empresa_id) {
        this.router.navigate(['/empresa']);
      } else {
        this.router.navigate(['/onboarding']);
      }
    });
  }
}
