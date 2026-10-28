// Cliente Assistido – IA para escrever as mensagens das campanhas (1.46.0).
// O app manda nome, objetivo e as versões atuais; a função escreve as 5 versões (modo 'todas')
// ou refaz só uma (modo 'uma', com pedido opcional do lojista). A chave da IA fica só aqui, como segredo
// do Supabase (nunca no app). Provedor e modelo por segredo: AI_PROVIDER = 'anthropic' | 'openai',
// AI_MODEL (opcional), ANTHROPIC_API_KEY ou OPENAI_API_KEY. Sem chave, responde { erro: 'sem_chave' }.
// Quem pode: admin; lojista ou operador da loja, se a loja tem o recurso 'ia_campanha' ligado.
// Erros voltam com status 200 e { erro } para o app mostrar a mensagem certa.
// Limite por loja e por dia (IA_LIMITE_DIA, padrão 40). Cada chamada fica em ai_usage (só o admin lê).
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const falha = (e: string, x: Record<string, unknown> = {}) => { console.log('ia-campanha erro', e, JSON.stringify(x)); return json({ erro: e, ...x }); };
const limpa = (t: unknown, n: number) => String(t ?? '').replace(/\r/g, '').trim().slice(0, n);

const RAMOS: Record<string, string> = { auto_center: 'auto center / oficina mecânica', otica: 'ótica', pet: 'pet shop / veterinária', beleza: 'beleza e bem-estar (salão, barbearia, estética)', salao: 'beleza e bem-estar (salão, barbearia, estética)', clinica: 'beleza e bem-estar (clínica, estética)', roupas: 'loja de roupas e calçados', academia: 'academia', alimentacao: 'confeitaria / alimentação', educacao: 'escola / curso', servicos: 'profissional liberal / serviços' };
const SEGS: Record<string, string> = { igreja: 'igreja / comunidade religiosa (os contatos são fiéis; nada de venda)', ong: 'ONG / projeto social (contatos são apoiadores, voluntários ou atendidos; nada de venda)', publico: 'órgão público (comunicação institucional, sem promoção pessoal nem política; nada de venda)', outros: 'organização (escola, clínica, associação)' };

function regras(loja: string, ramo: string, seg: string) {
  return `Você escreve mensagens de WhatsApp em português do Brasil para o Cliente Assistido, um app em que uma pessoa da loja envia, uma a uma e manualmente, mensagens de relacionamento para clientes que já conhecem a loja.
Organização: "${loja}"${ramo ? `, ramo: ${ramo}` : ''}${seg ? `, tipo: ${seg}` : ''}.
Regras de cada mensagem:
- Tom humano, caloroso e direto, como alguém da loja falando com um cliente conhecido. Nada de cara de propaganda em massa.
- Comece cumprimentando com {nome} (o app troca pelo primeiro nome do cliente). Use {loja} quando citar o nome da loja.
- Curta: de 2 a 5 frases, no máximo 400 caracteres. No máximo 2 emojis.
- Termine com um convite simples para responder (pergunta ou chamada leve).
- Pode usar *negrito* do WhatsApp em uma expressão, no máximo.
- Não invente preço, desconto, prazo, brinde ou condição que não esteja no objetivo. Não prometa o que a loja não disse.
- Sem links, sem telefone, sem hashtags, sem letras maiúsculas gritando, sem pressão ("última chance", "corra").
- Respeite a LGPD e as regras do WhatsApp: nada de conteúdo enganoso, ofensivo ou sensível.`;
}

async function chamarIA(sistema: string, pedido: string) {
  const prov = (Deno.env.get('AI_PROVIDER')?.trim() || (Deno.env.get('ANTHROPIC_API_KEY') ? 'anthropic' : 'openai')).toLowerCase();
  if (prov === 'anthropic') {
    const key = Deno.env.get('ANTHROPIC_API_KEY')?.trim(); if (!key) { console.log('sem ANTHROPIC_API_KEY; prov', prov); return { erro: 'sem_chave' }; }
    const modelo = Deno.env.get('AI_MODEL') || 'claude-haiku-5-5';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelo, max_tokens: 1500, system: sistema, messages: [{ role: 'user', content: pedido }] })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou', prov, modelo }; }
    return { texto: (d.content || []).map((c: any) => c.text || '').join(''), prov, modelo, tin: d.usage?.input_tokens || 0, tout: d.usage?.output_tokens || 0 };
  }
  const key = (Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY'))?.trim(); if (!key) { console.log('sem OPENAI_API_KEY; prov', prov); return { erro: 'sem_chave' }; }
  const modelo = Deno.env.get('AI_MODEL') || 'gpt-6-luna';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, messages: [{ role: 'system', content: sistema }, { role: 'user', content: pedido }] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('openai', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou', prov: 'openai', modelo }; }
  return { texto: d.choices?.[0]?.message?.content || '', prov: 'openai', modelo, tin: d.usage?.prompt_tokens || 0, tout: d.usage?.completion_tokens || 0 };
}
// A resposta vem como JSON {"versoes": [...]}; se vier com texto em volta, pega o trecho entre chaves.
function lerVersoes(t: string): string[] {
  const m = t.match(/\{[\s\S]*\}/); if (!m) return [];
  try { const o = JSON.parse(m[0]); return (Array.isArray(o.versoes) ? o.versoes : []).map((x: unknown) => limpa(x, 700).replace(/^["“]|["”]$/g, '')).filter(Boolean); } catch (_) { return []; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(jwt);
  const email = (u?.user?.email || '').toLowerCase();
  if (!email) return falha('nao_autorizado');
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const storeId = String(body.store_id || ''), modo = body.modo === 'uma' ? 'uma' : 'todas';
  if (!storeId) return falha('pedido_invalido');

  const { data: eu } = await admin.from('app_users').select('role,store_id,operator_store_ids,active').eq('email', email).maybeSingle();
  const ehAdmin = !!eu && eu.active && eu.role === 'admin';
  const atende = !!eu && eu.active && (ehAdmin || (eu.role === 'lojista' && eu.store_id === storeId) || (eu.role === 'operador' && (eu.operator_store_ids || []).includes(storeId)));
  if (!atende) return falha('sem_permissao');
  const { data: loja } = await admin.from('stores').select('name,ramo,recursos').eq('id', storeId).maybeSingle();
  if (!loja) return falha('pedido_invalido');
  const rec = loja.recursos || {};
  if (!ehAdmin && !(rec.on || []).includes('ia_campanha')) return falha('recurso_desligado');

  const limite = Number(Deno.env.get('IA_LIMITE_DIA') || 40);
  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('store_id', storeId).gte('em', desde);
  if (!ehAdmin && (count || 0) >= limite) return falha('limite', { limite });

  const nome = limpa(body.nome, 120), objetivo = limpa(body.objetivo, 1500);
  if (objetivo.length < 15) return falha('sem_objetivo');
  const atuais: string[] = (Array.isArray(body.versoes) ? body.versoes : []).slice(0, 10).map((x: unknown) => limpa(x, 700));
  const sistema = regras(limpa(loja.name, 80), RAMOS[loja.ramo] || '', SEGS[rec.segmento] || '');
  let pedido: string;
  if (modo === 'todas') {
    pedido = `Campanha: "${nome || 'sem nome'}".\nObjetivo e contexto escritos pela loja:\n${objetivo}\n\nEscreva 5 versões DIFERENTES da mensagem (mesma ideia, jeitos diferentes de dizer: muda a abertura, a ordem e o convite final), para o envio não ficar repetido.\nResponda só com JSON, sem nada antes ou depois: {"versoes": ["...", "...", "...", "...", "..."]}`;
  } else {
    const i = Math.max(0, Math.min(9, Number(body.indice) || 0));
    const outras = atuais.filter((t, j) => j !== i && t).map((t, j) => `${j + 1}. ${t}`).join('\n');
    const pedidoLoja = limpa(body.pedido, 300);
    pedido = `Campanha: "${nome || 'sem nome'}".\nObjetivo e contexto escritos pela loja:\n${objetivo}\n\nVersão atual que a loja quer trocar:\n${atuais[i] || '(vazia)'}\n${pedidoLoja ? `\nO que a loja pediu para mudar: ${pedidoLoja}\n` : ''}${outras ? `\nAs outras versões da campanha (a nova precisa ser diferente delas):\n${outras}\n` : ''}\nEscreva 1 nova versão.\nResponda só com JSON, sem nada antes ou depois: {"versoes": ["..."]}`;
  }

  const r: any = await chamarIA(sistema, pedido);
  if (r.erro) return falha(r.erro, { prov: r.prov, modelo: r.modelo });
  const versoes = lerVersoes(r.texto);
  await admin.from('ai_usage').insert({ store_id: storeId, user_email: email, tipo: modo, provedor: r.prov, modelo: r.modelo, tokens_in: r.tin, tokens_out: r.tout, ok: versoes.length > 0 });
  if (!versoes.length) { console.log('resposta sem versoes', limpa(r.texto, 300)); return falha('resposta_invalida'); }
  return json({ versoes: modo === 'todas' ? versoes.slice(0, 5) : versoes.slice(0, 1), restantes: ehAdmin ? null : Math.max(0, limite - (count || 0) - 1) });
});
