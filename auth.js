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
    if (acc.papel === 'admin') enableAdmin();
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

  /* ---------- Administração (só papel admin) ---------- */
  function enableAdmin() {
    const tab = $('#tabAdmin'); if (!tab) return;
    tab.classList.remove('hide');
    tab.addEventListener('click', loadAdmin);
  }
  async function loadAdmin() {
    const [{ data: stores }, { data: users }] = await Promise.all([
      sb.from('stores').select('*').order('name'),
      sb.from('app_users').select('*').order('email')
    ]);
    const so = (stores || []).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    $('#admLojaSel').innerHTML = '<option value="">(sem loja)</option>' + so;
    $('#admLojas').innerHTML = (stores || []).map(s => `<div class="it"><div class="t"><b>${esc(s.name)}</b><small>${s.plan} · ${s.max_devices} aparelho(s) · validade ${s.licensed_until || 'sem data'}</small></div><button data-loja="${s.id}" data-on="${s.active}">${s.active ? 'Desativar' : 'Ativar'}</button></div>`).join('') || '<p class="mut small">Nenhuma loja.</p>';
    const sn = id => ((stores || []).find(s => s.id === id) || {}).name || 'sem loja';
    $('#admUsers').innerHTML = (users || []).map(u => `<div class="it"><div class="t"><b>${esc(u.name || u.email)}</b><small>${esc(u.email)} · ${u.role} · ${esc(sn(u.store_id))}${u.last_login ? ' · último acesso ' + u.last_login.slice(0, 10) : ''}</small></div><button data-user="${u.id}" data-on="${u.active}">${u.active ? 'Desativar' : 'Ativar'}</button></div>`).join('');
  }
  document.addEventListener('click', async e => {
    const l = e.target.closest('[data-loja]'), u = e.target.closest('[data-user]');
    if (l) { await sb.from('stores').update({ active: l.dataset.on !== 'true' }).eq('id', l.dataset.loja); loadAdmin(); }
    if (u) { await sb.from('app_users').update({ active: u.dataset.on !== 'true' }).eq('id', u.dataset.user); loadAdmin(); }
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

  check();
})();
