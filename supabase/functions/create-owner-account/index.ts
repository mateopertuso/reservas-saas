import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Body = {
  nombre: string;
  rubro: string;
  color_tema: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const authHeader = req.headers.get('Authorization');
console.log('SERVICE ROLE:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
console.log('URL:', Deno.env.get('SUPABASE_URL'));
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // 🔥 Cliente ADMIN (clave)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 🔥 Validar usuario con token
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      console.error('AUTH ERROR:', userError);
      return json({ error: 'Unauthorized' }, 401);
    }

    const user = userData.user;

    const body = (await req.json()) as Partial<Body>;

    const nombre = body.nombre?.trim();
    const rubro = body.rubro?.trim();
    const color = body.color_tema?.trim();

    if (!nombre || !rubro || !color) {
      return json({ error: 'Missing fields' }, 400);
    }

    // 🔥 Llamar RPC
    const { data, error } = await supabaseAdmin.rpc(
      'create_owner_onboarding',
      {
        p_user_id: user.id,
        p_nombre: nombre,
        p_rubro: rubro,
        p_color_tema: color,
      }
    );

    if (error) {
      console.error('RPC ERROR:', error);

      if (error.message.includes('USER_ALREADY_ONBOARDED')) {
        return json({ error: 'User already onboarded' }, 409);
      }

      return json({ error: error.message }, 500);
    }

    return json({
      ok: true,
      onboarding: data,
    });
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err);

    return json(
      {
        error: err instanceof Error ? err.message : 'Unexpected error',
      },
      500
    );
  }
});