// Cliente Assistido – compra individual da formação Fraternidade Viva pelo Mercado Pago (1.84.0).
// Fluxo: a página /fraternidade-viva/opcao3 manda {acao:'criar', nome, email}; a função grava a compra em fv_compras,
// cria a preferência no Mercado Pago e devolve o link do checkout (Pix ou cartão).
// O Mercado Pago avisa esta mesma função (?aviso=1). O aviso NÃO é confiado: a função consulta o pagamento na API
// do Mercado Pago com a chave da conta e só libera se estiver aprovado, com o valor certo e a referência da compra.
// Liberar = cadastrar o e-mail como aluno na loja "Alunos independentes – Fraternidade Viva" com 60 dias de acesso
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
  // freio simples: no máximo 5 tentativas por e-mail por hora
  const umaHora = new Date(Date.now() - 3600e3).toISOString();
  const { count } = await sb.from('fv_compras').select('id', { count: 'exact', head: true }).eq('email', email).gte('criado_em', umaHora);
  if ((count || 0) >= 5) return json({ erro: 'muitas' });
  // e-mail já cadastrado em outra loja não pode virar aluno independente
  const { data: u } = await sb.from('app_users').select('store_id, role').eq('email', email).maybeSingle();
  if (u && u.store_id !== LOJA_FV) return json({ erro: 'ja_cadastrado' });

  const { data: c, error } = await sb.from('fv_compras').insert({ nome, email, valor: VALOR }).select('id').single();
  if (error || !c) return json({ erro: 'banco' });
  const volta = `${SITE}/fraternidade-viva/obrigado?c=${c.id}`;
  const pref = await mp('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ id: 'fv-individual', title: 'Fraternidade Viva – formação individual (60 dias)', quantity: 1, unit_price: VALOR, currency_id: 'BRL' }],
      payer: { name: nome, email },
      external_reference: c.id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/fv-compra?aviso=1`,
      back_urls: { success: volta, pending: volta, failure: volta },
      auto_return: 'approved',
      statement_descriptor: 'FRATERNIDADEVIVA',
      payment_methods: { installments: 1 }
    })
  });
  if (!pref.ok || !pref.d?.init_point) { await sb.from('fv_compras').update({ status: 'cancelado', obs: 'preferência não criada' }).eq('id', c.id); return json({ erro: 'mp' }); }
  await sb.from('fv_compras').update({ mp_preferencia: pref.d.id }).eq('id', c.id);
  return json({ ok: true, id: c.id, url: pref.d.init_point });
}

async function liberar(compraId: string) {
  const { data: c } = await sb.from('fv_compras').select('*').eq('id', compraId).maybeSingle();
  if (!c || c.status === 'liberado' || c.status === 'conflito') return c;
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
  let { data: c } = await sb.from('fv_compras').select('id, status, acesso_ate, criado_em').eq('id', id).maybeSingle();
  if (!c) return json({ erro: 'id' });
  if ((c.status === 'pendente' || c.status === 'recusado' || c.status === 'pago') && token()) {
    if (body.pagamento) await conferirPagamento(String(body.pagamento).replace(/\D/g, ''));
    else {
      const s = await mp('/v1/payments/search?external_reference=' + id + '&sort=date_created&criteria=desc');
      for (const p of (s.d?.results || []).slice(0, 3)) await conferirPagamento(String(p.id));
    }
    if (c.status === 'pago') await liberar(id);
    ({ data: c } = await sb.from('fv_compras').select('id, status, acesso_ate, criado_em').eq('id', id).maybeSingle());
  }
  return json({ ok: true, status: c!.status, acesso_ate: c!.acesso_ate });
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
