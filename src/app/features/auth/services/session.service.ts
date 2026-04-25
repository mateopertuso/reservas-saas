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

  constructor() {
    console.log('SessionService init');

    // Escuchar cambios de sesión (login / logout / refresh interno)
    supabase.auth.onAuthStateChange((event) => {
      console.log('AUTH EVENT:', event);

      if (event === 'SIGNED_OUT') {
        this.clear();
        window.location.href = '/';
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.loadContext();
      }
    });

    // clave cuando volvés a la pestaña
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Tab visible → rehydrating session');

        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          console.warn('No session → reload');
          window.location.href = '/';
          return;
        }

        await this.loadContext();
      }
    });
  }

  async loadContext() {
    this.loading.set(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        this.clear();
        return;
      }

      const { data, error } = await supabase.rpc('get_mi_contexto');

      if (error) throw error;

      console.log('CONTEXT LOADED:', data);

      this.context.set(data);
    } catch (err: any) {
      console.error('Error loading context:', err);

      // fallback simple y robusto
      window.location.reload();
    } finally {
      this.loading.set(false);
    }
  }

  clear() {
    this.context.set(null);
  }
}
