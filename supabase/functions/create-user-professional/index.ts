import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('ANON_KEY');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Config faltante en secretos de Supabase' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password, nombre, sucursal_id } = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Falta Authorization Bearer token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    console.log('BODY:', { email, nombre, sucursal_id });

    const {
      data: { user },
      error: getUserError,
    } = await supabaseUser.auth.getUser();

    if (getUserError || !user) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: usuarioEmpresa, error: usuarioEmpresaError } = await supabaseAdmin
      .from('usuario_empresa')
      .select('empresa_id, rol')
      .eq('user_id', user.id)
      .single();

    if (usuarioEmpresaError) throw usuarioEmpresaError;

    console.log('USER:', user);
    console.log('USUARIO EMPRESA:', usuarioEmpresa);

    if (!usuarioEmpresa || usuarioEmpresa.rol !== 'owner') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) throw userError;

    const { data: profesional, error: profError } = await supabaseAdmin
      .from('profesional')
      .insert({
        nombre,
        sucursal_id,
      })
      .select()
      .single();

    if (profError) throw profError;

    const { error: ueError } = await supabaseAdmin.from('usuario_empresa').insert({
      user_id: newUser.user.id,
      empresa_id: usuarioEmpresa.empresa_id,
      rol: 'professional',
      profesional_id: profesional.id,
      activo: true,
    });

    if (ueError) throw ueError;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.log(JSON.stringify({ error: err?.message ?? String(err) }));

    return new Response(JSON.stringify({ error: err?.message ?? 'Error interno' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
