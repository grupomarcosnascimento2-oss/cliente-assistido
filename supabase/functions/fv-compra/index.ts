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
// 1.87.0: forma 'pix' cria o pagamento Pix direto na API (/v1/payments) e a página /fraternidade-viva/pagamento mostra o
// QR Code e o copia e cola, acompanha o pagamento ({acao:'status'}) e mostra a confirmação; forma 'cartao' vai para o
// Checkout Pro só com cartão; sem forma (páginas antigas) continua o Checkout Pro com Pix e cartão.
// {acao:'novopix', id} gera um Pix novo quando o anterior venceu (30 min).
// E-mail ao liberar (uma vez, email_enviado_em): segredo BREVO_API_KEY ou RESEND_API_KEY + EMAIL_REMETENTE
// (remetente verificado no provedor). Sem eles, não envia e grava email_erro 'sem_provedor'.
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
const PIX_MIN = 30;
const ZAP = '5561999999340';
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[ch]);
const dataBR = (d: string) => d ? d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4) : '';

// Pix direto na API do Mercado Pago (QR Code e copia e cola na página da Fraternidade Viva)
async function gerarPix(c: { id: string; nome: string; email: string; valor: number; tipo: string; membros?: number }) {
  const exp = new Date(Date.now() + PIX_MIN * 60e3 - 3 * 3600e3).toISOString().replace('Z', '-03:00');
  const [first, ...rest] = String(c.nome).split(' ');
  const r = await mp('/v1/payments', {
    method: 'POST',
    headers: { 'X-Idempotency-Key': c.id + '-' + Date.now() },
    body: JSON.stringify({
      transaction_amount: Number(c.valor),
      description: c.tipo === 'pastoral' ? `Fraternidade Viva – pacote para ${c.membros} membros` : 'Fraternidade Viva – formação individual (60 dias)',
      payment_method_id: 'pix',
      payer: { email: c.email, first_name: first, last_name: rest.join(' ') || first },
      external_reference: c.id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/fv-compra?aviso=1`,
      date_of_expiration: exp,
      statement_descriptor: 'FRATERNIDADEVIVA'
    })
  });
  const td = r.d?.point_of_interaction?.transaction_data;
  if (!r.ok || !td?.qr_code) return null;
  const upd = { mp_pagamento: String(r.d.id), mp_status: r.d.status, mp_tipo: 'bank_transfer', mp_metodo: 'pix', forma: 'pix', status: 'pendente',
    pix_qr: td.qr_code, pix_qr64: td.qr_code_base64 || null, pix_expira: r.d.date_of_expiration ? new Date(r.d.date_of_expiration).toISOString() : new Date(Date.now() + PIX_MIN * 60e3).toISOString() };
  await sb.from('fv_compras').update(upd).eq('id', c.id);
  return upd;
}

// e-mail de boas-vindas (uma vez por compra); provedor por segredo
async function enviarEmail(compraId: string) {
  const { data: trava } = await sb.from('fv_compras').update({ email_enviado_em: new Date().toISOString(), email_erro: null }).eq('id', compraId).is('email_enviado_em', null).eq('status', 'liberado').select('*');
  const c = trava?.[0];
  if (!c) return;
  const brevo = Deno.env.get('BREVO_API_KEY'), resend = Deno.env.get('RESEND_API_KEY'), rem = Deno.env.get('EMAIL_REMETENTE');
  const falhou = async (e: string) => { await sb.from('fv_compras').update({ email_enviado_em: null, email_erro: e.slice(0, 300) }).eq('id', c.id); };
  if (!rem || (!brevo && !resend)) return await falhou('sem_provedor');
  const pastoral = c.tipo === 'pastoral';
  const assunto = pastoral ? 'Sua pastoral já pode começar a Fraternidade Viva' : 'Seu acesso à Fraternidade Viva está liberado';
  const passo = (n: number, t: string) => `<tr><td style="vertical-align:top;padding:6px 10px 6px 0"><span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:#0B2545;color:#fff;text-align:center;line-height:26px;font-weight:700">${n}</span></td><td style="padding:6px 0;font-size:16px;line-height:1.5">${t}</td></tr>`;
  const passos = pastoral
    ? [`Abra <a href="${SITE}">${SITE.replace('https://', '')}</a> no celular.`, `Toque em <b>Entrar com o Google</b> e use este e-mail: <b>${esc(c.email)}</b>.`, `Você entra como <b>coordenador(a)</b>. Abra o menu <b>Membros</b> e cadastre o Gmail de cada membro (são <b>${c.membros} vagas</b>).`, 'Cada membro entra pelo mesmo endereço, com o próprio Gmail, e tem 30 dias de acesso a partir da entrada.']
    : [`Abra <a href="${SITE}">${SITE.replace('https://', '')}</a> no celular.`, `Toque em <b>Entrar com o Google</b> e use este e-mail: <b>${esc(c.email)}</b>.`, 'A formação abre direto na primeira lição. Toque em <b>Ouvir a lição</b> e a Mariana conduz você.'];
  const html = `<div style="background:#FBF7F1;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1d2433">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #eadfcd">
<div style="background:#0B2545;color:#fff;padding:22px 24px"><div style="color:#E8C55A;font-size:13px;letter-spacing:2px;font-weight:700">FRATERNIDADE VIVA</div>
<div style="font-size:22px;font-weight:700;margin-top:6px">Pagamento confirmado. Que alegria ter você!</div></div>
<div style="padding:22px 24px">
<p style="font-size:16px;line-height:1.55;margin:0 0 12px">Olá, ${esc(String(c.nome).split(' ')[0])}!</p>
<p style="font-size:16px;line-height:1.55;margin:0 0 16px">${pastoral ? `O pacote da sua pastoral, com <b>${c.membros} membros</b>, está liberado.` : `O seu acesso à formação está liberado <b>até ${dataBR(c.acesso_ate)}</b>.`} Veja como entrar:</p>
<table role="presentation" style="border-collapse:collapse;margin:0 0 18px">${passos.map((t, i) => passo(i + 1, t)).join('')}</table>
<p style="text-align:center;margin:22px 0"><a href="${SITE}" style="background:#0A8F52;color:#fff;text-decoration:none;padding:14px 26px;border-radius:30px;font-weight:700;font-size:16px;display:inline-block">Entrar na formação</a></p>
<p style="font-size:14px;line-height:1.5;color:#5b6475;margin:0">Importante: use exatamente o e-mail acima. Com outro e-mail o acesso não aparece.<br>Dúvidas? Fale com o nosso time pelo WhatsApp: <a href="https://wa.me/${ZAP}">(61) 99999-9340</a>.</p>
</div><div style="background:#f4efe6;padding:14px 24px;font-size:12px;color:#7a6f5c">Valor pago: R$ ${Number(c.valor).toFixed(2).replace('.', ',')} · Compra ${String(c.id).slice(0, 8)} · Garantia de 7 dias.</div></div></div>`;
  try {
    let r: Response;
    if (brevo) r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': brevo, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ sender: { name: 'Fraternidade Viva', email: rem }, to: [{ email: c.email, name: c.nome }], subject: assunto, htmlContent: html }) });
    else r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + resend, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `Fraternidade Viva <${rem}>`, to: [c.email], subject: assunto, html }) });
    if (!r.ok) await falhou('provedor ' + r.status + ': ' + (await r.text()));
  } catch (e) { await falhou(String(e)); }
}

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
  // 1.87.1: individual também informa o WhatsApp (opcional no servidor, porque as páginas antigas não mandam)
  if (!pastoral && body.whatsapp) {
    const zi = String(body.whatsapp).replace(/\D/g, '');
    if (zi.length < 10 || zi.length > 13) return json({ erro: 'whatsapp' });
    extra.whatsapp = zi;
  }
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
  const forma = body.forma === 'pix' ? 'pix' : body.forma === 'cartao' ? 'cartao' : '';
  if (forma === 'pix') {
    const px = await gerarPix({ id: c.id, nome, email, valor, tipo: extra.tipo as string, membros: extra.membros as number });
    if (!px) { await sb.from('fv_compras').update({ status: 'cancelado', obs: 'Pix não criado' }).eq('id', c.id); return json({ erro: 'mp' }); }
    return json({ ok: true, id: c.id, url: `${SITE}/fraternidade-viva/pagamento?c=${c.id}` });
  }
  if (forma) await sb.from('fv_compras').update({ forma }).eq('id', c.id);
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
      // só Pix e cartão (pedido do Marcos, 14/11/2026): fora boleto, lotérica e crédito do Mercado Pago
      payment_methods: {
        installments: pastoral ? 6 : 1,
        excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }, { id: 'digital_currency' }, ...(forma === 'cartao' ? [{ id: 'bank_transfer' }] : [])]
      }
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
  if (c.tipo === 'pastoral') { const r = await liberarPastoral(c); if (r?.status === 'liberado') await enviarEmail(c.id); return r; }
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
  await enviarEmail(c.id);
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
  // 1.86.0: forma de pagamento para a tela Admin → Vendas (bank_transfer = Pix, credit_card, debit_card)
  const forma = { mp_tipo: p.d.payment_type_id || null, mp_metodo: p.d.payment_method_id || null, mp_parcelas: p.d.installments || null };
  const valorOk = Number(p.d.transaction_amount) >= Number(c.valor) - 0.001 && p.d.currency_id === 'BRL';
  if (st === 'approved' && valorOk) {
    if (c.status === 'pendente' || c.status === 'recusado') {
      await sb.from('fv_compras').update({ status: 'pago', mp_pagamento: String(p.d.id), mp_status: st, ...forma, pago_em: p.d.date_approved || new Date().toISOString() }).eq('id', c.id);
    } else {
      await sb.from('fv_compras').update(forma).eq('id', c.id);
    }
    await liberar(c.id);
  } else if (c.status === 'pendente') {
    await sb.from('fv_compras').update({ mp_status: st, ...forma, ...(st === 'rejected' || st === 'cancelled' ? { status: 'recusado' } : {}) }).eq('id', c.id);
  }
}

async function status(body: any) {
  const id = String(body.id || '');
  if (!uuid(id)) return json({ erro: 'id' });
  const CAMPOS = 'id, status, acesso_ate, criado_em, tipo, membros, nome, email, valor, forma, mp_pagamento, pix_qr, pix_qr64, pix_expira, email_enviado_em, email_erro';
  let { data: c } = await sb.from('fv_compras').select(CAMPOS).eq('id', id).maybeSingle();
  if (!c) return json({ erro: 'id' });
  if ((c.status === 'pendente' || c.status === 'recusado' || c.status === 'pago') && token()) {
    if (body.pagamento) await conferirPagamento(String(body.pagamento).replace(/\D/g, ''));
    else if (c.forma === 'pix' && c.mp_pagamento) await conferirPagamento(c.mp_pagamento);
    else {
      const s = await mp('/v1/payments/search?external_reference=' + id + '&sort=date_created&criteria=desc');
      for (const p of (s.d?.results || []).slice(0, 3)) await conferirPagamento(String(p.id));
    }
    if (c.status === 'pago') await liberar(id);
    ({ data: c } = await sb.from('fv_compras').select(CAMPOS).eq('id', id).maybeSingle());
  }
  // liberado sem e-mail (falha passageira do provedor): tenta de novo quando a página consulta
  if (c!.status === 'liberado' && !c!.email_enviado_em && c!.email_erro !== 'sem_provedor') { await enviarEmail(id); ({ data: c } = await sb.from('fv_compras').select(CAMPOS).eq('id', id).maybeSingle()); }
  const r: Record<string, unknown> = { ok: true, status: c!.status, acesso_ate: c!.acesso_ate, tipo: c!.tipo, membros: c!.membros, forma: c!.forma,
    nome: String(c!.nome || '').split(' ')[0], email: c!.email, valor: c!.valor, email_enviado: !!c!.email_enviado_em };
  if (c!.forma === 'pix' && (c!.status === 'pendente' || c!.status === 'recusado')) {
    r.pix = { qr: c!.pix_qr, qr64: c!.pix_qr64, expira: c!.pix_expira, vencido: !c!.pix_expira || new Date(c!.pix_expira).getTime() < Date.now() };
  }
  return json(r);
}

// Pix vencido: gera outro para a mesma compra
async function novoPix(body: any) {
  const id = String(body.id || '');
  if (!uuid(id) || !token()) return json({ erro: 'id' });
  const { data: c } = await sb.from('fv_compras').select('id, nome, email, valor, tipo, membros, status, forma, pix_expira, mp_pagamento').eq('id', id).maybeSingle();
  if (!c || c.forma !== 'pix' || !(c.status === 'pendente' || c.status === 'recusado')) return json({ erro: 'id' });
  if (c.pix_expira && new Date(c.pix_expira).getTime() > Date.now() + 60e3) return json({ ok: true });
  if (c.mp_pagamento) await conferirPagamento(c.mp_pagamento); // pode ter pago no último minuto
  const { data: d } = await sb.from('fv_compras').select('status').eq('id', id).maybeSingle();
  if (d?.status !== 'pendente' && d?.status !== 'recusado') return json({ ok: true });
  const px = await gerarPix(c as any);
  return json(px ? { ok: true } : { erro: 'mp' });
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
    if (body.acao === 'novopix') return await novoPix(body);
    return json({ erro: 'acao' });
  } catch (e) {
    console.log('fv-compra falha', String(e));
    return json({ erro: 'falha' });
  }
});
