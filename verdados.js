// Cliente Assistido – 👁️ Ver dados (1.58.0), pedido do Marcos.
// Admin → Lojas → 👁️ Ver dados: consulta, sem alterar nada, dos dados de uma loja no servidor:
// backup e aparelhos (usuários e último acesso), resumo, contatos (busca, 20 por vez), campanhas e atividades.
// Dados pela rpc admin_ver_loja(p_store) (SECURITY DEFINER, só is_admin()).
(function () {
  const POR = 20;
  let D = null, ALVO = null, aba = 'contatos', q = '', lim = POR;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const semAc = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fone = n => { const d = String(n || '').replace(/\D/g, '').replace(/^55/, ''); return d.length >= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}` : d; };
  const GRP = { novos: 'Novos', frequentes: 'Frequentes', sumidos: 'Sumidos', outros: 'Outros' };
  const PAP = { admin: 'admin', lojista: 'dono', funcionario: 'funcionário', operador: 'operador', gestor: 'gestor', aluno: 'aluno' };
  const niver = b => { const m = String(b || '').match(/(\d{1,2})[\/-](\d{1,2})$|^\d{4}-(\d{2})-(\d{2})$/); if (!m) return ''; return m[1] ? `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}` : `${m[4]}/${m[3]}`; };
  const dia = d => { const x = new Date(); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  const br = iso => { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}` : ''; };
  function quando(ts) {
    if (!ts) return 'nunca';
    const d = new Date(ts), agora = new Date(), hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dias = Math.round((new Date(agora.toDateString()) - new Date(d.toDateString())) / 864e5);
    if (dias === 0) return 'hoje ' + hora;
    if (dias === 1) return 'ontem ' + hora;
    return dias < 7 ? `há ${dias} dias` : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  const cor = ts => { if (!ts) return 'ruim'; const h = (Date.now() - new Date(ts)) / 36e5; return h < 24 ? 'ok' : h < 72 ? '' : 'alerta'; };

  function caixa() {
    let el = $('#verDados');
    if (!el) { el = document.createElement('div'); el.id = 'verDados'; el.className = 'hide'; document.body.appendChild(el); }
    return el;
  }
  async function abrir(id) {
    ALVO = id; D = null; aba = 'contatos'; q = ''; lim = POR;
    const el = caixa(); el.classList.remove('hide'); document.body.classList.add('verDadosOn');
    el.innerHTML = '<main><p class="mut" style="padding:24px 0">Carregando os dados da loja…</p></main>';
    el.scrollTop = 0;
    const sb = window.CA_SB;
    const { data, error } = sb ? await sb.rpc('admin_ver_loja', { p_store: id }) : { error: 1 };
    if (ALVO !== id) return;
    if (error || !data || data.erro) { el.innerHTML = `<main>${topo('Loja')}<p class="mut">Não foi possível carregar agora${data && data.erro === 'sem_permissao' ? ' (só o admin)' : ''}.</p></main>`; return; }
    D = data; render();
  }
  function fechar() { ALVO = null; D = null; const el = $('#verDados'); if (el) { el.classList.add('hide'); el.innerHTML = ''; } document.body.classList.remove('verDadosOn'); }
  const topo = nome => `<div class="vdTopo"><h2>👁️ ${esc(nome)}</h2><button data-vd-atualizar title="Carregar de novo">↻</button><button data-vd-fechar>✕ Fechar</button></div>
    <p class="vdAviso">👀 Só para consulta (admin). Nada aqui envia mensagem nem altera os dados da loja.</p>`;

  function statusCamp(c, h) {
    if (c.ended || (c.fim && c.fim < h)) return ['Encerrada', 'enc'];
    if (c.rascunho && !c.salva) return ['Não salva', 'enc'];
    const a = c.aprov && c.aprov.st;
    if (a === 'pendente') return ['Aguardando o dono', 'pend'];
    if (a === 'ajuste') return ['Ajuste pedido', 'pend'];
    if (c.inicio && c.inicio > h) return ['Programada', 'pend'];
    return ['Ativa', ''];
  }

  function render() {
    const el = $('#verDados'); if (!el || !D) return;
    const h = dia(), L = D.loja || {}, cs = D.contatos || [];
    const camps = (D.campanhas || []).filter(c => c && !c.descartada);
    const st = camps.map(c => statusCamp(c, h)[0]);
    const grupos = {}; cs.forEach(c => { const g = GRP[c.grupo] || 'Outros'; grupos[g] = (grupos[g] || 0) + 1; });
    const saiu = cs.filter(c => c.status === 'saiu').length, semzap = cs.filter(c => c.semzap).length;
    const loja = (D.usuarios || []).find(u => u.papel === 'lojista' && !u.acompanha);
    const usu = (D.usuarios || []).map(u => {
      const ult = [u.login, u.visto].filter(Boolean).sort().pop();
      const ico = u.acompanha ? '👀' : u.papel === 'lojista' ? '📱' : '👤';
      const extra = [PAP[u.papel] || u.papel, u.acompanha ? 'só acompanha' : '', u.ativo ? '' : 'desativado'].filter(Boolean).join(' · ');
      return `<div class="vdLin"><span>${ico} ${esc((u.email || '').split('@')[0])}<br><small class="mut">${esc(extra)}</small></span><span class="${cor(ult)}">${quando(ult)}</span></div>`;
    }).join('') || '<p class="mut small">Nenhum usuário.</p>';
    const avisoSem = L.backup && !cs.length ? `<p class="vdAviso">⏳ O servidor ainda não tem os contatos desta loja. Eles sobem quando o celular da loja${loja ? ` (${esc(loja.email.split('@')[0])})` : ''} abrir o app.</p>` : '';
    let corpo = '';
    if (aba === 'contatos') {
      const termo = semAc(q).trim(), dig = q.replace(/\D/g, '');
      const lista = cs.filter(c => !termo || semAc(c.nome).includes(termo) || (dig.length >= 3 && String(c.num || '').includes(dig)));
      corpo = `<div class="busca"><input id="vdBusca" type="search" placeholder="🔎 Buscar nome ou número" value="${esc(q)}"></div>
        <p class="mut small" style="margin:8px 0 0">${termo ? `${lista.length} encontrado(s)` : `${cs.length} contato(s)`}${lista.length > lim ? ` · mostrando ${lim}` : ''}</p>
        ${lista.slice(0, lim).map(c => `<div class="it"><div class="t"><b>${esc(c.nome || fone(c.num))}</b><small>${[fone(c.num), GRP[c.grupo] || '', niver(c.niver) ? '🎂 ' + niver(c.niver) : '', c.ult ? 'última mensagem ' + br(c.ult) : '', c.status === 'saiu' ? '🚫 saiu' : c.status === 'respondeu' ? '💬 respondeu' : '', c.semzap ? '📵 sem WhatsApp' : ''].filter(Boolean).join(' · ')}</small></div></div>`).join('') || '<p class="mut small">Nenhum contato.</p>'}
        ${lista.length > lim ? `<button class="vdMais" data-vd-mais>Mostrar mais ${Math.min(POR, lista.length - lim)}</button>` : ''}`;
    } else if (aba === 'campanhas') {
      const ord = camps.slice().sort((a, b) => (statusCamp(a, h)[0] === 'Encerrada') - (statusCamp(b, h)[0] === 'Encerrada') || String(b.inicio || b.created || '').localeCompare(String(a.inicio || a.created || '')));
      corpo = ord.map(c => {
        const [t, k] = statusCamp(c, h);
        const env = cs.filter(x => x.opened && x.opened[c.id]).length, resp = cs.filter(x => x.opened && x.opened[c.id] && x.status === 'respondeu').length;
        const grp = ((c.aud && c.aud.groups) || []).map(g => g === 'todos' ? 'Todos' : GRP[g] || g).join(', ');
        const per = [br(c.inicio || c.created), br(c.fim || c.ended)].filter(Boolean).join(' a ');
        const por = c.aprov && c.aprov.por ? `Preparada por ${String(c.aprov.por).split('@')[0]}` : '';
        return `<div class="it"><div class="t"><b>${esc(c.name || 'Sem nome')} <span class="tag ${k}">${t}</span></b><small>${[grp ? 'Público: ' + esc(grp) : '', per].filter(Boolean).join(' · ')}</small>${por && k === 'pend' ? `<small>${esc(por)}</small>` : ''}<small>${env} enviado(s) · ${resp} respondeu(ram)</small></div></div>`;
      }).join('') || '<p class="mut small">Nenhuma campanha no servidor.</p>';
    } else {
      const AC = window.CA_ACOES || {};
      corpo = (D.atividades || []).map(a => {
        const txt = (AC[a.action] || (() => a.action.replace(/_/g, ' ')))(a.detail || {});
        return `<div class="it"><span class="hora">${quando(a.created_at)}</span><div class="t"><b>${esc((a.user_email || '').split('@')[0])}</b><small>${esc(txt)}</small></div></div>`;
      }).join('') || '<p class="mut small">Nenhuma atividade registrada.</p>';
    }
    el.innerHTML = `<main>${topo(L.nome || 'Loja')}
      <div class="card"><b>☁️ Backup e aparelhos</b>
        <div class="vdLin"><span>Backup</span><span class="${L.backup ? 'ok' : 'ruim'}">${L.backup ? 'Ligado' : 'Desligado'}</span></div>
        <div class="vdLin"><span>Contatos no servidor</span><span><b>${cs.length.toLocaleString('pt-BR')}</b></span></div>
        <div class="vdLin"><span>Última subida da lista</span><span>${quando(D.ult_contatos)}</span></div>
        <div class="vdLin"><span>Último estado (campanhas)</span><span>${quando(D.ult_estado)}</span></div>
        ${L.ativa ? '' : '<div class="vdLin"><span>Loja</span><span class="ruim">Desativada</span></div>'}
        ${avisoSem}
        <p class="mut small" style="margin:10px 0 4px"><b>Usuários</b> (último acesso)</p>${usu}</div>
      <div class="card"><b>📊 Resumo</b>
        <div class="vdKpis"><div><b>${cs.length.toLocaleString('pt-BR')}</b><small>contatos</small></div><div><b>${D.envios7 || 0}</b><small>envios em 7 dias</small></div>
          <div><b>${st.filter(x => x === 'Ativa').length}</b><small>campanhas ativas</small></div><div><b>${st.filter(x => x === 'Aguardando o dono').length}</b><small>aguardando aprovação</small></div></div>
        ${cs.length ? `<p class="mut small" style="margin:10px 0 0">Grupos: ${Object.keys(grupos).map(g => `${g} ${grupos[g].toLocaleString('pt-BR')}`).join(' · ')}${saiu ? ` · 🚫 saiu ${saiu}` : ''}${semzap ? ` · 📵 sem WhatsApp ${semzap}` : ''}</p>` : ''}</div>
      <div class="vdTabs">${[['contatos', 'Contatos'], ['campanhas', 'Campanhas'], ['atividades', 'Atividades']].map(([k, t]) => `<button data-vd-aba="${k}" class="${aba === k ? 'on' : ''}">${t}</button>`).join('')}</div>
      <div class="card">${corpo}</div></main>`;
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-verdados]'); if (b) { abrir(b.dataset.verdados); return; }
    if (!ALVO) return;
    if (e.target.closest('[data-vd-fechar]')) { fechar(); return; }
    if (e.target.closest('[data-vd-atualizar]')) { abrir(ALVO); return; }
    const a = e.target.closest('[data-vd-aba]'); if (a) { aba = a.dataset.vdAba; render(); return; }
    if (e.target.closest('[data-vd-mais]')) { lim += POR; render(); }
  });
  let t = null;
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'vdBusca') {
      q = e.target.value; lim = POR; clearTimeout(t);
      t = setTimeout(() => { const pos = e.target.selectionStart; render(); const i = $('#vdBusca'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (_) {} } }, 250);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ALVO) fechar(); });
})();
