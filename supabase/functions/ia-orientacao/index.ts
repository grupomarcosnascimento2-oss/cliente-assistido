// Cliente Assistido – Orientação rápida com IA (1.70.0). O dono informa o assunto e explica o processo do jeito dele;
// a IA organiza em passos curtos e cria perguntas de múltipla escolha para conferir se a equipe entendeu.
// Não grava a orientação: devolve o rascunho para o dono revisar e publicar (store_guides, limite de 4 por mês no banco).
// Limite de rascunhos: IA_ORIENT_MES (padrão 15) por loja no mês; admin sem limite. Uso em ai_usage tipo 'orientacao'.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
const falha = (e: string) => { console.log('ia-orientacao erro', e); return json({ erro: e }); };
const limpa = (t: unknown, n: number) => String(t ?? '').replace(/\r/g, '').trim().slice(0, n);

const RAMOS: Record<string, string> = { farmacia: 'farmácia / drogaria', odonto: 'clínica dentária', hotelaria: 'hotel / pousada', auto_center: 'auto center / oficina', otica: 'ótica', pet: 'pet shop', beleza: 'salão, barbearia ou estética', salao: 'salão', clinica: 'estética', roupas: 'loja de roupas', academia: 'academia', alimentacao: 'alimentação', supermercado: 'supermercado', educacao: 'escola / curso', servicos: 'serviços' };

function sistema(loja: string, ramo: string) {
  return `Você ajuda o dono de uma empresa${loja ? ` ("${loja}")` : ''}${ramo ? ` do ramo ${ramo}` : ''} a transformar a explicação dele sobre um processo ou rotina interna numa ORIENTAÇÃO RÁPIDA para a equipe.
Regras:
- Use SOMENTE o que o dono escreveu. Não invente regras, valores, horários, prazos, nomes, leis ou etapas que ele não citou. Se faltar algo, não complete.
- Português do Brasil simples, frases curtas, tratamento por "você", tom gentil e direto. Sem emojis.
- titulo: até 60 caracteres, claro (ex.: "Como fechar o caixa").
- resumo: 1 frase de até 160 caracteres dizendo para que serve.
- passos: de 3 a 8 passos na ordem certa, cada um com até 220 caracteres, começando com verbo (ex.: "Confira...").
- perguntas: de 3 a 5 perguntas de múltipla escolha sobre os passos, cada uma com 3 opções curtas (até 90 caracteres), só UMA certa e as outras plausíveis mas claramente erradas pelo texto; "certa" é o índice (0, 1 ou 2) da opção correta; varie a posição da certa.
- Se o texto do dono pedir algo ilegal, discriminatório, enganoso com o cliente, contra a LGPD ou contra as regras do WhatsApp (robô, disparo em massa), não monte a orientação e devolva {"erro":"conteudo"}.
Responda SOMENTE com JSON válido, sem texto fora dele, no formato:
{"titulo":"...","resumo":"...","passos":["..."],"perguntas":[{"p":"...","opcoes":["...","...","..."],"certa":0}]}`;
}

async function chamarIA(sis: string, user: string) {
  const prov = (Deno.env.get('AI_PROVIDER')?.trim() || (Deno.env.get('ANTHROPIC_API_KEY') ? 'anthropic' : 'openai')).toLowerCase();
  if (prov === 'anthropic') {
    const key = Deno.env.get('ANTHROPIC_API_KEY')?.trim(); if (!key) return { erro: 'sem_chave' };
    const modelo = Deno.env.get('AI_MODEL')?.trim() || 'claude-haiku-5-5';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelo, max_tokens: 2000, system: sis, messages: [{ role: 'user', content: user }] })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
    return { texto: (d.content || []).map((c: any) => c.text || '').join(''), prov, modelo, tin: d.usage?.input_tokens || 0, tout: d.usage?.output_tokens || 0 };
  }
  const key = (Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY'))?.trim(); if (!key) return { erro: 'sem_chave' };
  const modelo = Deno.env.get('AI_MODEL')?.trim() || 'gpt-6-luna';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: sis }, { role: 'user', content: user }] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('openai', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
  return { texto: d.choices?.[0]?.message?.content || '', prov: 'openai', modelo, tin: d.usage?.prompt_tokens || 0, tout: d.usage?.completion_tokens || 0 };
}

function validar(t: string) {
  let o: any; try { o = JSON.parse(t.replace(/^```(json)?/i, '').replace(/```$/, '').trim()); } catch (_) { return null; }
  if (o && o.erro) return { erro: 'conteudo' };
  const titulo = limpa(o?.titulo, 90), resumo = limpa(o?.resumo, 200);
  const passos = (Array.isArray(o?.passos) ? o.passos : []).map((x: unknown) => limpa(x, 300)).filter(Boolean).slice(0, 10);
  const perguntas = (Array.isArray(o?.perguntas) ? o.perguntas : []).map((q: any) => {
    const opcoes = (Array.isArray(q?.opcoes) ? q.opcoes : []).map((x: unknown) => limpa(x, 140)).filter(Boolean).slice(0, 4);
    const certa = Number(q?.certa);
    return { p: limpa(q?.p, 220), opcoes, certa: Number.isInteger(certa) && certa >= 0 && certa < opcoes.length ? certa : -1 };
  }).filter((q: any) => q.p && q.opcoes.length >= 2 && q.certa >= 0).slice(0, 6);
  if (titulo.length < 3 || passos.length < 2 || !perguntas.length) return null;
  return { titulo, resumo, passos, perguntas };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(jwt);
  const email = (u?.user?.email || '').toLowerCase();
  if (!email) return falha('nao_autorizado');
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const assunto = limpa(body.assunto, 120), texto = limpa(body.texto, 3000);
  if (assunto.length < 3 || texto.length < 20) return falha('pouco_texto');

  const { data: eu } = await admin.from('app_users').select('role,store_id,active').eq('email', email).maybeSingle();
  if (!eu || !eu.active || !['lojista', 'admin'].includes(eu.role)) return falha('sem_permissao');
  const ehAdmin = eu.role === 'admin';
  const storeId = String((ehAdmin && body.store_id) || eu.store_id || '');
  if (!/^[0-9a-f-]{36}$/i.test(storeId)) return falha('sem_loja');
  const { data: loja } = await admin.from('stores').select('name,ramo').eq('id', storeId).maybeSingle();

  const limite = Number(Deno.env.get('IA_ORIENT_MES') || 15);
  const ini = new Date(); ini.setUTCDate(1); ini.setUTCHours(3, 0, 0, 0); // 1º do mês, 0h de Brasília
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('store_id', storeId).eq('tipo', 'orientacao').gte('em', ini.toISOString());
  if (!ehAdmin && (count || 0) >= limite) return falha('limite');

  const r: any = await chamarIA(sistema(limpa(loja?.name, 80), RAMOS[loja?.ramo] || ''), `Assunto: ${assunto}\n\nExplicação do dono:\n${texto}`);
  if (r.erro) return falha(r.erro);
  const v: any = validar(r.texto || '');
  await admin.from('ai_usage').insert({ store_id: storeId, user_email: email, tipo: 'orientacao', provedor: r.prov, modelo: r.modelo, tokens_in: r.tin, tokens_out: r.tout, ok: !!(v && !v.erro) });
  if (!v) return falha('resposta_invalida');
  if (v.erro) return falha(v.erro);
  return json({ ok: true, ...v });
});
