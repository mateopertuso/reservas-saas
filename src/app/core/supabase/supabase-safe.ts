import { supabase } from './supabase.client';

export async function safeRpc<T = any>(fn: () => PromiseLike<{ data: T; error: any }>): Promise<T> {
  try {
    const { data, error } = await fn();

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.warn('API ERROR:', err);

    if (err?.message?.includes('lock') || err?.message?.includes('JWT') || err?.status === 401) {
      console.warn('Session issue → trying recovery');

      try {
        await supabase.auth.refreshSession();
      } catch {
        await supabase.auth.signOut();
        window.location.href = '/';
        throw err;
      }

      const { data, error } = await fn();

      if (error) throw error;

      return data;
    }

    throw err;
  }
}
