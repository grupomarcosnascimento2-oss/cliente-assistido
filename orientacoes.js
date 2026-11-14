/* Cliente Assistido – Treinamentos da loja (1.70.0, ideia do Marcos em 09/11/2026).
   ⚡ Orientação rápida (tipo 1, incluso no pacote): o dono informa o assunto de um processo ou rotina da loja e explica do jeito dele;
   a IA (edge function ia-orientacao) organiza em passos e cria perguntas; o dono revisa e publica. Limite de 4 por mês por loja
   (trigger store_guides_limite no banco). A equipe lê, responde e, acertando tudo, confirma "Li e entendi" (guide_progress).
   🎓 Treinamento completo (tipo 2, adicional): por enquanto só o cartão "Em breve", com contato pelo WhatsApp.
   Onde aparece: Mais → 📋 Treinamentos da loja (#orientCard) e, no módulo do curso (body.modoTreino), o menu "Da loja". */
'use strict';
(function () {
  const ACC = () => window.CA_ACCESS || {};
  const SB = () => window.CA_SB;
  const LOJA = () => ACC().loja || {};
  const LIMITE = 4;
  const ZAP = '5561999999340';
  const escH = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const eu = () => String(ACC().email || '').toLowerCase();
  const papel = () => ACC().papel;
  const ehDono = () => ['lojista', 'admin'].includes(papel());
  const formacao = () => !!(window.CA_treinoAPI && window.CA_treinoAPI.formacao && window.CA_treinoAPI.formacao()); // 1.80.5: formações católicas sem Treinamentos da loja
  const podeVer = () => !formacao() && !!LOJA().id && ['lojista', 'admin', 'funcionario', 'aluno'].includes(papel());
  const dataBR = d => d ? new Date(d).toLocaleDateString('pt-BR') : '';
  const iniMes = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString(); };

  let guias = [], meus = {}, todosProg = [], equipe = [], carregado = false, carregando = null;
  let vis = 'lista', abertaId = null, rasc = null, msg = '', verQuem = {};
  let alvo = null; // onde está desenhado agora (caixa do curso ou #orientBox)

  const publicadas = () => guias.filter(g => g.status === 'publicada');
  const usadasMes = () => guias.filter(g => g.tipo === 'rapida' && g.criado_em >= iniMes()).length;
  const novas = () => publicadas().filter(g => !meus[g.id]).length;

  async function carregar() {
    const sb = SB(), loja = LOJA();
    if (!sb || !loja.id || !podeVer()) return;
    if (carregando) return carregando;
    carregando = (async () => {
      const qs = [
        sb.from('store_guides').select('id,tipo,titulo,assunto,resumo,passos,perguntas,status,criado_por,criado_em').eq('store_id', loja.id).order('criado_em', { ascending: false }).limit(60),
        sb.from('guide_progress').select('guide_id,user_email,tentativas,feito_em').eq('store_id', loja.id)
      ];
      if (ehDono()) qs.push(sb.from('app_users').select('email,name,role,active').eq('store_id', loja.id));
      const [rg, rp, ru] = await Promise.all(qs);
      if (!rg.error) guias = rg.data || [];
      if (!rp.error) { todosProg = rp.data || []; meus = {}; todosProg.filter(p => p.user_email === eu()).forEach(p => { meus[p.guide_id] = p; }); }
      if (ru && !ru.error) equipe = (ru.data || []).filter(u => u.active && u.email !== eu() && !['admin', 'operador', 'gestor'].includes(u.role));
      carregado = true;
    })();
    try { await carregando; } finally { carregando = null; }
  }

  // ---------- telas ----------
  function htmlLista() {
    const pub = publicadas();
    if (ehDono()) {
      const usadas = usadasMes(), resta = Math.max(0, LIMITE - usadas);
      const itens = pub.map(g => {
        const quem = todosProg.filter(p => p.guide_id === g.id && p.user_email !== eu());
        const nomes = quem.map(p => { const u = equipe.find(x => x.email === p.user_email); return `<li>✅ ${escH(u ? (u.name || u.email) : p.user_email)} <small class="mut">${dataBR(p.feito_em)}</small></li>`; });
        const faltam = equipe.filter(u => !quem.some(p => p.user_email === u.email)).map(u => `<li>⏳ ${escH(u.name || u.email)}</li>`);
        return `<div class="orIt">
          <div class="orTop"><span class="orTag">⚡ Orientação</span><small class="mut">${dataBR(g.criado_em)}</small></div>
          <b class="orTit">${escH(g.titulo)}</b>
          <div class="orRes"><span>${quem.length} de ${equipe.length || 0} ${equipe.length === 1 ? 'pessoa fez' : 'pessoas fizeram'}</span></div>
          <div class="orAcoes"><button class="trEqBtn sec" data-or-quem="${g.id}">${verQuem[g.id] ? 'Fechar' : '👥 Quem fez'}</button><button class="trEqBtn sec" data-or-abrir="${g.id}">👁️ Ver</button><button class="trEqBtn sec" data-or-arq="${g.id}">Arquivar</button></div>
          ${verQuem[g.id] ? `<ul class="orQuem">${nomes.join('') + faltam.join('') || '<li class="mut">Ninguém na equipe ainda.</li>'}</ul>` : ''}
        </div>`;
      }).join('');
      return `<div class="orCab"><div><b>Orientações rápidas deste mês</b><small class="mut">${usadas} de ${LIMITE} usadas${resta ? ` · faltam ${resta}` : ' · o limite renova no dia 1º'}</small></div>
          <button class="primary" data-or-criar="1">+ Criar</button></div>
        ${msg ? `<p class="orMsg">${msg}</p>` : ''}
        ${itens || '<p class="mut orVazio">Nenhuma orientação publicada ainda. Toque em <b>+ Criar</b>, diga o assunto e explique do seu jeito: a IA organiza em passos e perguntas para a sua equipe.</p>'}`;
    }
    const itens = pub.map(g => {
      const m = meus[g.id];
      return `<button class="orIt orBtn" data-or-abrir="${g.id}">
        <div class="orTop"><span class="orTag">⚡ Orientação</span>${m ? `<small class="orFeita">✓ Feita em ${dataBR(m.feito_em)}</small>` : '<span class="orNova">Nova</span>'}</div>
        <b class="orTit">${escH(g.titulo)}</b><small class="mut">${(g.passos || []).length} passos · ${(g.perguntas || []).length} perguntas</small></button>`;
    }).join('');
    return `${msg ? `<p class="orMsg">${msg}</p>` : ''}${itens || '<p class="mut orVazio">Quando a loja publicar uma orientação sobre um processo ou rotina, ela aparece aqui.</p>'}`;
  }

  function htmlCriar() {
    const resta = Math.max(0, LIMITE - usadasMes());
    const zap = `https://wa.me/${ZAP}?text=` + encodeURIComponent(`Olá, Marcos! Sou da loja ${LOJA().nome || ''} e quero saber sobre o Treinamento completo (com narração e certificado) para um processo da minha loja.`);
    return `<button class="trVoltar" data-or-lista="1">← Voltar</button>
      <h4 class="orH">O que você quer criar?</h4>
      <button class="orTipo" data-or-tipo1="1" ${resta ? '' : 'disabled'}>
        <span class="orTipoIco">⚡</span><span><b>Orientação rápida</b><small>Um recado ou processo explicado em passos, com perguntas para conferir. Pronto em minutos.</small>
        <em class="orSaldo">${resta ? `Incluso no seu plano · ${resta} de ${LIMITE} disponíveis este mês` : 'Você já usou as 4 deste mês. O limite renova no dia 1º.'}</em></span></button>
      <div class="orTipo orBreve">
        <span class="orTipoIco">🎓</span><span><b>Treinamento completo</b><small>Lição com narração, exemplos do seu ramo, desafio e certificado. Revisado pela equipe Cliente Assistido.</small>
        <em class="orSaldo">Em breve · adicional</em>
        <a class="trEqBtn" href="${zap}" target="_blank" rel="noopener">📲 Quero saber mais</a></span></div>`;
  }

  function htmlEditar() {
    const r = rasc;
    if (!r.pronto) {
      return `<button class="trVoltar" data-or-lista="1">← Voltar</button>
        <h4 class="orH">⚡ Nova orientação rápida</h4>
        <label class="orLab">Assunto<input id="orAssunto" maxlength="120" placeholder="Ex.: Como fechar o caixa" value="${escH(r.assunto || '')}"></label>
        <label class="orLab">Explique do seu jeito, como explicaria para alguém novo
          <textarea id="orTexto" class="auto" rows="5" maxlength="3000" placeholder="Ex.: No fim do dia você conta o dinheiro da gaveta, confere com o relatório do sistema, separa o troco do dia seguinte...">${escH(r.texto || '')}</textarea></label>
        <p class="mut small">A IA só organiza o que você escreveu, em passos e perguntas. Você revisa tudo antes de publicar.</p>
        ${msg ? `<p class="orMsg">${msg}</p>` : ''}
        <button class="primary big" id="orIA">✨ Montar com a IA</button>
        <button class="linkBtn" data-or-manual="1">ou escrever eu mesmo</button>`;
    }
    const passos = r.passos.map((p, i) => `<div class="orPasso"><span class="orNum">${i + 1}</span><textarea class="auto" rows="1" data-or-passo="${i}" maxlength="300">${escH(p)}</textarea><button class="orX" data-or-xpasso="${i}" aria-label="Tirar o passo ${i + 1}">✕</button></div>`).join('');
    const pergs = r.perguntas.map((q, i) => `<div class="orPerg">
        <div class="orPergTop"><b>Pergunta ${i + 1}</b><button class="orX" data-or-xperg="${i}" aria-label="Tirar a pergunta ${i + 1}">✕</button></div>
        <textarea class="auto" rows="1" data-or-p="${i}" maxlength="220">${escH(q.p)}</textarea>
        ${q.opcoes.map((o, j) => `<label class="orOp"><input type="radio" name="orC${i}" data-or-certa="${i}" value="${j}" ${q.certa === j ? 'checked' : ''} aria-label="Esta é a certa"><input data-or-op="${i}" data-j="${j}" maxlength="140" value="${escH(o)}" placeholder="Opção ${j + 1}"></label>`).join('')}
        <small class="mut">Marque a bolinha da opção certa.</small></div>`).join('');
    return `<button class="trVoltar" data-or-lista="1">← Voltar</button>
      <h4 class="orH">Revise antes de publicar</h4>
      <label class="orLab">Título<input id="orTit" maxlength="90" value="${escH(r.titulo)}"></label>
      <label class="orLab">Para que serve (opcional)<textarea id="orResumo" class="auto" rows="1" maxlength="200">${escH(r.resumo || '')}</textarea></label>
      <h4 class="orH2">Passos</h4>${passos}
      ${r.passos.length < 10 ? '<button class="trEqBtn sec" data-or-maispasso="1">+ Passo</button>' : ''}
      <h4 class="orH2">Perguntas para a equipe</h4>${pergs}
      ${r.perguntas.length < 6 ? '<button class="trEqBtn sec" data-or-maisperg="1">+ Pergunta</button>' : ''}
      ${msg ? `<p class="orMsg">${msg}</p>` : ''}
      <div class="orFim"><button class="primary big" id="orPublicar">Publicar para a equipe</button><button class="linkBtn" data-or-lista="1">Cancelar</button></div>
      <p class="mut small">Publicar conta 1 das ${LIMITE} orientações do mês.</p>`;
  }

  function htmlVer(g) {
    const m = meus[g.id], prevDono = ehDono();
    const pergs = (g.perguntas || []).map((q, i) => `<fieldset class="orQ" data-or-q="${i}"><legend>${i + 1}. ${escH(q.p)}</legend>
        ${(q.opcoes || []).map((o, j) => `<label class="orResp"><input type="radio" name="orR${i}" value="${j}" ${m && j === q.certa ? 'checked' : ''}><span>${escH(o)}</span></label>`).join('')}</fieldset>`).join('');
    return `<button class="trVoltar" data-or-lista="1">← Voltar</button>
      <div class="orVer"><span class="orTag">⚡ Orientação rápida</span>
      <h3 class="orVerTit">${escH(g.titulo)}</h3>
      ${g.resumo ? `<p class="mut">${escH(g.resumo)}</p>` : ''}
      <ol class="orPassos">${(g.passos || []).map(p => `<li>${escH(p)}</li>`).join('')}</ol>
      <h4 class="orH2">Confira o que você entendeu</h4>${pergs}
      <p class="orMsg" id="orVerMsg">${m ? `✓ Você confirmou em ${dataBR(m.feito_em)} que leu e entendeu.` : ''}</p>
      ${prevDono ? '<p class="mut small">Assim a sua equipe vê esta orientação. As respostas aqui não contam.</p>' : `<button class="primary big" id="orConferir" data-g="${g.id}">${m ? 'Conferir de novo' : 'Conferir respostas'}</button>`}</div>`;
  }

  function desenhar(box) {
    box = box || alvo; if (!box) return; alvo = box;
    if (!carregado) { box.innerHTML = '<div class="card orCard"><p class="mut">Carregando…</p></div>'; carregar().then(() => alvo === box && desenhar(box)); return; }
    let h;
    if (vis === 'criar' && ehDono()) h = htmlCriar();
    else if (vis === 'editar' && ehDono() && rasc) h = htmlEditar();
    else if (vis === 'ver' && guias.find(g => g.id === abertaId)) h = htmlVer(guias.find(g => g.id === abertaId));
    else { vis = 'lista'; h = htmlLista(); }
    box.innerHTML = `<div class="card orCard">${vis === 'lista' ? `<h3 class="orTitulo">📋 Treinamentos da loja</h3><p class="mut small">${ehDono() ? 'Processos e rotinas da sua loja explicados para a equipe, com perguntas para conferir.' : 'Processos e rotinas da loja. Leia, responda e confirme que entendeu.'}</p>` : ''}${h}</div>`;
    box.querySelectorAll('textarea.auto').forEach(t => { if (typeof ajustarAltura === 'function') ajustarAltura(t); });
    atualizarSelos();
  }

  function atualizarSelos() {
    const n = ehDono() ? 0 : novas();
    const card = document.getElementById('orientCard');
    if (card) {
      const mostra = podeVer() && !document.body.classList.contains('modoTreino') && (ehDono() || publicadas().length > 0);
      card.classList.toggle('hide', !mostra);
      const s = document.getElementById('orientSub'); if (s) s.textContent = ehDono() ? 'Orientações rápidas dos processos da sua loja' : n ? `${n} ${n === 1 ? 'orientação nova' : 'orientações novas'} para você` : 'Processos e rotinas da loja';
    }
    const tab = document.querySelector('#tabsCurso [data-curso="loja"]');
    if (tab) { tab.classList.toggle('hide', !(podeVer() && (ehDono() || publicadas().length > 0))); tab.innerHTML = 'Da loja' + (n ? ` <i class="orPonto">${n}</i>` : ''); }
    if (window.CA_alertasAtualizar) window.CA_alertasAtualizar(); // 1.73.0: Central de alertas
  }

  // ---------- rascunho ----------
  const lerForm = () => {
    if (!rasc) return;
    if (!rasc.pronto) { const a = document.getElementById('orAssunto'), t = document.getElementById('orTexto'); if (a) rasc.assunto = a.value; if (t) rasc.texto = t.value; return; }
    const ti = document.getElementById('orTit'), re = document.getElementById('orResumo');
    if (ti) rasc.titulo = ti.value; if (re) rasc.resumo = re.value;
    document.querySelectorAll('[data-or-passo]').forEach(e => { rasc.passos[+e.dataset.orPasso] = e.value; });
    document.querySelectorAll('[data-or-p]').forEach(e => { rasc.perguntas[+e.dataset.orP].p = e.value; });
    document.querySelectorAll('[data-or-op]').forEach(e => { rasc.perguntas[+e.dataset.orOp].opcoes[+e.dataset.j] = e.value; });
    document.querySelectorAll('[data-or-certa]:checked').forEach(e => { rasc.perguntas[+e.dataset.orCerta].certa = +e.value; });
  };
  const pergVazia = () => ({ p: '', opcoes: ['', '', ''], certa: 0 });

  const ERROS = {
    limite: 'Você já usou a IA muitas vezes este mês. Escreva a orientação você mesmo (botão "ou escrever eu mesmo") ou fale com o suporte.',
    pouco_texto: 'Escreva o assunto e explique um pouco mais o processo (pelo menos uma ou duas frases).',
    conteudo: 'Esse conteúdo não pode virar orientação. Revise o texto e tente de novo.',
    sem_permissao: 'Só o dono da loja pode criar orientações.',
    sem_chave: 'A IA está indisponível agora. Você pode escrever a orientação você mesmo.',
    ia_falhou: 'A IA não respondeu agora. Tente de novo em instantes.',
    resposta_invalida: 'A IA não conseguiu montar desta vez. Tente explicar com outras palavras ou escreva você mesmo.'
  };

  async function montarIA(btn) {
    lerForm();
    if ((rasc.assunto || '').trim().length < 3 || (rasc.texto || '').trim().length < 20) { msg = ERROS.pouco_texto; return desenhar(); }
    const sb = SB(); if (!sb) return;
    btn.disabled = true;
    const parar = window.CA_iaEspera ? window.CA_iaEspera(btn, ['Lendo a sua explicação…', 'Separando os passos na ordem…', 'Criando as perguntas para a equipe…', 'Quase pronto…']) : () => 0;
    let r; try { r = await sb.functions.invoke('ia-orientacao', { body: { assunto: rasc.assunto, texto: rasc.texto, store_id: LOJA().id } }); } catch (e) { r = { error: e }; }
    parar();
    const d = (r && r.data) || {};
    if (r.error || d.erro || !d.ok) { msg = ERROS[d.erro] || ERROS.ia_falhou; btn.disabled = false; return desenhar(); }
    Object.assign(rasc, { pronto: true, titulo: d.titulo, resumo: d.resumo || '', passos: d.passos, perguntas: d.perguntas.map(q => ({ p: q.p, opcoes: [0, 1, 2].map(j => q.opcoes[j] || ''), certa: q.certa })) });
    msg = ''; desenhar();
  }

  async function publicar(btn) {
    lerForm();
    const r = rasc, passos = r.passos.map(s => s.trim()).filter(Boolean);
    const perguntas = r.perguntas.map(q => {
      const ops = q.opcoes.map(o => o.trim()); const certaTxt = ops[q.certa];
      const fic = ops.filter(Boolean);
      return { p: q.p.trim(), opcoes: fic, certa: certaTxt ? fic.indexOf(certaTxt) : -1 };
    }).filter(q => q.p);
    if ((r.titulo || '').trim().length < 3) { msg = 'Dê um título à orientação.'; return desenhar(); }
    if (passos.length < 2) { msg = 'Coloque pelo menos 2 passos.'; return desenhar(); }
    if (!perguntas.length || perguntas.some(q => q.opcoes.length < 2 || q.certa < 0)) { msg = 'Cada pergunta precisa de pelo menos 2 opções e a bolinha da certa marcada.'; return desenhar(); }
    if (!confirm(`Publicar "${r.titulo.trim()}" para a equipe? Conta 1 das ${LIMITE} orientações do mês.`)) return;
    btn.disabled = true;
    const { error } = await SB().from('store_guides').insert({ store_id: LOJA().id, tipo: 'rapida', titulo: r.titulo.trim(), assunto: (r.assunto || '').trim() || null, resumo: (r.resumo || '').trim() || null, passos, perguntas, criado_por: eu() });
    if (error) { msg = /limite_mes/.test(error.message || '') ? 'Você já publicou as 4 orientações deste mês. O limite renova no dia 1º.' : 'Não foi possível publicar agora. Tente de novo em instantes.'; btn.disabled = false; return desenhar(); }
    rasc = null; vis = 'lista'; msg = '✅ Publicada! Avise a equipe: ela aparece em Treinamentos da loja.'; carregado = false; desenhar();
  }

  async function conferir(btn) {
    const g = guias.find(x => x.id === btn.dataset.g); if (!g) return;
    const fs = [...document.querySelectorAll('.orQ')]; let erradas = 0, semResp = 0;
    fs.forEach(f => {
      const i = +f.dataset.orQ, sel = f.querySelector('input:checked'); f.classList.remove('ok', 'erro');
      if (!sel) { semResp++; f.classList.add('erro'); return; }
      const ok = +sel.value === g.perguntas[i].certa; f.classList.add(ok ? 'ok' : 'erro'); if (!ok) erradas++;
    });
    const m = document.getElementById('orVerMsg');
    if (semResp) { m.textContent = 'Responda todas as perguntas.'; return; }
    if (erradas) { g._tent = (g._tent || 0) + 1; m.textContent = `${erradas === 1 ? '1 resposta ainda não está certa' : erradas + ' respostas ainda não estão certas'}. Releia os passos e tente de novo.`; return; }
    btn.disabled = true;
    const sb = SB(), ja = meus[g.id];
    let err = null;
    if (!ja) { const r = await sb.from('guide_progress').insert({ guide_id: g.id, store_id: LOJA().id, user_email: eu(), tentativas: (g._tent || 0) + 1 }); err = r.error; }
    if (err && !/duplicate|unique/i.test(err.message || '')) { m.textContent = 'Não foi possível salvar agora. Tente de novo em instantes.'; btn.disabled = false; return; }
    meus[g.id] = ja || { guide_id: g.id, user_email: eu(), feito_em: new Date().toISOString() };
    m.textContent = '✅ Muito bem! Você confirmou que leu e entendeu. O dono da loja já vê que você fez.';
    btn.remove(); atualizarSelos();
  }

  // ---------- eventos ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-or-criar],[data-or-lista],[data-or-tipo1],[data-or-manual],[data-or-abrir],[data-or-quem],[data-or-arq],[data-or-xpasso],[data-or-xperg],[data-or-maispasso],[data-or-maisperg],#orIA,#orPublicar,#orConferir');
    if (!t) return;
    const d = t.dataset;
    if (d.orCriar) { vis = 'criar'; msg = ''; return desenhar(); }
    if (d.orLista) { if (vis === 'editar' && rasc && rasc.pronto && !confirm('Sair sem publicar? O que você montou será perdido.')) return; vis = 'lista'; rasc = null; msg = ''; return desenhar(); }
    if (d.orTipo1) { vis = 'editar'; rasc = { pronto: false, assunto: '', texto: '' }; msg = ''; return desenhar(); }
    if (d.orManual) { lerForm(); Object.assign(rasc, { pronto: true, titulo: rasc.assunto || '', resumo: '', passos: ['', '', ''], perguntas: [pergVazia()] }); msg = ''; return desenhar(); }
    if (d.orAbrir) { vis = 'ver'; abertaId = d.orAbrir; msg = ''; desenhar(); try { if (document.body.classList.contains('modoTreino')) scrollTo(0, 0); else (alvo.closest('details') || alvo).scrollIntoView({ block: 'start' }); } catch (x) {} return; }
    if (d.orQuem) { verQuem[d.orQuem] = !verQuem[d.orQuem]; return desenhar(); }
    if (d.orArq) {
      if (!confirm('Arquivar esta orientação? Ela sai da lista da equipe. Não devolve a vaga do mês.')) return;
      SB().from('store_guides').update({ status: 'arquivada', arquivado_em: new Date().toISOString() }).eq('id', d.orArq).then(({ error }) => { msg = error ? 'Não foi possível arquivar agora.' : 'Orientação arquivada.'; const g = guias.find(x => x.id === d.orArq); if (!error && g) g.status = 'arquivada'; desenhar(); });
      return;
    }
    if (d.orXpasso !== undefined) { lerForm(); rasc.passos.splice(+d.orXpasso, 1); return desenhar(); }
    if (d.orXperg !== undefined) { lerForm(); rasc.perguntas.splice(+d.orXperg, 1); return desenhar(); }
    if (d.orMaispasso) { lerForm(); rasc.passos.push(''); return desenhar(); }
    if (d.orMaisperg) { lerForm(); rasc.perguntas.push(pergVazia()); return desenhar(); }
    if (t.id === 'orIA') return montarIA(t);
    if (t.id === 'orPublicar') return publicar(t);
    if (t.id === 'orConferir') return conferir(t);
  });
  document.addEventListener('toggle', e => { if (e.target.id === 'orientCard' && e.target.open) { carregado = false; vis = vis === 'editar' ? vis : 'lista'; desenhar(document.getElementById('orientBox')); } }, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && podeVer() && vis === 'lista') { carregado = false; carregar().then(() => { atualizarSelos(); if (alvo && alvo.isConnected && alvo.querySelector('.orCard')) desenhar(); }); } });

  // Chamado no applyRole (auth.js): carrega o que há e mostra o bloco/menu.
  window.CA_orientIniciar = () => { carregado = false; vis = 'lista'; rasc = null; alvo = null; if (!podeVer()) { atualizarSelos(); return; } carregar().then(atualizarSelos); };
  // Se o acesso já chegou antes deste arquivo carregar (sessão em cache), inicia agora.
  if (window.CA_ACCESS) window.CA_orientIniciar();
  // Menu "Da loja" do módulo do curso (treino.js)
  let pedido = null; // 1.73.0: o alerta pede para abrir uma orientação (ver) ou o "Quem fez" dela
  window.CA_orientRender = box => {
    if (alvo !== box) { vis = vis === 'editar' ? vis : 'lista'; } alvo = box;
    if (pedido) { if (pedido.modo === 'ver') { vis = 'ver'; abertaId = pedido.id; } else { vis = 'lista'; verQuem[pedido.id] = true; } pedido = null; }
    desenhar(box);
  };
  function abrirDoAlerta(modo, id) { pedido = { modo, id }; const t = document.querySelector('#tabsCurso [data-curso="loja"]'); if (t) t.click(); }
  // 1.73.0: alertas de Orientação rápida para a Central de alertas (alertas.js)
  window.CA_orientAlertas = () => {
    if (!carregado || !podeVer()) return [];
    const pub = publicadas();
    if (ehDono()) return pub.slice(0, 12).map(g => {
      const quem = todosProg.filter(p => p.guide_id === g.id && p.user_email !== eu()).length, tot = equipe.length, falta = Math.max(0, tot - quem);
      return { id: 'or-d-' + g.id, ico: '⚡', nivel: falta ? 'atencao' : 'ok', em: g.criado_em, pendente: falta > 0, exige: false,
        titulo: 'Orientação rápida publicada: ' + g.titulo,
        texto: !tot ? 'Cadastre a sua equipe para ela receber esta orientação.' : falta ? `${quem} de ${tot} da equipe já ${quem === 1 ? 'fez' : 'fizeram'}. ${falta === 1 ? 'Falta 1 pessoa' : 'Faltam ' + falta + ' pessoas'}.` : `Toda a equipe já fez (${tot} de ${tot}).`,
        acao: { rotulo: '👥 Ver quem fez', fn: () => abrirDoAlerta('quem', g.id) } };
    });
    return pub.map(g => {
      const m = meus[g.id];
      return { id: 'or-' + g.id, ico: '⚡', nivel: m ? 'ok' : 'info', em: g.criado_em, pendente: !m, exige: !m,
        titulo: 'Nova orientação rápida da loja: ' + g.titulo,
        texto: m ? `Você confirmou que leu e entendeu em ${dataBR(m.feito_em)}.` : 'Leia os passos e responda as perguntas para confirmar que entendeu.',
        acao: { rotulo: m ? 'Rever' : '⚡ Abrir agora', fn: () => abrirDoAlerta('ver', g.id) } };
    });
  };
})();
