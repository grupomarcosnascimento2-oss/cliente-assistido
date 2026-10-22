/* Cliente Assistido – Importar do Google Contatos.
   Usa o login do Google (Google Identity Services) só com permissão de LEITURA dos contatos
   e a People API, direto do navegador. Nenhum contato passa por servidor do CA nesta etapa:
   eles entram na lista do aparelho (e no backup, se a loja tiver o backup ligado). */
'use strict';
(function () {
  const CLIENT_ID = '1008302354237-si4meuh3ap4g2vgt42s664j91i3ecrja.apps.googleusercontent.com';
  const SCOPE = 'https://www.googleapis.com/auth/contacts.readonly';
  const $ = s => document.querySelector(s);
  const msg = t => showMsg('#importMsg', t);

  function carregarGIS() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    return new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.onload = ok; s.onerror = () => falha(new Error('sem_google'));
      document.head.appendChild(s);
    });
  }
  function pedirToken() {
    return new Promise((ok, falha) => {
      const tc = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID, scope: SCOPE, hint: (window.CA_ACCESS || {}).email || '', prompt: '',
        callback: r => {
          if (r.error) return falha(new Error(r.error));
          if (!google.accounts.oauth2.hasGrantedAllScopes(r, SCOPE)) return falha(new Error('permissao_negada'));
          ok(r.access_token);
        },
        error_callback: e => falha(new Error(e && e.type === 'popup_closed' ? 'cancelado' : (e && (e.message || e.type)) || 'erro'))
      });
      tc.requestAccessToken();
    });
  }
  async function buscarTodos(token, prog) {
    const out = []; let page = '';
    do {
      const u = new URL('https://people.googleapis.com/v1/people/me/connections');
      u.searchParams.set('personFields', 'names,phoneNumbers,birthdays');
      u.searchParams.set('pageSize', '1000');
      if (page) u.searchParams.set('pageToken', page);
      const r = await fetch(u, { headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) {
        const t = await r.text().catch(() => '');
        throw new Error(r.status === 403 && /SERVICE_DISABLED|has not been used|disabled/i.test(t) ? 'api_desativada' : 'google_' + r.status);
      }
      const j = await r.json();
      (j.connections || []).forEach(p => out.push(p));
      page = j.nextPageToken || '';
      if (prog) prog(out.length);
    } while (page);
    return out;
  }
  function converter(p) {
    const name = ((p.names || [])[0] || {}).displayName || '';
    const tels = (p.phoneNumbers || []).map(x => x.canonicalForm || x.value).filter(Boolean);
    const b = ((p.birthdays || []).find(x => x.date && x.date.month && x.date.day) || {}).date;
    const bday = b ? (b.year ? String(b.year) : '-') + '-' + String(b.month).padStart(2, '0') + '-' + String(b.day).padStart(2, '0') : '';
    return { name, tels, bday };
  }
  const ERROS = {
    cancelado: 'Importação cancelada.',
    permissao_negada: 'Para importar, é preciso marcar a permissão de ver seus contatos do Google.',
    access_denied: 'O Google ainda não liberou a importação para a sua conta. Fale com o suporte do Cliente Assistido.',
    api_desativada: 'A importação do Google ainda não foi ativada pelo suporte do Cliente Assistido.',
    sem_google: 'Não foi possível falar com o Google agora. Confira a internet e tente de novo.'
  };

  async function importar() {
    const btn = $('#btnGoogleContatos'); if (btn) btn.disabled = true;
    try {
      msg('Abrindo o Google…');
      await carregarGIS();
      const token = await pedirToken();
      msg('Buscando seus contatos no Google…');
      const pessoas = await buscarTodos(token, n => msg(`Buscando seus contatos no Google… ${n}`));
      if (!pessoas.length) { msg('Não encontramos contatos na sua conta Google. Confira se os contatos do celular estão salvos na conta Google.'); return; }
      const lista = pessoas.map(converter).filter(x => x.tels.length);
      const antes = S.contacts.filter(c => c.bday).length;
      addMany(lista); // adiciona os novos e completa nome/aniversário de quem já estava na lista
      S.gImport = { at: Date.now(), n: lista.length }; save();
      const novosNiver = S.contacts.filter(c => c.bday).length - antes;
      msg(document.querySelector('#importMsg').textContent + (novosNiver > 0 ? ` ${novosNiver} aniversário(s) vieram do Google.` : ''));
      renderGInfo(); renderAll();
      if (window.CA_log) window.CA_log('importou_google', { quantidade: lista.length });
    } catch (e) {
      const k = (e && e.message) || '';
      msg(ERROS[k] || ('Não foi possível importar do Google: ' + k));
    } finally { if (btn) btn.disabled = false; }
  }

  function renderGInfo() {
    const el = $('#gInfo'); if (!el) return;
    const g = S.gImport;
    el.textContent = g ? `Última importação do Google: ${new Date(g.at).toLocaleDateString('pt-BR')} às ${new Date(g.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (${g.n} contatos). Toque de novo para trazer os clientes novos.` : '';
    const freq = S.settings.gFreq || 'semanal';
    const dias = { diaria: 1, semanal: 7, quinzenal: 15 }[freq] || 0;
    const sel = $('#gFreq'); if (sel) { sel.value = freq; $('#gFreqBox').classList.toggle('hide', !g); }
    const vencido = !!(g && dias && Date.now() - g.at >= dias * 86400000 - 3600000);
    const banner = $('#gBanner');
    if (banner) {
      banner.classList.toggle('hide', !vencido);
      const ha = g ? Math.floor((Date.now() - g.at) / 86400000) : 0;
      $('#gBannerTxt').textContent = `Hora de atualizar seus contatos do Google${ha ? ` (última vez há ${ha} dia(s))` : ''}. Os clientes novos salvos no celular entram em segundos.`;
    }
  }
  const fs = $('#gFreq');
  if (fs) fs.addEventListener('change', () => { S.settings.gFreq = fs.value; save(); renderGInfo(); });
  window.CA_renderGInfo = renderGInfo;

  const b = $('#btnGoogleContatos'); if (b) b.addEventListener('click', importar);
  const b2 = $('#btnGoogleAtualizar'); if (b2) b2.addEventListener('click', () => { document.querySelector('.tabs button[data-tab="contatos"]').click(); importar(); });
  renderGInfo();
})();
