/* Cliente Assistido – MVP (Sprint 2: ações em massa)
   Dados ficam só neste aparelho (localStorage). Nenhum contato é enviado a servidor. */
'use strict';

/* ---------- Versão do app ---------- */
// Ao publicar uma nova versão: atualize APP_VERSION e NOVIDADES, e o CACHE do sw.js (ca-<versão>).
const APP_VERSION = { num: '1.30.9', data: '24/10/2026' };
const NOVIDADES = [
  'Saiu a janela "Alguém respondeu?" que aparecia sozinha; marque as respostas no cartão "Quem respondeu?" da tela Hoje',
  'Hoje: saiu a lista "Enviados anteriormente"; a conferência fica só em "Quem respondeu?", com busca e 5 por vez',
  'Hoje: "Enviados anteriormente" mostra só os 5 mais recentes, com "Mostrar mais" e busca para achar qualquer um',
  'Hoje: a lista "Abertos hoje" passou a se chamar "Enviados anteriormente"',
  'Hoje: busca por nome ou número em "Enviados anteriormente", para achar a pessoa rápido quando a lista está grande',
  'Ajustes internos nos modelos de campanha (emojis)',
  'Ajustes internos nos modelos de campanha',
  'Primeiro contato (aproximação): versões refeitas, sem o aviso sobre não receber mensagens',
  'Mais → Aparência: escolha o tema da tela: automático (segue o modo noturno do celular), claro ou escuro',
  'Novo modelo de campanha: Primeiro contato (aproximação), com 5 versões, para quem ainda não recebeu nenhuma mensagem da loja',
  'Treino: uma pesquisa por lição, a mesma citada na fala, para ficar mais simples',
  'Treino: na tela inicial aparece uma pesquisa por vez, trocando a cada visita',
  'Treino: lição 1 sem o dado da Bain & Company (lucro com retenção)',
  'Treino: números de pesquisas em cada lição, na fala, nas imagens e no quadro "O que dizem as pesquisas", com as fontes',
  'Treino: na tela inicial, "Por que este treinamento importa" com pesquisas sobre atendimento e capacitação',
  'Treino: botão Concluir lição no final de cada lição',
  'Treino: espaço para enviar dúvidas; o dono vê as dúvidas da equipe em Mais → Treinamento da equipe',
  'Treino: a voz volta a falar de forma contínua, mais próxima da leitura humana',
  'Treino: a voz faz pausas nas vírgulas, nos pontos e entre os trechos, para dar tempo de pensar no que ouviu',
  'Treino: a voz do celular fala um pouco mais rápido',
  'Treino: uma ilustração diferente para cada trecho da fala e legenda embaixo acompanhando o áudio',
  'Treino: painel de ilustrações em cada lição, entre o cartão e o texto, trocando a cada 7 segundos',
  'Treino de atendimento (quando ligado para a loja): aba Treino com 7 lições curtas, certificado no fim e acompanhamento da equipe para o dono',
  'Faixa de dicas: a frase passa uma vez só, mais devagar, e depois a faixa some até a próxima abertura do app',
  'Faixa de dicas mais lenta e com uma dica por vez: a próxima aparece quando o app for aberto de novo',
  'Faixa de dicas: cada vez que o app abre ou é atualizado, começa por uma dica diferente',
  'Faixa de dicas acima das abas: frases sobre a importância do relacionamento com o cliente. Quem é lembrado, vende mais',
  'Campanha: o resumo do público não mostra mais quantos dias de envio a campanha leva',
  'Botão "Sem WhatsApp": se o WhatsApp avisar que o número não está lá, um toque tira o contato das listas e devolve o envio ao limite do dia',
  'Contatos: a lista mostra 5 por vez e a busca ficou em destaque; use a busca ou os filtros para achar o cliente',
  'Hoje: a lista vem em rodadas de 5 clientes, com barra de progresso do dia; abriu os 5, os próximos aparecem sozinhos',
  'Mais: saíram os números repetidos; clientes na lista e quem pediu para sair agora aparecem no painel, abaixo do funil',
  'Mais: Relatório da semana, Lembrete diário, Backup automático, Seus dados, Minha loja, Minha equipe e Atividades agora abrem e fecham',
  'Painel de resultados em Mais: destaques da semana comparados com a anterior, gráfico de envios dos últimos 30 dias e funil do relacionamento',
  'Histórico e resultados mudou para a aba Mais, junto dos Resultados; Abrir e Reabrir levam para a aba Campanha',
  'Campanha: Ritmo de envio, Mensagem de parabéns, Mensagens de pós-venda e Respostas prontas agora abrem e fecham, como o Histórico',
  'Histórico e resultados: seta de abrir maior e mais visível',
  'Campanha: os grupos de clientes do público ficaram num quadro, em grade alinhada',
  'Campanha: as opções de aniversário do público ficaram juntas e alinhadas num quadro só',
  'Campanha: "Histórico e resultados" agora abre e fecha, e cada campanha mostra os detalhes ao tocar',
  'Botão "Instalar o aplicativo" em destaque no topo desde o primeiro acesso; some depois de instalado',
  'Campanha "Qual é o seu aniversário?": versão 3 reescrita, mais gentil e acolhedora',
  'Campanha "Qual é o seu aniversário?": mensagens reescritas pedindo só o dia e o mês (nunca o ano)',
  'Novo modelo de relacionamento "Qual é o seu aniversário?": pede o dia e o mês a quem ainda não tem aniversário cadastrado. Anote a resposta no 🎂 do contato',
  'Instalar o app no celular: botão "Instalar agora" no Android e o passo a passo no iPhone (em Mais e nos primeiros passos)',
  'Nova campanha já vem com as 5 versões da mensagem preenchidas, com o nome da loja; campanhas que estavam com o texto padrão também ganharam as 5',
  'Admin: loja em teste (exceção comercial) com data final e anotação; o aviso aparece só para o administrador',
  'Aniversário: a mensagem de parabéns e as versões da campanha "Aniversariantes do mês" agora dizem o nome da loja (use {loja} no seu texto)',
  'Contrato de licença digital (quando combinado com o suporte): o dono aceita no app e vê ou imprime a cópia em Mais → Minha loja',
  'Novo modelo pronto "Siga a gente no Instagram": convide os clientes para seguir a loja. Informe o @ em Mais → Minha loja',
  'Vencimento por km (para as lojas com a função ligada pelo suporte): o aviso sai pelo que vier primeiro, o prazo em meses ou a quilometragem estimada de cada cliente',
  'Respostas prontas: ao marcar que alguém respondeu, um toque abre o WhatsApp com a resposta escrita. Edite as suas na aba Campanha',
  'Interesse de compra: quem atende avisa o dono, que recebe uma notificação no celular e vê o cliente na tela Hoje',
  'Relatório da semana em Mais, com texto pronto para copiar',
  'Aprovação de campanha (versão 1.16.0): no CA Premium, o operador só envia depois que o dono aprova'
];
document.querySelectorAll('[data-ver]').forEach(el => { el.textContent = `Versão ${APP_VERSION.num} · ${APP_VERSION.data}`; });
(function mostrarNovidades() {
  let vista = ''; try { vista = localStorage.getItem('ca_versao_vista') || ''; } catch (e) {}
  const box = document.getElementById('novidades'); if (!box) return;
  const marcar = () => { try { localStorage.setItem('ca_versao_vista', APP_VERSION.num); } catch (e) {} };
  let usado = false; try { usado = !!localStorage.getItem('ca_v1'); } catch (e) {}
  if (!vista && !usado) { marcar(); return; } // primeiro uso: não mostra novidades
  if (vista === APP_VERSION.num) return;
  box.querySelector('[data-vernum]').textContent = `Novidades da versão ${APP_VERSION.num}`;
  document.getElementById('novList').innerHTML = NOVIDADES.map(n => `<li>${n}</li>`).join('');
  box.classList.remove('hide');
  document.getElementById('novOk').addEventListener('click', () => { box.classList.add('hide'); marcar(); });
})();

let KEY = 'ca_v1'; // operador CA usa 'ca_v1:<loja>' (uma lista por loja atendida)
const GROUPS = { novos: 'Novos clientes', frequentes: 'Frequentes', sumidos: 'Sumidos', outros: 'Outros' };
const OLD_BDAY = 'Feliz aniversário, {nome}! 🎉 Toda a nossa equipe deseja um dia muito especial para você. Passa aqui na loja esta semana que temos um mimo de aniversário te esperando! 🎁';
const OLD_BDAY2 = '*Feliz aniversário, {nome}!* 🎉\n\nToda a nossa equipe deseja um dia muito especial para você.\n\nPassa aqui na loja esta semana que temos um mimo de aniversário te esperando! 🎁';
const DEFAULT_BDAY = '*Feliz aniversário, {nome}!* 🎉\n\nToda a equipe da {loja} deseja um dia muito especial para você.\n\nPassa aqui esta semana: temos um mimo de aniversário te esperando! 🎁';
// Textos padrão antigos (sem o nome da loja) viram o padrão atual; texto escrito pela loja fica como está.
const bdayMsgAtual = () => (!S.bdayMsg || S.bdayMsg === OLD_BDAY || S.bdayMsg === OLD_BDAY2) ? DEFAULT_BDAY : S.bdayMsg;
const DEFAULT_PV1 = 'Oi, {nome}! Obrigado pela sua compra! 😊\n\nQualquer dúvida, é só chamar aqui. Salva nosso número para receber as novidades!';
const DEFAULT_PV7 = 'Oi, {nome}! Já faz uma semana da sua compra. Como ficou? Gostou?\n\nSua opinião é muito importante pra gente. 💚';
const DEFAULT_MSGS = [
  'Oi, {nome}! Aqui é da {loja}. Passando para saber como você está e agradecer a confiança. Salva nosso número para receber as novidades! 😊',
  'Olá, {nome}, tudo bem? Aqui é da {loja}. Faz um tempinho que não conversamos. Como você está?',
  'Oi, {nome}! A {loja} lembrou de você. Quando precisar, estamos à disposição. Salva nosso contato!',
  '{nome}, tudo certo por aí? A equipe da {loja} manda um abraço. Se precisar de alguma coisa, é só chamar aqui. 💚',
  'Olá, {nome}! Aqui é da {loja}. Obrigado por ser nosso cliente. Qualquer novidade, a gente avisa você por aqui. 😉'
];
// Textos padrão até a 1.20.2 (3 versões e 2 em branco). Campanha que ainda está com eles exatamente assim recebe as 5 novas.
const OLD_MSGS = [
  'Oi, {nome}! Aqui é da nossa loja. Passando para saber como você está e agradecer a confiança. Salva nosso número para receber as novidades! 😊',
  'Olá, {nome}, tudo bem? Faz um tempinho que não conversamos. Como você está?',
  'Oi, {nome}! Lembramos de você por aqui. Quando quiser, estamos à disposição. Salva nosso contato!'
];
const msgsPadraoAntigas = m => Array.isArray(m) && OLD_MSGS.every((t, i) => (m[i] || '') === t) && m.slice(3).every(t => !String(t || '').trim());

/* ---------- Campanhas: várias ao mesmo tempo, com período e histórico ---------- */
const hojeISO = () => new Date().toISOString().slice(0, 10);
let ultimoIdCamp = 0; // garante id único mesmo com duas campanhas criadas no mesmo milissegundo
function novaCamp(nome) {
  ultimoIdCamp = Math.max(Date.now(), ultimoIdCamp + 1);
  return { id: ultimoIdCamp, name: nome || '', msgs: DEFAULT_MSGS.slice(), aud: { groups: ['todos'], status: 'todos', compraDias: 0, semContatoDias: 0, niverMes: false }, inicio: hojeISO(), fim: '', ended: '', created: hojeISO(), upd: new Date().toISOString() };
}
// Toda alteração de campanha grava a hora (upd): o backup junta as campanhas de vários aparelhos pela mais recente.
function tocarCamp(c) { c.upd = new Date().toISOString(); delete c.padrao; }

/* ---------- Aprovação da campanha (CA Premium) ----------
   Campanha salva pelo operador CA fica "pendente" até o dono aprovar; o operador não envia campanha pendente.
   Campanha salva pelo dono já nasce aprovada. Campanhas antigas, sem aprov, valem como aprovadas. */
const papelAtual = () => (window.CA_ACCESS || {}).papel || '';
const souOperador = () => papelAtual() === 'operador';
const souDono = () => ['lojista', 'admin'].includes(papelAtual());
const assinaturaCamp = c => JSON.stringify([c.name || '', c.msgs || [], c.aud || {}, c.inicio || '', c.fim || '']);
const aprovSt = c => (c && c.aprov && c.aprov.st) || 'aprovada';
const bloqueadaParaMim = c => souOperador() && aprovSt(c) !== 'aprovada';
function registrarAprov(c, st, nota) {
  c.aprov = { st, em: new Date().toISOString(), por: (window.CA_ACCESS || {}).email || '', nota: nota || '', sig: assinaturaCamp(c) };
  tocarCamp(c);
}
// Chamada sempre que alguém salva a campanha: operador manda para aprovação; dono aprova na hora.
function aprovAoSalvar(c) {
  if (souOperador()) {
    if (aprovSt(c) === 'aprovada' && c.aprov && c.aprov.sig === assinaturaCamp(c)) return; // nada mudou
    registrarAprov(c, 'pendente');
    if (window.CA_log) window.CA_log('campanha_para_aprovar', { campanha: c.name || '' });
    if (window.CA_avisarDono) window.CA_avisarDono('aprovacao', { campanha: c.name || '' });
  } else if (souDono()) registrarAprov(c, 'aprovada');
}
function campStatus(c) {
  const h = hojeISO();
  if (c.ended || (c.fim && c.fim < h)) return 'encerrada';
  if (c.inicio && c.inicio > h) return 'programada';
  return 'ativa';
}
function normalizarCampanhas(s) {
  s.settings = s.settings || {};
  if (s.campaign && (!Array.isArray(s.campaigns) || !s.campaigns.length)) { // dados da versão 1.x com uma campanha só
    const o = s.campaign, n = novaCamp(o.name);
    n.id = o.id || n.id; n.msgs = o.msgs || n.msgs; n.aud.groups = [o.group || 'todos']; n.inicio = '';
    s.campaigns = [n];
    if (o.limit && !s.settings.limit) s.settings.limit = o.limit;
  }
  delete s.campaign;
  if (!Array.isArray(s.campaigns) || !s.campaigns.length) { const p = novaCamp('Minha campanha'); p.padrao = true; p.upd = ''; s.campaigns = [p]; }
  s.campaigns.forEach(c => { if (msgsPadraoAntigas(c.msgs)) { c.msgs = DEFAULT_MSGS.slice(); if (!c.padrao) c.upd = new Date().toISOString(); } });
  // 1.21.2/1.21.3: campanha "Qual é o seu aniversário?" ainda com os textos da 1.21.1 recebe os novos (pedem só dia e mês).
  const ANT_NIVER = [["Oi, {nome}! Aqui é da {loja}. Queremos lembrar do seu aniversário com um carinho especial 🎂 Qual é o dia e o mês do seu aniversário? Só se quiser contar!", "Olá, {nome}, tudo bem? A {loja} está preparando mimos para os aniversariantes 🎁 Me conta: quando é o seu aniversário? Só o dia e o mês já bastam.", "{nome}, aqui é da {loja}! Aniversariante tem condição especial no mês do aniversário. Para não deixar passar, qual é a data do seu? (dia/mês) 🎉", "Oi, {nome}! Estamos atualizando o cadastro dos clientes da {loja}. Pode me dizer o dia e o mês do seu aniversário? É só para te dar os parabéns 😊", "Olá, {nome}! A equipe da {loja} adora comemorar com os clientes 🥳 Qual é o dia do seu aniversário? Responde aqui com dia e mês, se quiser."], ["Oi, {nome}! Aqui é da {loja}. Queremos lembrar do seu aniversário com um carinho especial 🎂 Me conta o *dia e o mês* do seu aniversário? Por exemplo: 15/08.", "Olá, {nome}, tudo bem? A {loja} está preparando mimos para os aniversariantes 🎁 Qual é o *dia e o mês* do seu aniversário? Não precisa do ano 😉", "{nome}, aqui é da {loja}! Para o seu aniversário não passar em branco, responde só com o *dia e o mês*, assim: 25/12 🎉", "Oi, {nome}! Estamos atualizando o cadastro dos clientes da {loja}. Pode me passar o *dia e o mês* do seu aniversário? É só para te dar os parabéns 😊", "Olá, {nome}! A equipe da {loja} adora comemorar com os clientes 🥳 Em que *dia e mês* você faz aniversário? Só o dia e o mês já está ótimo!"]]; // textos da 1.21.1 e da 1.21.2
  const ANT_APROX = [["Oi, {nome}, tudo bem? Aqui é da {loja} 😊 Passando para dizer que agora você também pode falar com a gente por aqui, no WhatsApp. Precisando de algo, é só chamar! Se preferir não receber mensagens, é só avisar.", "Olá, {nome}! Aqui é da {loja}. Salva o nosso número aí 📲 Por aqui a gente tira dúvidas, avisa novidades e te atende mais rápido. Se não quiser receber mensagens, me avisa que a gente respeita, tá?", "Oi, {nome}! Que bom ter você como cliente da {loja} 💚 Queremos ficar mais perto e cuidar ainda melhor de você. Podemos te mandar, de vez em quando, avisos e novidades por aqui? Se preferir que não, é só dizer.", "Olá, {nome}, tudo certo? Aqui é da {loja}. Estamos entrando em contato com os nossos clientes para ficar mais próximos 🤝 Qualquer dúvida ou necessidade, conte com a gente neste número. E se não quiser receber mensagens, é só nos avisar.", "Oi, {nome}! Aqui é da {loja} 😊 Passei só para dar um oi e me colocar à disposição. Sempre que precisar, é só chamar aqui no WhatsApp. E, se preferir não receber nossas mensagens, é só me avisar, sem problema nenhum."]]; // 1.30.1: textos antigos do Primeiro contato (com o aviso de não receber)
  const ANT_ALO = [["Oi, {nome}! Tudo bem com você? Sei que a correria do dia a dia não para, mas passei aqui só para te dar um alô. Lembrei de você e quis saber como você está 😊 Um abraço, Marcos.", "Olá, {nome}! A vida anda corrida para todo mundo, né? Mas tem coisa que não tem preço: um alô para quem a gente gosta. Então aqui vai o meu! Como estão as coisas por aí? Abraço, Marcos.", "Oi, {nome}, tudo certo? No meio de tanta correria, a gente acaba deixando de falar com quem é importante. Hoje resolvi mudar isso e vim te mandar um alô 💚 Espero que esteja tudo bem com você e com os seus. Marcos.", "{nome}, que saudade! A rotina às vezes engole a gente, mas um simples \"oi, como você está?\" não pode ficar para depois. Passei para te dar um alô e desejar uma ótima semana! Abraço, Marcos.", "Oi, {nome}! Hoje parei um minutinho na correria só para lembrar de quem faz diferença. Um alô de coração, que não tem preço 🙏 Me conta, como você está? Um forte abraço, Marcos."], ["Oi, {nome}! 👋 Tudo bem com você? Sei que a correria do dia a dia não para ⏰, mas passei aqui só para te dar um alô. Lembrei de você e quis saber como você está 😊 Um abraço, Marcos 🤗", "Olá, {nome}! 😄 A vida anda corrida para todo mundo, né? 🏃‍♂️ Mas tem coisa que não tem preço: um alô para quem a gente gosta 💛 Então aqui vai o meu! Como estão as coisas por aí? Abraço, Marcos 🤝", "Oi, {nome}, tudo certo? 🙂 No meio de tanta correria, a gente acaba deixando de falar com quem é importante. Hoje resolvi mudar isso e vim te mandar um alô 💚 Espero que esteja tudo bem com você e com os seus 🙏 Marcos ✨", "{nome}, que saudade! 🥰 A rotina às vezes engole a gente 📅, mas um simples \"oi, como você está?\" não pode ficar para depois. Passei para te dar um alô e desejar uma ótima semana! 🌟 Abraço, Marcos 😉", "Oi, {nome}! ☕ Hoje parei um minutinho na correria só para lembrar de quem faz diferença. Um alô de coração, que não tem preço 🙏❤️ Me conta, como você está? Um forte abraço, Marcos 🤗"]]; // textos anteriores do alô pessoal (1.30.2 e 1.30.3); campanha sem edição recebe o atual
  s.campaigns.forEach(c => { if (c.tpl === 'alo-pessoal' && Array.isArray(c.msgs) && ANT_ALO.some(ant => ant.every((t, i) => c.msgs[i] === t)) && window.CA_MODELOS) { const m = window.CA_MODELOS.find(x => x.key === 'alo-pessoal'); if (m) { c.msgs = m.msgs.slice(0, 5); c.upd = new Date().toISOString(); } } });
  s.campaigns.forEach(c => { if (c.tpl === 'aproximacao' && Array.isArray(c.msgs) && ANT_APROX.some(ant => ant.every((t, i) => c.msgs[i] === t)) && window.CA_MODELOS) { const m = window.CA_MODELOS.find(x => x.key === 'aproximacao'); if (m) { c.msgs = m.msgs.slice(0, 5); c.upd = new Date().toISOString(); } } });
  s.campaigns.forEach(c => { if (c.tpl === 'captar-niver' && Array.isArray(c.msgs) && ANT_NIVER.some(ant => ant.every((t, i) => c.msgs[i] === t)) && window.CA_MODELOS) { const m = window.CA_MODELOS.find(x => x.key === 'captar-niver'); if (m) { c.msgs = m.msgs.slice(0, 5); c.upd = new Date().toISOString(); } } });
  if (!s.settings.limit) s.settings.limit = 50;
  if (s.settings.descanso === undefined) s.settings.descanso = 7;
  if (!s.campaigns.some(c => c.id === s.activeCampId)) s.activeCampId = (s.campaigns.find(c => campStatus(c) === 'ativa') || s.campaigns[s.campaigns.length - 1]).id;
  return s;
}

let S = load();

function blank() {
  return {
    contacts: [],
    settings: { ddd: '62', app: 'n', autoGroups: true },
    bdayMsg: DEFAULT_BDAY, pvMsg1: DEFAULT_PV1, pvMsg7: DEFAULT_PV7,
    campaigns: [],
    sentLog: {}
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = Object.assign(blank(), JSON.parse(raw)); if (s.settings.autoGroups === undefined) s.settings.autoGroups = true; if (!s.bdayMsg || s.bdayMsg === OLD_BDAY || s.bdayMsg === OLD_BDAY2) s.bdayMsg = DEFAULT_BDAY; if (!s.pvMsg1) s.pvMsg1 = DEFAULT_PV1; if (!s.pvMsg7) s.pvMsg7 = DEFAULT_PV7; return normalizarCampanhas(s); }
  } catch (e) {}
  return normalizarCampanhas(blank());
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { alert('Não foi possível salvar neste aparelho.'); } if (window.CA_onSave) window.CA_onSave(); }

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const fmt = n => '(' + n.slice(2, 4) + ') ' + n.slice(4, 9) + '-' + n.slice(9);
const firstName = n => (n || '').trim().split(/\s+/)[0] || '';

/* ---------- Normalização de números (Brasil) ---------- */
function norm(raw, ddd) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) d = d.slice(2);
  d = d.replace(/^0+/, '');
  if (d.length === 12 || d.length === 13) d = d.slice(2); // remove código de operadora (ex.: 0 15 62 ...)
  if (d.length === 8 || d.length === 9) { if (!ddd) return null; d = ddd + d; }
  if (d.length === 10) {
    if ('6789'.includes(d[2])) d = d.slice(0, 2) + '9' + d.slice(2);
    else return null; // telefone fixo
  }
  if (d.length === 11 && d[2] === '9') return '55' + d;
  return null;
}

/* ---------- Adicionar contatos ---------- */
function localMobile(t) {
  const d = String(t || '').replace(/\D/g, '');
  if (d.length === 9 && d[0] === '9') return d;
  if (d.length === 8 && '6789'.includes(d[0])) return '9' + d;
  return null;
}
function insertContact(byNum, num, it) {
  const ex = byNum.get(num);
  if (ex) { if (!ex.name && it.name) ex.name = it.name; if (!ex.bday && it.bday) ex.bday = it.bday; juntarVeiculo(ex, it); return false; }
  const c = { id: num, num, name: (it.name || '').trim(), group: 'novos', excluded: false, status: 'novo', opened: {}, bday: it.bday || '', added: today() };
  juntarVeiculo(c, it);
  S.contacts.push(c); byNum.set(num, c); return true;
}
// Leitura de km: guarda a anterior (com a data) para o app calcular quanto o cliente roda por mês.
function novaLeituraKm(ant, km, data) {
  km = String(km || '').replace(/\D/g, '');
  if (!km) return { kmAnt: ant.kmAnt, kmData: ant.kmData };
  if (km === String(ant.km || '')) return { kmAnt: ant.kmAnt, kmData: ant.kmData || data };
  return { kmAnt: ant.km && ant.kmData && data > ant.kmData ? { km: +ant.km, data: ant.kmData } : ant.kmAnt, kmData: data };
}
// Dados do ramo vindos de planilha (veículo e serviços): completa sem apagar o que já existe; serviço mais recente vence.
function juntarVeiculo(c, it) {
  if (it.veic) {
    const v = {}; Object.entries(it.veic).forEach(([k, x]) => { if (String(x || '').trim()) v[k] = String(x).trim(); });
    if (v.km) Object.assign(v, novaLeituraKm(c.veic || {}, v.km, (it.serv && it.serv.oleo && it.serv.oleo.data) || today()));
    if (Object.keys(v).length) c.veic = Object.assign(c.veic || {}, v);
  }
  if (it.serv) Object.entries(it.serv).forEach(([k, s]) => {
    if (!s || (!s.data && !s.prox)) return;
    c.serv = c.serv || {};
    const atual = c.serv[k];
    if (!atual || (s.data || '') > (atual.data || '') || (s.prox && s.prox !== atual.prox)) c.serv[k] = Object.assign({}, atual, s);
  });
}
function addMany(list) {
  let added = 0, dup = 0, invalid = 0, semDDD = 0;
  const antes = new Set(S.contacts.map(c => c.id));
  const byNum = new Map(S.contacts.map(c => [c.num, c]));
  const pend = new Set((S.pendingDDD || []).map(p => p.local));
  S.pendingDDD = S.pendingDDD || [];
  for (const it of list) {
    const nums = (it.tels || []).map(t => norm(t, '')).filter(Boolean);
    if (nums.length) { insertContact(byNum, nums[0], it) ? added++ : dup++; continue; }
    const loc = (it.tels || []).map(localMobile).find(Boolean);
    if (loc) {
      if (!pend.has(loc)) { S.pendingDDD.push({ name: (it.name || '').trim(), local: loc, bday: it.bday || '' }); pend.add(loc); }
      semDDD++; continue;
    }
    invalid++;
  }
  save();
  showMsg('#importMsg', `${added} contato(s) adicionado(s). ${dup} já estavam na lista. ${invalid} sem celular válido (fixo, 0800 ou inválido) ignorado(s).` + (semDDD ? ` ${semDDD} estão sem DDD: confira abaixo em "Revisar DDD".` : ''));
  renderAll();
  return S.contacts.filter(c => !antes.has(c.id));
}
// Poucos clientes adicionados de uma vez (agenda ou colar) costumam ser quem acabou de comprar.
function oferecerPosVenda(novos) {
  if (desligado('posvenda')) return;
  if (!novos || !novos.length || novos.length > 10) return;
  if (!confirm(`${novos.length === 1 ? 'Esse cliente comprou' : 'Esses ' + novos.length + ' clientes compraram'} hoje?\n\nSe sim, o app lembra você de agradecer amanhã e de perguntar como ficou daqui a 7 dias.`)) return;
  novos.forEach(c => { c.compra = today(); delete c.pv1; delete c.pv7; });
  save(); renderAll();
}
function renderPendingDDD() {
  const box = $('#ddDBox'); if (!box) return;
  const p = S.pendingDDD || [];
  if (!p.length) { box.classList.add('hide'); return; }
  box.classList.remove('hide');
  $('#dddCount').textContent = p.length;
  $('#dddLista').innerHTML = p.slice(0, 300).map((x, i) => `<div class="it"><div class="t"><b>${esc(x.name || 'Sem nome')}</b><small>${x.local.slice(0, 5)}-${x.local.slice(5)}</small></div><input class="mini" maxlength="2" inputmode="numeric" data-pddd="${i}" value="${esc(x.ddd || S.settings.ddd)}"><button class="x" title="Não importar" data-pdel="${i}">✕</button></div>`).join('') + (p.length > 300 ? `<p class="mut small">Mostrando 300 de ${p.length}. Confirme estes para ver os próximos.</p>` : '');
}
function decodeQP(v) {
  try {
    const bytes = v.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)));
    return decodeURIComponent(escape(bytes));
  } catch (e) { return v; }
}
function parseVCF(text) {
  const out = [];
  text = text.replace(/=\r?\n/g, '').replace(/\r?\n[ \t]/g, ''); // linhas dobradas e quoted-printable
  for (const block of text.split(/BEGIN:VCARD/i).slice(1)) {
    const lines = block.split(/\r?\n/);
    let name = '', tels = [], bday = '';
    for (const l of lines) {
      const i = l.indexOf(':'); if (i < 0) continue;
      const k = l.slice(0, i).toUpperCase(); let v = l.slice(i + 1).trim(); if (k.includes('QUOTED-PRINTABLE')) v = decodeQP(v);
      if (k.startsWith('FN')) name = v;
      else if (k.startsWith('N') && !name && !k.startsWith('NOTE') && !k.startsWith('NICK')) name = v.split(';').filter(Boolean).reverse().join(' ');
      else if (k.startsWith('TEL') || k.includes('.TEL')) tels.push(v);
      else if (k.startsWith('BDAY')) bday = v.replace(/[^0-9-]/g, '').slice(-10);
    }
    out.push({ name, tels, bday });
  }
  return out;
}

function parseCSVText(text) {
  const rows = []; let row = [], cell = '', q = false;
  const sep = (text.split('\n')[0].split(';').length > text.split('\n')[0].split(',').length) ? ';' : ',';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function parseCSV(text) {
  const rows = parseCSVText(text).filter(r => r.some(x => x.trim()));
  if (!rows.length) return [];
  const h = rows[0].map(x => x.toLowerCase().trim());
  const hasHeader = h.some(x => /name|nome|phone|telefone|celular|whats|placa/.test(x));
  if (!hasHeader) return rows.map(r => ({ name: r.find(x => !/\d{6,}/.test(x)) || '', tels: r.filter(x => /\d{8,}/.test(x.replace(/\D/g, ''))) }));
  const idx = re => h.map((x, i) => re.test(x) ? i : -1).filter(i => i >= 0);
  const full = idx(/^(name|nome|nome completo|display name)$/);
  const parts = idx(/(first|middle|last) name|given name|family name|primeiro nome|sobrenome/);
  const phones = idx(/phone|telefone|celular|whats|mobile/).filter(i => !/type|tipo|label|r[oó]tulo/.test(h[i]));
  const bd = idx(/birthday|anivers/);
  // Colunas do ramo automotivo (sistema da oficina): placa, modelo, km, última troca de óleo, próxima troca, revisão
  const cPlaca = idx(/placa/), cModelo = idx(/modelo|ve[ií]culo|carro/), cKm = idx(/^km|quilometr|hod[oô]metro/);
  const cOleo = idx(/[oó]leo/).filter(i => !/pr[oó]x/.test(h[i])), cOleoProx = idx(/pr[oó]x/).filter(i => !/revis/.test(h[i]));
  const cRev = idx(/revis/).filter(i => !/pr[oó]x/.test(h[i]));
  const temVeic = cPlaca.length || cModelo.length || cOleo.length || cOleoProx.length || cRev.length;
  return rows.slice(1).map(r => {
    const it = {
      name: full.length ? r[full[0]] : parts.map(i => r[i]).filter(Boolean).join(' '),
      tels: phones.flatMap(i => (r[i] || '').split(/:::|\/|,/)).filter(x => x.trim()),
      bday: bd.length ? (r[bd[0]] || '') : ''
    };
    if (temVeic) {
      it.veic = { placa: cPlaca.length ? (r[cPlaca[0]] || '').toUpperCase().replace(/[^A-Z0-9]/g, '') : '', modelo: cModelo.length ? r[cModelo[0]] || '' : '', km: cKm.length ? (r[cKm[0]] || '').replace(/\D/g, '') : '' };
      it.serv = {};
      const ol = cOleo.length ? dataISO(r[cOleo[0]]) : '', op = cOleoProx.length ? dataISO(r[cOleoProx[0]]) : '';
      if (ol || op) it.serv.oleo = Object.assign({}, ol ? { data: ol } : {}, op ? { prox: op } : {});
      const rv = cRev.length ? dataISO(r[cRev[0]]) : ''; if (rv) it.serv.revisao = { data: rv };
    }
    return it;
  });
}
// Aceita 25/12/2025, 25/12/25, 2025-12-25 e 25-12-2025
function dataISO(v) {
  const s = String(v || '').trim(); let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
  if ((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/))) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; if (+m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31) return y + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0'); }
  return '';
}
function parsePaste(text) {
  return text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/(\+?\d[\d\s().-]{7,})/);
    const tel = m ? m[1] : '';
    const name = l.replace(tel, '').replace(/[;,:\-–]+\s*$/, '').replace(/^[;,:\-–\s]+/, '').trim();
    return { name, tels: [tel] };
  });
}

/* ---------- Links do WhatsApp ---------- */
function msgFor(c, i, camp) {
  const msgs = (camp || active()).msgs.map(m => m.trim()).filter(Boolean);
  if (!msgs.length) return '';
  const m = phRamo(msgs[i % msgs.length], c);
  const n = firstName(c.name);
  return m.replace(/\{nome\}/gi, n).replace(/\s+([,!?.])/g, '$1').replace(/,+/g, ',').replace(/,([!?.])/g, '$1').replace(/^(Oi|Olá|Ola),\s*!/i, '$1!');
}
/* ---------- Pacote do ramo (ramos.js): veículo, vencimentos e modelos próprios ---------- */
const ramoAtual = () => (((window.CA_ACCESS || {}).loja || {}).ramo) || '';
const PACOTE = () => (window.CA_RAMOS || {})[ramoAtual()] || null;
// Funcionalidades desligadas pelo administrador para esta loja (Admin → Lojas → Editar)
const desligado = k => {
  const r = (((window.CA_ACCESS || {}).loja || {}).recursos) || {};
  if ((window.CA_RECURSOS_OPT_IN || []).includes(k)) return !(r.on || []).includes(k); // começa desligada
  return (r.off || []).includes(k);
};
const ligado = k => !desligado(k);
const lojaNome = () => (((window.CA_ACCESS || {}).loja || {}).nome) || 'nossa loja';
function veiculoTxt(c) { const v = c.veic || {}, p = PACOTE(); return (v.modelo || '').trim() || (p && p.item ? p.item.padrao : 'seu carro'); }
// Instagram da loja: guardado em S.settings.instagram (viaja no backup). Na mensagem vira "@perfil (instagram.com/perfil)".
const normInsta = t => String(t || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '').replace(/[^A-Za-z0-9._]/g, '');
const instaTxt = () => { const h = normInsta(S.settings.instagram); return h ? `@${h} (instagram.com/${h})` : '[Instagram da loja]'; };
const phRamo = (t, c) => String(t || '').replace(/\{veiculo\}/gi, veiculoTxt(c)).replace(/\{loja\}/gi, lojaNome()).replace(/\{instagram\}/gi, instaTxt());
function somaMeses(iso, m) {
  const [y, mo, d] = iso.split('-').map(Number); const x = new Date(y, mo - 1 + m, d);
  if (x.getDate() !== d) x.setDate(0); // 31/08 + 6 meses = 28/02
  return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
}
// Tipos de vencimento do pacote, com prazo, antecedência e mensagem ajustados pelo dono (S.vencCfg)
function vencTipos() { const p = PACOTE(); return p && p.venc ? p.venc.filter(t => ligado('venc:' + t.k)).map(t => Object.assign({}, t, (S.vencCfg || {})[t.k] || {})) : []; }
/* Vencimento por km (opcional, ligado pelo administrador): o app não controla a oficina, só estima.
   Usa a média de km por mês do cliente (duas leituras de km na ficha ou na planilha) ou a média padrão da loja,
   e avisa pelo que vier primeiro: o prazo em meses ou o limite de km do serviço. A data vinda do sistema da loja manda. */
const KM_MEDIA_PADRAO = 1000;
function somaDias(iso, n) { const [y, m, d] = iso.split('-').map(Number); const x = new Date(y, m - 1, d + n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }
function mediaKm(c) {
  const v = c.veic || {}, a = v.kmAnt;
  if (a && a.data && v.kmData && +v.km > +a.km) {
    const dias = Math.round((new Date(v.kmData) - new Date(a.data)) / 86400000);
    if (dias >= 20) return { media: Math.round((v.km - a.km) / dias * 30), doCliente: true };
  }
  return { media: +S.settings.kmMedia || KM_MEDIA_PADRAO, doCliente: false };
}
function proxVencInfo(c, t) {
  const s = (c.serv || {})[t.k]; if (!s) return { d: '' };
  if (s.prox) return { d: s.prox, sistema: true };
  if (!s.data) return { d: '' };
  const porTempo = somaMeses(s.data, +t.meses || 6);
  if (t.km && ligado('venc_km')) {
    const m = mediaKm(c);
    if (m.media > 0) { const porKm = somaDias(s.data, Math.round(+t.km / (m.media / 30))); if (porKm < porTempo) return { d: porKm, km: true, media: m.media }; }
  }
  return { d: porTempo };
}
function proxVenc(c, t) { return proxVencInfo(c, t).d; }
// Vencimentos a avisar hoje: dentro da antecedência ou vencidos há até 60 dias, ainda não avisados
function vencDue(c) {
  if (c.excluded || c.status === 'saiu' || c.semZap || !c.serv) return [];
  return vencTipos().map(t => { const i = proxVencInfo(c, t), prox = i.d; return prox ? { t, prox, dias: diasAte(prox), km: !!i.km } : null; })
    .filter(x => x && x.dias <= (+x.t.aviso || 0) && x.dias >= -60 && !(c.vencAv || {})[x.t.k + ':' + x.prox]);
}
const venceTxt = dias => dias > 1 ? `vence em ${dias} dias` : dias === 1 ? 'vence amanhã' : dias === 0 ? 'vence hoje' : `venceu há ${-dias} dia${dias < -1 ? 's' : ''}`;
const venceFrase = (dias, prox) => venceTxt(dias) + (dias > 1 || dias < 0 ? ` (${fmtD(prox)})` : '');
function vencText(c, x) {
  return phRamo(x.t.msg, c).replace(/\{vence\}/gi, venceFrase(x.dias, x.prox)).replace(/\{nome\}/gi, firstName(c.name)).replace(/\s+([,!?.])/g, '$1').replace(/,\s*!/g, '!');
}
function renderVenc() {
  const p = PACOTE(), card = $('#vencCard'); if (!card) return;
  const tipos = vencTipos();
  if (!p || !tipos.length) { card.classList.add('hide'); return; }
  const due = []; let prox30 = 0;
  S.contacts.forEach(c => {
    vencDue(c).forEach(x => due.push({ c, x }));
    if (!c.excluded && c.serv) tipos.forEach(t => { const d = proxVenc(c, t); if (d && diasAte(d) > (+t.aviso || 0) && diasAte(d) <= 30) prox30++; });
  });
  due.sort((a, b) => a.x.dias - b.x.dias);
  const comServ = S.contacts.filter(c => !c.excluded && c.serv && Object.keys(c.serv).length).length;
  card.classList.remove('hide');
  $('#vencResumo').textContent = due.length ? `${due.length} aviso(s) para hoje.${prox30 ? ` Mais ${prox30} vencem nos próximos 30 dias.` : ''}`
    : comServ ? `Nenhum aviso para hoje.${prox30 ? ` ${prox30} vencem nos próximos 30 dias.` : ''}`
    : `Registre os serviços dos clientes (botão ${p.item.icone} na lista de contatos ou planilha do sistema) para o app avisar os vencimentos.`;
  $('#vencLista').innerHTML = due.slice(0, 60).map(({ c, x }) => {
    const v = c.veic || {};
    const veic = [v.modelo, v.placa].filter(Boolean).join(' · ');
    return `<div class="it"><div class="t"><b>${x.t.ic} ${esc(c.name || fmt(c.num))}</b><small>${esc(x.t.r)} · ${venceFrase(x.dias, x.prox)}${x.km ? ' · pela km estimada' : ''}${veic ? ' · ' + esc(veic) : ''}</small></div>
      <a class="go" href="${esc(openLink(c.num, vencText(c, x)))}" data-venc="${c.id}" data-vk="${x.t.k}" data-vp="${x.prox}">Avisar</a>
      <button class="ic" title="Já fez o serviço (registrar hoje)" data-vfeito="${c.id}" data-vk="${x.t.k}">✓</button>
      <button class="x" title="Não avisar desta vez" data-vpular="${c.id}" data-vk="${x.t.k}" data-vp="${x.prox}">✕</button></div>`;
  }).join('') + (due.length > 60 ? `<p class="mut small">Mostrando 60 de ${due.length}.</p>` : '');
}
// Liga ou esconde as partes do app que dependem do ramo
function aplicarPacote() {
  const p = PACOTE();
  const temVenc = !!(p && vencTipos().length);
  [['#vencMsgCard', temVenc], ['#cVencBox', temVenc], ['#modTipoRamo', !!(p && ligado('modelos_ramo'))],
   ['#niverMsgCard', ligado('niver')], ['#pvMsgCard', ligado('posvenda')], ['#btnGoogleContatos', ligado('google')]]
    .forEach(([s, on]) => { const el = $(s); if (el) el.classList.toggle('hide', !on); });
  if (desligado('niver') && $('#niverCard')) $('#niverCard').classList.add('hide');
  if (desligado('google') && $('#gBanner')) $('#gBanner').classList.add('hide');
  if (!p && $('#vencCard')) $('#vencCard').classList.add('hide');
  document.body.classList.toggle('ramo-on', !!p);
}
function waLink(num, text) { return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text); }
function openLink(num, text) {
  const app = S.settings.app;
  if (app === 'a' || location.protocol !== 'https:') return waLink(num, text);
  const pk = app === 'b' ? 'com.whatsapp.w4b' : 'com.whatsapp';
  return 'intent://send?phone=' + num + '&text=' + encodeURIComponent(text) + '#Intent;scheme=whatsapp;package=' + pk + ';S.browser_fallback_url=' + encodeURIComponent(waLink(num, text)) + ';end';
}

/* ---------- Regras de elegibilidade ---------- */
const active = () => S.campaigns.find(c => c.id === S.activeCampId) || S.campaigns[0];
const campId = () => active().id;
const sentToday = () => S.sentLog[today()] || 0;
const limiteDia = () => S.settings.limit || 50;
// Público da campanha (filtros combinados)
function matchAud(c, camp) {
  const a = camp.aud || {};
  const gs = a.groups && a.groups.length ? a.groups : ['todos'];
  if (!gs.includes('todos') && !gs.includes(c.group)) return false;
  const recebeu = Object.keys(c.opened || {}).length > 0;
  if (a.status === 'nunca' && recebeu) return false;
  if (a.status === 'respondeu' && c.status !== 'respondeu') return false;
  if (a.status === 'semresp' && c.status !== 'aberto') return false;
  if (a.compraDias && !(c.compra && diasDesde(c.compra) <= a.compraDias)) return false;
  if (a.semContatoDias && c.lastOpen && diasDesde(c.lastOpen) < a.semContatoDias) return false;
  if (a.venc) { const t = vencTipos().find(x => x.k === a.venc); const pv = t ? proxVenc(c, t) : ''; if (!pv || diasAte(pv) > 30 || diasAte(pv) < -120) return false; }
  if (a.semNiver && c.bday) return false; // campanha que pede a data: só quem ainda não tem aniversário cadastrado
  if (a.niverMes && !(c.bday && mmdd(c.bday).slice(0, 2) === String(new Date().getMonth() + 1).padStart(2, '0'))) return false;
  return true;
}
const noPublico = (camp) => S.contacts.filter(c => !c.excluded && c.status !== 'saiu' && matchAud(c, camp));
const nf = n => n.toLocaleString('pt-BR');
// Estimativa de envios: público, quem está em descanso agora, dias necessários no limite diário e o que cabe no período
function estimativa(aud, inicio, fim, campIdAtual) {
  const pub = noPublico({ aud });
  const desc = S.settings.descanso || 0;
  const jaRecebeu = campIdAtual ? pub.filter(c => c.opened && c.opened[campIdAtual]).length : 0;
  const emDescanso = pub.filter(c => !(campIdAtual && c.opened && c.opened[campIdAtual]) && desc && c.lastOpen && diasDesde(c.lastOpen) < desc).length;
  const aEnviar = pub.length - jaRecebeu;
  const lim = limiteDia();
  const dias = Math.ceil(aEnviar / lim);
  let periodo = 0;
  if (fim) periodo = Math.max(1, Math.round((new Date(fim + 'T00:00:00') - new Date(((inicio && inicio > today()) ? inicio : today()) + 'T00:00:00')) / 86400000) + 1);
  return { publico: pub.length, jaRecebeu, emDescanso, aEnviar, lim, dias, periodo, cabe: periodo ? Math.min(aEnviar, periodo * lim) : aEnviar };
}
function textoEstimativa(e) {
  if (!e.publico) return 'Nenhum cliente entra neste público hoje.';
  let t = `${nf(e.publico)} cliente(s) no público. Estimativa: ${nf(e.aEnviar)} mensagem(ns) a enviar`;
  if (e.jaRecebeu) t += ` (${nf(e.jaRecebeu)} já receberam)`;
  t += '.'; // 1.24.3: saiu o "leva cerca de N dias de envio" (número grande desanimava); fica só o aviso quando o período não comporta
  if (e.periodo && e.dias > e.periodo) t += ` A campanha tem ${e.periodo} dia(s): no limite de ${e.lim} por dia, dá para enviar cerca de ${nf(e.cabe)}. Para alcançar todos, aumente o limite diário ou o período.`;
  if (e.emDescanso) t += ` Hoje, ${nf(e.emDescanso)} estão em descanso (receberam mensagem há pouco) e entram nos próximos dias.`;
  return t;
}
function eligible(c, camp) {
  camp = camp || active();
  if (campStatus(camp) !== 'ativa') return false;
  if (bloqueadaParaMim(camp)) return false; // operador só envia campanha aprovada pelo dono
  if (c.excluded || c.status === 'saiu' || c.semZap) return false; // semZap: marcado como sem WhatsApp
  if (c.opened && c.opened[camp.id]) return false;
  if (ligado('niver') && isBdayToday(c)) return false; // no dia do aniversário o cliente recebe só o parabéns
  if (posVendaDue(c)) return false; // no dia do pós-venda, recebe só o pós-venda
  if (vencDue(c).length) return false; // com vencimento para avisar, recebe só o aviso
  const d = S.settings.descanso || 0; // descanso entre mensagens, em dias
  if (d && c.lastOpen && diasDesde(c.lastOpen) < d) return false;
  return matchAud(c, camp);
}
function markOpened(id, cid) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  const camp = S.campaigns.find(x => x.id === (cid || campId())) || active();
  if (!c.opened) c.opened = {};
  if (!c.opened[camp.id]) {
    const n = Math.max(1, camp.msgs.filter(m => m.trim()).length);
    c.opened[camp.id] = today();
    c.ver = c.ver || {}; c.ver[camp.id] = S.contacts.indexOf(c) % n;
    c.lastOpen = today(); c.openedAt = Date.now();
    if (c.status === 'novo') c.status = 'aberto';
    S.sentLog[today()] = sentToday() + 1;
    save();
    if (window.CA_log) window.CA_log('envio', { nome: c.name || '', num: c.num, campanha: camp.name || '' });
  }
  setTimeout(renderAll, 400);
}
// Resultados de uma campanha: enviados, responderam, saíram e respostas por versão de mensagem
function resultados(camp) {
  let env = 0, resp = 0, saiu = 0; const porVer = {};
  S.contacts.forEach(c => {
    const d = c.opened && c.opened[camp.id]; if (!d) return;
    env++;
    const ok = c.status === 'respondeu' && (c.lastReply || '') >= d;
    if (ok) resp++; if (c.status === 'saiu') saiu++;
    const v = c.ver && c.ver[camp.id];
    if (v !== undefined) { porVer[v] = porVer[v] || { e: 0, r: 0 }; porVer[v].e++; if (ok) porVer[v].r++; }
  });
  return { env, resp, saiu, taxa: env ? Math.round(resp * 100 / env) : 0, porVer };
}
const fmtD = iso => iso ? iso.split('-').reverse().slice(0, 2).join('/') : '';
function campRotulo(c) {
  const st = campStatus(c);
  const ap = aprovSt(c);
  return (c.name || 'Campanha sem nome') + (st === 'programada' ? ` (começa ${fmtD(c.inicio)})` : st === 'encerrada' ? ' (encerrada)' : '') + (st !== 'encerrada' && ap === 'pendente' ? ' · aguardando aprovação' : st !== 'encerrada' && ap === 'ajuste' ? ' · ajuste pedido' : '');
}
function renderCampSel() {
  const abertas = S.campaigns.filter(c => campStatus(c) !== 'encerrada' || c.id === S.activeCampId);
  const html = abertas.map(c => `<option value="${c.id}"${c.id === S.activeCampId ? ' selected' : ''}>${esc(campRotulo(c))}</option>`).join('');
  ['#hojeCamp', '#campSel'].forEach(s => { const el = $(s); if (el) el.innerHTML = html; });
}
// 1.24.2: o WhatsApp avisou que o número não está no WhatsApp. O contato sai das listas de envio,
// a abertura de hoje é devolvida (não conta no limite) e ele fica marcado em Contatos para corrigir o número.
function marcarSemZap(id, desfazer) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  if (desfazer) { delete c.semZap; save(); renderAll(); return; }
  c.semZap = today();
  const hoje = today();
  Object.keys(c.opened || {}).forEach(k => { if (c.opened[k] === hoje) { delete c.opened[k]; if (c.ver) delete c.ver[k]; S.sentLog[hoje] = Math.max(0, (S.sentLog[hoje] || 0) - 1); } });
  if (c.lastOpen === hoje) delete c.lastOpen;
  if (c.status === 'aberto' && !Object.keys(c.opened || {}).length) c.status = 'novo';
  c.reviewed = true;
  if (window.CA_log) window.CA_log('sem_whatsapp', { nome: c.name || '', num: c.num });
  save(); renderAll();
}
function setStatus(id, st) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  c.status = st; c.reviewed = true;
  if (st === 'respondeu') c.lastReply = today();
  setTimeout(() => { if (!$('#perguntaResp').classList.contains('hide')) perguntarRespostas(); }, 0);
  if (window.CA_log) window.CA_log('marcou_' + st, { nome: c.name || '', num: c.num });
  if (st === 'saiu') { c.excluded = false; c.saiuEm = today(); }
  save(); renderAll();
  if (st === 'respondeu' && window.CA_aposResposta) window.CA_aposResposta(id);
}

/* ---------- Aniversários e resumo para o lembrete ---------- */
const mmdd = s => { const d = String(s || '').replace(/[^0-9]/g, ''); return d.length >= 4 ? d.slice(-4, -2) + '-' + d.slice(-2) : ''; };
const todayMMDD = () => { const t = new Date(); return String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
const isBdayToday = c => !c.excluded && c.status !== 'saiu' && !c.semZap && c.bday && mmdd(c.bday) === todayMMDD();
// Guarda só números (sem nomes nem telefones) para o aviso do celular montar o texto do dia.
function saveSummary() {
  if (!('caches' in window)) return;
  const bdays = {};
  if (ligado('niver')) S.contacts.forEach(c => { if (!c.excluded && c.status !== 'saiu' && c.bday) { const k = mmdd(c.bday); if (k) bdays[k] = (bdays[k] || 0) + 1; } });
  const gFreq = { diaria: 1, semanal: 7, quinzenal: 15 }[S.settings.gFreq || 'semanal'] || 0;
  const gDue = !!(S.gImport && gFreq && Date.now() - S.gImport.at >= gFreq * 86400000 - 3600000);
  const resumo = { date: today(), aguardando: S.contacts.filter(c => eligible(c)).length, limite: limiteDia(), campanha: active().name || '', bdays, gDue, venc: S.contacts.reduce((n, c) => n + vencDue(c).length, 0),
    aprovar: souDono() ? S.campaigns.filter(c => campStatus(c) !== 'encerrada' && aprovSt(c) === 'pendente').length : 0,
    vendas: souDono() ? S.contacts.filter(c => c.venda && c.venda.st === 'aberto').length : 0, relatorio: souDono() };
  caches.open('ca-data').then(c => c.put('/__resumo', new Response(JSON.stringify(resumo), { headers: { 'Content-Type': 'application/json' } }))).catch(() => {});
}

/* ---------- Organização automática dos grupos ---------- */
// Regras simples e transparentes; contato com grupo mudado à mão (groupManual) não é tocado.
const diasDesde = iso => iso ? Math.floor((new Date(today()) - new Date(iso)) / 86400000) : Infinity;
function autoGroups() {
  if (!S.settings.autoGroups) return 0;
  let n = 0;
  for (const c of S.contacts) {
    if (c.excluded || c.status === 'saiu' || c.groupManual) continue;
    if (c.status === 'respondeu' && !c.lastReply) c.lastReply = today();
    let g = c.group;
    const envios = Object.keys(c.opened || {}).length;
    if (c.status === 'respondeu' && diasDesde(c.lastReply) <= 90) g = 'frequentes';
    else if (c.status === 'respondeu' && diasDesde(c.lastReply) > 90) g = 'sumidos';
    else if (c.status !== 'respondeu' && envios >= 2 && diasDesde(c.lastOpen) >= 7) g = 'sumidos';
    if (g !== c.group) { c.group = g; n++; }
  }
  if (n) save();
  return n;
}

/* ---------- Aniversários: lista do dia, próximos dias e parabéns ---------- */
const fmtBday = s => { const k = mmdd(s); return k ? k.slice(3) + '/' + k.slice(0, 2) : ''; };
function proxAniversarios(dias) {
  const out = [];
  for (let i = 1; i <= dias; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const k = String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    S.contacts.forEach(c => { if (!c.excluded && c.status !== 'saiu' && c.bday && mmdd(c.bday) === k) out.push({ c, i }); });
  }
  return out;
}
const anoAtual = () => String(new Date().getFullYear());
function bdayText(c) { return phRamo(bdayMsgAtual(), c).replace(/\{nome\}/gi, firstName(c.name)).replace(/\s+([,!?.])/g, '$1').replace(/,\s*!/g, '!'); }
function renderNiver() {
  const box = $('#niverLista'); if (!box) return;
  if (desligado('niver')) { $('#niverCard').classList.add('hide'); return; }
  const hoje = S.contacts.filter(isBdayToday);
  const feitos = hoje.filter(c => c.bdaySent === anoAtual()).length;
  $('#niverResumo').textContent = hoje.length ? `${hoje.length} aniversariante(s) hoje · ${feitos} parabéns enviado(s).` : 'Ninguém faz aniversário hoje.';
  box.innerHTML = hoje.map(c => {
    const ok = c.bdaySent === anoAtual();
    return `<div class="it"><div class="t"><b>🎂 ${esc(c.name || 'Sem nome')}</b><small>${fmt(c.num)}</small></div>
      ${ok ? '<span class="enviado">✓ Enviado</span>' : `<a class="go" href="${esc(openLink(c.num, bdayText(c)))}" data-niver="${c.id}">Enviar parabéns</a>`}</div>`;
  }).join('');
  const prox = proxAniversarios(7);
  const card = $('#niverCard'); if (card) card.classList.toggle('hide', !hoje.length && !prox.length);
  $('#niverProx').innerHTML = prox.length ? '<p class="small"><b>Próximos 7 dias</b></p>' + prox.map(({ c, i }) => `<div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')}</b><small>${fmtBday(c.bday)} · ${i === 1 ? 'amanhã' : 'em ' + i + ' dias'}</small></div></div>`).join('') : '';
  const ta = $('#niverMsg'); if (ta && document.activeElement !== ta) ta.value = bdayMsgAtual();
}

/* ---------- Jornada pós-venda: agradecimento no dia seguinte e "como ficou?" em 7 dias ---------- */
function posVendaDue(c) {
  if (desligado('posvenda')) return null;
  if (!c.compra || c.excluded || c.status === 'saiu' || c.semZap) return null;
  const d = diasDesde(c.compra);
  if (d >= 1 && d <= 6 && !c.pv1) return 'd1';
  if (d >= 7 && d <= 14 && !c.pv7) return 'd7';
  return null;
}
const pvText = (c, k) => ((k === 'd1' ? S.pvMsg1 : S.pvMsg7) || (k === 'd1' ? DEFAULT_PV1 : DEFAULT_PV7)).replace(/\{nome\}/gi, firstName(c.name)).replace(/\s+([,!?.])/g, '$1').replace(/,\s*!/g, '!');
function renderPosVenda() {
  const box = $('#posLista'); if (!box) return;
  const due = S.contacts.map(c => ({ c, k: posVendaDue(c) })).filter(x => x.k);
  $('#posCard').classList.toggle('hide', !due.length);
  box.innerHTML = due.map(({ c, k }) => `<div class="it"><div class="t"><b>🛍️ ${esc(c.name || 'Sem nome')}</b><small>Comprou em ${c.compra.split('-').reverse().slice(0, 2).join('/')} · ${k === 'd1' ? 'agradecer a compra' : 'perguntar como ficou'}</small></div>
    <a class="go" href="${esc(openLink(c.num, pvText(c, k)))}" data-pv="${c.id}" data-pvk="${k}">Enviar</a>
    <button class="x" title="Pular" data-pvskip="${c.id}" data-pvk="${k}">✕</button></div>`).join('');
}

/* ---------- "Ele respondeu?" ao voltar para o app ---------- */
let foraDesde = null;
function pendentesResposta() {
  const lim = Date.now() - 20 * 60000;
  return S.contacts.filter(c => c.status === 'aberto' && !c.reviewed && !c.excluded && (c.openedAt ? c.openedAt <= lim : diasDesde(c.lastOpen) <= 7));
}
function perguntarRespostas() {
  return; // 1.30.9: a janela "Alguém respondeu?" saiu a pedido do Marcos; a conferência fica no cartão "Quem respondeu?" da tela Hoje.
  if (desligado('resposta')) return;
  const box = $('#perguntaResp'); if (!box || !document.body.dataset.papel) return;
  if ((S.askSnooze || 0) > Date.now()) return;
  const p = pendentesResposta().slice(0, 5);
  if (!p.length) { box.classList.add('hide'); return; }
  $('#prLista').innerHTML = p.map(c => `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>enviado em ${(c.lastOpen || '').split('-').reverse().slice(0, 2).join('/')}</small></div>
    <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button data-st="nao" data-id="${c.id}">Ainda não</button><button class="sair" data-st="saiu" data-id="${c.id}">Saiu</button><button class="semzap" data-semzap="${c.id}">Sem WhatsApp</button></div></div>`).join('');
  box.classList.remove('hide');
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') foraDesde = Date.now();
  else if (foraDesde && Date.now() - foraDesde > 60000) { foraDesde = null; }
});

/* ---------- Render ---------- */
function renderKPIs() {
  if (!$('#kpis')) return; // 1.23.2: os quadradinhos saíram de Mais; clientes na lista e saídas ficam no painel (dashboard.js)
  const act = S.contacts.filter(c => !c.excluded && c.status !== 'saiu');
  const camp = noPublico(active());
  const doneCamp = S.contacts.filter(c => c.opened && c.opened[campId()]).length;
  const k = [
    ['hl', `${sentToday()} / ${limiteDia()}`, 'abertos hoje / limite'],
    ['', `${doneCamp} / ${camp.length}`, 'campanha: abertos / público'],
    ['', S.contacts.filter(c => c.status === 'respondeu').length, 'responderam (marcados)'],
    ['', S.contacts.filter(c => c.status === 'saiu').length, 'pediram para sair'],
    ['', act.length, 'clientes na lista'],
    ['', S.contacts.filter(c => c.added === today()).length, 'adicionados hoje'],
    ['', S.contacts.filter(isBdayToday).length, 'aniversariantes hoje']
  ];
  $('#kpis').innerHTML = k.map(([cl, v, l]) => `<div class="kpi ${cl}"><b>${v}</b><span>${l}</span></div>`).join('');
}
function renderRevisao() {
  const pend = S.contacts.filter(c => c.status === 'aberto' && !c.reviewed)
    .sort((a, b) => (b.lastOpen || '').localeCompare(a.lastOpen || '') || (b.openedAt || 0) - (a.openedAt || 0));
  if (!pend.length) { $('#revisao').innerHTML = '<p class="mut small">Nada para revisar agora.</p>'; return; }
  const focoBusca = document.activeElement && document.activeElement.id === 'abertosBusca';
  // 1.30.8: só 5 por vez (os mais recentes), "Mostrar mais 5" e busca por nome ou número em todos.
  $('#revisao').innerHTML = `<p class="small" style="margin:0 0 4px"><b>${pend.length}</b> para conferir</p>`
    + (pend.length > AB_PAG ? `<input id="abertosBusca" class="abBusca" type="search" inputmode="search" autocomplete="off" placeholder="🔎 Buscar por nome ou número" value="${esc(abertosQ)}"><p class="mut small hide" id="abertosVazio">Ninguém encontrado com essa busca.</p>` : '')
    + pend.map(c => `
    <div class="it abIt" data-busca="${esc(semAcento((c.name || '') + ' ' + c.num + ' ' + fmt(c.num)))}"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)} · aberto em ${c.lastOpen || ''}</small>
      <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button data-st="nao" data-id="${c.id}">Não respondeu</button><button class="sair" data-st="saiu" data-id="${c.id}">Pediu para sair</button><button class="semzap" data-semzap="${c.id}">Sem WhatsApp</button></div></div></div>`).join('')
    + (pend.length > AB_PAG ? `<button class="linkbtn abMaisBtn" id="abertosMais">Mostrar mais ${AB_PAG}</button>` : '');
  filtrarAbertos();
  if (focoBusca && $('#abertosBusca')) { const b = $('#abertosBusca'); b.focus(); b.setSelectionRange(b.value.length, b.value.length); }
}
function groupOptions(sel, withAll) {
  return (withAll ? `<option value="todos"${sel === 'todos' ? ' selected' : ''}>Todos os grupos</option>` : '') +
    Object.entries(GROUPS).map(([k, v]) => `<option value="${k}"${sel === k ? ' selected' : ''}>${v}</option>`).join('');
}
/* ---------- Contatos: filtros, seleção e ações em massa ---------- */
const SEL = new Set();
let PAGE = 5; // 1.24.1: a lista de contatos mostra 5 por vez; o caminho principal é a busca e os filtros
const semAcento = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function visibleContacts() {
  const q = semAcento($('#busca').value).trim();
  const qd = q.replace(/\D/g, '');
  const palavras = q.split(/\s+/).filter(w => w && !/^\d+$/.test(w));
  const fg = $('#filtroGrupo').value || 'todos';
  const fs = $('#filtroStatus').value || 'todos';
  return S.contacts.filter(c => !c.excluded &&
    (fg === 'todos' || c.group === fg) &&
    (fs === 'todos' || (fs === 'semzap' ? !!c.semZap : fs === 'aniversario' ? isBdayToday(c) : (c.status || 'novo') === fs)) &&
    (!q || (palavras.length ? palavras.every(w => semAcento(c.name + ' ' + ((c.veic || {}).modelo || '')).includes(w)) : false) || (qd.length >= 3 && c.num.includes(qd)) ||
      (q.replace(/[^a-z0-9]/g, '').length >= 3 && semAcento((c.veic || {}).placa).replace(/[^a-z0-9]/g, '').includes(q.replace(/[^a-z0-9]/g, '')))));
}
function renderBulk(vis) {
  vis = vis || visibleContacts();
  for (const id of [...SEL]) { const c = S.contacts.find(x => x.id === id); if (!c || c.excluded) SEL.delete(id); }
  $('#selAllN').textContent = vis.length;
  const all = vis.length > 0 && vis.every(c => SEL.has(c.id));
  $('#selAll').checked = all;
  $('#selAll').indeterminate = !all && vis.some(c => SEL.has(c.id));
  $('#selCount').textContent = SEL.size;
  $('#bulkActs').classList.toggle('hide', SEL.size === 0);
}
function renderContatos() {
  const act = S.contacts.filter(c => !c.excluded);
  const vis = visibleContacts();
  const shown = vis.slice(0, PAGE);
  const filtrando = !!(($('#busca') || {}).value || '').trim() || (($('#filtroGrupo') || {}).value || 'todos') !== 'todos' || (($('#filtroStatus') || {}).value || 'todos') !== 'todos';
  $('#contResumo').innerHTML = vis.length > shown.length
    ? `Mostrando <b>${shown.length}</b> de ${vis.length}${filtrando ? ' no filtro' : ' clientes'}. ${filtrando ? 'Refine a busca para achar mais rápido.' : '<b>Use a busca ou os filtros acima</b> para achar o cliente.'}`
    : `${act.length} na lista${filtrando ? ` · ${vis.length} no filtro` : ''}`;
  $('#listaContatos').innerHTML = shown.map(c => {
    const pk = PACOTE(), v = c.veic || {};
    const proxV = pk ? vencTipos().map(t => ({ t, d: proxVenc(c, t) })).filter(x => x.d).sort((x, y) => x.d.localeCompare(y.d))[0] : null;
    const info = [fmt(c.num), pk && ligado('veiculo') && (v.modelo || v.placa) ? pk.item.icone + ' ' + [v.modelo, v.placa].filter(Boolean).join(' ') : '', proxV ? proxV.t.ic + ' ' + fmtD(proxV.d) + (proxV.d.slice(0, 4) !== anoAtual() ? '/' + proxV.d.slice(2, 4) : '') : '', c.bday ? '🎂 ' + fmtBday(c.bday) : '', c.compra ? '🛍️ comprou ' + c.compra.split('-').reverse().slice(0, 2).join('/') : '', c.groupManual ? 'grupo fixo' : ''].filter(Boolean).join(' · ');
    return `
    <div class="it ct${SEL.has(c.id) ? ' sel' : ''}">
      <div class="ctTop"><input type="checkbox" class="ck" data-sel="${c.id}"${SEL.has(c.id) ? ' checked' : ''} aria-label="Selecionar">
        <div class="ctNome"><b>${esc(c.name || 'Sem nome')}</b>${c.status === 'respondeu' ? '<span class="tag">respondeu</span>' : ''}${c.status === 'saiu' ? '<span class="tag red">saiu</span>' : ''}${c.semZap ? `<span class="tag red">sem WhatsApp</span> <button class="linkbtn" data-temzap="${c.id}">Tem WhatsApp</button>` : ''}<small>${info}</small></div></div>
      <div class="ctAcoes">
        <select data-grp="${c.id}" aria-label="Grupo">${groupOptions(c.group)}</select>
        <button class="ic" title="Enviar campanha" data-avulso="${c.id}">📤</button>
        ${pk && ligado('veiculo') ? `<button class="ic" title="${esc(pk.item.rotulo)} e serviços" data-veic="${c.id}">${pk.item.icone}</button>` : ''}
        ${ligado('posvenda') ? `<button class="ic" title="Registrar compra de hoje" data-compra="${c.id}">🛍️</button>` : ''}
        ${ligado('niver') ? `<button class="ic" title="Aniversário" data-bd="${c.id}">🎂</button>` : ''}
        <button class="ic del" title="Excluir da lista" data-del="${c.id}">✕</button>
      </div>
    </div>`;
  }).join('') || (act.length ? '<p class="mut small">Nenhum contato neste filtro.</p>' : '<p class="mut small">Nenhum contato ainda. Use "Escolher da agenda" ou "Importar arquivo".</p>');
  const rest = vis.length - shown.length;
  $('#btnMais').classList.toggle('hide', rest <= 0);
  $('#btnMais').textContent = `Mostrar mais ${Math.min(5, rest)} (faltam ${rest})`;
  renderBulk(vis);
  const exc = S.contacts.filter(c => c.excluded);
  $('#excTitulo').textContent = `Excluídos (${exc.length})`;
  $('#btnRestTodos').classList.toggle('hide', exc.length < 2);
  $('#listaExcluidos').innerHTML = exc.slice(0, 300).map(c => `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)}</small></div><button data-res="${c.id}">Restaurar</button></div>`).join('') + (exc.length > 300 ? `<p class="mut small">Mostrando 300 de ${exc.length}.</p>` : '') || '<p class="mut small">Nenhum contato excluído.</p>';
}
function audForm() {
  const gs = [...document.querySelectorAll('[data-cg]:checked')].map(x => x.dataset.cg);
  return { groups: gs.length ? gs : ['todos'], status: $('#cStatus').value, compraDias: +$('#cCompra').value || 0, semContatoDias: +$('#cSemContato').value || 0, niverMes: $('#cNiverMes').checked, semNiver: $('#cSemNiver').checked, venc: PACOTE() ? $('#cVenc').value : '' };
}
function atualizarPublico() {
  $('#cPublico').textContent = textoEstimativa(estimativa(audForm(), $('#cInicio').value, $('#cFim').value, campId()));
}
function renderCampanha() {
  const c = active(); const a = c.aud || {};
  renderCampSel();
  $('#cNome').value = c.name || '';
  $('#cInicio').value = c.inicio || ''; $('#cFim').value = c.fim || '';
  const gs = a.groups || ['todos'];
  $('#cGrupos').innerHTML = [['todos', 'Todos']].concat(Object.entries(GROUPS)).map(([k, v]) => `<label class="ckl chip"><input type="checkbox" class="ck" data-cg="${k}"${gs.includes(k) ? ' checked' : ''}> ${v}</label>`).join('');
  const vts = vencTipos();
  $('#cVenc').innerHTML = '<option value="">Tanto faz</option>' + vts.map(t => `<option value="${t.k}">${esc(t.r)}: vencendo em até 30 dias ou vencida</option>`).join('');
  $('#cVenc').value = a.venc && vts.some(t => t.k === a.venc) ? a.venc : '';
  renderVencCfg();
  $('#cStatus').value = a.status || 'todos'; $('#cCompra').value = String(a.compraDias || 0); $('#cSemContato').value = String(a.semContatoDias || 0); $('#cNiverMes').checked = !!a.niverMes; $('#cSemNiver').checked = !!a.semNiver;
  $('#cLimite').value = limiteDia(); $('#cDescanso').value = S.settings.descanso || 0;
  document.querySelectorAll('#segApp button').forEach(b => b.classList.toggle('on', b.dataset.app === S.settings.app));
  $('#cMsgs').innerHTML = c.msgs.map((m, i) => `<textarea rows="3" class="auto" data-msg="${i}"${document.body.dataset.papel === 'funcionario' ? ' readonly' : ''} placeholder="Versão ${i + 1}${i > 0 ? ' (opcional)' : ''}">${esc(m)}</textarea>`).join('');
  const st = campStatus(c);
  $('#cStatusTag').textContent = st === 'ativa' ? 'Ativa' : st === 'programada' ? 'Programada' : 'Encerrada';
  $('#cStatusTag').className = 'tag' + (st === 'encerrada' ? ' red' : st === 'programada' ? ' warn' : '');
  $('#btnEncerrarCamp').classList.toggle('hide', st === 'encerrada');
  const ap = c.aprov, apb = $('#cAprov');
  if (apb) {
    const quem = ap && ap.por ? ap.por.split('@')[0] : '';
    apb.className = 'small aprovInfo' + (aprovSt(c) === 'aprovada' ? '' : ' warnbox');
    apb.innerHTML = !ap || st === 'encerrada' || (ap.st === 'aprovada' && !souOperador()) ? '' : ap.st === 'pendente' ? '⏳ Aguardando aprovação do dono da loja. Os envios do operador começam depois da aprovação.'
      : ap.st === 'ajuste' ? `✏️ O dono pediu ajuste${ap.nota ? ': <b>' + esc(ap.nota) + '</b>' : ''}. Ajuste e salve de novo para reenviar.`
      : `✓ Aprovada por ${esc(quem)} em ${fmtD(ap.em.slice(0, 10))}.`;
    apb.classList.toggle('hide', !apb.innerHTML);
  }
  atualizarPublico();
  renderHistorico();
  renderHoje(); renderNiver();
  if ($('#pvMsg1') && document.activeElement !== $('#pvMsg1')) $('#pvMsg1').value = S.pvMsg1 || DEFAULT_PV1;
  if ($('#pvMsg7') && document.activeElement !== $('#pvMsg7')) $('#pvMsg7').value = S.pvMsg7 || DEFAULT_PV7;
  ajustarTextos();
}
/* Caixas de mensagem crescem com o texto: a frase inteira fica sempre visível, sem rolagem escondida. */
function ajustarAltura(t) {
  if (!t || !t.offsetParent) return; // caixa escondida (outra aba): ajusta quando aparecer
  t.style.height = 'auto';
  t.style.height = (t.scrollHeight + 2) + 'px';
}
function ajustarTextos() { document.querySelectorAll('textarea.auto').forEach(ajustarAltura); }
// Blocos que abrem e fecham (details): ao abrir, as caixas de texto crescem até mostrar a frase inteira.
document.addEventListener('toggle', e => { if (e.target.open) e.target.querySelectorAll('textarea.auto').forEach(ajustarAltura); }, true);
document.addEventListener('input', e => { if (e.target.matches && e.target.matches('textarea.auto')) ajustarAltura(e.target); });
window.addEventListener('resize', () => { clearTimeout(ajustarTextos._t); ajustarTextos._t = setTimeout(ajustarTextos, 150); });
function renderHistorico() {
  const box = $('#campHist'); if (!box) return;
  const lista = [...S.campaigns].sort((x, y) => (y.created || '').localeCompare(x.created || '') || y.id - x.id);
  const ativas = lista.filter(c => campStatus(c) === 'ativa').length;
  const rs = $('#histResumo'); if (rs) rs.textContent = `${lista.length} campanha(s) · ${ativas} ativa(s)`;
  // Cada campanha numa linha curta; "ver mais" abre datas, números completos e resposta por versão.
  const abertos = new Set([...box.querySelectorAll('details[data-hist][open]')].map(d => d.dataset.hist));
  box.innerHTML = lista.map(c => {
    const r = resultados(c), st = campStatus(c);
    const vers = Object.keys(r.porVer).sort().map(v => `V${+v + 1}: ${r.porVer[v].e ? Math.round(r.porVer[v].r * 100 / r.porVer[v].e) : 0}% (${r.porVer[v].r}/${r.porVer[v].e})`).join(' · ');
    const botao = st === 'encerrada' ? `<button class="so-dono" data-reabrir="${c.id}">Reabrir</button>` : (c.id === S.activeCampId ? '' : `<button data-abrircamp="${c.id}">Abrir</button>`);
    return `<details class="histIt" data-hist="${c.id}"${abertos.has(String(c.id)) ? ' open' : ''}>
      <summary><b>${esc(c.name || 'Campanha sem nome')}</b> <span class="tag${st === 'encerrada' ? ' red' : st === 'programada' ? ' warn' : ''}">${st}</span>
        <small class="mut">${r.env} enviados · ${r.taxa}% de resposta</small></summary>
      <div class="histMais">
        <small>${c.inicio ? 'De ' + fmtD(c.inicio) : ''}${c.fim ? ' até ' + fmtD(c.fim) : ''}${c.ended ? ' · encerrada em ' + fmtD(c.ended) : ''}</small>
        <div class="hnum"><span><b>${r.env}</b> enviados</span><span><b>${r.resp}</b> responderam</span><span><b>${r.taxa}%</b> de resposta</span><span><b>${r.saiu}</b> saíram</span></div>
        ${vers ? `<small>Resposta por versão da mensagem: ${vers}</small>` : ''}
        ${botao ? `<div class="row" style="margin-top:8px">${botao}</div>` : ''}
      </div></details>`;
  }).join('') || '<p class="mut small">Nenhuma campanha ainda.</p>';
}
let abertosQ = '';
// 1.30.7: mostra só os 5 mais recentes (openedAt) e "Mostrar mais 5"; com busca, procura em todos.
const AB_PAG = 5; let abLim = AB_PAG;
function filtrarAbertos() {
  const q = semAcento(abertosQ).trim(), qd = q.replace(/\D/g, '');
  let vis = 0, n = 0, tot = 0;
  document.querySelectorAll('#revisao .abIt').forEach(it => {
    tot++;
    const b = it.dataset.busca || '', bate = !q || b.includes(q) || (qd.length >= 3 && b.replace(/\D/g, '').includes(qd));
    const ok = bate && (q || n++ < abLim);
    it.classList.toggle('hide', !ok); if (ok) vis++;
  });
  const v = $('#abertosVazio'); if (v) v.classList.toggle('hide', !q || vis > 0);
  const m = $('#abertosMais'); if (m) { const faltam = tot - abLim; m.classList.toggle('hide', !!q || faltam <= 0); m.textContent = `Mostrar mais ${Math.min(AB_PAG, faltam)} (faltam ${faltam})`; }
}
document.addEventListener('click', e => { if (e.target && e.target.id === 'abertosMais') { abLim += AB_PAG; filtrarAbertos(); } });
document.addEventListener('input', e => { if (e.target && e.target.id === 'abertosBusca') { abertosQ = e.target.value; filtrarAbertos(); } });
function renderHoje() {
  const left = Math.max(0, limiteDia() - sentToday());
  const el = S.contacts.filter(c => eligible(c));
  renderCampSel();
  const stA = campStatus(active());
  const apA = aprovSt(active());
  $('#hojeResumo').textContent = bloqueadaParaMim(active()) ? (apA === 'ajuste' ? `O dono pediu ajuste nesta campanha${active().aprov.nota ? ': "' + active().aprov.nota + '"' : ''}. Ajuste na aba Campanha e salve de novo.` : 'Esta campanha está aguardando a aprovação do dono da loja. Os envios liberam assim que ele aprovar.')
    : stA === 'programada' ? `Esta campanha começa em ${fmtD(active().inicio)}. Escolha outra campanha acima ou aguarde.`
    : stA === 'encerrada' ? 'Esta campanha foi encerrada. Escolha outra campanha acima ou crie uma nova na aba Campanha.'
    : left ? `Você ainda pode abrir ${left} conversa(s) hoje. ${el.length} cliente(s) aguardam nesta campanha.`
    : `Limite de hoje atingido. Amanhã a lista continua de onde parou. ${el.length} cliente(s) aguardam.`;
  // 1.24.0: a lista vem em rodadas de 5 para não desanimar; abriu os 5, os próximos aparecem sozinhos.
  const RODADA = 5, feitos = sentToday(), metaHoje = Math.min(limiteDia(), feitos + el.length);
  const rodadas = Math.max(1, Math.ceil(metaHoje / RODADA)), rodadaAtual = Math.min(rodadas, Math.floor(feitos / RODADA) + 1);
  let topo = '';
  if (metaHoje > 0 && !bloqueadaParaMim(active()) && stA === 'ativa') {
    const pctDia = Math.round(Math.min(feitos, metaHoje) * 100 / metaHoje);
    const msgRod = feitos >= metaHoje ? '<p class="rodOk">Meta de hoje cumprida! 🎉 Amanhã a lista continua de onde parou.</p>'
      : feitos && feitos % RODADA === 0 ? `<p class="rodOk">Rodada ${feitos / RODADA} concluída! 👏 Aqui estão os próximos ${Math.min(RODADA, metaHoje - feitos)}.</p>` : '';
    topo = `<div class="rodada"><div class="rodTx"><b>Rodada ${rodadaAtual} de ${rodadas}</b><span>${Math.min(feitos, metaHoje)} de ${metaHoje} mensagens de hoje</span></div>
      <div class="rodBar"><i style="width:${pctDia}%"></i></div>${msgRod}</div>`;
  }
  let html = topo + el.slice(0, Math.min(left, RODADA)).map((c, i) => {
    const idx = S.contacts.indexOf(c);
    const txt = msgFor(c, idx);
    return `<div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')}</b><small>${fmt(c.num)}</small></div>
      <a class="go" href="${esc(openLink(c.num, txt))}" data-open="${c.id}">Abrir / Enviar</a>
      <button class="x" title="Excluir da lista" data-del="${c.id}">✕</button></div>`;
  }).join('');
  // 1.30.8: a lista "Abertos hoje"/"Enviados anteriormente" saiu; a conferência fica só em "Quem respondeu?" (renderRevisao), com busca e 5 por vez.
  const saud = (h => h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')(new Date().getHours());
  const nome = firstName((window.CA_ACCESS || {}).nome || '');
  const nNiver = desligado('niver') ? 0 : S.contacts.filter(c => isBdayToday(c) && c.bdaySent !== String(new Date().getFullYear())).length;
  const nResp = S.contacts.filter(c => c.status === 'aberto' && !c.reviewed).length;
  const nPos = S.contacts.filter(c => posVendaDue(c)).length;
  const nVenc = PACOTE() ? S.contacts.reduce((n, c) => n + vencDue(c).length, 0) : 0;
  renderAprovar();
  if (window.CA_renderPremium) window.CA_renderPremium();
  const nVendas = souDono() ? S.contacts.filter(c => c.venda && c.venda.st === 'aberto').length : 0;
  const nAprov = souDono() ? S.campaigns.filter(c => campStatus(c) !== 'encerrada' && aprovSt(c) === 'pendente').length : 0;
  if ($('#hojeOla')) {
    $('#hojeOla').textContent = `${saud}${nome ? ', ' + nome : ''}!`;
    const partes = (nVendas ? [`${nVendas} cliente(s) interessado(s)`] : []).concat(nAprov ? [`${nAprov} campanha(s) para aprovar`] : []).concat([`${Math.min(left, el.length)} envio(s)`]).concat(ligado('niver') ? [`${nNiver} aniversariante(s)`] : []).concat(nVenc ? [`${nVenc} vencimento(s)`] : []).concat(nPos ? [`${nPos} pós-venda`] : []).concat([`${nResp} resposta(s) para marcar`]);
    $('#hojeLinha').textContent = (left || nNiver || nResp || nPos || nVenc || nAprov || nVendas) ? 'Para hoje: ' + partes.join(' · ') + '.' : 'Tudo em dia por hoje. 🎉';
  }
  $('#listaHoje').innerHTML = html || '<p class="mut small">Ninguém para enviar agora. Adicione contatos ou escolha outro público.</p>';
  if (window.CA_renderImpl) window.CA_renderImpl();
}
/* Cartão "Campanhas para aprovar" (dono): revisa o que o operador preparou e aprova ou pede ajuste. */
function renderAprovar() {
  const card = $('#aprovCard'); if (!card) return;
  const pend = souDono() ? S.campaigns.filter(c => campStatus(c) !== 'encerrada' && aprovSt(c) === 'pendente') : [];
  card.classList.toggle('hide', !pend.length);
  if (!pend.length) { card.innerHTML = ''; return; }
  card.innerHTML = `<h3>✅ Campanhas para aprovar</h3><p class="mut small">O operador do Cliente Assistido preparou ${pend.length === 1 ? 'esta campanha' : 'estas campanhas'}. Confira o público e as mensagens. Nada é enviado antes da sua aprovação.</p>` +
    pend.map(c => `<div class="aprovItem"><b>${esc(c.name || 'Campanha sem nome')}</b>
      <p class="small">Período: ${c.inicio ? 'de ' + fmtD(c.inicio) : 'a partir de hoje'}${c.fim ? ' até ' + fmtD(c.fim) : ', sem data para terminar'} · Público: ${esc(descAud(c.aud || {}))}</p>
      ${(c.msgs || []).filter(m => m.trim()).map((m, i) => `<p class="small mut" style="margin:6px 0 2px">Versão ${i + 1}</p><div class="prev">${esc(m)}</div>`).join('')}
      <div class="row wrap" style="margin-top:8px"><button class="primary" data-aprovar-camp="${c.id}">Aprovar</button><button data-ajuste-camp="${c.id}">Pedir ajuste</button></div></div>`).join('');
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-aprovar-camp]'), j = e.target.closest('[data-ajuste-camp]');
  if (!a && !j) return;
  const c = S.campaigns.find(x => x.id === +(a || j).dataset[a ? 'aprovarCamp' : 'ajusteCamp']); if (!c || !souDono()) return;
  if (a) {
    if (!confirm(`Aprovar a campanha "${c.name || 'sem nome'}"? O operador poderá começar os envios.`)) return;
    registrarAprov(c, 'aprovada');
    if (window.CA_log) window.CA_log('campanha_aprovada', { campanha: c.name || '' });
  } else {
    const nota = prompt('O que precisa mudar? O operador vê este recado na campanha.', '');
    if (nota === null) return;
    registrarAprov(c, 'ajuste', nota.trim());
    if (window.CA_log) window.CA_log('campanha_ajuste', { campanha: c.name || '', nota: nota.trim() });
  }
  save(); renderAll();
});

function renderAll() { aplicarPacote(); renderVenc(); autoGroups(); renderKPIs(); renderRevisao(); renderContatos(); renderHoje(); renderPendingDDD(); renderNiver(); renderPosVenda(); renderDatas(); renderHistorico(); if (window.CA_renderDash) window.CA_renderDash(); if (window.CA_renderTreino) window.CA_renderTreino(); saveSummary(); if (window.CA_renderGInfo) window.CA_renderGInfo(); }
function showMsg(sel, t) { const el = $(sel); el.textContent = t; el.classList.remove('hide'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.add('hide'), 8000); }

/* ---------- Eventos ---------- */
document.querySelectorAll('.tabs button, [data-goto]').forEach(b => b.addEventListener('click', () => {
  const t = b.dataset.tab || b.dataset.goto;
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x.dataset.tab === t));
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x.id === t));
  if (t === 'campanha') renderCampanha(); else renderAll();
  window.scrollTo(0, 0);
  requestAnimationFrame(ajustarTextos);
}));

document.addEventListener('click', e => {
  const z = e.target.closest('[data-semzap],[data-temzap]');
  if (z) { if (z.dataset.semzap) { if (confirm('O WhatsApp avisou que este número não está no WhatsApp? Ele sai das listas de envio e esta abertura não conta no limite de hoje.')) marcarSemZap(z.dataset.semzap); } else marcarSemZap(z.dataset.temzap, true); return; }
  const t = e.target.closest('[data-del],[data-res],[data-st],[data-open]');
  if (!t) return;
  if (t.dataset.del) { const c = S.contacts.find(x => x.id === t.dataset.del); if (c) { c.excluded = true; save(); renderAll(); } }
  else if (t.dataset.res) { const c = S.contacts.find(x => x.id === t.dataset.res); if (c) { c.excluded = false; save(); renderAll(); } }
  else if (t.dataset.st) { setStatus(t.dataset.id, t.dataset.st === 'nao' ? 'aberto' : t.dataset.st); }
  else if (t.dataset.open) { markOpened(t.dataset.open); }
});
document.addEventListener('click', e => {
  const n = e.target.closest('[data-niver]');
  if (n) { const c = S.contacts.find(x => x.id === n.dataset.niver); if (c) { c.bdaySent = anoAtual(); c.lastOpen = today(); save(); if (window.CA_log) window.CA_log('parabens', { nome: c.name || '', num: c.num }); setTimeout(renderAll, 400); } return; }
  const pv = e.target.closest('[data-pv]');
  if (pv) { const c = S.contacts.find(x => x.id === pv.dataset.pv); if (c) { c[pv.dataset.pvk === 'd1' ? 'pv1' : 'pv7'] = today(); c.lastOpen = today(); save(); if (window.CA_log) window.CA_log(pv.dataset.pvk === 'd1' ? 'posvenda_obrigado' : 'posvenda_como_ficou', { nome: c.name || '', num: c.num }); setTimeout(renderAll, 400); } return; }
  const pvs = e.target.closest('[data-pvskip]');
  if (pvs) { const c = S.contacts.find(x => x.id === pvs.dataset.pvskip); if (c) { c[pvs.dataset.pvk === 'd1' ? 'pv1' : 'pv7'] = 'pulou'; save(); renderAll(); } return; }
  const cp = e.target.closest('[data-compra]');
  if (cp) {
    const c = S.contacts.find(x => x.id === cp.dataset.compra); if (!c) return;
    if (!confirm(`Registrar que ${c.name || 'este cliente'} comprou hoje?\n\nO app lembra você de agradecer amanhã e de perguntar como ficou daqui a 7 dias.`)) return;
    c.compra = today(); delete c.pv1; delete c.pv7; save(); renderAll();
    showMsg('#importMsg', `Pós-venda agendado para ${c.name || 'o cliente'}: agradecimento amanhã e "como ficou?" em 7 dias.`);
    return;
  }
  const b = e.target.closest('[data-bd]');
  if (b) {
    const c = S.contacts.find(x => x.id === b.dataset.bd); if (!c) return;
    const v = prompt(`Aniversário de ${c.name || 'contato'} (dia/mês, ex.: 25/12). Deixe vazio para apagar.`, fmtBday(c.bday));
    if (v === null) return;
    const m = v.trim().match(/^(\d{1,2})\D+(\d{1,2})/);
    if (!v.trim()) c.bday = '';
    else if (m && +m[1] >= 1 && +m[1] <= 31 && +m[2] >= 1 && +m[2] <= 12) c.bday = '--' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
    else { alert('Use o formato dia/mês, por exemplo 25/12.'); return; }
    save(); renderAll();
  }
});
document.addEventListener('change', e => {
  const s = e.target.closest('[data-grp]');
  if (s) { const c = S.contacts.find(x => x.id === s.dataset.grp); if (c) { c.group = s.value; c.groupManual = true; save(); renderKPIs(); } }
});

$('#btnPicker').addEventListener('click', async () => {
  if (!('contacts' in navigator && 'select' in navigator.contacts)) {
    showMsg('#importMsg', 'Este navegador não permite escolher da agenda. Use o Chrome no Android ou importe o arquivo de contatos (.vcf).');
    return;
  }
  try {
    const res = await navigator.contacts.select(['name', 'tel'], { multiple: true });
    oferecerPosVenda(addMany(res.map(r => ({ name: (r.name || [])[0] || '', tels: r.tel || [] }))));
  } catch (err) { showMsg('#importMsg', 'Seleção cancelada.'); }
});
$('#fileImport').addEventListener('change', async e => {
  const files = [...e.target.files];
  if (!files.length) return;
  showMsg('#importMsg', 'Lendo o arquivo… aguarde.');
  try {
    const all = [];
    for (const f of files) {
      const txt = await f.text();
      if (/BEGIN:VCARD/i.test(txt)) all.push(...parseVCF(txt));
      else if (/\.csv$/i.test(f.name) || /[;,].*[;,]/.test(txt.split('\n')[0])) all.push(...parseCSV(txt));
      else all.push(...parsePaste(txt));
    }
    if (!all.length) showMsg('#importMsg', 'Não encontrei contatos nesse arquivo. Confira se é o arquivo .vcf exportado dos Contatos.');
    else addMany(all);
  } catch (err) {
    showMsg('#importMsg', 'Não consegui ler o arquivo: ' + (err && err.message ? err.message : err));
  }
  e.target.value = '';
});
$('#autoGrp').addEventListener('change', e => { S.settings.autoGroups = e.target.checked; save(); const n = autoGroups(); renderAll(); if (e.target.checked) showMsg('#importMsg', n ? `${n} contato(s) reorganizado(s) automaticamente.` : 'Organização automática ligada.'); });
$('#btnLiberarGrp').addEventListener('click', () => {
  const fixos = S.contacts.filter(c => c.groupManual);
  if (!fixos.length) { showMsg('#importMsg', 'Nenhum contato com grupo fixo.'); return; }
  if (!confirm(`Liberar ${fixos.length} contato(s) com grupo escolhido à mão para a organização automática?`)) return;
  fixos.forEach(c => { c.groupManual = false; }); save(); const n = autoGroups(); renderAll();
  showMsg('#importMsg', `${fixos.length} liberado(s); ${n} mudaram de grupo.`);
});
$('#niverMsg').addEventListener('change', e => { S.bdayMsg = e.target.value.trim() || DEFAULT_BDAY; save(); renderNiver(); });
$('#pvMsg1').addEventListener('change', e => { S.pvMsg1 = e.target.value.trim() || DEFAULT_PV1; save(); renderPosVenda(); });
$('#pvMsg7').addEventListener('change', e => { S.pvMsg7 = e.target.value.trim() || DEFAULT_PV7; save(); renderPosVenda(); });
$('#prDepois').addEventListener('click', () => { S.askSnooze = Date.now() + 3 * 3600000; save(); $('#perguntaResp').classList.add('hide'); });
$('#prFechar').addEventListener('click', () => { $('#perguntaResp').classList.add('hide'); });
$('#btnPaste').addEventListener('click', () => $('#pasteBox').classList.toggle('hide'));
$('#btnPasteOk').addEventListener('click', () => { oferecerPosVenda(addMany(parsePaste($('#pasteText').value))); $('#pasteText').value = ''; $('#pasteBox').classList.add('hide'); });
$('#ddd').addEventListener('change', e => { S.settings.ddd = e.target.value.replace(/\D/g, '').slice(0, 2) || '62'; save(); });
const refilter = () => { PAGE = 5; renderContatos(); };
$('#busca').addEventListener('input', () => { $('#buscaLimpar').classList.toggle('hide', !$('#busca').value); refilter(); });
$('#buscaLimpar').addEventListener('click', () => { $('#busca').value = ''; $('#buscaLimpar').classList.add('hide'); refilter(); $('#busca').focus(); });
$('#filtroGrupo').addEventListener('change', refilter);
$('#filtroStatus').addEventListener('change', refilter);
$('#btnMais').addEventListener('click', () => { PAGE += 5; renderContatos(); });
document.addEventListener('change', e => {
  const k = e.target.closest('[data-sel]');
  if (!k) return;
  k.checked ? SEL.add(k.dataset.sel) : SEL.delete(k.dataset.sel);
  k.closest('.it').classList.toggle('sel', k.checked);
  renderBulk();
});
$('#selAll').addEventListener('change', e => {
  const vis = visibleContacts();
  if (e.target.checked) vis.forEach(c => SEL.add(c.id)); else vis.forEach(c => SEL.delete(c.id));
  renderContatos();
});
$('#bulkClear').addEventListener('click', () => { SEL.clear(); renderContatos(); });
$('#bulkMove').addEventListener('click', () => {
  const g = $('#bulkGrp').value, n = SEL.size;
  S.contacts.forEach(c => { if (SEL.has(c.id)) { c.group = g; c.groupManual = true; } });
  SEL.clear(); save(); renderAll();
  showMsg('#importMsg', `${n} contato(s) movido(s) para "${GROUPS[g]}".`);
  if (window.CA_log) window.CA_log('moveu_em_massa', { quantidade: n, grupo: GROUPS[g] });
  window.scrollTo(0, 0);
});
$('#bulkDel').addEventListener('click', () => {
  const n = SEL.size;
  if (!confirm(`Excluir ${n} contato(s) da lista? Eles vão para "Excluídos" e podem ser restaurados.`)) return;
  S.contacts.forEach(c => { if (SEL.has(c.id)) c.excluded = true; });
  SEL.clear(); save(); renderAll();
  showMsg('#importMsg', `${n} contato(s) excluído(s). Para desfazer, abra "Excluídos" no fim da lista.`);
  if (window.CA_log) window.CA_log('excluiu_em_massa', { quantidade: n });
  window.scrollTo(0, 0);
});
$('#btnRestTodos').addEventListener('click', () => {
  const exc = S.contacts.filter(c => c.excluded);
  if (!confirm(`Restaurar os ${exc.length} contatos excluídos?`)) return;
  exc.forEach(c => { c.excluded = false; }); save(); renderAll();
});

document.querySelectorAll('#segApp button').forEach(b => b.addEventListener('click', () => { S.settings.app = b.dataset.app; save(); renderCampanha(); }));
$('#btnSalvarCamp').addEventListener('click', () => {
  const c = active();
  const msgs = [...document.querySelectorAll('[data-msg]')].map(t => t.value);
  if (!msgs.some(m => m.trim())) { showMsg('#campMsg', 'Escreva pelo menos uma mensagem.'); return; }
  const ini = $('#cInicio').value, fim = $('#cFim').value;
  if (ini && fim && fim < ini) { showMsg('#campMsg', 'A data de fim precisa ser depois do início.'); return; }
  c.name = $('#cNome').value.trim(); c.inicio = ini; c.fim = fim; c.aud = audForm(); c.msgs = msgs; c.salva = today();
  if (c.ended && (!fim || fim >= today())) c.ended = '';
  tocarCamp(c); aprovAoSalvar(c);
  save(); renderCampanha(); renderKPIs(); showMsg('#campMsg', aprovSt(c) === 'pendente' ? 'Campanha salva e enviada para o dono aprovar. Os envios começam depois da aprovação.' : 'Campanha salva.');
  if (window.CA_log) window.CA_log('campanha_salva', { campanha: c.name || '', publico: c.aud.groups.join(','), limite: limiteDia() });
});
// As duas opções de aniversário se excluem (marcar uma desmarca a outra).
['#cNiverMes', '#cSemNiver'].forEach((id, i, l) => { const el = $(id); if (el) el.addEventListener('change', () => { if (el.checked) { const o = $(l[1 - i]); if (o.checked) { o.checked = false; o.dispatchEvent(new Event('change', { bubbles: true })); } } }); });
$('#btnNovaCamp').addEventListener('click', () => {
  const c = novaCamp('');
  S.campaigns.push(c); S.activeCampId = c.id; save(); renderCampanha();
  $('#cNome').focus();
  showMsg('#campMsg', 'Nova campanha criada. Dê um nome, escolha o público, escreva as mensagens e salve. As outras campanhas continuam guardadas.');
});
$('#btnEncerrarCamp').addEventListener('click', () => {
  const c = active();
  if (!confirm(`Encerrar a campanha "${c.name || 'sem nome'}"? Ela sai da lista de envios e fica no histórico com os resultados.`)) return;
  c.ended = today(); tocarCamp(c);
  const outra = S.campaigns.find(x => x.id !== c.id && campStatus(x) === 'ativa');
  if (outra) S.activeCampId = outra.id;
  save(); renderCampanha(); renderAll();
  if (window.CA_log) window.CA_log('campanha_encerrada', { campanha: c.name || '' });
});
document.addEventListener('change', e => {
  if (e.target.id === 'hojeCamp' || e.target.id === 'campSel') {
    S.activeCampId = +e.target.value; save(); renderAll();
    if ($('#campanha').classList.contains('on')) renderCampanha();
  }
  const cg = e.target.closest('[data-cg]');
  if (cg && cg.checked) document.querySelectorAll('[data-cg]').forEach(x => { if (x !== cg && (cg.dataset.cg === 'todos' || x.dataset.cg === 'todos')) x.checked = false; });
  if (e.target.closest('#cAud') || e.target.id === 'cInicio' || e.target.id === 'cFim') atualizarPublico();
  if (e.target.id === 'cLimite') { S.settings.limit = Math.min(60, Math.max(1, parseInt(e.target.value, 10) || 50)); e.target.value = S.settings.limit; save(); renderAll(); }
  if (e.target.id === 'cDescanso') { S.settings.descanso = Math.min(30, Math.max(0, parseInt(e.target.value, 10) || 0)); e.target.value = S.settings.descanso; save(); renderAll(); }
});
document.addEventListener('click', e => {
  // O histórico fica em Mais: abrir ou reabrir leva para a aba Campanha com ela aberta.
  const irCampanha = () => { const t = document.querySelector('.tabs button[data-tab="campanha"]'); if (t) t.click(); window.scrollTo(0, 0); };
  const r = e.target.closest('[data-reabrir]');
  if (r) { const c = S.campaigns.find(x => x.id === +r.dataset.reabrir); if (c) { c.ended = ''; if (c.fim && c.fim < today()) c.fim = ''; tocarCamp(c); S.activeCampId = c.id; save(); renderCampanha(); renderAll(); irCampanha(); } return; }
  const ab = e.target.closest('[data-abrircamp]');
  if (ab) { S.activeCampId = +ab.dataset.abrircamp; save(); renderCampanha(); renderAll(); irCampanha(); }
});

/* ---------- Modelos prontos de campanha e aviso de datas comerciais ---------- */
const MODELOS = () => window.CA_MODELOS || [];
const diasAte = iso => Math.round((new Date(iso + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 86400000);
let modTipo = 'rel';
function descAud(au) {
  const p = [];
  const gs = au.groups || ['todos'];
  p.push(gs.includes('todos') ? 'todos os grupos' : gs.map(g => GROUPS[g] || g).join(', '));
  if (au.status === 'nunca') p.push('que nunca receberam mensagem');
  if (au.status === 'respondeu') p.push('que já responderam');
  if (au.status === 'semresp') p.push('que receberam e não responderam');
  if (au.compraDias) p.push(`que compraram nos últimos ${au.compraDias} dias`);
  if (au.semContatoDias) p.push(`sem contato há ${au.semContatoDias} dias ou mais`);
  if (au.niverMes) p.push('aniversariantes do mês');
  if (au.semNiver) p.push('sem aniversário cadastrado');
  if (au.venc) { const t = vencTipos().find(x => x.k === au.venc); if (t) p.push(`com ${t.r.toLowerCase()} vencendo em até 30 dias ou vencida`); }
  return p.join(' · ');
}
function abrirModelos(tipo) {
  if (tipo) modTipo = tipo;
  else if (!abrirModelos.ja && PACOTE() && ligado('modelos_ramo')) modTipo = 'ramo'; // na primeira vez, mostra os modelos do ramo
  abrirModelos.ja = true;
  if (modTipo === 'ramo' && !(PACOTE() && ligado('modelos_ramo'))) modTipo = 'rel';
  document.querySelectorAll('#modTipo button').forEach(b => b.classList.toggle('on', b.dataset.tipo === modTipo));
  const lojaId = ((window.CA_ACCESS || {}).loja || {}).id;
  const lista = MODELOS().filter(m => m.tipo === modTipo && (!m.ramo || m.ramo === ramoAtual()) && (!m.lojas || m.lojas.includes(lojaId))); // m.lojas: modelo exclusivo de uma loja
  if (modTipo === 'data') lista.sort((x, y) => window.CA_periodoModelo(x).alvo.localeCompare(window.CA_periodoModelo(y).alvo)); // a próxima data primeiro
  $('#modSel').innerHTML = lista.map(m => {
    const p = m.tipo === 'data' ? window.CA_periodoModelo(m) : null;
    return `<option value="${m.key}">${esc(m.nome)}${p ? ' · ' + fmtD(p.alvo) + (p.ano !== new Date().getFullYear() ? '/' + p.ano : '') : ''}</option>`;
  }).join('');
  $('#modSheet').classList.remove('hide');
  infoModelo();
}
function infoModelo() {
  const m = MODELOS().find(x => x.key === $('#modSel').value); if (!m) return;
  const p = m.tipo === 'data' ? window.CA_periodoModelo(m) : null;
  const e = estimativa(m.aud, p ? p.inicio : '', p ? p.fim : '');
  $('#modInfo').innerHTML = `
    <p class="small"><b>Público:</b> ${esc(descAud(m.aud))}</p>
    <p class="msg small">${esc(textoEstimativa(e))}</p>
    <p class="small"><b>Período:</b> ${p ? `de ${fmtD(p.inicioIdeal)} a ${fmtD(p.fim)}${p.ano !== new Date().getFullYear() ? ' de ' + p.ano : ''}` : 'começa hoje, sem data para terminar'}</p>
    <p class="small"><b>As 5 mensagens:</b></p>
    <ol class="modmsgs">${m.msgs.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`;
}
function criarDeModelo(key) {
  const m = MODELOS().find(x => x.key === key); if (!m) return;
  if (m.msgs.some(t => /\{instagram\}/i.test(t)) && !normInsta(S.settings.instagram)) {
    const h = prompt('Qual é o Instagram da loja? (ex.: @sualoja)', '');
    if (h === null) return;
    if (normInsta(h)) { S.settings.instagram = normInsta(h); save(); }
  }
  const p = m.tipo === 'data' ? window.CA_periodoModelo(m) : null;
  const c = novaCamp(m.nome + (p ? ' ' + p.ano : ''));
  c.msgs = m.msgs.slice(0, 5); c.aud = JSON.parse(JSON.stringify(m.aud));
  if (p) { c.inicio = p.inicio; c.fim = p.fim; }
  c.tpl = key + (p ? '-' + p.ano : '');
  tocarCamp(c); aprovAoSalvar(c);
  S.campaigns.push(c); S.activeCampId = c.id; save();
  $('#modSheet').classList.add('hide');
  document.querySelector('.tabs button[data-tab="campanha"]').click();
  showMsg('#campMsg', `Campanha "${c.name}" criada a partir do modelo, com público, datas e 5 mensagens. Revise do seu jeito e toque em Salvar.`);
  if (window.CA_log) window.CA_log('campanha_modelo', { campanha: c.name });
}
function renderDatas() {
  const box = $('#datasLista'); if (!box) return;
  if (desligado('datas')) { $('#datasCard').classList.add('hide'); return; }
  S.tplDismiss = S.tplDismiss || {};
  const itens = MODELOS().filter(m => m.tipo === 'data').map(m => ({ m, p: window.CA_periodoModelo(m) })).filter(({ m, p }) => {
    if (!p) return false;
    const k = m.key + '-' + p.ano;
    if (S.tplDismiss[k] || S.campaigns.some(c => c.tpl === k)) return false;
    return diasAte(p.inicioIdeal) <= 7 && diasAte(p.fim) >= 0;
  });
  $('#datasCard').classList.toggle('hide', !itens.length);
  box.innerHTML = itens.map(({ m, p }) => {
    const falta = diasAte(p.alvo);
    const txt = falta > 0 ? `Faltam ${falta} dia(s) para ${m.nome === 'Black Friday' ? 'a' : 'o'} ${m.nome} (${fmtD(p.alvo)}).` : falta === 0 ? `Hoje é ${m.nome}!` : `${m.nome} em andamento.`;
    return `<div class="it"><div class="t"><b>📅 ${esc(m.nome)}</b><small>${esc(txt)} Campanha pronta com 5 mensagens.</small></div><button class="primary" data-modelo="${m.key}">Criar</button><button class="x" title="Agora não" data-tpldismiss="${m.key}-${p.ano}">✕</button></div>`;
  }).join('');
}
document.addEventListener('click', e => {
  const md = e.target.closest('[data-modelo]'); if (md) { criarDeModelo(md.dataset.modelo); return; }
  const dm = e.target.closest('[data-tpldismiss]'); if (dm) { S.tplDismiss = S.tplDismiss || {}; S.tplDismiss[dm.dataset.tpldismiss] = today(); save(); renderDatas(); }
});
$('#btnModelo').addEventListener('click', () => abrirModelos());
document.querySelectorAll('#modTipo button').forEach(b => b.addEventListener('click', () => abrirModelos(b.dataset.tipo)));
$('#modSel').addEventListener('change', infoModelo);
$('#modUsar').addEventListener('click', () => criarDeModelo($('#modSel').value));
$('#modFechar').addEventListener('click', () => $('#modSheet').classList.add('hide'));

/* ---------- Envio avulso: escolher a campanha para um cliente específico ---------- */
let avId = null;
function abrirAvulso(id) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  avId = id;
  const abertas = S.campaigns.filter(x => campStatus(x) === 'ativa');
  $('#avTitulo').textContent = `Enviar para ${c.name || fmt(c.num)}`;
  $('#avCamp').innerHTML = abertas.map(x => `<option value="${x.id}"${x.id === S.activeCampId ? ' selected' : ''}>${esc(x.name || 'Campanha sem nome')}</option>`).join('');
  $('#avSheet').classList.remove('hide');
  atualizarAvulso();
}
function atualizarAvulso() {
  const c = S.contacts.find(x => x.id === avId); if (!c) return;
  const camp = S.campaigns.find(x => x.id === +$('#avCamp').value);
  const go = $('#avGo'), av = $('#avAviso');
  if (c.status === 'saiu') { av.textContent = 'Este cliente pediu para sair. Não envie mensagens para ele.'; go.classList.add('hide'); $('#avPrev').textContent = ''; return; }
  if (!camp) { av.textContent = 'Não há campanha ativa. Crie ou reabra uma campanha na aba Campanha.'; go.classList.add('hide'); $('#avPrev').textContent = ''; return; }
  if (bloqueadaParaMim(camp)) { av.textContent = 'Esta campanha ainda não foi aprovada pelo dono da loja.'; go.classList.add('hide'); $('#avPrev').textContent = msgFor(c, S.contacts.indexOf(c), camp); return; }
  const txt = msgFor(c, S.contacts.indexOf(c), camp);
  $('#avPrev').textContent = txt;
  const ja = c.opened && c.opened[camp.id];
  av.textContent = ja ? `Este cliente já recebeu esta campanha em ${fmtD(ja)}.` : (sentToday() >= limiteDia() ? 'Atenção: o limite de envios de hoje já foi atingido.' : '');
  go.classList.remove('hide'); go.href = openLink(c.num, txt); go.dataset.avcamp = camp.id;
}
$('#avCamp').addEventListener('change', atualizarAvulso);
$('#avFechar').addEventListener('click', () => $('#avSheet').classList.add('hide'));
$('#avGo').addEventListener('click', e => { markOpened(avId, +e.currentTarget.dataset.avcamp); setTimeout(() => $('#avSheet').classList.add('hide'), 300); });
document.addEventListener('click', e => { const b = e.target.closest('[data-avulso]'); if (b) abrirAvulso(b.dataset.avulso); });

/* ---------- Vencimentos: avisar, marcar feito, pular ---------- */
document.addEventListener('click', e => {
  const av = e.target.closest('[data-venc]');
  if (av) { const c = S.contacts.find(x => x.id === av.dataset.venc); if (c) { c.vencAv = c.vencAv || {}; c.vencAv[av.dataset.vk + ':' + av.dataset.vp] = today(); c.lastOpen = today(); save(); if (window.CA_log) window.CA_log('aviso_vencimento', { nome: c.name || '', num: c.num, tipo: av.dataset.vk }); setTimeout(renderAll, 400); } return; }
  const vf = e.target.closest('[data-vfeito]');
  if (vf) { const c = S.contacts.find(x => x.id === vf.dataset.vfeito); const t = vencTipos().find(x => x.k === vf.dataset.vk); if (c && t && confirm(`Registrar que ${c.name || 'o cliente'} fez ${t.r.toLowerCase()} hoje? O próximo aviso fica para daqui a ${t.meses} mes(es).`)) { c.serv = c.serv || {}; c.serv[t.k] = { data: today() }; save(); renderAll(); } return; }
  const vp = e.target.closest('[data-vpular]');
  if (vp) { const c = S.contacts.find(x => x.id === vp.dataset.vpular); if (c) { c.vencAv = c.vencAv || {}; c.vencAv[vp.dataset.vk + ':' + vp.dataset.vp] = 'pulou'; save(); renderAll(); } return; }
  const vb = e.target.closest('[data-veic]'); if (vb) abrirVeiculo(vb.dataset.veic);
});
/* ---------- Ficha do veículo (ou item do ramo) e serviços ---------- */
let veId = null;
function abrirVeiculo(id) {
  const c = S.contacts.find(x => x.id === id), p = PACOTE(); if (!c || !p) return;
  veId = id; const v = c.veic || {};
  $('#veTitulo').textContent = `${p.item.icone} ${c.name || fmt(c.num)}`;
  $('#veCampos').innerHTML = p.item.campos.map(f => `<label class="grow">${esc(f.r)}<input data-vc="${f.k}" value="${esc(v[f.k] || '')}" placeholder="${esc(f.ph || '')}"${f.num ? ' inputmode="numeric"' : ''}></label>`).join('');
  $('#veServ').innerHTML = vencTipos().map(t => { const s = (c.serv || {})[t.k] || {}; return `<div class="vserv"><span class="vnome">${t.ic} ${esc(t.r)}</span>
    <div class="vlin"><input type="date" data-vd="${t.k}" value="${s.data || ''}" aria-label="Último serviço: ${esc(t.r)}"><button data-vhoje="${t.k}">Hoje</button></div>
    <small class="mut" id="vpx-${t.k}">${proxTxt(t, s, c)}</small></div>`; }).join('');
  const mk = mediaKm(c), kmBox = $('#veKm');
  if (kmBox) { kmBox.classList.toggle('hide', !ligado('venc_km')); kmBox.textContent = mk.doCliente ? `Este cliente roda cerca de ${mk.media.toLocaleString('pt-BR')} km por mês (calculado pelas leituras de km).` : `Média usada: ${mk.media.toLocaleString('pt-BR')} km por mês (padrão da loja). Com duas leituras de km em datas diferentes, o app passa a usar a média deste cliente.`; }
  $('#veSheet').classList.remove('hide');
}
function proxTxt(t, s, c) {
  const i = proxVencInfo(Object.assign({}, c || {}, { serv: { [t.k]: s } }), t), d = i.d;
  const regra = `a cada ${t.meses} mes(es)${t.km && ligado('venc_km') ? ' ou ' + Number(t.km).toLocaleString('pt-BR') + ' km' : ''}`;
  return d ? `próximo: ${d.split('-').reverse().join('/')} (${venceTxt(diasAte(d))})${i.km ? ' · pela km estimada' : i.sistema ? ' · data do sistema da loja' : ''}` : `sem registro · ${regra}`;
}
document.addEventListener('change', e => { const d = e.target.closest('[data-vd]'); if (d) { const t = vencTipos().find(x => x.k === d.dataset.vd); $('#vpx-' + t.k).textContent = proxTxt(t, { data: d.value }, S.contacts.find(x => x.id === veId)); } });
document.addEventListener('click', e => { const h = e.target.closest('[data-vhoje]'); if (h) { const i = document.querySelector(`[data-vd="${h.dataset.vhoje}"]`); i.value = today(); i.dispatchEvent(new Event('change', { bubbles: true })); } });
$('#veFechar').addEventListener('click', () => $('#veSheet').classList.add('hide'));
$('#veSalvar').addEventListener('click', () => {
  const c = S.contacts.find(x => x.id === veId); if (!c) return;
  const v = {}; document.querySelectorAll('[data-vc]').forEach(i => { const x = i.value.trim(); if (x) v[i.dataset.vc] = i.dataset.vc === 'placa' ? x.toUpperCase().replace(/[^A-Z0-9]/g, '') : i.dataset.vc === 'km' ? x.replace(/\D/g, '') : x; });
  c.veic = Object.assign(v, novaLeituraKm(c.veic || {}, v.km, today()));
  let fezHoje = false; c.serv = c.serv || {};
  document.querySelectorAll('[data-vd]').forEach(i => {
    const k = i.dataset.vd, ant = c.serv[k];
    if (!i.value) { delete c.serv[k]; return; }
    if (!ant || ant.data !== i.value) c.serv[k] = { data: i.value }; // data nova: o próximo é recalculado pelo prazo
    if (i.value === today() && (!ant || ant.data !== i.value)) fezHoje = true;
  });
  $('#veSheet').classList.add('hide');
  if (fezHoje && ligado('posvenda') && c.compra !== today() && confirm('Registrar o atendimento de hoje também no pós-venda?\n\nO app lembra você de agradecer amanhã e de perguntar como ficou o carro daqui a 7 dias.')) { c.compra = today(); delete c.pv1; delete c.pv7; }
  save(); renderAll();
  if (window.CA_log) window.CA_log('ficha_veiculo', { nome: c.name || '', num: c.num });
});
/* ---------- Ajuste dos vencimentos pelo dono: prazo, antecedência e mensagem ---------- */
function renderVencCfg() {
  const sel = $('#vmTipo'); if (!sel) return;
  const ts = vencTipos(); if (!ts.length) return;
  const atual = sel.value;
  sel.innerHTML = ts.map(t => `<option value="${t.k}">${t.ic} ${esc(t.r)}</option>`).join('');
  sel.value = ts.some(t => t.k === atual) ? atual : ts[0].k;
  const t = ts.find(x => x.k === sel.value);
  $('#vmMeses').value = t.meses; $('#vmAviso').value = t.aviso;
  const kmOn = ligado('venc_km'); $('#vmKmBox').classList.toggle('hide', !kmOn);
  $('#vmKm').value = t.km || ''; $('#vmKm').disabled = !t.km; $('#vmKm').placeholder = t.km ? '' : 'não se aplica';
  $('#vmMedia').value = +S.settings.kmMedia || KM_MEDIA_PADRAO;
  if (document.activeElement !== $('#vmTexto')) $('#vmTexto').value = t.msg;
  ajustarAltura($('#vmTexto'));
}
function salvarVencCfg() {
  const P = PACOTE(); if (!P) return;
  const k = $('#vmTipo').value, base = (P.venc || []).find(x => x.k === k); if (!base) return;
  S.vencCfg = S.vencCfg || {};
  const cfg = {};
  const m = +$('#vmMeses').value, av = +$('#vmAviso').value, txt = $('#vmTexto').value.trim();
  if (m && m !== base.meses) cfg.meses = Math.min(60, Math.max(1, m));
  if ($('#vmAviso').value !== '' && av !== base.aviso) cfg.aviso = Math.min(60, Math.max(0, av));
  if (txt && txt !== base.msg) cfg.msg = txt;
  const km = parseInt($('#vmKm').value, 10); if (base.km && km && km !== base.km) cfg.km = Math.min(200000, Math.max(500, km));
  if (Object.keys(cfg).length) S.vencCfg[k] = cfg; else delete S.vencCfg[k];
  save(); renderAll();
}
$('#vmTipo').addEventListener('change', renderVencCfg);
['#vmMeses', '#vmAviso', '#vmTexto', '#vmKm'].forEach(s => $(s).addEventListener('change', salvarVencCfg));
$('#vmMedia').addEventListener('change', e => { const m = Math.min(20000, Math.max(100, parseInt(e.target.value, 10) || KM_MEDIA_PADRAO)); e.target.value = m; S.settings.kmMedia = m; save(); renderAll(); });
$('#vmPadrao').addEventListener('click', () => { if (S.vencCfg) delete S.vencCfg[$('#vmTipo').value]; save(); $('#vmTexto').blur(); renderVencCfg(); renderAll(); });

$('#btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cliente-assistido-copia-' + today() + '.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
$('#fileBackup').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try { const s = JSON.parse(await f.text()); if (!Array.isArray(s.contacts)) throw 0; if (!confirm('Substituir os dados deste aparelho pela cópia?')) return; S = normalizarCampanhas(Object.assign(blank(), s)); save(); renderAll(); alert('Cópia restaurada.'); }
  catch (err) { alert('Arquivo de cópia inválido.'); }
  e.target.value = '';
});

document.addEventListener('input', e => {
  const t = e.target.closest('[data-pddd]');
  if (t) { const x = S.pendingDDD[+t.dataset.pddd]; if (x) { x.ddd = t.value.replace(/\D/g, '').slice(0, 2); save(); } }
});
document.addEventListener('click', e => {
  const d = e.target.closest('[data-pdel]');
  if (d) { S.pendingDDD.splice(+d.dataset.pdel, 1); save(); renderPendingDDD(); }
});
$('#btnDddTodos').addEventListener('click', () => {
  const v = $('#dddTodos').value.replace(/\D/g, '').slice(0, 2);
  if (v.length !== 2) { alert('Digite um DDD com 2 números.'); return; }
  S.pendingDDD.forEach(x => x.ddd = v); save(); renderPendingDDD();
});
$('#btnDddOk').addEventListener('click', () => {
  const byNum = new Map(S.contacts.map(c => [c.num, c]));
  const show = S.pendingDDD.slice(0, 300); let ok = 0, bad = 0;
  for (const x of show) { const dd = (x.ddd || S.settings.ddd || '').replace(/\D/g, ''); const num = dd.length === 2 ? norm(dd + x.local, '') : null; if (num) { if (insertContact(byNum, num, x)) ok++; } else bad++; }
  S.pendingDDD = S.pendingDDD.slice(300); save(); renderAll();
  showMsg('#importMsg', `${ok} contato(s) sem DDD adicionado(s).` + (bad ? ` ${bad} com DDD inválido não entraram.` : ''));
});
$('#btnDddDescartar').addEventListener('click', () => { if (confirm('Descartar todos os contatos sem DDD? Eles não serão importados.')) { S.pendingDDD = []; save(); renderPendingDDD(); } });
$('#btnRecomecar').addEventListener('click', () => {
  if (!confirm('Apagar TODOS os contatos, campanhas e marcações deste aparelho? Faça uma cópia antes, se precisar.')) return;
  const ddd = S.settings.ddd, app = S.settings.app; S = normalizarCampanhas(blank()); S.settings.ddd = ddd; S.settings.app = app; save(); renderAll(); alert('Lista apagada. Agora você pode importar de novo.');
});

/* ---------- Troca de loja (operador CA) ---------- */
window.CA_useStore = function (id) {
  const novo = id ? 'ca_v1:' + id : 'ca_v1';
  if (novo === KEY) return;
  KEY = novo; S = load(); SEL.clear(); PAGE = 5;
  $('#ddd').value = S.settings.ddd; $('#autoGrp').checked = !!S.settings.autoGroups;
  renderAll(); if ($('#campanha').classList.contains('on')) renderCampanha();
};

// Painel do operador: números do dia de uma loja a partir da cópia guardada neste aparelho (sem abrir a loja).
window.CA_resumoDe = function (dados, loja) {
  const salvo = S, acc = window.CA_ACCESS || {}, lojaSalva = acc.loja;
  try {
    S = normalizarCampanhas(Object.assign(blank(), JSON.parse(JSON.stringify(dados))));
    acc.loja = loja;
    const camp = active(), left = Math.max(0, limiteDia() - sentToday());
    const aguardam = S.contacts.filter(c => eligible(c, camp)).length;
    return {
      contatos: S.contacts.length,
      campanha: camp ? (camp.name || 'Campanha sem nome') : '',
      envios: Math.min(left, aguardam), aguardam, enviadosHoje: sentToday(),
      niver: desligado('niver') ? 0 : S.contacts.filter(c => isBdayToday(c) && c.bdaySent !== anoAtual()).length,
      venc: PACOTE() ? S.contacts.reduce((n, c) => n + vencDue(c).length, 0) : 0,
      pos: S.contacts.filter(c => posVendaDue(c)).length,
      resp: S.contacts.filter(c => c.status === 'aberto' && !c.reviewed).length,
      pendentes: S.campaigns.filter(c => campStatus(c) !== 'encerrada' && aprovSt(c) === 'pendente').length,
      ajustes: S.campaigns.filter(c => campStatus(c) !== 'encerrada' && aprovSt(c) === 'ajuste').length,
      implantacao: !!(S.implantacao && S.implantacao.concluido),
      vendas: S.contacts.filter(c => c.venda && c.venda.st === 'aberto').length
    };
  } finally { S = salvo; acc.loja = lojaSalva; }
};

/* ---------- Início ---------- */
$('#ddd').value = S.settings.ddd;
$('#autoGrp').checked = !!S.settings.autoGroups;
$('#filtroGrupo').innerHTML = groupOptions('todos', true);
$('#bulkGrp').innerHTML = groupOptions('frequentes');
renderAll();
// Atalhos do ícone e toque na notificação: /?tab=campanha, /?tab=contatos&filtro=aniversario, /?tab=contatos&novo=1
(function abrirPorLink() {
  const p = new URLSearchParams(location.search);
  let tab = p.get('tab');
  if (tab === 'campanha' || tab === 'painel') tab = 'hoje'; // links antigos e notificações
  if (!tab || !document.getElementById(tab)) return;
  if (p.get('filtro') === 'aniversario') { $('#filtroStatus').value = 'aniversario'; tab = 'contatos'; }
  const b = document.querySelector(`.tabs button[data-tab="${tab}"]`); if (b) b.click();
  if (p.get('novo')) setTimeout(() => $('#btnPicker').scrollIntoView({ block: 'center' }), 100);
  if (p.get('ver') === 'relatorio') setTimeout(() => { const r = $('#relCard'); if (r) { r.open = true; r.scrollIntoView({ block: 'start' }); } }, 600);
  history.replaceState(null, '', '/');
})();
// 1.30.9: sem a janela automática "Alguém respondeu?" ao abrir ou voltar para o app.
// Deixa o Google pronto para a importação de contatos não ser bloqueada como pop-up.
setTimeout(() => { if (!window.google) { const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; document.head.appendChild(s); } }, 4000);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
