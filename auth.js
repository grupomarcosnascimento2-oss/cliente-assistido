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
    licenca_vencida: 'A licença da sua loja venceu. Renove o plano para continuar usando.',
    acesso_vencido: 'O seu período de acesso ao curso terminou. Para renovar, fale com Marcos Nascimento pelo WhatsApp (61) 99999-9340.' // 1.43.0: validade por usuário (app_users.acesso_ate)
  };
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const gate = $('#gate');
  const show = (state, msg) => {
    gate.classList.remove('hide');
    $('#gateLoading').classList.toggle('hide', state !== 'loading');
    $('#gateLogin').classList.toggle('hide', state !== 'login');
    $('#gateDenied').classList.toggle('hide', state !== 'denied');
    $('#gatePedido').classList.toggle('hide', state !== 'pedido');
    $('#gatePedidoOk').classList.toggle('hide', state !== 'pedidoOk');
    $('#gateTermos').classList.toggle('hide', state !== 'termos');
    $('#gateContrato').classList.toggle('hide', state !== 'contrato');
    if (msg) $('#gateMsg').textContent = msg;
  };

  if (!window.supabase || !window.supabase.createClient) {
    show('denied', 'Não foi possível carregar o login. Verifique a internet e abra o app novamente.');
    return;
  }
  // Sessão vencida (aba parada muito tempo, celular em repouso): renova o token e repete a chamada uma vez.
  let sb = null;
  async function fetchComRenovacao(url, opts) {
    const r = await fetch(url, opts);
    const u = String(url);
    if (r.status !== 401 || !sb || u.includes('/auth/v1/')) return r;
    const txt = await r.clone().text().catch(() => '');
    if (!/jwt expired|invalid jwt|token is expired/i.test(txt)) return r;
    const { data, error } = await sb.auth.refreshSession();
    if (error || !data || !data.session) { show('login'); return r; }
    const h = new Headers((opts && opts.headers) || {});
    h.set('Authorization', 'Bearer ' + data.session.access_token);
    return fetch(url, Object.assign({}, opts, { headers: h }));
  }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }, global: { fetch: fetchComRenovacao } });
  // Recomendação do Supabase para navegadores: renovar o token só com a tela visível e ao voltar para ela.
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sb.auth.startAutoRefresh(); else sb.auth.stopAutoRefresh(); });
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
      // Só sem internet usa o último acesso guardado neste aparelho. Sessão vencida ou recusada pede login de novo
      // (antes, a cópia antiga podia abrir o app com dados desatualizados, por exemplo sem a loja).
      const semRede = !navigator.onLine || /failed to fetch|networkerror|load failed|network/i.test((e && e.message) || '');
      let last = null; try { last = JSON.parse(localStorage.getItem('ca_access') || 'null'); } catch (x) {}
      if (semRede && last && last.ok && last.email === (session.user.email || '').toLowerCase()) { acc = last; }
      else if (!semRede) { await sb.auth.signOut().catch(() => {}); show('login'); $('#gateLogin p.small') && ($('#gateLogin p.small').textContent = 'Sua sessão expirou. Entre de novo com o Google.'); return; }
      else { show('denied', 'Não foi possível verificar seu acesso. Confira a internet e tente de novo.'); return; }
    }
    if (acc && !acc.ok && acc.motivo === 'nao_cadastrado') {
      try { localStorage.removeItem('ca_access'); } catch (x) {}
      pedidoTermos = (acc.termos && acc.termos.versao) || null;
      mostrarPedido(acc.pedido, session.user);
      return;
    }
    if (!acc || !acc.ok) {
      try { localStorage.removeItem('ca_access'); } catch (x) {}
      show('denied', acc && acc.motivo === 'acesso_vencido' && acc.acesso_ate ? `O seu acesso ao curso terminou em ${acc.acesso_ate.split('-').reverse().join('/')}. Para renovar, fale com Marcos Nascimento pelo WhatsApp (61) 99999-9340.` : (MOTIVOS[acc && acc.motivo] || 'Acesso não liberado.'));
      $('#gateEmail').textContent = session.user.email || '';
      return;
    }
    // Termos de Uso e Política de Privacidade: aceite no primeiro acesso e a cada nova versão dos textos.
    if (acc.termos && !acc.termos.aceito) { mostrarTermos(acc); return; }
    // Contrato digital (quando o administrador ligou para a loja): só o dono aceita.
    if (acc.papel === 'lojista' && acc.contrato && acc.contrato.exigido && acc.contrato.id && !acc.contrato.aceito && window.CA_CONTRATO) { mostrarContrato(acc); return; }
    // Operador CA: escolhe qual loja Premium está atendendo; cada loja tem a sua lista neste aparelho.
    if (acc.papel === 'operador') {
      const lojas = acc.lojas || [];
      if (!lojas.length) { show('denied', 'Nenhuma loja foi atribuída a você ainda. Fale com o administrador.'); $('#gateEmail').textContent = acc.email || ''; return; }
      let escolhida = null; try { escolhida = localStorage.getItem('ca_op_loja'); } catch (x) {}
      acc.loja = lojas.find(l => l.id === escolhida) || lojas[0];
      if (window.CA_useStore) window.CA_useStore(acc.loja.id);
    }
    try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {}
    if (acc.termos && $('#termosInfo')) $('#termosInfo').textContent = `Você aceitou a versão ${acc.termos.versao} dos termos.`;
    gate.classList.add('hide'); $('#gateLoading').classList.add('hide');
    const rotulo = acc.papel === 'operador'
      ? `<span>${esc(acc.nome || acc.email)} · Operador CA</span><select id="opLoja" title="Loja atendida">${(acc.lojas || []).map(l => `<option value="${l.id}"${l.id === acc.loja.id ? ' selected' : ''}>${esc(l.nome)}</option>`).join('')}</select>`
      : `<span>${esc(acc.nome || acc.email)}${acc.loja && acc.loja.nome && acc.loja.nome !== acc.nome && !(acc.loja.recursos || {}).independente ? ' · ' + esc(acc.loja.nome) : ''}</span>`;
    $('#userBox').innerHTML = `${rotulo}<button id="btnSair">Sair</button>`;
    const opSel = $('#opLoja');
    if (opSel) opSel.onchange = () => {
      const l = (acc.lojas || []).find(x => x.id === opSel.value); if (!l) return;
      try { localStorage.setItem('ca_op_loja', l.id); } catch (x) {}
      acc.loja = l; try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {}
      if (window.CA_useStore) window.CA_useStore(l.id);
      applyRole(acc);
      if (window.CA_startSync) window.CA_startSync(acc);
      if (window.CA_log) window.CA_log('abriu_loja', {});
      if (window.CA_renderPainel) window.CA_renderPainel();
    };
    $('#btnSair').onclick = async () => { if (window.CA_presencaSair) await window.CA_presencaSair(); await sb.auth.signOut(); try { localStorage.removeItem('ca_access'); } catch (x) {} location.reload(); };
    applyRole(acc);
    if (window.CA_painelInit) window.CA_painelInit(acc);
    if (acc.papel === 'admin') enableAdmin();
    carregarLojaEquipe(acc).catch(() => {});
    if (typeof renderAll === 'function') renderAll(); // liga o pacote do ramo da loja
    lemEstado().catch(() => {});
    if (window.CA_startSync) window.CA_startSync(acc);
    if (acc.papel === 'operador' && window.CA_log) window.CA_log('abriu_loja', {});
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

  /* ---------- Aceite dos Termos de Uso e da Política de Privacidade ---------- */
  let termosAcc = null;
  function mostrarTermos(acc) {
    termosAcc = acc;
    try { localStorage.removeItem('ca_access'); } catch (x) {}
    $('#tTitulo').textContent = acc.termos.anterior ? 'Nossos termos foram atualizados' : 'Antes de começar';
    $('#tInfo').textContent = `Versão ${acc.termos.versao} · ${acc.email || ''}`;
    $('#tAceito').checked = false; $('#btnAceitar').disabled = true;
    show('termos');
  }
  $('#tAceito').addEventListener('change', e => { $('#btnAceitar').disabled = !e.target.checked; });
  async function aceitarTermos(versao) {
    const { error } = await sb.rpc('accept_terms', { p_version: versao, p_user_agent: navigator.userAgent });
    if (error) throw error;
  }
  $('#btnAceitar').addEventListener('click', async () => {
    if (!termosAcc || !$('#tAceito').checked) return;
    const b = $('#btnAceitar'); b.disabled = true; b.textContent = 'Registrando…';
    try {
      await aceitarTermos(termosAcc.termos.versao);
      check();
    } catch (e) {
      // Versão nova publicada enquanto a tela estava aberta: busca o acesso de novo e mostra a versão atual.
      if (/versao_desatualizada/.test((e && e.message) || '')) { check(); return; }
      alert('Não foi possível registrar o aceite agora. Confira a internet e tente de novo.');
      b.disabled = false;
    } finally { b.textContent = 'Aceitar e continuar'; }
  });
  $('#btnOutraConta4').addEventListener('click', async () => { await sb.auth.signOut(); show('login'); });

  /* ---------- Papéis e aviso de licença ---------- */
  function applyRole(acc) {
    window.CA_ACCESS = acc;
    if (typeof renderHoje === 'function') renderHoje();
    document.body.dataset.papel = acc.papel || '';
    if (window.CA_aplicarSegmento) window.CA_aplicarSegmento(); // 1.44.0: vocabulário e recursos do tipo de organização
    // 1.42.0: modo treinamento: o aluno (ou qualquer usuário de loja do plano "Só treinamento") vê só o curso.
    const modoTreino = acc.papel === 'aluno' || (!['admin', 'operador'].includes(acc.papel) && acc.loja && acc.loja.plano === 'treino');
    document.body.classList.toggle('modoTreino', !!modoTreino);
    if (modoTreino) {
      const b = document.querySelector('.tabs button[data-tab="mais"]'); if (b && !b.classList.contains('on')) b.click();
      const c = document.getElementById('treinoCard'); if (c && !c.open) c.open = true;
      if (window.CA_renderTreino) window.CA_renderTreino();
    }
    const func = acc.papel === 'funcionario';
    ['#cForm', '#cRitmo'].forEach(s => { const el = $(s); if (el) el.disabled = func; });
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
  const PAPEIS = { admin: 'Administrador', lojista: 'Lojista (dono)', funcionario: 'Funcionário', operador: 'Operador CA', aluno: 'Aluno (só o curso)' };
  const PLANOS = { basico: 'Essencial', premium: 'Premium', treino: 'Só treinamento' }; // 1.42.0: loja que comprou só o curso
  // Funcionário: a interface esconde ações destrutivas (classe .so-dono) e trava a edição da campanha.
  document.addEventListener('click', e => { if (document.body.dataset.papel === 'funcionario' && e.target.closest('.so-dono')) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

  /* ---------- Solicitação de acesso (quem ainda não está cadastrado) ---------- */
  const fmtDia = iso => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';
  let pedidoTermos = null; // versão atual dos termos, para registrar o aceite junto com o pedido
  function mostrarPedido(p, user) {
    const meta = (user && user.user_metadata) || {};
    if (p && p.status === 'pendente') {
      show('pedidoOk');
      $('#pStatus').textContent = `Recebemos o seu pedido para a loja "${p.loja}" em ${fmtDia(p.criado)}. A equipe do Cliente Assistido vai entrar em contato pelo WhatsApp para ativar o seu acesso.`;
      return;
    }
    show('pedido');
    $('#pEmail').textContent = 'Conta Google: ' + ((user && user.email) || '');
    if (!$('#pNome').value) $('#pNome').value = meta.full_name || meta.name || '';
    if (p && p.status === 'recusada') $('#pEmail').textContent += ' · Seu pedido anterior não foi aprovado' + (p.nota ? ': ' + p.nota : '') + '. Você pode enviar de novo.';
  }
  $('#btnPedido').addEventListener('click', async () => {
    const { data: { session } } = await sb.auth.getSession(); if (!session) return show('login');
    const v = id => $(id).value.trim();
    const dados = { email: (session.user.email || '').toLowerCase(), name: v('#pNome'), store_name: v('#pLoja'), ramo: $('#pRamo').value || null, cidade: v('#pCidade') || null, whatsapp: v('#pWhats').replace(/\D/g, '') || null, cnpj: v('#pCnpj') || null, status: 'pendente', note: null };
    if (!dados.name || !dados.store_name || !dados.whatsapp) return alert('Preencha seu nome, o nome da loja e o WhatsApp.');
    if (dados.whatsapp.length < 10) return alert('Informe o WhatsApp com DDD.');
    if (!$('#pTermos').checked) return alert('Para enviar o pedido, leia e aceite os Termos de Uso e a Política de Privacidade.');
    if (pedidoTermos) { try { await aceitarTermos(pedidoTermos); } catch (e) { return alert('Não foi possível registrar o aceite dos termos agora. Tente de novo.'); } }
    const { error } = await sb.from('access_requests').upsert(dados, { onConflict: 'email' });
    if (error) return alert('Não foi possível enviar agora: ' + error.message);
    mostrarPedido({ status: 'pendente', loja: dados.store_name, criado: new Date().toISOString() }, session.user);
  });
  ['#btnOutraConta2', '#btnOutraConta3'].forEach(s => $(s).addEventListener('click', async () => { await sb.auth.signOut(); show('login'); }));

  /* ---------- Minha loja e Minha equipe (dono da loja) ---------- */
  const PLANO_TXT = { basico: 'Essencial', premium: 'Premium' };
  async function carregarLojaEquipe(acc) {
    const l = acc.loja, dono = acc.loja && ['lojista', 'admin'].includes(acc.papel);
    $('#lojaCard').classList.toggle('hide', !l || acc.papel === 'operador');
    $('#equipeCard').classList.toggle('hide', !dono);
    if (!l) return;
    $('#lojaPlano').textContent = `Plano ${PLANO_TXT[l.plano] || l.plano} · ${l.aparelhos || 1} acesso(s) · licença ${l.validade ? 'até ' + l.validade.split('-').reverse().join('/') : 'sem data de vencimento'}.`;
    $('#lNome').value = l.nome || ''; $('#lRamo').value = l.ramo || ''; $('#lCidade').value = l.cidade || '';
    $('#lWhats').value = l.whatsapp || ''; $('#lCnpj').value = l.cnpj || ''; $('#lResp').value = l.responsavel || '';
    if (typeof S !== 'undefined') $('#lInsta').value = S.settings.instagram ? '@' + S.settings.instagram : '';
    $('#lojaForm').disabled = !dono;
    $('#btnVerContrato').classList.toggle('hide', !(acc.contrato && acc.contrato.exigido && acc.contrato.id));
    if (dono) await carregarEquipe();
  }
  async function carregarEquipe() {
    const acc = window.CA_ACCESS || {}; const sid = acc.loja && acc.loja.id; if (!sid) return;
    const { data, error } = await sb.from('app_users').select('id,email,name,role,active,last_login').eq('store_id', sid).order('role').order('email');
    if (error) { $('#equipeLista').innerHTML = '<p class="mut small">Não foi possível carregar a equipe.</p>'; return; }
    const ativos = (data || []).filter(x => x.active).length, lim = acc.loja.aparelhos || 1;
    window.CA_EQUIPE_ATIVOS = ativos; if (window.CA_renderImpl) window.CA_renderImpl();
    $('#equipeInfo').textContent = `${ativos} de ${lim} acesso(s) em uso. Cadastre o e-mail da conta Google de cada funcionário: só ele consegue entrar.`;
    $('#equipeLista').innerHTML = (data || []).map(x => `<div class="it"><div class="t"><b>${esc(x.name || x.email)}${x.role !== 'funcionario' ? ' <span class="tag">dono</span>' : ''}${x.active ? '' : ' <span class="tag red">desativado</span>'}</b><small>${esc(x.email)} · ${x.last_login ? 'último acesso ' + fmtDia(x.last_login) : 'nunca entrou'}</small></div>${x.role === 'funcionario' ? `<button data-eq="${x.id}" data-on="${x.active}" class="${x.active ? 'x-wide' : ''}">${x.active ? 'Desativar' : 'Ativar'}</button>` : ''}</div>`).join('');
    const cheio = ativos >= lim;
    $('#btnEqAdd').disabled = cheio; $('#eqEmail').disabled = cheio; $('#eqNome').disabled = cheio;
    if (cheio) $('#equipeInfo').textContent += ' Todos os acessos do plano estão em uso; para incluir mais pessoas, fale com o suporte.';
  }
  const ERR_EQ = { limite_atingido: 'Todos os acessos do plano estão em uso.', email_invalido: 'Informe um e-mail válido (o da conta Google).', email_em_outra_loja: 'Este e-mail já está cadastrado em outra loja.', sem_permissao: 'Só o dono da loja pode fazer isso.' };
  const errMsg = e => { const k = Object.keys(ERR_EQ).find(k => (e.message || '').includes(k)); return k ? ERR_EQ[k] : e.message; };
  const msgEq = t => { const el = $('#equipeMsg'); el.textContent = t; el.classList.remove('hide'); setTimeout(() => el.classList.add('hide'), 6000); };
  $('#btnEqAdd').addEventListener('click', async () => {
    const { error } = await sb.rpc('team_add', { p_email: $('#eqEmail').value, p_name: $('#eqNome').value });
    if (error) return msgEq(errMsg(error));
    msgEq('Funcionário adicionado. Ele já pode entrar com a conta Google desse e-mail.');
    $('#eqEmail').value = ''; $('#eqNome').value = ''; carregarEquipe();
  });
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-eq]'); if (!b) return;
    const ligar = b.dataset.on !== 'true';
    if (!ligar && !confirm('Desativar este funcionário? Ele não consegue mais entrar no app.')) return;
    const { error } = await sb.rpc('team_set_active', { p_user: b.dataset.eq, p_active: ligar });
    if (error) return msgEq(errMsg(error));
    carregarEquipe();
  });
  // O @ do Instagram pode ter sido informado ao usar o modelo de campanha: mostra o valor atual ao abrir a aba Mais.
  document.addEventListener('click', e => { if (e.target.closest('[data-tab="mais"]') && typeof S !== 'undefined' && document.activeElement !== $('#lInsta')) $('#lInsta').value = S.settings.instagram ? '@' + S.settings.instagram : ''; });
  $('#btnSalvarLoja').addEventListener('click', async () => {
    const v = id => $(id).value.trim();
    if (typeof S !== 'undefined' && typeof normInsta === 'function') { const h = normInsta($('#lInsta').value); if (h !== (S.settings.instagram || '')) { S.settings.instagram = h; save(); } }
    const { error } = await sb.rpc('update_store_profile', { p_name: v('#lNome'), p_ramo: $('#lRamo').value, p_cidade: v('#lCidade'), p_cnpj: v('#lCnpj'), p_whatsapp: v('#lWhats').replace(/\D/g, ''), p_responsavel: v('#lResp') });
    const el = $('#lojaMsg');
    el.textContent = error ? 'Não foi possível salvar: ' + (error.message.includes('nome_obrigatorio') ? 'informe o nome da loja.' : error.message) : 'Dados da loja salvos.';
    el.classList.remove('hide'); setTimeout(() => el.classList.add('hide'), 5000);
    if (!error) {
      const acc = window.CA_ACCESS; Object.assign(acc.loja, { nome: v('#lNome'), ramo: $('#lRamo').value, cidade: v('#lCidade'), cnpj: v('#lCnpj'), whatsapp: v('#lWhats').replace(/\D/g, ''), responsavel: v('#lResp') });
      try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {}
      if (window.CA_log) window.CA_log('perfil_loja', {});
      if (typeof renderAll === 'function') renderAll();
    }
  });

  /* ---------- Administração (só papel admin) ---------- */
  let STORES = [], USERS = [], EDIT = null, TERMOS = {};
  function enableAdmin() {
    const tab = $('#tabAdmin'); if (!tab) return;
    tab.classList.remove('hide');
    setTimeout(() => carregarPedidos().catch(() => {}), 500);
    tab.addEventListener('click', loadAdmin);
    document.querySelectorAll('[data-goto="admin"]').forEach(b => b.addEventListener('click', loadAdmin));
  }
  async function loadAdmin() {
    const [r1, r2, r3, r4] = await Promise.all([
      sb.from('stores').select('*').order('name'),
      sb.from('app_users').select('*').order('email'),
      sb.from('terms_acceptances').select('email,version,accepted_at').order('accepted_at', { ascending: false }),
      sb.from('contract_acceptances').select('store_id,contrato_id,email,accepted_at').order('accepted_at', { ascending: false })
    ]);
    // Último aceite do contrato por loja (para mostrar na lista de lojas).
    CONTRATOS = {}; (r4.data || []).forEach(c => { if (!CONTRATOS[c.store_id]) CONTRATOS[c.store_id] = c; });
    // Último aceite dos termos por e-mail (para mostrar na lista de usuários).
    TERMOS = {}; (r3.data || []).forEach(t => { if (!TERMOS[t.email]) TERMOS[t.email] = t; });
    if (r1.error || r2.error) { $('#admLojas').innerHTML = '<p class="msg">Erro ao carregar: ' + esc((r1.error || r2.error).message) + '</p>'; return; }
    STORES = r1.data || []; USERS = r2.data || [];
    renderAdmin();
    carregarPedidos();
  }
  const RAMO_TXT = { auto_center: 'Auto center / oficina', otica: 'Ótica', pet: 'Pet shop', salao: 'Salão / barbearia', clinica: 'Clínica / estética', roupas: 'Roupas e calçados', academia: 'Academia', alimentacao: 'Alimentação', educacao: 'Escola / curso', servicos: 'Serviços', outro: 'Outro' };
  async function carregarPedidos() {
    const { data, error } = await sb.from('access_requests').select('*').order('created_at', { ascending: false });
    if (error) { $('#admPedidos').innerHTML = '<p class="mut small">Não foi possível carregar as solicitações.</p>'; return; }
    const pend = (data || []).filter(p => p.status === 'pendente');
    const n = $('#admPedidosN'); n.textContent = pend.length ? pend.length + ' nova(s)' : ''; n.classList.toggle('hide', !pend.length);
    const tab = $('#tabAdmin'); if (tab) tab.textContent = pend.length ? `Admin (${pend.length})` : 'Admin';
    const d30 = new Date(); d30.setMonth(d30.getMonth() + 1); const val = d30.toISOString().slice(0, 10);
    $('#admPedidos').innerHTML = pend.map(p => `<div class="ped">
      <b>${esc(p.store_name)}</b> <small class="mut">${esc(RAMO_TXT[p.ramo] || p.ramo || '')}${p.cidade ? ' · ' + esc(p.cidade) : ''}</small>
      <p class="small" style="margin:4px 0">${esc(p.name)} · ${esc(p.email)} · WhatsApp ${esc(p.whatsapp || '')}${p.cnpj ? ' · CNPJ ' + esc(p.cnpj) : ''}<br><span class="mut">pedido em ${fmtDia(p.created_at)}</span></p>
      <div class="row wrap"><label class="grow">Plano<select data-pplano="${p.id}"><option value="basico">Essencial</option><option value="premium">Premium</option></select></label>
        <label class="grow">Acessos<input data-pap="${p.id}" type="number" min="1" max="20" value="2" inputmode="numeric"></label>
        <label class="grow">Licença até<input data-pval="${p.id}" type="date" value="${val}"></label></div>
      <div class="row wrap"><button class="primary" data-aprovar="${p.id}">Aprovar e criar a loja</button><button class="x-wide" data-recusar="${p.id}">Recusar</button></div></div>`).join('') || '<p class="mut small">Nenhuma solicitação pendente.</p>';
  }
  document.addEventListener('click', async e => {
    const ap = e.target.closest('[data-aprovar]'), rc = e.target.closest('[data-recusar]');
    if (ap) {
      const id = ap.dataset.aprovar;
      const plano = document.querySelector(`[data-pplano="${id}"]`).value, ac = parseInt(document.querySelector(`[data-pap="${id}"]`).value, 10) || 1, val = document.querySelector(`[data-pval="${id}"]`).value || null;
      if (!confirm('Aprovar este pedido? A loja e o acesso do lojista são criados agora.')) return;
      const { error } = await sb.rpc('approve_request', { p_id: id, p_plan: plano, p_validade: val, p_aparelhos: ac });
      if (error) return alert('Erro: ' + error.message);
      loadAdmin();
    } else if (rc) {
      const nota = prompt('Motivo da recusa (aparece para quem pediu; opcional):', '');
      if (nota === null) return;
      const { error } = await sb.rpc('reject_request', { p_id: rc.dataset.recusar, p_note: nota });
      if (error) return alert('Erro: ' + error.message);
      carregarPedidos();
    }
  });
  function termosTag(email) {
    const t = TERMOS[email], atual = ((window.CA_ACCESS || {}).termos || {}).versao;
    if (!t) return '<span class="tag warn">termos não aceitos</span>';
    const txt = `termos v${esc(t.version)} aceitos em ${fmtDia(t.accepted_at)}`;
    return atual && t.version !== atual ? `<span class="tag warn">${txt} (versão antiga)</span>` : txt;
  }
  function storeOptions(sel) {
    return '<option value="">(sem loja)</option>' + STORES.map(s => `<option value="${s.id}"${s.id === sel ? ' selected' : ''}>${esc(s.name)}</option>`).join('');
  }
  function renderAdmin() {
    $('#admLojaSel').innerHTML = storeOptions('');
    const venc = STORES.filter(s => s.active && s.licensed_until && diasAte(s.licensed_until) <= 7);
    // Lojas em teste (exceção comercial combinada pelo admin): aviso só para o admin, a loja não vê.
    const testes = STORES.filter(s => s.active && (s.recursos || {}).teste && s.recursos.teste.ate);
    $('#admResumo').innerHTML = (venc.length
      ? `<p class="msg warnbox"><b>${venc.length} loja(s) com licença vencida ou vencendo em até 7 dias:</b> ${venc.map(s => esc(s.name)).join(', ')}</p>`
      : '') + testes.map(s => { const t = s.recursos.teste, d = diasAte(t.ate);
        return `<p class="msg warnbox"><b>Em teste: ${esc(s.name)}</b> · ${d >= 0 ? `até ${fmtData(t.ate)} (faltam ${d} dia(s))` : `teste terminou em ${fmtData(t.ate)}`}${t.nota ? '<br>' + esc(t.nota) : ''}</p>`; }).join('');
    if ($('#admLojasSub')) $('#admLojasSub').textContent = `${STORES.filter(s => s.active).length} ativa(s) de ${STORES.length} · cadastrar, editar, renovar e ligar funcionalidades`; // 1.31.10
    if ($('#admUsersSub')) $('#admUsersSub').textContent = `${USERS.filter(u => u.active).length} ativo(s) de ${USERS.length} · quem pode entrar no app, com papel e loja`;
    const ordem = [...STORES].sort((a, b) => (a.licensed_until || '9999').localeCompare(b.licensed_until || '9999'));
    $('#admLojas').innerHTML = ordem.map(s => EDIT === 'l' + s.id ? `
      <div class="it edit"><div class="t">
        <label>Nome<input id="eLNome" value="${esc(s.name)}"></label>
        <label>Tipo de organização<select id="eLSeg">${Object.entries(window.CA_SEGMENTOS || {}).map(([k, v]) => `<option value="${k}"${((s.recursos || {}).segmento || 'comercio') === k ? ' selected' : ''}>${esc(v.nome)}</option>`).join('')}</select></label>
        <div class="row wrap">
          <label class="grow">Plano<select id="eLPlano">${Object.entries(PLANOS).map(([k, v]) => `<option value="${k}"${s.plan === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="grow">Aparelhos<input id="eLAp" type="number" min="1" max="20" inputmode="numeric" value="${s.max_devices}"></label>
        </div>
        <label>Validade da licença<input id="eLVal" type="date" value="${s.licensed_until || ''}"></label>
        <label>Em teste até <span class="mut">(exceção comercial; só o admin vê o aviso)</span><input id="eLTeste" type="date" value="${((s.recursos || {}).teste || {}).ate || ''}"></label>
        <label>Anotação do teste<input id="eLTesteNota" value="${esc(((s.recursos || {}).teste || {}).nota || '')}" placeholder="Ex.: se der certo, adere ao Essencial"></label>
        <label style="display:block">Ramo<select id="eLRamo" style="display:block;width:100%"><option value="">Não informado</option>${Object.entries(RAMO_TXT).map(([k, v]) => `<option value="${k}"${s.ramo === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
        <div id="eLRec">${recursosHTML(s.ramo, s.recursos)}</div>
        ${contratoCamposHTML(s)}
        <div class="row wrap"><button class="primary" data-savloja="${s.id}">Salvar</button><button data-cancel="1">Cancelar</button></div>
      </div></div>` : `
      <div class="it"><div class="t"><b>${esc(s.name)} ${licTag(s)}</b><small>${PLANOS[s.plan] || s.plan} · ${s.max_devices} aparelho(s) · validade ${fmtData(s.licensed_until)} · ${USERS.filter(u => u.store_id === s.id).length} usuário(s)${(s.recursos || {}).segmento && window.CA_SEGMENTOS && window.CA_SEGMENTOS[s.recursos.segmento] ? ' · <span class="tag">' + esc(window.CA_SEGMENTOS[s.recursos.segmento].nome.split(' /')[0].split(' (')[0]) + '</span>' : ''}${s.ramo ? ' · ' + esc(RAMO_TXT[s.ramo] || s.ramo) : ''}${((s.recursos || {}).off || []).length ? ` · <span class="tag warn">${s.recursos.off.length} desligada(s)</span>` : ''}${((s.recursos || {}).on || []).includes('venc_km') ? ' · <span class="tag">km ligado</span>' : ''}${contratoTag(s)}${(s.recursos || {}).teste && s.recursos.teste.ate ? ` · <span class="tag warn">teste até ${fmtData(s.recursos.teste.ate)}</span>` : ''}</small>
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
        <div class="row wrap" style="align-items:flex-end"><label class="grow">Acesso até <small class="mut">(vazio = sem prazo)</small><input id="eUAte" type="date" value="${u.acesso_ate || ''}"></label><button type="button" data-mais30="1">+30 dias</button></div>
        <label class="ckl"><input type="checkbox" class="ck" id="eUTreino"${u.treino || u.role === 'aluno' ? ' checked' : ''}> 🎓 Curso Excelência liberado para este usuário <small class="mut">(a loja também precisa ter o curso ligado; aluno já vem liberado)</small></label>
        <div id="eUOps" class="${u.role === 'operador' ? '' : 'hide'}"><p class="small"><b>Lojas atendidas pelo operador</b> (o operador só acessa lojas Premium ou com backup ligado)</p>
          ${STORES.map(s => `<label class="ckl"><input type="checkbox" class="ck" data-opst="${s.id}"${(u.operator_store_ids || []).includes(s.id) ? ' checked' : ''}> ${esc(s.name)} <small class="mut">${PLANOS[s.plan] || s.plan}</small></label>`).join('')}</div>
        <div class="row wrap"><button class="primary" data-savuser="${u.id}">Salvar</button><button data-cancel="1">Cancelar</button></div>
      </div></div>` : `
      <div class="it"><div class="t"><b>${esc(u.name || u.email)}${u.active ? '' : ' <span class="tag red">desativado</span>'}</b><small>${esc(u.email)} · ${PAPEIS[u.role] || u.role}${u.treino || u.role === 'aluno' ? ' · <span class="tag">🎓 curso</span>' : ''}${u.acesso_ate ? ` · <span class="tag${u.acesso_ate < hojeAdm() ? ' red' : ''}">${u.acesso_ate < hojeAdm() ? 'acesso venceu' : 'acesso até'} ${fmtData(u.acesso_ate)}</span>` : ''} · ${u.role === 'operador' ? (u.operator_store_ids || []).length + ' loja(s) atendida(s)' : esc(sn(u.store_id))} · ${u.last_login ? 'último acesso ' + fmtData(u.last_login.slice(0, 10)) : 'nunca entrou'} · ${termosTag(u.email)}</small>
        <div class="marks"><button data-edituser="${u.id}">Editar</button><button data-user="${u.id}" data-on="${u.active}" class="${u.active ? 'sair' : ''}">${u.active ? 'Desativar' : 'Ativar'}</button></div></div></div>`).join('');
  }
  /* ---------- Contrato digital (opcional por loja; o texto fica em contrato.js) ---------- */
  let CONTRATOS = {}; // último aceite por loja
  function contratoCamposHTML(s) {
    const ct = (s.recursos || {}).contrato || {}, ligado = ((s.recursos || {}).on || []).includes('contrato_digital');
    return `<div id="eLCt" class="ctAdm${ligado ? '' : ' hide'}"><p class="small" style="margin:8px 0 2px"><b>Contrato digital</b> <span class="mut">(12 meses a partir do início)</span></p>
      <label>Valor e forma de pagamento<input id="eLCtValor" value="${esc(ct.valor || '')}" placeholder="Ex.: R$ 1.188,00 em 12 parcelas mensais de R$ 99,00 por Pix"></label>
      <label>Início da vigência<input id="eLCtIni" type="date" value="${esc(ct.inicio || new Date().toISOString().slice(0, 10))}"></label>
      <p class="mut small">Mudar valor, início, plano ou acessos gera um contrato novo, e o dono aceita de novo no próximo acesso.</p></div>`;
  }
  document.addEventListener('change', e => { if (e.target.matches && e.target.matches('[data-rec="contrato_digital"]') && $('#eLCt')) $('#eLCt').classList.toggle('hide', !e.target.checked); });
  function dadosContrato(loja) {
    const ct = (loja.recursos || {}).contrato || {};
    return { loja: loja.nome || loja.name, doc: loja.cnpj, cidade: loja.cidade, responsavel: loja.responsavel, plano: ct.plano || loja.plano || loja.plan, acessos: ct.acessos || loja.aparelhos || loja.max_devices, inicio: ct.inicio, valor: ct.valor };
  }
  function contratoHTML(d, rodape) {
    const c = window.CA_CONTRATO.montar(d);
    return `<h3 class="ctTit">${esc(c.titulo)}</h3>` + c.clausulas.map(x => `<p class="ctCl"><b>${esc(x.t)}</b></p>` + x.p.map(t => `<p>${esc(t)}</p>`).join('')).join('') + (rodape ? `<p class="ctRod">${esc(rodape)}</p>` : '');
  }
  function abrirContratoImpressao(d, rodape) {
    const w = window.open('', '_blank'); if (!w) return alert('Libere as janelas pop-up deste site para ver o contrato.');
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contrato · Cliente Assistido</title><style>body{font:15px/1.6 "Times New Roman",serif;max-width:720px;margin:24px auto;padding:0 16px;color:#111;background:#fff}h3{text-align:center;text-transform:uppercase;font-size:17px}p{text-align:justify;margin:6px 0}.ctCl{margin-top:14px}.ctRod{margin-top:24px;font-style:italic}button{font:inherit;padding:8px 14px;margin:12px 0}@media print{button{display:none}}</style></head><body><button onclick="print()">Imprimir ou salvar em PDF</button>${contratoHTML(d, rodape)}</body></html>`);
    w.document.close();
  }
  let ctAcc = null;
  function mostrarContrato(acc) {
    ctAcc = acc;
    try { localStorage.removeItem('ca_access'); } catch (x) {}
    $('#ctTexto').innerHTML = contratoHTML(dadosContrato(acc.loja));
    $('#ctAceito').checked = false; $('#btnAceitarCt').disabled = true;
    $('#ctInfo').textContent = `${acc.loja.nome} · ${acc.email || ''}`;
    show('contrato');
  }
  $('#ctAceito').addEventListener('change', e => { $('#btnAceitarCt').disabled = !e.target.checked; });
  $('#btnAceitarCt').addEventListener('click', async () => {
    if (!ctAcc || !$('#ctAceito').checked) return;
    const b = $('#btnAceitarCt'); b.disabled = true; b.textContent = 'Registrando…';
    const d = dadosContrato(ctAcc.loja);
    const { error } = await sb.rpc('accept_contract', { p_contrato_id: ctAcc.contrato.id, p_dados: { versao_texto: window.CA_CONTRATO.VERSAO, campos: d, texto: window.CA_CONTRATO.texto(d) }, p_user_agent: navigator.userAgent });
    b.textContent = 'Aceitar o contrato';
    if (error) { if (/contrato_desatualizado|contrato_desligado/.test(error.message)) return check(); alert('Não foi possível registrar o aceite agora. Confira a internet e tente de novo.'); b.disabled = false; return; }
    check();
  });
  $('#btnSairCt').addEventListener('click', async () => { await sb.auth.signOut(); show('login'); });
  $('#btnVerContrato').addEventListener('click', () => {
    const acc = window.CA_ACCESS || {}; if (!acc.loja) return;
    const c = acc.contrato || {};
    abrirContratoImpressao(dadosContrato(acc.loja), c.aceito ? `Aceito eletronicamente por ${c.aceito_por} em ${new Date(c.aceito_em).toLocaleString('pt-BR')}.` : 'Aguardando o aceite do dono da loja.');
  });
  function contratoTag(s) {
    if (!((s.recursos || {}).on || []).includes('contrato_digital')) return '';
    const id = ((s.recursos || {}).contrato || {}).id, a = CONTRATOS[s.id];
    return a && a.contrato_id === id ? ` · contrato aceito em ${fmtDia(a.accepted_at)}` : ' · <span class="tag warn">contrato pendente</span>';
  }

  // Lê a lista da tela: "off" guarda o que foi desligado; "on" guarda o que foi ligado entre as que começam desligadas.
  function recursosDaTela() {
    const optin = window.CA_RECURSOS_OPT_IN || [], todas = [...document.querySelectorAll('[data-rec]')];
    return { off: todas.filter(x => !x.checked && !optin.includes(x.dataset.rec)).map(x => x.dataset.rec), on: todas.filter(x => x.checked && optin.includes(x.dataset.rec)).map(x => x.dataset.rec) };
  }
  // Lista de funcionalidades da loja: marcadas = ligadas. Muda conforme o ramo escolhido.
  function recursosHTML(ramo, rec) {
    const off = (rec || {}).off || [], on = (rec || {}).on || [], optin = window.CA_RECURSOS_OPT_IN || [];
    const marcado = k => optin.includes(k) ? on.includes(k) : !off.includes(k);
    const item = x => `<label class="ckl"><input type="checkbox" class="ck" data-rec="${x.k}"${marcado(x.k) ? ' checked' : ''}> ${esc(x.r)}</label>`;
    const doRamo = window.CA_RECURSOS_RAMO ? window.CA_RECURSOS_RAMO(ramo) : [];
    return `<p class="small" style="margin:10px 0 2px"><b>Funcionalidades da loja</b> <span class="mut">(desmarque o que a loja não vai usar)</span></p>
      ${(window.CA_RECURSOS_GERAIS || []).map(item).join('')}
      ${doRamo.length ? `<p class="small" style="margin:8px 0 2px"><b>Do ramo ${esc(RAMO_TXT[ramo] || ramo)}</b></p>${doRamo.map(item).join('')}` : ''}`;
  }
  document.addEventListener('change', e => {
    if (e.target.id !== 'eLRamo') return;
    $('#eLRec').innerHTML = recursosHTML(e.target.value, recursosDaTela()); // mantém o que já estava marcado ou desmarcado
  });
  // 1.43.0: datas do acesso por usuário (dia local do aparelho)
  function hojeAdm() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function somaDias(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  document.addEventListener('click', e => { if (e.target.closest('[data-mais30]')) { const i = $('#eUAte'); if (!i) return; const h = hojeAdm(); i.value = somaDias(i.value && i.value > h ? i.value : h, 30); } });
  document.addEventListener('change', e => { if (e.target.id === 'eUPapel' && $('#eUOps')) $('#eUOps').classList.toggle('hide', e.target.value !== 'operador'); if (e.target.id === 'eUPapel' && e.target.value === 'aluno' && $('#eUTreino')) $('#eUTreino').checked = true; });
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
      const { off, on } = recursosDaTela();
      if ($('#eLPlano').value === 'treino' && !on.includes('treino')) on.push('treino'); // 1.42.0: loja só treinamento já vem com o curso ligado
      const ant = (STORES.find(x => x.id === d.savloja) || {}).recursos || {};
      const recursos = Object.assign({}, ant, { off, on });
      const seg = $('#eLSeg') ? $('#eLSeg').value : 'comercio'; if (seg && seg !== 'comercio') recursos.segmento = seg; else delete recursos.segmento; // 1.44.0
      const teste = $('#eLTeste').value; if (teste) recursos.teste = { ate: teste, nota: $('#eLTesteNota').value.trim() }; else delete recursos.teste;
      if (on.includes('contrato_digital')) {
        if (window.CA_CONTRATO && window.CA_CONTRATO.pendente()) return alert('Antes de ligar o contrato digital, os dados da CONTRATADA (razão social, CNPJ e endereço) precisam ser preenchidos no arquivo contrato.js. Peça ao Claude para completar.');
        const valor = $('#eLCtValor').value.trim(), inicio = $('#eLCtIni').value;
        if (!valor || !inicio) return alert('Para o contrato digital, informe o valor com a forma de pagamento e o início da vigência.');
        const antCt = ant.contrato || {}, plano = $('#eLPlano').value;
        const mudou = !antCt.id || antCt.valor !== valor || antCt.inicio !== inicio || antCt.plano !== plano || antCt.acessos !== ap;
        recursos.contrato = { id: mudou ? new Date().toISOString() : antCt.id, valor, inicio, plano, acessos: ap };
        if (mudou && antCt.id && !confirm('Os dados do contrato mudaram. O dono da loja vai precisar aceitar o contrato novo no próximo acesso. Continuar?')) return;
      }
      run(sb.from('stores').update({ name, plan: $('#eLPlano').value, max_devices: ap, licensed_until: $('#eLVal').value || null, ramo: $('#eLRamo').value || null, recursos }).eq('id', d.savloja), () => {
        // se o admin editou a própria loja, aplica na hora
        const acc = window.CA_ACCESS; if (acc && acc.loja && acc.loja.id === d.savloja) { acc.loja.recursos = recursos; acc.loja.ramo = $('#eLRamo').value || null; try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {} if (window.CA_aplicarSegmento) window.CA_aplicarSegmento(); if (typeof renderAll === 'function') renderAll(); }
      });
    } else if (d.savuser) {
      const me = (window.CA_ACCESS || {}).email, u = USERS.find(x => x.id === d.savuser);
      const role = $('#eUPapel').value;
      if (u && u.email === me && role !== 'admin' && !confirm('Você vai tirar o seu próprio acesso de administrador. Continuar?')) return;
      const ops = role === 'operador' ? [...document.querySelectorAll('[data-opst]:checked')].map(x => x.dataset.opst) : [];
      const treino = role === 'aluno' || !!($('#eUTreino') && $('#eUTreino').checked); // 1.42.0: curso liberado por usuário
      run(sb.from('app_users').update({ name: $('#eUNome').value.trim() || null, role, store_id: role === 'operador' ? null : ($('#eULoja').value || null), operator_store_ids: ops, treino, acesso_ate: ($('#eUAte') && $('#eUAte').value) || null }).eq('id', d.savuser));
    }
  });
  $('#admAddLoja').addEventListener('click', async () => {
    const name = $('#admLojaNome').value.trim(); if (!name) return alert('Informe o nome da loja.');
    const plan = $('#admLojaPlano').value;
    const { error } = await sb.from('stores').insert(Object.assign({ name, plan, licensed_until: $('#admLojaValidade').value || null }, plan === 'treino' ? { recursos: { on: ['treino'] } } : {}));
    if (error) return alert('Erro: ' + error.message);
    $('#admLojaNome').value = ''; loadAdmin();
  });
  $('#admAddUser').addEventListener('click', async () => {
    const email = $('#admUserEmail').value.trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return alert('Informe um e-mail válido (o mesmo da conta Google).');
    const lojaSel = STORES.find(s => s.id === $('#admLojaSel').value), indep = !!(lojaSel && lojaSel.recursos && lojaSel.recursos.independente);
    // 1.43.0: aluno independente entra com 30 dias de acesso a partir de hoje
    const { error } = await sb.from('app_users').insert({ email, name: $('#admUserNome').value.trim() || null, role: indep ? 'aluno' : $('#admUserPapel').value, store_id: $('#admLojaSel').value || null, treino: indep || $('#admUserPapel').value === 'aluno', acesso_ate: indep ? somaDias(hojeAdm(), 30) : null });
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
    window.CA_LEMBRETE_ON = on; if (window.CA_renderImpl) window.CA_renderImpl();
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
