import { Injectable, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../core/supabase/supabase.client';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  loading = signal(true);

  constructor(private session: SessionService) {
    this.init();
  }

  async init() {
    const { data } = await supabase.auth.getUser();

    this.user.set(data.user ?? null);

    if (data.user) {
      await this.session.loadContext();
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      this.user.set(session?.user ?? null);

      if (session?.user) {
        await this.session.loadContext();
      } else {
        this.session.clear();
      }
    });

    this.loading.set(false);
  }

  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
