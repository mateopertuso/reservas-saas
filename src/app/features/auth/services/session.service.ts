import { Injectable, signal } from '@angular/core';
import { supabase } from '../../../core/supabase/supabase.client';

export interface UserContext {
  user_id: string;
  empresa_id: string;
  profesional_id: string | null;
  rol: 'owner' | 'professional';
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  context = signal<UserContext | null>(null);
  loading = signal(true);

  async loadContext() {
    const { data, error } = await supabase.rpc('get_mi_contexto');

    if (error) {
      console.error(error);
      return;
    }

    this.context.set(data);
    this.loading.set(false);
  }

  clear() {
    this.context.set(null);
  }
}
