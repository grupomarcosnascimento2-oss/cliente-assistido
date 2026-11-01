// Cliente Assistido – API oficial do WhatsApp: envio dos lembretes agendados (1.55.0).
// Chamado pelo pg_cron a cada minuto (1.55.1, para o piloto de pós-venda 1 min depois da venda) (cabeçalho x-cron-secret = push_secrets().push_cron_secret).
// O app de cada loja calcula os lembretes (vencimentos e pós-venda) e grava na tabela wa_fila com dia e hora;
// aqui só enviamos o que já venceu o horário, por MODELO APROVADO pela Meta (modelos em wa_config.modelos).
// Também aceita {modo:'teste', store_id, num, tipo, params} vindo de um ADMIN logado, para testar o envio na hora.
// Chave de acesso: wa_tokens (por loja, sem leitura pelo app) ou o segredo WA_TOKEN (número de teste/usuário do sistema).
// Versão da Graph API no segredo WA_GRAPH_VER (padrão v23.0).
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
const ACAO: Record<string, string> = { venc: 'aviso_vencimento', pv1: 'posvenda', pv7: 'posvenda' };
const espera = (ms: number) => new Promise(r => setTimeout(r, ms));

async function enviarModelo(cfg: any, token: string, num: string, tipo: string, params: string[]) {
  params = Array.isArray(params) ? params : [];
  const ver = Deno.env.get('WA_GRAPH_VER')?.trim() || 'v23.0';
  const m = cfg.modelos || {};
  const nome = m[tipo];
  if (!nome) return { erro: 'sem_modelo_' + tipo };
  // hello_world: modelo que já vem aprovado no número de teste da Meta (inglês, sem variáveis) — usado no piloto
  const hello = nome === 'hello_world', idioma = hello ? 'en_US' : (m.idioma || 'pt_BR');
  if (hello) params = [];
  const corpo = {
    messaging_product: 'whatsapp', to: num, type: 'template',
    template: { name: nome, language: { code: idioma }, components: params.length ? [{ type: 'body', parameters: params.map(t => ({ type: 'text', text: String(t).replace(/[\r\n\t]+/g, ' ').replace(/ {4,}/g, '   ').slice(0, 900) })) }] : [] }
  };
  const r = await fetch(`https://graph.facebook.com/${ver}/${cfg.phone_number_id}/messages`, {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(corpo)
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return { erro: (d?.error?.message || ('http_' + r.status)).slice(0, 300) };
  return { id: d?.messages?.[0]?.id || null };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const { data: sec } = await admin.rpc('push_secrets');
  const isCron = !!sec && req.headers.get('x-cron-secret') === sec.push_cron_secret;
  const tokenDe = async (storeId: string) => {
    const { data } = await admin.from('wa_tokens').select('token').eq('store_id', storeId).maybeSingle();
    return data?.token || Deno.env.get('WA_TOKEN')?.trim() || '';
  };

  // Teste feito por um admin logado: envia um modelo na hora para um número
  if (!isCron) {
    if (body?.modo !== 'teste') return json({ erro: 'nao_autorizado' });
    const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: u } = await admin.auth.getUser(jwt);
    const email = (u?.user?.email || '').toLowerCase();
    const { data: eu } = await admin.from('app_users').select('role,active').eq('email', email).maybeSingle();
    if (!eu || !eu.active || eu.role !== 'admin') return json({ erro: 'sem_permissao' });
    const storeId = String(body.store_id || '');
    const { data: cfg } = await admin.from('wa_config').select('*').eq('store_id', storeId).maybeSingle();
    if (!cfg || !cfg.phone_number_id) return json({ erro: 'sem_config' });
    const token = await tokenDe(storeId); if (!token) return json({ erro: 'sem_chave' });
    const num = String(body.num || '').replace(/\D/g, ''); if (num.length < 12) return json({ erro: 'numero_invalido' });
    const tipo = ['venc', 'pv1', 'pv7'].includes(body.tipo) ? body.tipo : 'pv1';
    const params = (Array.isArray(body.params) ? body.params : []).map((x: unknown) => String(x || '').slice(0, 300));
    const r = await enviarModelo(cfg, token, num, tipo, params);
    return json(r.erro ? { erro: r.erro } : { ok: true, id: r.id });
  }

  // Cron: lembretes vencidos há mais de 36 h sem envio não saem mais (o cliente já não está no prazo certo)
  await admin.from('wa_fila').update({ status: 'expirado', atualizado_em: new Date().toISOString() })
    .eq('status', 'agendado').lt('enviar_em', new Date(Date.now() - 36 * 3600 * 1000).toISOString());
  const { data: cfgs } = await admin.from('wa_config').select('*').eq('ativo', true).not('phone_number_id', 'is', null);
  if (!cfgs || !cfgs.length) return json({ lojas: 0, enviados: 0 });
  let enviados = 0, falhas = 0;
  for (const cfg of cfgs) {
    const token = await tokenDe(cfg.store_id); if (!token) continue;
    const { data: fila } = await admin.from('wa_fila').select('*').eq('store_id', cfg.store_id).eq('status', 'agendado')
      .lte('enviar_em', new Date().toISOString()).order('enviar_em').limit(200);
    for (const it of fila || []) {
      // trava: só um envio por item, mesmo com duas execuções ao mesmo tempo
      const { data: trava } = await admin.from('wa_fila').update({ status: 'enviando', atualizado_em: new Date().toISOString() })
        .eq('id', it.id).eq('status', 'agendado').select('id');
      if (!trava || !trava.length) continue;
      const r = await enviarModelo(cfg, token, it.num, it.tipo, Array.isArray(it.params) ? it.params : []);
      if (r.erro) {
        falhas++;
        await admin.from('wa_fila').update({ status: 'falhou', erro: r.erro, atualizado_em: new Date().toISOString() }).eq('id', it.id);
      } else {
        enviados++;
        await admin.from('wa_fila').update({ status: 'enviado', wa_msg_id: r.id, erro: null, atualizado_em: new Date().toISOString() }).eq('id', it.id);
        await admin.from('activity_log').insert({ store_id: cfg.store_id, user_email: 'api-whatsapp', user_role: 'api', action: ACAO[it.tipo] || 'aviso_vencimento', detail: { num: it.num, tipo: it.tipo, api: true } });
      }
      await espera(250);
    }
  }
  return json({ lojas: cfgs.length, enviados, falhas });
});
