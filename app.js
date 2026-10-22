/* Cliente Assistido – MVP (Sprint 2: ações em massa)
   Dados ficam só neste aparelho (localStorage). Nenhum contato é enviado a servidor. */
'use strict';

/* ---------- Versão do app ---------- */
// Ao publicar uma nova versão: atualize APP_VERSION e NOVIDADES, e o CACHE do sw.js (ca-<versão>).
const APP_VERSION = { num: '1.9.0', data: '22/10/2026' };
const NOVIDADES = [
  'Campanhas 2.0: várias campanhas ao mesmo tempo, com escolha na tela Hoje, datas de início e fim e histórico com resultados',
  'Público mais certeiro: combine grupos, situação, compras recentes, tempo sem contato e aniversariantes do mês',
  'Descanso entre mensagens: quem recebeu algo nos últimos dias fica de fora (ajuste na aba Campanha)',
  'Envio avulso: na aba Contatos, toque em 📤 para enviar a campanha que quiser a um cliente específico',
  'Importar do Google Contatos'
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
const DEFAULT_BDAY = '*Feliz aniversário, {nome}!* 🎉\n\nToda a nossa equipe deseja um dia muito especial para você.\n\nPassa aqui na loja esta semana que temos um mimo de aniversário te esperando! 🎁';
const DEFAULT_PV1 = 'Oi, {nome}! Obrigado pela sua compra! 😊\n\nQualquer dúvida, é só chamar aqui. Salva nosso número para receber as novidades!';
const DEFAULT_PV7 = 'Oi, {nome}! Já faz uma semana da sua compra. Como ficou? Gostou?\n\nSua opinião é muito importante pra gente. 💚';
const DEFAULT_MSGS = [
  'Oi, {nome}! Aqui é da nossa loja. Passando para saber como você está e agradecer a confiança. Salva nosso número para receber as novidades! 😊',
  'Olá, {nome}, tudo bem? Faz um tempinho que não conversamos. Como você está?',
  'Oi, {nome}! Lembramos de você por aqui. Quando quiser, estamos à disposição. Salva nosso contato!',
  '',
  ''
];

/* ---------- Campanhas: várias ao mesmo tempo, com período e histórico ---------- */
const hojeISO = () => new Date().toISOString().slice(0, 10);
function novaCamp(nome) {
  return { id: Date.now(), name: nome || '', msgs: DEFAULT_MSGS.slice(), aud: { groups: ['todos'], status: 'todos', compraDias: 0, semContatoDias: 0, niverMes: false }, inicio: hojeISO(), fim: '', ended: '', created: hojeISO() };
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
  if (!Array.isArray(s.campaigns) || !s.campaigns.length) s.campaigns = [novaCamp('Minha campanha')];
  if (!s.settings.limit) s.settings.limit = 25;
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
    if (raw) { const s = Object.assign(blank(), JSON.parse(raw)); if (s.settings.autoGroups === undefined) s.settings.autoGroups = true; if (!s.bdayMsg || s.bdayMsg === OLD_BDAY) s.bdayMsg = DEFAULT_BDAY; if (!s.pvMsg1) s.pvMsg1 = DEFAULT_PV1; if (!s.pvMsg7) s.pvMsg7 = DEFAULT_PV7; return normalizarCampanhas(s); }
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
  if (ex) { if (!ex.name && it.name) ex.name = it.name; if (!ex.bday && it.bday) ex.bday = it.bday; return false; }
  const c = { id: num, num, name: (it.name || '').trim(), group: 'novos', excluded: false, status: 'novo', opened: {}, bday: it.bday || '', added: today() };
  S.contacts.push(c); byNum.set(num, c); return true;
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
  const hasHeader = h.some(x => /name|nome|phone|telefone|celular|whats/.test(x));
  if (!hasHeader) return rows.map(r => ({ name: r.find(x => !/\d{6,}/.test(x)) || '', tels: r.filter(x => /\d{8,}/.test(x.replace(/\D/g, ''))) }));
  const idx = re => h.map((x, i) => re.test(x) ? i : -1).filter(i => i >= 0);
  const full = idx(/^(name|nome|nome completo|display name)$/);
  const parts = idx(/(first|middle|last) name|given name|family name|primeiro nome|sobrenome/);
  const phones = idx(/phone|telefone|celular|whats|mobile/).filter(i => !/type|tipo|label|r[oó]tulo/.test(h[i]));
  const bd = idx(/birthday|anivers/);
  return rows.slice(1).map(r => ({
    name: full.length ? r[full[0]] : parts.map(i => r[i]).filter(Boolean).join(' '),
    tels: phones.flatMap(i => (r[i] || '').split(/:::|\/|,/)).filter(x => x.trim()),
    bday: bd.length ? (r[bd[0]] || '') : ''
  }));
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
  const m = msgs[i % msgs.length];
  const n = firstName(c.name);
  return m.replace(/\{nome\}/gi, n).replace(/\s+([,!?.])/g, '$1').replace(/,+/g, ',').replace(/,([!?.])/g, '$1').replace(/^(Oi|Olá|Ola),\s*!/i, '$1!');
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
const limiteDia = () => S.settings.limit || 25;
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
  if (a.niverMes && !(c.bday && mmdd(c.bday).slice(0, 2) === String(new Date().getMonth() + 1).padStart(2, '0'))) return false;
  return true;
}
const noPublico = (camp) => S.contacts.filter(c => !c.excluded && c.status !== 'saiu' && matchAud(c, camp));
function eligible(c, camp) {
  camp = camp || active();
  if (campStatus(camp) !== 'ativa') return false;
  if (c.excluded || c.status === 'saiu') return false;
  if (c.opened && c.opened[camp.id]) return false;
  if (isBdayToday(c)) return false; // no dia do aniversário o cliente recebe só o parabéns
  if (posVendaDue(c)) return false; // no dia do pós-venda, recebe só o pós-venda
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
  return (c.name || 'Campanha sem nome') + (st === 'programada' ? ` (começa ${fmtD(c.inicio)})` : st === 'encerrada' ? ' (encerrada)' : '');
}
function renderCampSel() {
  const abertas = S.campaigns.filter(c => campStatus(c) !== 'encerrada' || c.id === S.activeCampId);
  const html = abertas.map(c => `<option value="${c.id}"${c.id === S.activeCampId ? ' selected' : ''}>${esc(campRotulo(c))}</option>`).join('');
  ['#hojeCamp', '#campSel'].forEach(s => { const el = $(s); if (el) el.innerHTML = html; });
}
function setStatus(id, st) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  c.status = st; c.reviewed = true;
  if (st === 'respondeu') c.lastReply = today();
  setTimeout(() => { if (!$('#perguntaResp').classList.contains('hide')) perguntarRespostas(); }, 0);
  if (window.CA_log) window.CA_log('marcou_' + st, { nome: c.name || '', num: c.num });
  if (st === 'saiu') c.excluded = false;
  save(); renderAll();
}

/* ---------- Aniversários e resumo para o lembrete ---------- */
const mmdd = s => { const d = String(s || '').replace(/[^0-9]/g, ''); return d.length >= 4 ? d.slice(-4, -2) + '-' + d.slice(-2) : ''; };
const todayMMDD = () => { const t = new Date(); return String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
const isBdayToday = c => !c.excluded && c.status !== 'saiu' && c.bday && mmdd(c.bday) === todayMMDD();
// Guarda só números (sem nomes nem telefones) para o aviso do celular montar o texto do dia.
function saveSummary() {
  if (!('caches' in window)) return;
  const bdays = {};
  S.contacts.forEach(c => { if (!c.excluded && c.status !== 'saiu' && c.bday) { const k = mmdd(c.bday); if (k) bdays[k] = (bdays[k] || 0) + 1; } });
  const resumo = { date: today(), aguardando: S.contacts.filter(eligible).length, limite: limiteDia(), campanha: active().name || '', bdays };
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
function bdayText(c) { return (S.bdayMsg || DEFAULT_BDAY).replace(/\{nome\}/gi, firstName(c.name)).replace(/\s+([,!?.])/g, '$1').replace(/,\s*!/g, '!'); }
function renderNiver() {
  const box = $('#niverLista'); if (!box) return;
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
  const ta = $('#niverMsg'); if (ta && document.activeElement !== ta) ta.value = S.bdayMsg || DEFAULT_BDAY;
}

/* ---------- Jornada pós-venda: agradecimento no dia seguinte e "como ficou?" em 7 dias ---------- */
function posVendaDue(c) {
  if (!c.compra || c.excluded || c.status === 'saiu') return null;
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
  const box = $('#perguntaResp'); if (!box || !document.body.dataset.papel) return;
  if ((S.askSnooze || 0) > Date.now()) return;
  const p = pendentesResposta().slice(0, 5);
  if (!p.length) { box.classList.add('hide'); return; }
  $('#prLista').innerHTML = p.map(c => `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>enviado em ${(c.lastOpen || '').split('-').reverse().slice(0, 2).join('/')}</small></div>
    <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button data-st="nao" data-id="${c.id}">Ainda não</button><button class="sair" data-st="saiu" data-id="${c.id}">Saiu</button></div></div>`).join('');
  box.classList.remove('hide');
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') foraDesde = Date.now();
  else if (foraDesde && Date.now() - foraDesde > 60000) { foraDesde = null; perguntarRespostas(); }
});

/* ---------- Render ---------- */
function renderKPIs() {
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
  const pend = S.contacts.filter(c => c.status === 'aberto' && !c.reviewed).sort((a, b) => (b.lastOpen || '').localeCompare(a.lastOpen || ''));
  if (!pend.length) { $('#revisao').innerHTML = '<p class="mut small">Nada para revisar agora.</p>'; return; }
  $('#revisao').innerHTML = pend.slice(0, 30).map(c => `
    <div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)} · aberto em ${c.lastOpen || ''}</small>
      <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button data-st="nao" data-id="${c.id}">Não respondeu</button><button class="sair" data-st="saiu" data-id="${c.id}">Pediu para sair</button></div></div></div>`).join('');
}
function groupOptions(sel, withAll) {
  return (withAll ? `<option value="todos"${sel === 'todos' ? ' selected' : ''}>Todos os grupos</option>` : '') +
    Object.entries(GROUPS).map(([k, v]) => `<option value="${k}"${sel === k ? ' selected' : ''}>${v}</option>`).join('');
}
/* ---------- Contatos: filtros, seleção e ações em massa ---------- */
const SEL = new Set();
let PAGE = 200;
function visibleContacts() {
  const q = ($('#busca').value || '').toLowerCase();
  const qd = q.replace(/\D/g, '');
  const fg = $('#filtroGrupo').value || 'todos';
  const fs = $('#filtroStatus').value || 'todos';
  return S.contacts.filter(c => !c.excluded &&
    (fg === 'todos' || c.group === fg) &&
    (fs === 'todos' || (fs === 'aniversario' ? isBdayToday(c) : (c.status || 'novo') === fs)) &&
    (!q || (c.name || '').toLowerCase().includes(q) || (qd && c.num.includes(qd))));
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
  $('#contResumo').textContent = `${act.length} na lista · ${vis.length} no filtro · mostrando ${shown.length}`;
  $('#listaContatos').innerHTML = shown.map(c => `
    <div class="it${SEL.has(c.id) ? ' sel' : ''}"><input type="checkbox" class="ck" data-sel="${c.id}"${SEL.has(c.id) ? ' checked' : ''} aria-label="Selecionar">
      <div class="t"><b>${esc(c.name || 'Sem nome')}${c.status === 'respondeu' ? '<span class="tag">respondeu</span>' : ''}${c.status === 'saiu' ? '<span class="tag red">saiu</span>' : ''}</b><small>${fmt(c.num)}${c.bday ? ' · 🎂 ' + fmtBday(c.bday) : ''}${c.groupManual ? ' · grupo fixo' : ''}${c.compra ? ' · comprou ' + c.compra.split('-').reverse().slice(0, 2).join('/') : ''}</small></div>
      <button class="bd" title="Enviar campanha" data-avulso="${c.id}">📤</button>
      <button class="bd" title="Registrar compra de hoje" data-compra="${c.id}">🛍️</button>
      <button class="bd" title="Aniversário" data-bd="${c.id}">🎂</button>
      <select data-grp="${c.id}">${groupOptions(c.group)}</select>
      <button class="x" title="Excluir da lista" data-del="${c.id}">✕</button></div>`).join('') || (act.length ? '<p class="mut small">Nenhum contato neste filtro.</p>' : '<p class="mut small">Nenhum contato ainda. Use "Escolher da agenda" ou "Importar arquivo".</p>');
  const rest = vis.length - shown.length;
  $('#btnMais').classList.toggle('hide', rest <= 0);
  $('#btnMais').textContent = `Mostrar mais ${Math.min(200, rest)} (faltam ${rest})`;
  renderBulk(vis);
  const exc = S.contacts.filter(c => c.excluded);
  $('#excTitulo').textContent = `Excluídos (${exc.length})`;
  $('#btnRestTodos').classList.toggle('hide', exc.length < 2);
  $('#listaExcluidos').innerHTML = exc.slice(0, 300).map(c => `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)}</small></div><button data-res="${c.id}">Restaurar</button></div>`).join('') + (exc.length > 300 ? `<p class="mut small">Mostrando 300 de ${exc.length}.</p>` : '') || '<p class="mut small">Nenhum contato excluído.</p>';
}
function audForm() {
  const gs = [...document.querySelectorAll('[data-cg]:checked')].map(x => x.dataset.cg);
  return { groups: gs.length ? gs : ['todos'], status: $('#cStatus').value, compraDias: +$('#cCompra').value || 0, semContatoDias: +$('#cSemContato').value || 0, niverMes: $('#cNiverMes').checked };
}
function atualizarPublico() {
  const n = noPublico({ aud: audForm() }).length;
  $('#cPublico').textContent = `${n} cliente(s) no público desta campanha.`;
}
function renderCampanha() {
  const c = active(); const a = c.aud || {};
  renderCampSel();
  $('#cNome').value = c.name || '';
  $('#cInicio').value = c.inicio || ''; $('#cFim').value = c.fim || '';
  const gs = a.groups || ['todos'];
  $('#cGrupos').innerHTML = [['todos', 'Todos']].concat(Object.entries(GROUPS)).map(([k, v]) => `<label class="ckl chip"><input type="checkbox" class="ck" data-cg="${k}"${gs.includes(k) ? ' checked' : ''}> ${v}</label>`).join('');
  $('#cStatus').value = a.status || 'todos'; $('#cCompra').value = String(a.compraDias || 0); $('#cSemContato').value = String(a.semContatoDias || 0); $('#cNiverMes').checked = !!a.niverMes;
  $('#cLimite').value = limiteDia(); $('#cDescanso').value = S.settings.descanso || 0;
  document.querySelectorAll('#segApp button').forEach(b => b.classList.toggle('on', b.dataset.app === S.settings.app));
  $('#cMsgs').innerHTML = c.msgs.map((m, i) => `<textarea rows="3" data-msg="${i}"${document.body.dataset.papel === 'funcionario' ? ' readonly' : ''} placeholder="Versão ${i + 1}${i > 0 ? ' (opcional)' : ''}">${esc(m)}</textarea>`).join('');
  const st = campStatus(c);
  $('#cStatusTag').textContent = st === 'ativa' ? 'Ativa' : st === 'programada' ? 'Programada' : 'Encerrada';
  $('#cStatusTag').className = 'tag' + (st === 'encerrada' ? ' red' : st === 'programada' ? ' warn' : '');
  $('#btnEncerrarCamp').classList.toggle('hide', st === 'encerrada');
  atualizarPublico();
  renderHistorico();
  renderHoje(); renderNiver();
  if ($('#pvMsg1') && document.activeElement !== $('#pvMsg1')) $('#pvMsg1').value = S.pvMsg1 || DEFAULT_PV1;
  if ($('#pvMsg7') && document.activeElement !== $('#pvMsg7')) $('#pvMsg7').value = S.pvMsg7 || DEFAULT_PV7;
}
function renderHistorico() {
  const box = $('#campHist'); if (!box) return;
  const lista = [...S.campaigns].sort((x, y) => (y.created || '').localeCompare(x.created || '') || y.id - x.id);
  box.innerHTML = lista.map(c => {
    const r = resultados(c), st = campStatus(c);
    const vers = Object.keys(r.porVer).sort().map(v => `V${+v + 1}: ${r.porVer[v].e ? Math.round(r.porVer[v].r * 100 / r.porVer[v].e) : 0}% (${r.porVer[v].r}/${r.porVer[v].e})`).join(' · ');
    return `<div class="it hist"><div class="t"><b>${esc(c.name || 'Campanha sem nome')} <span class="tag${st === 'encerrada' ? ' red' : st === 'programada' ? ' warn' : ''}">${st}</span></b>
      <small>${c.inicio ? 'de ' + fmtD(c.inicio) : ''}${c.fim ? ' até ' + fmtD(c.fim) : ''}${c.ended ? ' · encerrada em ' + fmtD(c.ended) : ''}</small>
      <div class="hnum"><span><b>${r.env}</b> enviados</span><span><b>${r.resp}</b> responderam</span><span><b>${r.taxa}%</b> de resposta</span><span><b>${r.saiu}</b> saíram</span></div>
      ${vers ? `<small>Resposta por versão da mensagem: ${vers}</small>` : ''}</div>
      ${st === 'encerrada' ? `<button class="so-dono" data-reabrir="${c.id}">Reabrir</button>` : (c.id === S.activeCampId ? '' : `<button data-abrircamp="${c.id}">Abrir</button>`)}</div>`;
  }).join('');
}
function renderHoje() {
  const left = Math.max(0, limiteDia() - sentToday());
  const el = S.contacts.filter(c => eligible(c));
  renderCampSel();
  const stA = campStatus(active());
  const reviewNow = S.contacts.filter(c => c.opened && c.opened[campId()] === today() && !c.reviewed);
  $('#hojeResumo').textContent = stA === 'programada' ? `Esta campanha começa em ${fmtD(active().inicio)}. Escolha outra campanha acima ou aguarde.`
    : stA === 'encerrada' ? 'Esta campanha foi encerrada. Escolha outra campanha acima ou crie uma nova na aba Campanha.'
    : left ? `Você ainda pode abrir ${left} conversa(s) hoje. ${el.length} cliente(s) aguardam nesta campanha.`
    : `Limite de hoje atingido. Amanhã a lista continua de onde parou. ${el.length} cliente(s) aguardam.`;
  let html = el.slice(0, left).map((c, i) => {
    const idx = S.contacts.indexOf(c);
    const txt = msgFor(c, idx);
    return `<div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')}</b><small>${fmt(c.num)}</small></div>
      <a class="go" href="${esc(openLink(c.num, txt))}" data-open="${c.id}">Abrir / Enviar</a>
      <button class="x" title="Excluir da lista" data-del="${c.id}">✕</button></div>`;
  }).join('');
  if (reviewNow.length) html += `<h3 style="margin-top:14px">Abertos hoje</h3>` + reviewNow.map(c => `
    <div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)}</small>
      <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button class="sair" data-st="saiu" data-id="${c.id}">Pediu para sair</button></div></div></div>`).join('');
  const saud = (h => h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')(new Date().getHours());
  const nome = firstName((window.CA_ACCESS || {}).nome || '');
  const nNiver = S.contacts.filter(c => isBdayToday(c) && c.bdaySent !== String(new Date().getFullYear())).length;
  const nResp = S.contacts.filter(c => c.status === 'aberto' && !c.reviewed).length;
  const nPos = S.contacts.filter(c => posVendaDue(c)).length;
  if ($('#hojeOla')) {
    $('#hojeOla').textContent = `${saud}${nome ? ', ' + nome : ''}!`;
    const partes = [`${Math.min(left, el.length)} envio(s)`, `${nNiver} aniversariante(s)`].concat(nPos ? [`${nPos} pós-venda`] : []).concat([`${nResp} resposta(s) para marcar`]);
    $('#hojeLinha').textContent = (left || nNiver || nResp || nPos) ? 'Para hoje: ' + partes.join(' · ') + '.' : 'Tudo em dia por hoje. 🎉';
  }
  $('#listaHoje').innerHTML = html || '<p class="mut small">Ninguém para enviar agora. Adicione contatos ou escolha outro público.</p>';
}
function renderAll() { autoGroups(); renderKPIs(); renderRevisao(); renderContatos(); renderHoje(); renderPendingDDD(); renderNiver(); renderPosVenda(); saveSummary(); if (window.CA_renderGInfo) window.CA_renderGInfo(); }
function showMsg(sel, t) { const el = $(sel); el.textContent = t; el.classList.remove('hide'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.add('hide'), 8000); }

/* ---------- Eventos ---------- */
document.querySelectorAll('.tabs button, [data-goto]').forEach(b => b.addEventListener('click', () => {
  const t = b.dataset.tab || b.dataset.goto;
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x.dataset.tab === t));
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x.id === t));
  if (t === 'campanha') renderCampanha(); else renderAll();
  window.scrollTo(0, 0);
}));

document.addEventListener('click', e => {
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
const refilter = () => { PAGE = 200; renderContatos(); };
$('#busca').addEventListener('input', refilter);
$('#filtroGrupo').addEventListener('change', refilter);
$('#filtroStatus').addEventListener('change', refilter);
$('#btnMais').addEventListener('click', () => { PAGE += 200; renderContatos(); });
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
  c.name = $('#cNome').value.trim(); c.inicio = ini; c.fim = fim; c.aud = audForm(); c.msgs = msgs;
  if (c.ended && (!fim || fim >= today())) c.ended = '';
  save(); renderCampanha(); renderKPIs(); showMsg('#campMsg', 'Campanha salva.');
  if (window.CA_log) window.CA_log('campanha_salva', { campanha: c.name || '', publico: c.aud.groups.join(','), limite: limiteDia() });
});
$('#btnNovaCamp').addEventListener('click', () => {
  const c = novaCamp('');
  S.campaigns.push(c); S.activeCampId = c.id; save(); renderCampanha();
  $('#cNome').focus();
  showMsg('#campMsg', 'Nova campanha criada. Dê um nome, escolha o público, escreva as mensagens e salve. As outras campanhas continuam guardadas.');
});
$('#btnEncerrarCamp').addEventListener('click', () => {
  const c = active();
  if (!confirm(`Encerrar a campanha "${c.name || 'sem nome'}"? Ela sai da lista de envios e fica no histórico com os resultados.`)) return;
  c.ended = today();
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
  if (e.target.closest('#cAud')) atualizarPublico();
  if (e.target.id === 'cLimite') { S.settings.limit = Math.min(60, Math.max(1, parseInt(e.target.value, 10) || 25)); e.target.value = S.settings.limit; save(); renderAll(); }
  if (e.target.id === 'cDescanso') { S.settings.descanso = Math.min(30, Math.max(0, parseInt(e.target.value, 10) || 0)); e.target.value = S.settings.descanso; save(); renderAll(); }
});
document.addEventListener('click', e => {
  const r = e.target.closest('[data-reabrir]');
  if (r) { const c = S.campaigns.find(x => x.id === +r.dataset.reabrir); if (c) { c.ended = ''; if (c.fim && c.fim < today()) c.fim = ''; S.activeCampId = c.id; save(); renderCampanha(); renderAll(); } return; }
  const ab = e.target.closest('[data-abrircamp]');
  if (ab) { S.activeCampId = +ab.dataset.abrircamp; save(); renderCampanha(); renderAll(); window.scrollTo(0, 0); }
});

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
  KEY = novo; S = load(); SEL.clear(); PAGE = 200;
  $('#ddd').value = S.settings.ddd; $('#autoGrp').checked = !!S.settings.autoGroups;
  renderAll(); if ($('#campanha').classList.contains('on')) renderCampanha();
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
  history.replaceState(null, '', '/');
})();
setTimeout(perguntarRespostas, 2500);
// Deixa o Google pronto para a importação de contatos não ser bloqueada como pop-up.
setTimeout(() => { if (!window.google) { const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; document.head.appendChild(s); } }, 4000);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
