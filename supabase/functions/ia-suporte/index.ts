// Cliente Assistido – Suporte com IA (1.51.0). Ícone 🎧 no topo do app: a IA tira dúvidas de USO do app na hora;
// se não resolver, o app oferece falar com uma pessoa pelo WhatsApp. Cada pergunta fica em support_chats (só o admin lê)
// e em ai_usage (tipo 'suporte'). Limite IA_SUPORTE_DIA (padrão 20) por pessoa em 24 h; admin sem limite.
// Usa os mesmos segredos da IA das campanhas (AI_PROVIDER, AI_MODEL, OPENAI_API_KEY/OPEN_API_KEY ou ANTHROPIC_API_KEY).
// MANUAL abaixo: atualizar quando o app mudar de um jeito que o usuário perceba.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
const falha = (e: string) => { console.log('ia-suporte erro', e); return json({ erro: e }); };
const limpa = (t: unknown, n: number) => String(t ?? '').replace(/\r/g, '').trim().slice(0, n);

const MANUAL = `MANUAL DO CLIENTE ASSISTIDO (CA)
O que é: aplicativo (PWA, abre no navegador e pode ser instalado no celular) para pequenas lojas manterem o relacionamento com os clientes pelo WhatsApp. Lema: quem é lembrado, vende mais. O envio é SEMPRE manual: o app abre o WhatsApp com a mensagem pronta e uma pessoa da loja confere e toca em enviar. Não existe robô, envio automático nem disparo em massa. Isso protege o número da loja e respeita as regras do WhatsApp e a LGPD.
Abas: Gerencial (só para o dono da loja), Hoje, Contatos, Campanha e Mais (o admin também vê Admin). No topo ficam o nome, o botão de suporte 🎧 e o botão Sair.

HOJE (a rotina do dia)
- Mostra o que fazer no dia: Resumo do dia, Aniversariantes 🎂, Vencimentos 🔧, Datas chegando 📅, Pós-venda 🛍️ e Enviar hoje 📤.
- Enviar hoje: os clientes da campanha ativa aparecem em rodadas de 5. Tocar em "Abrir e enviar" abre o WhatsApp com a mensagem já com o nome do cliente; a pessoa confere e envia.
- Depois de cada envio da campanha há uma espera curta e aleatória (de 5 a 10 segundos), e a cada 5 envios uma pausa maior (de 3 a 5 minutos), com um contador na tela. A contagem começa quando a pessoa volta do WhatsApp para o app. Isso é proposital, para o ritmo parecer natural e proteger o número. Basta esperar o contador zerar.
- Limite de mensagens de campanha por dia: até 30 (ajustável para menos em Campanha → Ritmo de envio). Parabéns, pós-venda e vencimentos não entram nas esperas.
- Quem respondeu: os clientes costumam responder horas ou dias depois. Quando alguém responder, vá em Contatos, ache o cliente pela busca e toque em "💬 Respondeu" (tocar de novo desmarca). Quem respondeu vai para o grupo Frequentes e entra na taxa de resposta. Na mesma linha há "🚫 Saiu" (pediu para não receber mais) e "📵 Sem WhatsApp" (o número não tem WhatsApp; para desfazer, toque em "Tem WhatsApp" no contato).
- Quando o cliente responde com interesse em comprar, registre o interesse: o dono recebe um aviso no celular e o cliente fica em destaque.
- Respostas prontas: ao marcar em Contatos que alguém respondeu, aparecem textos prontos que abrem o WhatsApp para responder (editáveis em Campanha → Respostas prontas).

CONTATOS
- Carregar contatos: Escolher da agenda (do celular), Importar arquivo (planilha ou arquivo de contatos), Colar números, ou Google Contatos. Dá para definir o DDD padrão para números sem DDD e revisar os que vieram sem DDD antes de importar.
- Números fixos ou inválidos não entram.
- Busca e filtros para achar um contato; a lista mostra 5 por vez ("Mostrar mais 5").
- Em cada contato: 🎂 aniversário (só dia e mês), 🛍️ registrar compra (ou 💇 data do último atendimento, em salões e clínicas), grupo (Novos, Frequentes, Sumidos, Outros) e, em auto centers, o veículo.
- Grupos automáticos: quem respondeu vai para Frequentes; quem ficou mais de 90 dias sem responder ou recebeu 2 mensagens sem resposta vai para Sumidos. Escolher o grupo à mão deixa fixo.
- Quando você coloca contatos na mão (cadastrando, colando, importando ou trocando o grupo) num grupo que tem campanha em andamento dirigida a esse grupo, o app pergunta se quer incluir esses contatos na campanha. Sim (ou fechar a pergunta) = entram; Não = ficam fora só daquela campanha. Campanha para "Todos" não pergunta.
- Excluídos podem ser restaurados.
- Quem pediu para não receber mensagens deve ser marcado com "🚫 Saiu" em Contatos e não recebe mais.

CAMPANHA
- Criar a partir de um Modelo de campanha (mais de 20, inclusive datas comerciais e modelos do ramo da loja) ou criar uma nova.
- Campos: nome, Objetivo / contexto, período (começa em / termina em), público (grupos de clientes, situação, compra recente, tempo sem contato, aniversário) e até 5 versões da mensagem, que se alternam entre os clientes.
- Na mensagem dá para usar {nome} (primeiro nome do cliente), {loja}, {instagram} e, em auto centers, {veiculo}.
- A campanha só vale depois de tocar em Salvar campanha. Enquanto não é salva aparece "Não salva" e há o botão Cancelar.
- IA nas campanhas (quando liberada para a loja pelo suporte CA): escreva o objetivo e toque em "✨ Escrever as 5 versões com IA"; cada versão pode ser refeita com "✨ Refazer a versão com IA". Sempre revise antes de salvar. Limite de 40 usos por dia por loja.
- No CA Premium, a campanha criada pelo operador CA precisa da aprovação do dono antes de ser enviada.
- Configurações (blocos recolhíveis): Ritmo de envio (limite por dia, descanso, qual WhatsApp abrir), Mensagem de parabéns, Mensagens de pós-venda (agradecimento no dia seguinte e "como ficou?" depois de 7 dias), Respostas prontas.
- Vencimentos (auto center): lembretes de troca de óleo, revisão, bateria, pneus etc., pelos meses e, se ligado pelo suporte, também pelos quilômetros.

MAIS
- Painel de resultados (últimos 7 dias comparados com os 7 anteriores, gráfico de envios em 30 dias, funil).
- Curso Excelência no Atendimento ao Cliente (quando liberado): 7 lições curtas com áudio, vídeo, diálogos, pergunta e certificado; dúvidas no fim de cada lição são respondidas pela IA de suporte.
- Aparência: tema claro, escuro ou igual ao do celular.
- Relatório da semana (texto pronto para copiar e mandar), Histórico e resultados de cada campanha.
- Lembrete diário: aviso no celular, todo dia, de quem aguarda contato (precisa permitir notificações).
- Backup automático: guarda os contatos no servidor e deixa a mesma lista em todos os aparelhos da loja.
- Seus dados: cópia em arquivo, recomeçar a lista, termos e roteiro de primeiros passos.
- Minha loja (nome, cidade, WhatsApp, Instagram, ramo), Minha equipe (quem usa o app com o dono), Curso da equipe (quem fez cada lição), Atividades (o que foi feito, por quem e quando).
- Instalar o app no celular: no Android, botão Instalar; no iPhone, Compartilhar → Adicionar à Tela de Início.

PAINEL GERENCIAL (aba Gerencial do dono e perfil Gestor)
- O dono da loja (perfil Lojista) tem a aba Gerencial, a primeira, que abre ao entrar; as abas Hoje, Contatos, Campanha e Mais continuam ao lado para quando ele quiser operar.
- O perfil Gestor (diretoria que só acompanha) vê só o Painel gerencial, com números, sem as abas de trabalho. Escolhe Consolidado ou uma unidade (ex.: Matriz, Filial) e o período (7 dias, 30 dias ou mês atual); as setas comparam com o período anterior do mesmo tamanho.
- Saúde do relacionamento (0 a 100): 50% constância (dias, sem contar domingos, com envios de pelo menos 80% da meta do dia), 30% taxa de resposta (35% ou mais vale nota cheia) e 20% crescimento da base (3% de clientes novos no período vale nota cheia). 75 ou mais = Boa; 50 a 74 = Atenção; abaixo de 50 = Baixa.
- Meta do mês: limite diário de envios vezes os dias do mês sem domingos; por unidade, o limite é dividido entre as unidades.
- Os números somam o trabalho de todos os celulares da loja com o Backup automático ligado. Cada envio conta para a unidade de quem enviou, e cada contato novo para a unidade de quem cadastrou. Unidades, perfis e a unidade de cada pessoa são configurados pelo suporte CA.

PROBLEMAS COMUNS
- App mostrando versão antiga ou algo que não apareceu: feche o app por completo e abra de novo (ou recarregue a página).
- O WhatsApp não abre: confira em Campanha → Ritmo de envio qual WhatsApp abrir (normal ou Business) e se o número do cliente tem DDD.
- Lista diferente em outro celular: ligue o Backup automático em Mais.
- Não recebe o lembrete: permita notificações para o app no celular e ative em Mais → Lembrete diário.
- Funcionalidade que não aparece (IA, curso, vencimento por km): pode não estar liberada para a loja; o suporte CA libera.
- Entrar no app: login com a conta Google cadastrada pelo suporte CA. Planos, valores, contrato e cadastro de usuários são feitos pelo suporte CA.`;

function sistema(ctx: { papel: string; loja: string; ramo: string; recursos: string[]; tela: string }) {
  return `Você é a assistente de suporte do aplicativo Cliente Assistido (CA). Responda dúvidas de USO do aplicativo, com base SOMENTE no manual abaixo.
Quem pergunta: papel "${ctx.papel}"${ctx.loja ? `, da loja "${ctx.loja}"` : ''}${ctx.ramo ? ` (ramo: ${ctx.ramo})` : ''}. Funcionalidades extras ligadas para a loja: ${ctx.recursos.length ? ctx.recursos.join(', ') : 'nenhuma'}. Aba aberta agora: ${ctx.tela || 'não informada'}.

${MANUAL}

Como responder:
- Português do Brasil, simples, gentil e direto, para quem não entende de tecnologia. Fale por "você".
- Diga o caminho exato no app quando houver (ex.: "Mais → Backup automático"). Use passos numerados curtos quando forem 2 ou mais passos. Sem markdown pesado: no máximo listas simples com números ou hífens. No máximo 1 emoji.
- Curta: até 6 frases ou 6 passos, no máximo 900 caracteres.
- Se o manual não cobre a dúvida, ou se for problema técnico, cobrança, plano, contrato, cadastro de usuário ou liberação de funcionalidade, NÃO invente: diga que é melhor falar com uma pessoa do suporte e que é só tocar em "Falar com uma pessoa no WhatsApp", logo abaixo.
- Nunca sugira robô, envio automático, disparo em massa, lista comprada ou burlar o WhatsApp. O envio é sempre feito por uma pessoa.
- Se a pergunta não tiver relação com o aplicativo, diga com gentileza que aqui você ajuda com o uso do Cliente Assistido.
- Nunca peça senha, código ou dados de cartão.
- Responda só com o texto da resposta.`;
}

async function chamarIA(sis: string, msgs: { role: string; content: string }[]) {
  const prov = (Deno.env.get('AI_PROVIDER')?.trim() || (Deno.env.get('ANTHROPIC_API_KEY') ? 'anthropic' : 'openai')).toLowerCase();
  if (prov === 'anthropic') {
    const key = Deno.env.get('ANTHROPIC_API_KEY')?.trim(); if (!key) return { erro: 'sem_chave' };
    const modelo = Deno.env.get('AI_MODEL')?.trim() || 'claude-haiku-5-5';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelo, max_tokens: 900, system: sis, messages: msgs })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
    return { texto: (d.content || []).map((c: any) => c.text || '').join(''), prov, modelo, tin: d.usage?.input_tokens || 0, tout: d.usage?.output_tokens || 0 };
  }
  const key = (Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY'))?.trim(); if (!key) return { erro: 'sem_chave' };
  const modelo = Deno.env.get('AI_MODEL')?.trim() || 'gpt-6-luna';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, messages: [{ role: 'system', content: sis }, ...msgs] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('openai', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
  return { texto: d.choices?.[0]?.message?.content || '', prov: 'openai', modelo, tin: d.usage?.prompt_tokens || 0, tout: d.usage?.completion_tokens || 0 };
}

const RAMOS: Record<string, string> = { auto_center: 'auto center', otica: 'ótica', pet: 'pet shop', beleza: 'beleza e bem-estar', salao: 'beleza e bem-estar', clinica: 'beleza e bem-estar', roupas: 'roupas', academia: 'academia', alimentacao: 'alimentação', educacao: 'educação', servicos: 'serviços' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(jwt);
  const email = (u?.user?.email || '').toLowerCase();
  if (!email) return falha('nao_autorizado');
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const pergunta = limpa(body.pergunta, 800);
  if (pergunta.length < 3) return falha('sem_pergunta');

  const { data: eu } = await admin.from('app_users').select('role,store_id,name,active').eq('email', email).maybeSingle();
  if (!eu || !eu.active) return falha('sem_permissao');
  const ehAdmin = eu.role === 'admin';
  const limite = Number(Deno.env.get('IA_SUPORTE_DIA') || 20);
  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('user_email', email).eq('tipo', 'suporte').gte('em', desde);
  if (!ehAdmin && (count || 0) >= limite) return falha('limite');

  // Loja: a do usuário; operador e admin podem informar a loja que estão atendendo.
  const storeId = String(body.store_id || eu.store_id || '');
  let loja: any = null;
  if (/^[0-9a-f-]{36}$/i.test(storeId)) { const r = await admin.from('stores').select('name,ramo,recursos').eq('id', storeId).maybeSingle(); loja = r.data; }
  const rec = (loja?.recursos?.on || []) as string[];
  const NOMES: Record<string, string> = { ia_campanha: 'IA nas campanhas', treino: 'curso de atendimento', venc_km: 'vencimento por km', contrato_digital: 'contrato digital' };
  const ctx = { papel: eu.role, loja: limpa(loja?.name, 80), ramo: RAMOS[loja?.ramo] || '', recursos: rec.map(k => NOMES[k]).filter(Boolean), tela: limpa(body.tela, 30) };

  const hist = (Array.isArray(body.historico) ? body.historico : []).slice(-4);
  const msgs: { role: string; content: string }[] = [];
  hist.forEach((h: any) => { const q = limpa(h?.q, 800), r = limpa(h?.r, 1200); if (q && r) { msgs.push({ role: 'user', content: q }); msgs.push({ role: 'assistant', content: r }); } });
  msgs.push({ role: 'user', content: pergunta });

  const r: any = await chamarIA(sistema(ctx), msgs);
  if (r.erro) return falha(r.erro);
  const resposta = limpa(r.texto, 1500);
  await admin.from('ai_usage').insert({ store_id: /^[0-9a-f-]{36}$/i.test(storeId) ? storeId : null, user_email: email, tipo: 'suporte', provedor: r.prov, modelo: r.modelo, tokens_in: r.tin, tokens_out: r.tout, ok: !!resposta });
  if (!resposta) return falha('resposta_invalida');
  const { data: reg } = await admin.from('support_chats').insert({ user_email: email, user_name: eu.name || null, store_id: /^[0-9a-f-]{36}$/i.test(storeId) ? storeId : null, papel: eu.role, tela: ctx.tela || null, pergunta, resposta }).select('id').single();
  return json({ resposta, id: reg?.id || null, restantes: ehAdmin ? null : Math.max(0, limite - (count || 0) - 1) });
});
