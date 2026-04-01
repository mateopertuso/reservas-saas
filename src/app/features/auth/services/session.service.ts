import { Injectable, signal } from '@angular/core';
import { supabase } from '../../../core/supabase/supabase.client';

export interface UserContext {
  user_id: string;
  empresa_id: string;
  profesional_id: string | null;
  rol: 'owner' | 'professional';
  activo: boolean;
  color_tema: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  context = signal<UserContext | null>(null);
  loading = signal(true);

  async loadContext() {
    this.loading.set(true);

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      // NO hay sesión → limpiar todo
      this.context.set(null);
      this.loading.set(false);
      return;
    }

    const { data, error } = await supabase.rpc('get_mi_contexto');

    if (error) {
      console.error('Error loading context:', error);
      this.loading.set(false);
      return;
    }

    console.log('CONTEXT LOADED:', data);

    this.context.set(data);
    this.loading.set(false);
  }

  clear() {
    this.context.set(null);
  }
}
