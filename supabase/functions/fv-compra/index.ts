// Cliente Assistido – compra da formação Fraternidade Viva pelo Mercado Pago (1.84.0 individual; 1.85.0 pacote da pastoral).
// Pastoral (tipo 'pastoral'): o coordenador informa nome, e-mail Google, WhatsApp e nº de membros (1.85.2: pastoral, paróquia e cidade saíram da página; se vierem, entram no nome da loja)
// (5 a 200; R$ 99 pelos 5 primeiros + R$ 9,90 por membro a mais). Pago: cria a loja (plano treino, curso fraternidade,
// segmento igreja, recursos.vagas = membros) e o coordenador como lojista; ele cadastra os membros no painel Membros.
// Coordenador que já é lojista de uma loja da Fraternidade Viva compra mais vagas: soma em recursos.vagas.
// Fluxo: a página /fraternidade-viva/opcao3 manda {acao:'criar', nome, email}; a função grava a compra em fv_compras,
// cria a preferência no Mercado Pago e devolve o link do checkout (Pix ou cartão).
// O Mercado Pago avisa esta mesma função (?aviso=1). O aviso NÃO é confiado: a função consulta o pagamento na API
// do Mercado Pago com a chave da conta e só libera se estiver aprovado, com o valor certo e a referência da compra.
// Individual: liberar = cadastrar o e-mail como aluno na loja "Alunos independentes – Fraternidade Viva" com 60 dias de acesso
// (quem já é aluno dessa loja ganha +60 dias). E-mail já cadastrado em outra loja vira 'conflito' para o admin resolver.
// {acao:'status', id} devolve a situação para a página de retorno e, se ainda estiver pendente, consulta o Mercado Pago.
// Segredo necessário: MP_ACCESS_TOKEN (Access Token de produção da conta do Mercado Pago). Sem ele: erro 'sem_chave'.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });

const LOJA_FV = '228275e9-3e0d-442a-935c-ee67d5d3bcbc';
const VALOR = 39.90;
const MIN = 5, MAX = 200;
const valorPastoral = (n: number) => Math.round((99 + Math.max(0, n - MIN) * 9.9) * 100) / 100;
const DIAS = 60;
const SITE = 'https://cliente-assistido.vercel.app';
const MP = 'https://api.mercadopago.com';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const token = () => Deno.env.get('MP_ACCESS_TOKEN') || '';
const hoje = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const soma = (d: string, n: number) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const uuid = (s: unknown) => /^[0-9a-f-]{36}$/i.test(String(s || ''));

async function mp(path: string, init: RequestInit = {}) {
  const r = await fetch(MP + path, { ...init, headers: { Authorization: 'Bearer ' + token(), 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const t = await r.text();
  let d: any = null; try { d = JSON.parse(t); } catch { /* */ }
  if (!r.ok) console.log('fv-compra mp erro', path, r.status, t.slice(0, 300));
  return { ok: r.ok, d };
}

async function criar(body: any) {
  if (!token()) return json({ erro: 'sem_chave' });
  const nome = String(body.nome || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const email = String(body.email || '').trim().toLowerCase();
  if (nome.length < 3) return json({ erro: 'nome' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 120) return json({ erro: 'email' });
  const pastoral = body.tipo === 'pastoral';
  const extra: Record<string, unknown> = { tipo: pastoral ? 'pastoral' : 'individual' };
  let valor = VALOR, titulo = 'Fraternidade Viva – formação individual (60 dias)';
  if (pastoral) {
    const t = (v: unknown, n: number) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, n);
    const zap = String(body.whatsapp || '').replace(/\D/g, '');
    const membros = Math.floor(Number(body.membros));
    extra.pastoral = t(body.pastoral, 80) || null; extra.paroquia = t(body.paroquia, 100) || null; extra.cidade = t(body.cidade, 60) || null;
    extra.whatsapp = zap; extra.membros = membros;
    if (zap.length < 10 || zap.length > 13) return json({ erro: 'whatsapp' });
    if (!(membros >= MIN && membros <= MAX)) return json({ erro: 'membros' });
    valor = valorPastoral(membros);
    titulo = `Fraternidade Viva – pacote para ${membros} membros`;
  }
  // freio simples: no máximo 5 tentativas por e-mail por hora
  const umaHora = new Date(Date.now() - 3600e3).toISOString();
  const { count } = await sb.from('fv_compras').select('id', { count: 'exact', head: true }).eq('email', email).gte('criado_em', umaHora);
  if ((count || 0) >= 5) return json({ erro: 'muitas' });
  // e-mail já cadastrado em outra loja não pode virar aluno independente
  const { data: u } = await sb.from('app_users').select('store_id, role').eq('email', email).maybeSingle();
  if (u && !pastoral && u.store_id !== LOJA_FV) return json({ erro: 'ja_cadastrado' });
  if (u && pastoral && !(await lojaDoCoordenador(u))) return json({ erro: 'ja_cadastrado' });

  const { data: c, error } = await sb.from('fv_compras').insert({ nome, email, valor, ...extra }).select('id').single();
  if (error || !c) return json({ erro: 'banco' });
  const volta = `${SITE}/fraternidade-viva/obrigado?c=${c.id}`;
  const pref = await mp('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ id: pastoral ? 'fv-pastoral' : 'fv-individual', title: titulo, quantity: 1, unit_price: valor, currency_id: 'BRL' }],
      payer: { name: nome, email },
      external_reference: c.id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/fv-compra?aviso=1`,
      back_urls: { success: volta, pending: volta, failure: volta },
      auto_return: 'approved',
      statement_descriptor: 'FRATERNIDADEVIVA',
      payment_methods: { installments: pastoral ? 6 : 1 }
    })
  });
  if (!pref.ok || !pref.d?.init_point) { await sb.from('fv_compras').update({ status: 'cancelado', obs: 'preferência não criada' }).eq('id', c.id); return json({ erro: 'mp' }); }
  await sb.from('fv_compras').update({ mp_preferencia: pref.d.id }).eq('id', c.id);
  return json({ ok: true, id: c.id, url: pref.d.init_point });
}

// coordenador (lojista) de uma loja da Fraternidade Viva: pode comprar mais vagas
async function lojaDoCoordenador(u: { store_id: string | null; role: string }) {
  if (!u || u.role !== 'lojista' || !u.store_id) return null;
  const { data: l } = await sb.from('stores').select('id, plan, max_devices, recursos').eq('id', u.store_id).maybeSingle();
  if (!l || l.plan !== 'treino' || (l.recursos || {}).curso !== 'fraternidade' || (l.recursos || {}).independente) return null;
  return l;
}

async function liberarPastoral(c: any) {
  const n = Number(c.membros) || MIN;
  const { data: u } = await sb.from('app_users').select('id, store_id, role').eq('email', c.email).maybeSingle();
  let lojaId: string;
  if (u) {
    const l = await lojaDoCoordenador(u);
    if (!l) { await sb.from('fv_compras').update({ status: 'conflito', obs: 'e-mail já cadastrado e não é coordenador da Fraternidade Viva' }).eq('id', c.id); return { ...c, status: 'conflito' }; }
    const r = l.recursos || {};
    const vagas = (typeof r.vagas === 'number' ? r.vagas : 0) + n;
    await sb.from('stores').update({ recursos: { ...r, vagas }, max_devices: Math.max(l.max_devices || 1, vagas + 5), active: true }).eq('id', l.id);
    lojaId = l.id;
  } else {
    const { data: l, error } = await sb.from('stores').insert({
      name: (c.pastoral && c.paroquia ? `${c.pastoral} – ${c.paroquia}` : `Fraternidade Viva – Pastoral de ${c.nome}`).slice(0, 150), plan: 'treino', active: true, max_devices: n + 5, sync_enabled: false,
      cidade: c.cidade, whatsapp: c.whatsapp, responsavel: c.nome,
      recursos: { on: ['treino'], curso: 'fraternidade', segmento: 'igreja', vagas: n, compra: c.id }
    }).select('id').single();
    if (error || !l) { await sb.from('fv_compras').update({ status: 'conflito', obs: 'loja: ' + (error?.message || '') }).eq('id', c.id); return { ...c, status: 'conflito' }; }
    const { error: e2 } = await sb.from('app_users').insert({ email: c.email, name: c.nome, role: 'lojista', store_id: l.id, treino: true, active: true });
    if (e2) {
      await sb.from('stores').update({ active: false }).eq('id', l.id);
      await sb.from('fv_compras').update({ status: 'conflito', obs: 'coordenador: ' + e2.message, store_id: l.id }).eq('id', c.id);
      return { ...c, status: 'conflito' };
    }
    lojaId = l.id;
  }
  await sb.from('fv_compras').update({ status: 'liberado', liberado_em: new Date().toISOString(), store_id: lojaId }).eq('id', c.id);
  return { ...c, status: 'liberado', store_id: lojaId };
}

async function liberar(compraId: string) {
  const { data: c } = await sb.from('fv_compras').select('*').eq('id', compraId).maybeSingle();
  if (!c || c.status === 'liberado' || c.status === 'conflito') return c;
  if (c.tipo === 'pastoral') return await liberarPastoral(c);
  const { data: u } = await sb.from('app_users').select('id, store_id, acesso_ate').eq('email', c.email).maybeSingle();
  const h = hoje();
  let ate: string;
  if (!u) {
    ate = soma(h, DIAS);
    const { error } = await sb.from('app_users').insert({ email: c.email, name: c.nome, role: 'aluno', store_id: LOJA_FV, treino: true, active: true, acesso_ate: ate });
    if (error) { await sb.from('fv_compras').update({ status: 'conflito', obs: 'cadastro: ' + error.message }).eq('id', c.id); return { ...c, status: 'conflito' }; }
  } else if (u.store_id === LOJA_FV) {
    const base = u.acesso_ate && u.acesso_ate > h ? u.acesso_ate : h;
    ate = soma(base, DIAS);
    await sb.from('app_users').update({ active: true, treino: true, role: 'aluno', acesso_ate: ate }).eq('id', u.id);
  } else {
    await sb.from('fv_compras').update({ status: 'conflito', obs: 'e-mail já cadastrado em outra loja' }).eq('id', c.id);
    return { ...c, status: 'conflito' };
  }
  await sb.from('fv_compras').update({ status: 'liberado', liberado_em: new Date().toISOString(), acesso_ate: ate }).eq('id', c.id);
  return { ...c, status: 'liberado', acesso_ate: ate };
}

// confere um pagamento na API e, se for desta compra e estiver aprovado, libera
async function conferirPagamento(pagId: string) {
  if (!pagId || !token()) return;
  const p = await mp('/v1/payments/' + encodeURIComponent(pagId));
  if (!p.ok || !p.d) return;
  const ref = String(p.d.external_reference || '');
  if (!uuid(ref)) return;
  const { data: c } = await sb.from('fv_compras').select('id, status, valor').eq('id', ref).maybeSingle();
  if (!c) return;
  const st = String(p.d.status || '');
  const valorOk = Number(p.d.transaction_amount) >= Number(c.valor) - 0.001 && p.d.currency_id === 'BRL';
  if (st === 'approved' && valorOk) {
    if (c.status === 'pendente' || c.status === 'recusado') {
      await sb.from('fv_compras').update({ status: 'pago', mp_pagamento: String(p.d.id), mp_status: st, pago_em: p.d.date_approved || new Date().toISOString() }).eq('id', c.id);
    }
    await liberar(c.id);
  } else if (c.status === 'pendente') {
    await sb.from('fv_compras').update({ mp_status: st, ...(st === 'rejected' || st === 'cancelled' ? { status: 'recusado' } : {}) }).eq('id', c.id);
  }
}

async function status(body: any) {
  const id = String(body.id || '');
  if (!uuid(id)) return json({ erro: 'id' });
  const CAMPOS = 'id, status, acesso_ate, criado_em, tipo, membros';
  let { data: c } = await sb.from('fv_compras').select(CAMPOS).eq('id', id).maybeSingle();
  if (!c) return json({ erro: 'id' });
  if ((c.status === 'pendente' || c.status === 'recusado' || c.status === 'pago') && token()) {
    if (body.pagamento) await conferirPagamento(String(body.pagamento).replace(/\D/g, ''));
    else {
      const s = await mp('/v1/payments/search?external_reference=' + id + '&sort=date_created&criteria=desc');
      for (const p of (s.d?.results || []).slice(0, 3)) await conferirPagamento(String(p.id));
    }
    if (c.status === 'pago') await liberar(id);
    ({ data: c } = await sb.from('fv_compras').select(CAMPOS).eq('id', id).maybeSingle());
  }
  return json({ ok: true, status: c!.status, acesso_ate: c!.acesso_ate, tipo: c!.tipo, membros: c!.membros });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const u = new URL(req.url);
  try {
    if (u.searchParams.get('aviso')) {
      // aviso do Mercado Pago (webhook novo ou IPN antigo); sempre responde 200
      let b: any = {}; try { b = await req.json(); } catch { /* */ }
      const tipo = b.type || b.topic || u.searchParams.get('type') || u.searchParams.get('topic') || '';
      const pid = String(b.data?.id || u.searchParams.get('data.id') || u.searchParams.get('id') || '');
      if (String(tipo).startsWith('payment') && /^\d+$/.test(pid)) await conferirPagamento(pid);
      return json({ ok: true });
    }
    if (req.method !== 'POST') return json({ erro: 'metodo' });
    const body = await req.json().catch(() => ({}));
    if (body.acao === 'criar') return await criar(body);
    if (body.acao === 'status') return await status(body);
    return json({ erro: 'acao' });
  } catch (e) {
    console.log('fv-compra falha', String(e));
    return json({ erro: 'falha' });
  }
});
