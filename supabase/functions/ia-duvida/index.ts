// Cliente Assistido – IA de suporte do curso (1.49.0).
// O aluno envia a dúvida (linha em training_questions); o app chama esta função com o id da dúvida e o conteúdo
// da lição. A IA responde na hora como instrutora do curso; a resposta fica gravada com respondida_por = 'ia'.
// O admin revisa depois e pode trocar a resposta (rpc answer_question, vira 'humano').
// Só quem escreveu a dúvida pode pedir a resposta, uma vez por dúvida, até IA_DUVIDAS_DIA (padrão 10) por pessoa em 24 h.
// Usa os mesmos segredos da IA das campanhas (AI_PROVIDER, AI_MODEL, OPENAI_API_KEY/OPEN_API_KEY ou ANTHROPIC_API_KEY).
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
const falha = (e: string) => { console.log('ia-duvida erro', e); return json({ erro: e }); };
const limpa = (t: unknown, n: number) => String(t ?? '').replace(/\r/g, '').trim().slice(0, n);

const RAMOS: Record<string, string> = { auto_center: 'auto center / oficina mecânica', otica: 'ótica', pet: 'pet shop / veterinária', beleza: 'salão, barbearia ou estética', salao: 'salão, barbearia ou estética', clinica: 'clínica de estética', roupas: 'loja de roupas e calçados', academia: 'academia', alimentacao: 'confeitaria / alimentação', educacao: 'escola / curso', servicos: 'profissional liberal / serviços' };

function sistema(ramo: string, licao: { n: number; titulo: string; resumo: string; pontos: string[]; frase: string }) {
  return `Você é a instrutora do "Curso Excelência no Atendimento ao Cliente", do Cliente Assistido, criado por Marcos Nascimento para atendentes e donos de pequenas lojas no Brasil.
Um aluno fez uma pergunta na lição ${licao.n}, "${licao.titulo}".${ramo ? ` Ele trabalha num(a) ${ramo}.` : ''}
O que a lição ensina:
${licao.resumo}
Pontos principais: ${licao.pontos.join(' | ')}
Frase da lição: "${licao.frase}"

Como responder:
- Português do Brasil, tom de instrutor gentil, prático e encorajador. Fale com o aluno por "você".
- Responda à pergunta de forma direta, com um exemplo concreto do dia a dia${ramo ? ' do ramo dele' : ' de uma loja'} e, se ajudar, uma frase pronta que ele pode dizer ao cliente.
- Curta: de 3 a 6 frases, no máximo 700 caracteres. Sem títulos, sem listas longas, sem markdown (no máximo 1 emoji).
- Ligue a resposta ao que a lição ensina sempre que fizer sentido.
- Envio de mensagens pelo WhatsApp é sempre manual, uma a uma, respeitando quem pediu para não receber. Nunca sugira robôs, disparo em massa ou burlar regras.
- Não invente leis, números ou pesquisas. Não dê orientação jurídica, médica ou financeira: nesses casos, diga que o melhor é falar com o responsável da loja ou um profissional.
- Se a pergunta não tiver relação com atendimento ao cliente ou com o curso, diga com gentileza que aqui você ajuda com dúvidas do curso e de atendimento, e convide a perguntar sobre isso.
- Se a pergunta for sobre usar o aplicativo Cliente Assistido e você não tiver certeza, oriente a falar com o suporte do Cliente Assistido.
- Responda só com o texto da resposta.`;
}

async function chamarIA(sis: string, pergunta: string) {
  const prov = (Deno.env.get('AI_PROVIDER')?.trim() || (Deno.env.get('ANTHROPIC_API_KEY') ? 'anthropic' : 'openai')).toLowerCase();
  if (prov === 'anthropic') {
    const key = Deno.env.get('ANTHROPIC_API_KEY')?.trim(); if (!key) return { erro: 'sem_chave' };
    const modelo = Deno.env.get('AI_MODEL')?.trim() || 'claude-haiku-5-5';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelo, max_tokens: 800, system: sis, messages: [{ role: 'user', content: pergunta }] })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
    return { texto: (d.content || []).map((c: any) => c.text || '').join(''), prov, modelo, tin: d.usage?.input_tokens || 0, tout: d.usage?.output_tokens || 0 };
  }
  const key = (Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY'))?.trim(); if (!key) return { erro: 'sem_chave' };
  const modelo = Deno.env.get('AI_MODEL')?.trim() || 'gpt-6-luna';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, messages: [{ role: 'system', content: sis }, { role: 'user', content: pergunta }] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('openai', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
  return { texto: d.choices?.[0]?.message?.content || '', prov: 'openai', modelo, tin: d.usage?.prompt_tokens || 0, tout: d.usage?.completion_tokens || 0 };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(jwt);
  const email = (u?.user?.email || '').toLowerCase();
  if (!email) return falha('nao_autorizado');
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const id = String(body.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return falha('pedido_invalido');

  const { data: q } = await admin.from('training_questions').select('id,store_id,user_email,licao,texto,resposta').eq('id', id).maybeSingle();
  if (!q || (q.user_email || '').toLowerCase() !== email) return falha('sem_permissao');
  if (q.resposta) return json({ resposta: q.resposta, por: 'ja' });

  const { data: eu } = await admin.from('app_users').select('role,active').eq('email', email).maybeSingle();
  const ehAdmin = !!eu && eu.active && eu.role === 'admin';
  const limite = Number(Deno.env.get('IA_DUVIDAS_DIA') || 10);
  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('user_email', email).eq('tipo', 'duvida').gte('em', desde);
  if (!ehAdmin && (count || 0) >= limite) return falha('limite');

  const { data: loja } = await admin.from('stores').select('ramo').eq('id', q.store_id).maybeSingle();
  const L = body.licao || {};
  const licao = {
    n: q.licao,
    titulo: limpa(L.titulo, 120),
    resumo: limpa(L.resumo, 2500),
    pontos: (Array.isArray(L.pontos) ? L.pontos : []).slice(0, 8).map((x: unknown) => limpa(x, 200)),
    frase: limpa(L.frase, 200)
  };
  const r: any = await chamarIA(sistema(RAMOS[loja?.ramo] || '', licao), limpa(q.texto, 1000));
  if (r.erro) return falha(r.erro);
  const resposta = limpa(r.texto, 1500);
  await admin.from('ai_usage').insert({ store_id: q.store_id, user_email: email, tipo: 'duvida', provedor: r.prov, modelo: r.modelo, tokens_in: r.tin, tokens_out: r.tout, ok: !!resposta });
  if (!resposta) return falha('resposta_invalida');
  await admin.from('training_questions').update({ resposta, respondida_em: new Date().toISOString(), respondida_por: 'ia' }).eq('id', id).is('resposta', null);
  return json({ resposta, por: 'ia' });
});
