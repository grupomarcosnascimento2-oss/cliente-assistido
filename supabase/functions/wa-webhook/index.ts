// Cliente Assistido – API oficial do WhatsApp: webhook da Meta (1.55.0).
// GET: verificação da Meta (hub.verify_token = segredo WA_VERIFY_TOKEN).
// POST: confirmações de entrega/leitura/falha das mensagens enviadas pela wa-envio (atualiza wa_fila pelo wa_msg_id)
// e respostas dos clientes (marca 'respondeu' no último lembrete enviado ao número, para o app marcar o contato).
// Se o segredo WA_APP_SECRET existir, confere a assinatura X-Hub-Signature-256 de cada aviso.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const ORDEM: Record<string, number> = { enviando: 0, enviado: 1, entregue: 2, lido: 3, respondeu: 4, falhou: 5 };
const MAPA: Record<string, string> = { sent: 'enviado', delivered: 'entregue', read: 'lido', failed: 'falhou' };

async function assinaturaOk(raw: string, sig: string | null) {
  const segredo = Deno.env.get('WA_APP_SECRET')?.trim();
  if (!segredo) return true;
  if (!sig || !sig.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
  const hex = Array.from(mac).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === sig.slice(7);
}
// Números do Brasil podem chegar com ou sem o nono dígito
function variantes(n: string) {
  const d = String(n || '').replace(/\D/g, ''); const v = new Set([d]);
  if (d.startsWith('55') && d.length === 13 && d[4] === '9') v.add(d.slice(0, 4) + d.slice(5));
  if (d.startsWith('55') && d.length === 12) v.add(d.slice(0, 4) + '9' + d.slice(4));
  return [...v];
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === 'GET') {
    const ok = url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === (Deno.env.get('WA_VERIFY_TOKEN') || '').trim() && !!Deno.env.get('WA_VERIFY_TOKEN');
    return new Response(ok ? (url.searchParams.get('hub.challenge') || '') : 'proibido', { status: ok ? 200 : 403 });
  }
  if (req.method !== 'POST') return new Response('ok');
  const raw = await req.text();
  if (!(await assinaturaOk(raw, req.headers.get('x-hub-signature-256')))) return new Response('assinatura', { status: 401 });
  let body: any = {}; try { body = JSON.parse(raw); } catch (_) { return new Response('ok'); }
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const agora = new Date().toISOString();
  for (const e of body.entry || []) for (const ch of e.changes || []) {
    const v = ch.value || {};
    for (const s of v.statuses || []) {
      const novo = MAPA[s.status]; if (!novo || !s.id) continue;
      const { data: it } = await admin.from('wa_fila').select('id,status').eq('wa_msg_id', s.id).maybeSingle();
      if (!it) continue;
      if (novo !== 'falhou' && (ORDEM[it.status] ?? 0) >= ORDEM[novo]) continue; // nunca volta: lido não vira entregue
      if (novo === 'falhou' && (ORDEM[it.status] ?? 0) >= ORDEM.entregue) continue;
      const erro = novo === 'falhou' ? String(s.errors?.[0]?.title || s.errors?.[0]?.message || 'falhou').slice(0, 300) : null;
      await admin.from('wa_fila').update({ status: novo, erro, atualizado_em: agora }).eq('id', it.id);
    }
    const phoneId = v.metadata?.phone_number_id;
    for (const m of v.messages || []) {
      if (!phoneId || !m.from) continue;
      const { data: cfg } = await admin.from('wa_config').select('store_id').eq('phone_number_id', phoneId).maybeSingle();
      if (!cfg) continue;
      const desde = new Date(Date.now() - 15 * 86400000).toISOString();
      const { data: it } = await admin.from('wa_fila').select('id,num,status').eq('store_id', cfg.store_id).in('num', variantes(m.from))
        .in('status', ['enviado', 'entregue', 'lido']).gte('enviar_em', desde).order('enviar_em', { ascending: false }).limit(1).maybeSingle();
      if (!it) continue;
      await admin.from('wa_fila').update({ status: 'respondeu', atualizado_em: agora }).eq('id', it.id);
      await admin.from('activity_log').insert({ store_id: cfg.store_id, user_email: 'api-whatsapp', user_role: 'api', action: 'marcou_respondeu', detail: { num: it.num, api: true } });
    }
  }
  return new Response('ok');
});
