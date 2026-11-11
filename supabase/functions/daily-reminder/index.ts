// Cliente Assistido – lembrete diário e avisos (Web Push).
// mode=cron: chamado pelo pg_cron a cada 15 min, com o cabeçalho x-cron-secret.
// mode=presenca (1.35.0): chamado pelo banco (presence_notify, com x-cron-secret) quando um lojista ou funcionário
//   entra ou sai do app; avisa os administradores. Texto montado aqui, só com nome do usuário e da loja.
// mode=avancado (1.74.4): chamado pelo pg_cron 'avancado-aviso' uma vez por dia (9h05 de Brasília, x-cron-secret);
//   avisa no celular quem tem lição nova do módulo avançado liberada hoje (rpc avancado_liberadas_hoje).
//   Vai para todos os aparelhos da pessoa (também os com o lembrete diário desligado: active=false).
// mode=test: chamado pelo app com o token do usuário logado; envia um teste só para os aparelhos dele.
// mode=aviso (1.17.0): chamado pelo app quando o operador ou um funcionário precisa do dono da loja
//   tipo=aprovacao (campanha para aprovar) ou tipo=venda (cliente com interesse de compra).
//   O texto é montado aqui (nunca vem pronto do app) e não leva nome nem telefone de cliente.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import webpush from 'npm:web-push@3.6.7';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });

function localNow(tz: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: parseInt(p.hour, 10) };
}
const limpa = (t: unknown, n: number) => String(t || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

// Títulos das lições do módulo avançado (treino-semanais.js). Ao acrescentar lições lá, acrescentar aqui e subir p_total.
const AVANCADO = ['O cliente com pressa', 'Dizer “não” sem perder o cliente', 'Oferecer mais sem empurrar', 'Tom de voz e postura',
  'O cliente indeciso', 'Atender bem o cliente idoso', 'O cliente grosseiro', 'Lembrar das preferências do cliente'];

async function enviar(admin: any, subs: any[], payloadDe: (s: any) => string, ttl: number, urg: string, marcarDia: boolean) {
  let sent = 0, removed = 0, failed = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payloadDe(s), { TTL: ttl, urgency: urg });
      sent++;
      if (marcarDia) await admin.from('push_subscriptions').update({ last_sent: localNow(s.tz || 'America/Sao_Paulo').date }).eq('id', s.id);
    } catch (e: any) {
      if (e?.statusCode === 404 || e?.statusCode === 410) { await admin.from('push_subscriptions').delete().eq('id', s.id); removed++; }
      else { failed++; console.error('push falhou', e?.statusCode, e?.body || e?.message); }
    }
  }
  return { sent, removed, failed };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { data: sec, error: secErr } = await admin.rpc('push_secrets');
  if (secErr || !sec) return json({ error: 'config' }, 500);
  webpush.setVapidDetails('mailto:grupomarcosnascimento@gmail.com', sec.vapid_public, sec.vapid_private);

  const isCron = req.headers.get('x-cron-secret') === sec.push_cron_secret;
  let body: any = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const presenca = isCron && body && body.mode === 'presenca';

  // 1.74.4: lição nova do módulo avançado
  if (isCron && body && body.mode === 'avancado') {
    const { data: lib, error } = await admin.rpc('avancado_liberadas_hoje', { p_basico: 7, p_total: AVANCADO.length, p_intervalo: 15 });
    if (error) return json({ error: 'rpc', detail: error.message }, 500);
    const porEmail: Record<string, number> = {};
    (lib || []).forEach((r: any) => { porEmail[String(r.user_email).toLowerCase()] = r.licao; });
    const emails = Object.keys(porEmail);
    if (!emails.length) return json({ mode: 'avancado', pessoas: 0, sent: 0 });
    const { data: subs } = await admin.from('push_subscriptions').select('*').in('user_email', emails);
    const r = await enviar(admin, subs || [], s => {
      const n = porEmail[String(s.user_email).toLowerCase()], t = AVANCADO[n - 1] || '';
      return JSON.stringify({ kind: 'aviso', title: '🚀 Nova lição no módulo avançado', body: `Chegou a lição ${n}${t ? ': ' + t : ''}. Leva cerca de 6 minutos. Toque para abrir.`, tag: 'avancado-' + n, url: '/?ver=avancado' });
    }, 20 * 3600, 'normal', false);
    return json({ mode: 'avancado', pessoas: emails.length, candidates: (subs || []).length, ...r });
  }

  let subs: any[] = [];
  let kind = presenca ? 'aviso' : isCron ? 'daily' : 'test';
  let aviso: { title: string; body: string; tag: string; url: string } | null = null;
  if (presenca) {
    const tipo = body.tipo === 'saiu' ? 'saiu' : 'entrou';
    const nome = limpa(body.nome, 60) || 'Um usuário', loja = limpa(body.loja, 60);
    const min = Number(body.minutos) || 0;
    const tempo = min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
    aviso = tipo === 'entrou'
      ? { title: `🟢 Entrou no CA: ${loja || nome}`, body: `${nome}${loja ? ' (' + loja + ')' : ''} acabou de abrir o Cliente Assistido.`, tag: 'presenca-' + Date.now(), url: '/?tab=admin' }
      : { title: `⚪ Saiu do CA: ${loja || nome}`, body: `${nome}${loja ? ' (' + loja + ')' : ''} saiu do Cliente Assistido${min ? ' depois de ' + tempo + ' de uso' : ''}.`, tag: 'presenca-' + Date.now(), url: '/?tab=admin' };
    const { data: adms } = await admin.from('app_users').select('email').eq('role', 'admin').eq('active', true);
    const emails = (adms || []).map((d: any) => (d.email || '').toLowerCase()).filter(Boolean);
    if (emails.length) { const { data } = await admin.from('push_subscriptions').select('*').in('user_email', emails); subs = data || []; }
  } else if (isCron) {
    const { data } = await admin.from('push_subscriptions').select('*').eq('active', true);
    subs = (data || []).filter(s => { const n = localNow(s.tz || 'America/Sao_Paulo'); return n.hour === s.hour && s.last_sent !== n.date; });
  } else {
    const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: u } = await admin.auth.getUser(jwt);
    const email = (u?.user?.email || '').toLowerCase();
    if (!email) return json({ error: 'nao_autorizado' }, 401);
    if (body && body.mode === 'aviso') {
      kind = 'aviso';
      const storeId = String(body.store_id || '');
      const tipo = String(body.tipo || '');
      if (!storeId || !['aprovacao', 'venda'].includes(tipo)) return json({ error: 'pedido_invalido' }, 400);
      // Quem avisa precisa atender a loja: admin, operador atribuído ou alguém da própria loja.
      const { data: eu } = await admin.from('app_users').select('role,store_id,operator_store_ids,active').eq('email', email).maybeSingle();
      const pode = !!eu && eu.active && (eu.role === 'admin' || eu.store_id === storeId || (eu.role === 'operador' && (eu.operator_store_ids || []).includes(storeId)));
      if (!pode) return json({ error: 'sem_permissao' }, 403);
      const { data: donos } = await admin.from('app_users').select('email').eq('store_id', storeId).eq('role', 'lojista').eq('active', true);
      const emails = (donos || []).map((d: any) => (d.email || '').toLowerCase()).filter((e: string) => e && e !== email);
      if (!emails.length) return json({ mode: kind, candidates: 0, sent: 0 });
      const { data } = await admin.from('push_subscriptions').select('*').in('user_email', emails).eq('active', true);
      subs = data || [];
      const camp = limpa(body.campanha, 60);
      aviso = tipo === 'aprovacao'
        ? { title: 'Campanha para aprovar', body: camp ? `A campanha "${camp}" está pronta. Confira as mensagens e aprove para os envios começarem.` : 'Há uma campanha pronta para você aprovar.', tag: 'aviso-aprovacao', url: '/?tab=hoje' }
        : { title: 'Cliente com interesse de compra', body: 'Um cliente respondeu querendo comprar. Toque para ver quem é e chamar.', tag: 'aviso-venda', url: '/?tab=hoje' };
    } else if (body && body.mode === 'test_avancado') {
      // 1.74.4: teste do aviso do módulo avançado, só para os aparelhos de quem pediu.
      kind = 'aviso';
      const { data } = await admin.from('push_subscriptions').select('*').eq('user_email', email);
      subs = data || [];
      aviso = { title: '🚀 Aviso do módulo avançado ligado', body: 'Pronto! Quando chegar uma lição nova, você recebe um aviso como este.', tag: 'avancado-teste', url: '/?ver=avancado' };
    } else {
      const { data } = await admin.from('push_subscriptions').select('*').eq('user_email', email);
      subs = data || [];
    }
  }

  const payload = JSON.stringify(aviso ? { kind, ...aviso } : { kind, title: 'Cliente Assistido', url: '/?tab=campanha' });
  const r = await enviar(admin, subs, () => payload, presenca ? 3600 : 6 * 3600, aviso ? 'high' : 'normal', isCron && !presenca);
  return json({ mode: presenca ? 'presenca' : kind, candidates: subs.length, ...r });
});
