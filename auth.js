/* Cliente Assistido – Login com Google (Supabase Auth) e controle de acesso.
   Só entra quem está cadastrado em app_users (ativo) e com loja ativa/licença válida. */
'use strict';
(function () {
  const SUPABASE_URL = 'https://kxwwbqjleskxzfbmybvb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4d3dicWpsZXNreHpmYm15YnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzA5NjUsImV4cCI6MjEwNzkwNjk2NX0.l3hlpo4Py3nSJa0M2FF6Ucncs_WgIczqpAstj0TQQEA';
  const MOTIVOS = {
    nao_cadastrado: 'Seu e-mail ainda não está liberado no Cliente Assistido. Fale com o suporte para ativar seu acesso.',
    usuario_inativo: 'Seu acesso está desativado. Fale com o suporte.',
    sem_loja: 'Seu usuário ainda não está ligado a uma loja. Fale com o suporte.',
    loja_inativa: 'O acesso da sua loja está desativado. Fale com o suporte.',
    licenca_vencida: 'A licença da sua loja venceu. Renove o plano para continuar usando.'
  };
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const gate = $('#gate');
  const show = (state, msg) => {
    gate.classList.remove('hide');
    $('#gateLoading').classList.toggle('hide', state !== 'loading');
    $('#gateLogin').classList.toggle('hide', state !== 'login');
    $('#gateDenied').classList.toggle('hide', state !== 'denied');
    if (msg) $('#gateMsg').textContent = msg;
  };

  if (!window.supabase || !window.supabase.createClient) {
    show('denied', 'Não foi possível carregar o login. Verifique a internet e abra o app novamente.');
    return;
  }
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  window.CA_SB = sb;

  let running = null, watchdog = null;
  function check() {
    if (running) return running;
    running = doCheck().catch(e => show('denied', 'Erro ao verificar o acesso: ' + (e && e.message || e))).finally(() => { running = null; clearTimeout(watchdog); });
    return running;
  }
  async function doCheck() {
    show('loading');
    clearTimeout(watchdog);
    watchdog = setTimeout(() => { if (!gate.classList.contains('hide') && !$('#gateLoading').classList.contains('hide')) show('denied', 'A verificação demorou mais que o normal. Toque em "Tentar de novo".'); }, 12000);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { show('login'); return; }
    let acc;
    try {
      const { data, error } = await sb.rpc('my_access');
      if (error) throw error;
      acc = data;
    } catch (e) {
      // Sem internet: libera o uso local se já houve um acesso válido antes neste aparelho
      let last = null; try { last = JSON.parse(localStorage.getItem('ca_access') || 'null'); } catch (x) {}
      if (last && last.ok && last.email === (session.user.email || '').toLowerCase()) { acc = last; }
      else { show('denied', 'Não foi possível verificar seu acesso. Confira a internet e tente de novo.'); return; }
    }
    if (!acc || !acc.ok) {
      try { localStorage.removeItem('ca_access'); } catch (x) {}
      show('denied', MOTIVOS[acc && acc.motivo] || 'Acesso não liberado.');
      $('#gateEmail').textContent = session.user.email || '';
      return;
    }
    try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {}
    gate.classList.add('hide'); $('#gateLoading').classList.add('hide');
    $('#userBox').innerHTML = `<span>${esc(acc.nome || acc.email)}${acc.loja ? ' · ' + esc(acc.loja.nome) : ''}</span><button id="btnSair">Sair</button>`;
    $('#btnSair').onclick = async () => { await sb.auth.signOut(); try { localStorage.removeItem('ca_access'); } catch (x) {} location.reload(); };
    applyRole(acc);
    if (acc.papel === 'admin') enableAdmin();
    lemEstado().catch(() => {});
  }

  $('#btnGoogle').addEventListener('click', async () => {
    show('loading');
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/', queryParams: { prompt: 'select_account' } } });
    if (error) show('denied', 'Erro ao abrir o login do Google: ' + error.message);
  });
  $('#btnOutraConta').addEventListener('click', async () => { await sb.auth.signOut(); show('login'); });
  // Nunca chamar o Supabase direto dentro do onAuthStateChange (trava o login); agenda para depois.
  sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT') setTimeout(check, 0); });
  $('#btnTentar').addEventListener('click', () => location.replace(location.origin + '/'));

  /* ---------- Papéis e aviso de licença ---------- */
  function applyRole(acc) {
    window.CA_ACCESS = acc;
    if (typeof renderHoje === 'function') renderHoje();
    document.body.dataset.papel = acc.papel || '';
    const func = acc.papel === 'funcionario';
    ['#cNome', '#cGrupo', '#cLimite'].forEach(s => { const el = $(s); if (el) el.disabled = func; });
    document.querySelectorAll('[data-msg]').forEach(t => { t.readOnly = func; });
    const av = $('#avisoLic'); if (!av) return;
    const d = acc.loja && acc.loja.validade ? diasAte(acc.loja.validade) : null;
    if (d !== null && d <= 7) {
      av.textContent = d < 0 ? 'A licença da loja venceu.' : d === 0 ? 'A licença da loja vence hoje. Fale com o suporte para renovar.' : `A licença da loja vence em ${d} dia(s). Fale com o suporte para renovar e não perder o acesso.`;
      av.classList.remove('hide');
    } else av.classList.add('hide');
  }
  function diasAte(iso) {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const v = new Date(iso + 'T00:00:00');
    return Math.round((v - t) / 86400000);
  }
  function licTag(s) {
    if (!s.active) return '<span class="tag red">desativada</span>';
    if (!s.licensed_until) return '<span class="tag">sem validade</span>';
    const d = diasAte(s.licensed_until);
    if (d < 0) return '<span class="tag red">vencida</span>';
    if (d <= 7) return `<span class="tag warn">vence em ${d} dia(s)</span>`;
    return '<span class="tag">em dia</span>';
  }
  const fmtData = iso => iso ? iso.split('-').reverse().join('/') : 'sem data';
  const PAPEIS = { admin: 'Administrador', lojista: 'Lojista (dono)', funcionario: 'Funcionário' };
  const PLANOS = { basico: 'Essencial', premium: 'Premium' };
  // Funcionário: a interface esconde ações destrutivas (classe .so-dono) e trava a edição da campanha.
  document.addEventListener('click', e => { if (document.body.dataset.papel === 'funcionario' && e.target.closest('.so-dono')) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

  /* ---------- Administração (só papel admin) ---------- */
  let STORES = [], USERS = [], EDIT = null;
  function enableAdmin() {
    const tab = $('#tabAdmin'); if (!tab) return;
    tab.classList.remove('hide');
    tab.addEventListener('click', loadAdmin);
    document.querySelectorAll('[data-goto="admin"]').forEach(b => b.addEventListener('click', loadAdmin));
  }
  async function loadAdmin() {
    const [r1, r2] = await Promise.all([
      sb.from('stores').select('*').order('name'),
      sb.from('app_users').select('*').order('email')
    ]);
    if (r1.error || r2.error) { $('#admLojas').innerHTML = '<p class="msg">Erro ao carregar: ' + esc((r1.error || r2.error).message) + '</p>'; return; }
    STORES = r1.data || []; USERS = r2.data || [];
    renderAdmin();
  }
  function storeOptions(sel) {
    return '<option value="">(sem loja)</option>' + STORES.map(s => `<option value="${s.id}"${s.id === sel ? ' selected' : ''}>${esc(s.name)}</option>`).join('');
  }
  function renderAdmin() {
    $('#admLojaSel').innerHTML = storeOptions('');
    const venc = STORES.filter(s => s.active && s.licensed_until && diasAte(s.licensed_until) <= 7);
    $('#admResumo').innerHTML = venc.length
      ? `<p class="msg warnbox"><b>${venc.length} loja(s) com licença vencida ou vencendo em até 7 dias:</b> ${venc.map(s => esc(s.name)).join(', ')}</p>`
      : '';
    const ordem = [...STORES].sort((a, b) => (a.licensed_until || '9999').localeCompare(b.licensed_until || '9999'));
    $('#admLojas').innerHTML = ordem.map(s => EDIT === 'l' + s.id ? `
      <div class="it edit"><div class="t">
        <label>Nome<input id="eLNome" value="${esc(s.name)}"></label>
        <div class="row wrap">
          <label class="grow">Plano<select id="eLPlano">${Object.entries(PLANOS).map(([k, v]) => `<option value="${k}"${s.plan === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="grow">Aparelhos<input id="eLAp" type="number" min="1" max="20" inputmode="numeric" value="${s.max_devices}"></label>
        </div>
        <label>Validade da licença<input id="eLVal" type="date" value="${s.licensed_until || ''}"></label>
        <div class="row wrap"><button class="primary" data-savloja="${s.id}">Salvar</button><button data-cancel="1">Cancelar</button></div>
      </div></div>` : `
      <div class="it"><div class="t"><b>${esc(s.name)} ${licTag(s)}</b><small>${PLANOS[s.plan] || s.plan} · ${s.max_devices} aparelho(s) · validade ${fmtData(s.licensed_until)} · ${USERS.filter(u => u.store_id === s.id).length} usuário(s)</small>
        <div class="marks"><button data-editloja="${s.id}">Editar</button><button data-renova="${s.id}">+30 dias</button><button data-loja="${s.id}" data-on="${s.active}" class="${s.active ? 'sair' : ''}">${s.active ? 'Desativar' : 'Ativar'}</button></div></div></div>`).join('') || '<p class="mut small">Nenhuma loja.</p>';
    const sn = id => (STORES.find(s => s.id === id) || {}).name || 'sem loja';
    $('#admUsers').innerHTML = USERS.map(u => EDIT === 'u' + u.id ? `
      <div class="it edit"><div class="t">
        <p class="small"><b>${esc(u.email)}</b></p>
        <label>Nome<input id="eUNome" value="${esc(u.name || '')}"></label>
        <div class="row wrap">
          <label class="grow">Papel<select id="eUPapel">${Object.entries(PAPEIS).map(([k, v]) => `<option value="${k}"${u.role === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="grow">Loja<select id="eULoja">${storeOptions(u.store_id)}</select></label>
        </div>
        <div class="row wrap"><button class="primary" data-savuser="${u.id}">Salvar</button><button data-cancel="1">Cancelar</button></div>
      </div></div>` : `
      <div class="it"><div class="t"><b>${esc(u.name || u.email)}${u.active ? '' : ' <span class="tag red">desativado</span>'}</b><small>${esc(u.email)} · ${PAPEIS[u.role] || u.role} · ${esc(sn(u.store_id))} · ${u.last_login ? 'último acesso ' + fmtData(u.last_login.slice(0, 10)) : 'nunca entrou'}</small>
        <div class="marks"><button data-edituser="${u.id}">Editar</button><button data-user="${u.id}" data-on="${u.active}" class="${u.active ? 'sair' : ''}">${u.active ? 'Desativar' : 'Ativar'}</button></div></div></div>`).join('');
  }
  async function run(q, ok) { const { error } = await q; if (error) { alert('Erro: ' + error.message); return; } EDIT = null; if (ok) ok(); loadAdmin(); }
  document.addEventListener('click', async e => {
    const t = e.target.closest('[data-loja],[data-user],[data-editloja],[data-edituser],[data-renova],[data-savloja],[data-savuser],[data-cancel]');
    if (!t || !t.closest('#admin')) return;
    const d = t.dataset;
    if (d.loja) {
      if (d.on === 'true' && !confirm('Desativar esta loja? Todos os usuários dela perdem o acesso até ela ser ativada de novo.')) return;
      run(sb.from('stores').update({ active: d.on !== 'true' }).eq('id', d.loja));
    } else if (d.user) {
      if (d.on === 'true' && !confirm('Desativar este usuário? Ele não consegue mais entrar no app.')) return;
      run(sb.from('app_users').update({ active: d.on !== 'true' }).eq('id', d.user));
    } else if (d.editloja) { EDIT = 'l' + d.editloja; renderAdmin(); }
    else if (d.edituser) { EDIT = 'u' + d.edituser; renderAdmin(); }
    else if (d.cancel) { EDIT = null; renderAdmin(); }
    else if (d.renova) {
      const s = STORES.find(x => x.id === d.renova); if (!s) return;
      const base = new Date(); base.setHours(0, 0, 0, 0);
      if (s.licensed_until && diasAte(s.licensed_until) > 0) base.setTime(new Date(s.licensed_until + 'T00:00:00').getTime());
      base.setDate(base.getDate() + 30);
      const nova = base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0') + '-' + String(base.getDate()).padStart(2, '0');
      if (!confirm(`Renovar "${s.name}" até ${fmtData(nova)}?`)) return;
      run(sb.from('stores').update({ licensed_until: nova }).eq('id', s.id));
    } else if (d.savloja) {
      const name = $('#eLNome').value.trim(); if (!name) return alert('Informe o nome da loja.');
      const ap = Math.min(20, Math.max(1, parseInt($('#eLAp').value, 10) || 1));
      run(sb.from('stores').update({ name, plan: $('#eLPlano').value, max_devices: ap, licensed_until: $('#eLVal').value || null }).eq('id', d.savloja));
    } else if (d.savuser) {
      const me = (window.CA_ACCESS || {}).email, u = USERS.find(x => x.id === d.savuser);
      const role = $('#eUPapel').value;
      if (u && u.email === me && role !== 'admin' && !confirm('Você vai tirar o seu próprio acesso de administrador. Continuar?')) return;
      run(sb.from('app_users').update({ name: $('#eUNome').value.trim() || null, role, store_id: $('#eULoja').value || null }).eq('id', d.savuser));
    }
  });
  $('#admAddLoja').addEventListener('click', async () => {
    const name = $('#admLojaNome').value.trim(); if (!name) return alert('Informe o nome da loja.');
    const { error } = await sb.from('stores').insert({ name, plan: $('#admLojaPlano').value, licensed_until: $('#admLojaValidade').value || null });
    if (error) return alert('Erro: ' + error.message);
    $('#admLojaNome').value = ''; loadAdmin();
  });
  $('#admAddUser').addEventListener('click', async () => {
    const email = $('#admUserEmail').value.trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return alert('Informe um e-mail válido (o mesmo da conta Google).');
    const { error } = await sb.from('app_users').insert({ email, name: $('#admUserNome').value.trim() || null, role: $('#admUserPapel').value, store_id: $('#admLojaSel').value || null });
    if (error) return alert('Erro: ' + (error.code === '23505' ? 'esse e-mail já está cadastrado.' : error.message));
    $('#admUserEmail').value = ''; $('#admUserNome').value = ''; loadAdmin();
  });

  /* ---------- Lembrete diário (notificação no celular) ---------- */
  const VAPID_PUBLIC = 'BIxs_Wu4qFAnzVYa7WH__ycMCkYfRxnYnut2DdtuWy0hQCKRU9BbEwjveg_MUOUo4u3bGZMootzNWuuAgg83wcI';
  const lemMsg = t => { const el = $('#lemMsg'); el.textContent = t; el.classList.remove('hide'); };
  const b64ToBytes = s => { const p = '='.repeat((4 - s.length % 4) % 4); const r = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(r, c => c.charCodeAt(0)); };
  const pushOK = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  (function initLembrete() {
    const sel = $('#lemHora'); if (!sel) return;
    sel.innerHTML = Array.from({ length: 16 }, (_, i) => i + 6).map(h => `<option value="${h}"${h === 9 ? ' selected' : ''}>${String(h).padStart(2, '0')}:00</option>`).join('');
  })();
  async function lemEstado() {
    if (!$('#lemAtivar')) return;
    if (!pushOK()) { lemMsg('Este navegador não aceita notificações. No Android, use o Chrome.'); $('#lemAtivar').disabled = true; return; }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    let row = null;
    if (sub) { const { data } = await sb.from('push_subscriptions').select('hour,active').eq('endpoint', sub.endpoint).maybeSingle(); row = data; }
    const on = !!(sub && row && row.active);
    if (row) $('#lemHora').value = String(row.hour);
    $('#lemAtivar').textContent = on ? 'Salvar horário' : 'Ativar lembrete';
    $('#lemTestar').classList.toggle('hide', !on);
    $('#lemDesativar').classList.toggle('hide', !on);
    if (on) lemMsg(`Lembrete ativo todos os dias às ${String(row.hour).padStart(2, '0')}:00.`);
    else if (Notification.permission === 'denied') lemMsg('As notificações estão bloqueadas para este site. Libere em Configurações > Apps > Chrome > Notificações e tente de novo.');
  }
  $('#lemAtivar') && $('#lemAtivar').addEventListener('click', async () => {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { lemMsg('Sem permissão para notificações. Toque em "Permitir" quando o celular perguntar.'); return; }
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC) });
      const j = sub.toJSON();
      const email = ((window.CA_ACCESS || {}).email || '').toLowerCase();
      const row = { user_email: email, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, hour: parseInt($('#lemHora').value, 10), tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', active: true };
      const { error } = await sb.from('push_subscriptions').upsert(row, { onConflict: 'endpoint' });
      if (error) throw error;
      await lemEstado();
    } catch (e) { lemMsg('Não foi possível ativar: ' + (e && e.message || e)); }
  });
  $('#lemDesativar') && $('#lemDesativar').addEventListener('click', async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) { await sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint); await sub.unsubscribe().catch(() => {}); }
    $('#lemMsg').classList.add('hide'); await lemEstado(); lemMsg('Lembrete desativado.');
  });
  $('#lemTestar') && $('#lemTestar').addEventListener('click', async () => {
    lemMsg('Enviando teste…');
    const { data, error } = await sb.functions.invoke('daily-reminder', { body: { mode: 'test' } });
    if (error || !data || !data.sent) lemMsg('O teste não chegou ao servidor de avisos' + (error ? ': ' + error.message : '') + '. Tente de novo em alguns minutos.');
    else lemMsg('Teste enviado. A notificação deve aparecer em alguns segundos.');
  });

  check();
})();
