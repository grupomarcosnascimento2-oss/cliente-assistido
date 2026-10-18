/* Cliente Assistido – MVP (Sprint 1)
   Dados ficam só neste aparelho (localStorage). Nenhum contato é enviado a servidor. */
'use strict';

const KEY = 'ca_v1';
const GROUPS = { novos: 'Novos clientes', frequentes: 'Frequentes', sumidos: 'Sumidos', outros: 'Outros' };
const DEFAULT_MSGS = [
  'Oi, {nome}! Aqui é da nossa loja. Passando para saber como você está e agradecer a confiança. Salva nosso número para receber as novidades! 😊',
  'Olá, {nome}, tudo bem? Faz um tempinho que não conversamos. Como você está?',
  'Oi, {nome}! Lembramos de você por aqui. Quando quiser, estamos à disposição. Salva nosso contato!',
  '',
  ''
];

let S = load();

function blank() {
  return {
    contacts: [],
    settings: { ddd: '62', app: 'n' },
    campaign: { id: Date.now(), name: '', group: 'todos', limit: 25, msgs: DEFAULT_MSGS.slice() },
    sentLog: {}
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); return Object.assign(blank(), s); }
  } catch (e) {}
  return blank();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { alert('Não foi possível salvar neste aparelho.'); } }

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
  if (d.length === 8 || d.length === 9) d = (ddd || '62') + d;
  if (d.length === 10) {
    if ('6789'.includes(d[2])) d = d.slice(0, 2) + '9' + d.slice(2);
    else return null; // telefone fixo
  }
  if (d.length === 11 && d[2] === '9') return '55' + d;
  return null;
}

/* ---------- Adicionar contatos ---------- */
function addMany(list) {
  let added = 0, dup = 0, invalid = 0;
  const byNum = new Map(S.contacts.map(c => [c.num, c]));
  for (const it of list) {
    const nums = (it.tels || []).map(t => norm(t, S.settings.ddd)).filter(Boolean);
    if (!nums.length) { invalid++; continue; }
    const num = nums[0];
    const ex = byNum.get(num);
    if (ex) {
      dup++;
      if (!ex.name && it.name) ex.name = it.name;
      if (!ex.bday && it.bday) ex.bday = it.bday;
      continue;
    }
    const c = { id: num, num, name: (it.name || '').trim(), group: 'novos', excluded: false, status: 'novo', opened: {}, bday: it.bday || '', added: today() };
    S.contacts.push(c); byNum.set(num, c); added++;
  }
  save();
  showMsg('#importMsg', `${added} contato(s) adicionado(s). ${dup} já estavam na lista. ${invalid} sem celular válido (fixo ou inválido) ignorado(s).`);
  renderAll();
}

function parseVCF(text) {
  const out = [];
  text = text.replace(/\r\n[ \t]/g, ''); // linhas dobradas
  for (const block of text.split(/BEGIN:VCARD/i).slice(1)) {
    const lines = block.split(/\r?\n/);
    let name = '', tels = [], bday = '';
    for (const l of lines) {
      const i = l.indexOf(':'); if (i < 0) continue;
      const k = l.slice(0, i).toUpperCase(), v = l.slice(i + 1).trim();
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
function msgFor(c, i) {
  const msgs = S.campaign.msgs.map(m => m.trim()).filter(Boolean);
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
const campId = () => S.campaign.id;
const sentToday = () => S.sentLog[today()] || 0;
function eligible(c) {
  if (c.excluded || c.status === 'saiu') return false;
  if (c.opened && c.opened[campId()]) return false;
  const g = S.campaign.group;
  return g === 'todos' || c.group === g;
}
function markOpened(id) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  if (!c.opened) c.opened = {};
  if (!c.opened[campId()]) {
    c.opened[campId()] = today();
    c.lastOpen = today();
    if (c.status === 'novo') c.status = 'aberto';
    S.sentLog[today()] = sentToday() + 1;
    save();
  }
  setTimeout(renderAll, 400);
}
function setStatus(id, st) {
  const c = S.contacts.find(x => x.id === id); if (!c) return;
  c.status = st; c.reviewed = true;
  if (st === 'saiu') c.excluded = false;
  save(); renderAll();
}

/* ---------- Render ---------- */
function renderKPIs() {
  const act = S.contacts.filter(c => !c.excluded && c.status !== 'saiu');
  const camp = act.filter(c => S.campaign.group === 'todos' || c.group === S.campaign.group);
  const doneCamp = camp.filter(c => c.opened && c.opened[campId()]).length;
  const k = [
    ['hl', `${sentToday()} / ${S.campaign.limit}`, 'abertos hoje / limite'],
    ['', `${doneCamp} / ${camp.length}`, 'campanha: abertos / público'],
    ['', S.contacts.filter(c => c.status === 'respondeu').length, 'responderam (marcados)'],
    ['', S.contacts.filter(c => c.status === 'saiu').length, 'pediram para sair'],
    ['', act.length, 'clientes na lista'],
    ['', S.contacts.filter(c => c.added === today()).length, 'adicionados hoje']
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
function renderContatos() {
  const q = ($('#busca').value || '').toLowerCase();
  const fg = $('#filtroGrupo').value || 'todos';
  const act = S.contacts.filter(c => !c.excluded);
  const vis = act.filter(c => (fg === 'todos' || c.group === fg) && (!q || (c.name || '').toLowerCase().includes(q) || c.num.includes(q.replace(/\D/g, '') || '§')));
  $('#contResumo').textContent = `${act.length} na lista · mostrando ${Math.min(vis.length, 200)}` + (vis.length > 200 ? ' (use a busca para ver mais)' : '');
  $('#listaContatos').innerHTML = vis.slice(0, 200).map(c => `
    <div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')}${c.status === 'respondeu' ? '<span class="tag">respondeu</span>' : ''}${c.status === 'saiu' ? '<span class="tag red">saiu</span>' : ''}</b><small>${fmt(c.num)}${c.bday ? ' · 🎂 ' + esc(c.bday) : ''}</small></div>
      <select data-grp="${c.id}">${groupOptions(c.group)}</select>
      <button class="x" title="Excluir da lista" data-del="${c.id}">✕</button></div>`).join('') || '<p class="mut small">Nenhum contato ainda. Use "Escolher da agenda" ou "Importar arquivo".</p>';
  const exc = S.contacts.filter(c => c.excluded);
  $('#excTitulo').textContent = `Excluídos (${exc.length})`;
  $('#listaExcluidos').innerHTML = exc.map(c => `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)}</small></div><button data-res="${c.id}">Restaurar</button></div>`).join('') || '<p class="mut small">Nenhum contato excluído.</p>';
}
function renderCampanha() {
  $('#cNome').value = S.campaign.name;
  $('#cGrupo').innerHTML = groupOptions(S.campaign.group, true);
  $('#cLimite').value = S.campaign.limit;
  document.querySelectorAll('#segApp button').forEach(b => b.classList.toggle('on', b.dataset.app === S.settings.app));
  $('#cMsgs').innerHTML = S.campaign.msgs.map((m, i) => `<textarea rows="3" data-msg="${i}" placeholder="Versão ${i + 1}${i > 0 ? ' (opcional)' : ''}">${esc(m)}</textarea>`).join('');
  renderHoje();
}
function renderHoje() {
  const left = Math.max(0, S.campaign.limit - sentToday());
  const el = S.contacts.filter(eligible);
  const reviewNow = S.contacts.filter(c => c.opened && c.opened[campId()] === today() && !c.reviewed);
  $('#hojeResumo').textContent = left
    ? `Você ainda pode abrir ${left} conversa(s) hoje. ${el.length} cliente(s) aguardam nesta campanha.`
    : `Limite de hoje atingido. Amanhã a lista continua de onde parou. ${el.length} cliente(s) aguardam.`;
  let html = el.slice(0, left).map((c, i) => {
    const idx = S.contacts.indexOf(c);
    const txt = msgFor(c, idx);
    return `<div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')}</b><small>${fmt(c.num)} · versão ${(idx % Math.max(1, S.campaign.msgs.filter(m => m.trim()).length)) + 1}</small></div>
      <a class="go" href="${esc(openLink(c.num, txt))}" data-open="${c.id}">Abrir / Enviar</a>
      <button class="x" title="Excluir da lista" data-del="${c.id}">✕</button></div>`;
  }).join('');
  if (reviewNow.length) html += `<h3 style="margin-top:14px">Abertos hoje</h3>` + reviewNow.map(c => `
    <div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)}</small>
      <div class="marks"><button data-st="respondeu" data-id="${c.id}">Respondeu</button><button class="sair" data-st="saiu" data-id="${c.id}">Pediu para sair</button></div></div></div>`).join('');
  $('#listaHoje').innerHTML = html || '<p class="mut small">Ninguém para enviar agora. Adicione contatos ou escolha outro público.</p>';
}
function renderAll() { renderKPIs(); renderRevisao(); renderContatos(); renderHoje(); }
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
document.addEventListener('change', e => {
  const s = e.target.closest('[data-grp]');
  if (s) { const c = S.contacts.find(x => x.id === s.dataset.grp); if (c) { c.group = s.value; save(); renderKPIs(); } }
});

$('#btnPicker').addEventListener('click', async () => {
  if (!('contacts' in navigator && 'select' in navigator.contacts)) {
    showMsg('#importMsg', 'Este navegador não permite escolher da agenda. Use o Chrome no Android ou importe o arquivo de contatos (.vcf).');
    return;
  }
  try {
    const res = await navigator.contacts.select(['name', 'tel'], { multiple: true });
    addMany(res.map(r => ({ name: (r.name || [])[0] || '', tels: r.tel || [] })));
  } catch (err) { showMsg('#importMsg', 'Seleção cancelada.'); }
});
$('#fileImport').addEventListener('change', async e => {
  const all = [];
  for (const f of e.target.files) {
    const txt = await f.text();
    if (/\.vcf$/i.test(f.name) || /BEGIN:VCARD/i.test(txt)) all.push(...parseVCF(txt));
    else if (/\.csv$/i.test(f.name)) all.push(...parseCSV(txt));
    else all.push(...parsePaste(txt));
  }
  addMany(all); e.target.value = '';
});
$('#btnPaste').addEventListener('click', () => $('#pasteBox').classList.toggle('hide'));
$('#btnPasteOk').addEventListener('click', () => { addMany(parsePaste($('#pasteText').value)); $('#pasteText').value = ''; $('#pasteBox').classList.add('hide'); });
$('#ddd').addEventListener('change', e => { S.settings.ddd = e.target.value.replace(/\D/g, '').slice(0, 2) || '62'; save(); });
$('#busca').addEventListener('input', renderContatos);
$('#filtroGrupo').addEventListener('change', renderContatos);

document.querySelectorAll('#segApp button').forEach(b => b.addEventListener('click', () => { S.settings.app = b.dataset.app; save(); renderCampanha(); }));
$('#btnSalvarCamp').addEventListener('click', () => {
  S.campaign.name = $('#cNome').value.trim();
  S.campaign.group = $('#cGrupo').value;
  S.campaign.limit = Math.min(60, Math.max(1, parseInt($('#cLimite').value, 10) || 25));
  S.campaign.msgs = [...document.querySelectorAll('[data-msg]')].map(t => t.value);
  if (!S.campaign.msgs.some(m => m.trim())) { showMsg('#campMsg', 'Escreva pelo menos uma mensagem.'); return; }
  save(); renderHoje(); renderKPIs(); showMsg('#campMsg', 'Campanha salva.');
});
$('#btnNovaCamp').addEventListener('click', () => {
  if (!confirm('Começar uma nova campanha? Os clientes voltam a ficar disponíveis para envio (quem pediu para sair continua fora).')) return;
  S.campaign = { id: Date.now(), name: '', group: 'todos', limit: S.campaign.limit, msgs: DEFAULT_MSGS.slice() };
  S.contacts.forEach(c => { c.reviewed = false; });
  save(); renderCampanha(); showMsg('#campMsg', 'Nova campanha criada. Ajuste as mensagens e salve.');
});

$('#btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cliente-assistido-copia-' + today() + '.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
$('#fileBackup').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try { const s = JSON.parse(await f.text()); if (!Array.isArray(s.contacts)) throw 0; if (!confirm('Substituir os dados deste aparelho pela cópia?')) return; S = Object.assign(blank(), s); save(); renderAll(); alert('Cópia restaurada.'); }
  catch (err) { alert('Arquivo de cópia inválido.'); }
  e.target.value = '';
});

/* ---------- Início ---------- */
$('#ddd').value = S.settings.ddd;
$('#filtroGrupo').innerHTML = groupOptions('todos', true);
renderAll();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
