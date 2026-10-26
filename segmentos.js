/* Cliente Assistido – Camada de segmentos (versão 1.44.0).
   O motor do CA é o mesmo para todos: lista de pessoas, campanhas, envio manual com pausas, equipe, curso e relatórios.
   O TIPO DE ORGANIZAÇÃO (segmento) muda só três coisas:
   1. vocabulário da tela (cliente → fiel, loja → igreja, funcionário → ajudante...), trocado nas palavras da interface;
   2. recursos que não fazem sentido (pós-venda, datas comerciais, interesse de compra, pacote de ramo) ficam desligados;
   3. modelos de campanha: só os que servem para o segmento (modelos próprios de cada segmento estão na lista de evolução).
   O segmento fica em stores.recursos.segmento (o admin escolhe em Admin → Lojas → Editar). Sem segmento = comércio.
   As mensagens enviadas NÃO passam pela troca de palavras: o texto das campanhas é o que a organização escreveu. */
'use strict';
(function () {
  // voc: [singular, plural] de cada termo, sempre com o mesmo gênero da palavra original, para não quebrar a frase
  // (o cliente → o fiel / o contato / o cidadão; a loja → a igreja / a organização / a prefeitura).
  const SEG = {
    comercio: { nome: 'Comércio (lojas)', slogan: 'Quem é lembrado, vende mais.' },
    igreja: { nome: 'Igreja / comunidade religiosa', slogan: 'Quem é lembrado, se sente acolhido.',
      voc: { cliente: ['fiel', 'fiéis'], loja: ['igreja', 'igrejas'], dono: ['responsável', 'responsáveis'], funcionario: ['ajudante', 'ajudantes'] } },
    ong: { nome: 'ONG / projeto social', slogan: 'Quem é lembrado, se sente parte.',
      voc: { cliente: ['contato', 'contatos'], loja: ['organização', 'organizações'], dono: ['coordenador', 'coordenadores'], funcionario: ['voluntário', 'voluntários'] } },
    publico: { nome: 'Órgão público / município', slogan: 'Quem é lembrado, é bem atendido.',
      voc: { cliente: ['cidadão', 'cidadãos'], loja: ['secretaria', 'secretarias'], dono: ['gestor', 'gestores'], funcionario: ['servidor', 'servidores'] } },
    outros: { nome: 'Outra organização (escola, clínica, associação...)', slogan: 'Quem é lembrado, volta sempre.',
      voc: { cliente: ['contato', 'contatos'], loja: ['organização', 'organizações'], dono: ['responsável', 'responsáveis'], funcionario: ['colaborador', 'colaboradores'] } }
  };
  // Fora do comércio: sem pós-venda, datas comerciais, interesse de compra e pacote de ramo (veículo, vencimentos, modelos do ramo).
  const FORA = ['posvenda', 'datas', 'venda', 'veiculo', 'modelos_ramo', 'venc_km'];
  // Modelos gerais que servem fora do comércio (os textos não falam de compra, oferta nem loja).
  const MODELOS_NEUTROS = ['reconquista', 'pascoa', 'maes', 'pais', 'criancas', 'ano-novo'];
  Object.keys(SEG).forEach(k => { if (k !== 'comercio') Object.assign(SEG[k], { fora: FORA, modelos: MODELOS_NEUTROS }); });
  window.CA_SEGMENTOS = SEG;

  const atual = () => { const r = (((window.CA_ACCESS || {}).loja || {}).recursos) || {}; return SEG[r.segmento] ? r.segmento : 'comercio'; };
  window.CA_segmento = atual;
  window.CA_seg = () => SEG[atual()];
  window.CA_segFora = k => (SEG[atual()].fora || []).includes(k);
  window.CA_segModeloOk = m => { const s = SEG[atual()]; return !s.modelos || !m || (!m.ramo && s.modelos.includes(m.key)); };

  /* ---------- Troca de palavras na interface ---------- */
  const ORIG = { cliente: ['cliente', 'clientes'], loja: ['loja', 'lojas'], dono: ['dono', 'donos'], funcionario: ['funcionário', 'funcionários'] };
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  let regras = null, segRegras = null;
  function montar() {
    const s = SEG[atual()]; if (!s.voc) return null;
    const lista = [];
    Object.keys(ORIG).forEach(k => {
      const de = ORIG[k], para = s.voc[k]; if (!para) return;
      // "cliente(s)" vira o plural ("fiéis"), porque o singular com (s) não serve para todas as palavras (fiel → fiéis)
      lista.push([de[0] + '(s)', para[1]], [cap(de[0]) + '(s)', cap(para[1])]);
      [1, 0].forEach(i => { // plural antes do singular
        lista.push([de[i], para[i]], [cap(de[i]), cap(para[i])], [de[i].toUpperCase(), para[i].toUpperCase()]);
      });
    });
    const mapa = new Map(lista);
    const re = new RegExp('(?<![\\p{L}\\p{N}])(' + lista.map(x => x[0].replace(/[()]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}])', 'gu');
    return { re, mapa };
  }
  // Áreas que não mudam: Admin e painel do operador (o Marcos vê os termos reais), o curso (conteúdo próprio),
  // o nome de quem está logado e qualquer bloco marcado com .noVoc.
  const FORA_DOM = '#admin,#painel,#treinoCard,#treinoEquipe,#userBox,.noVoc,script,style,textarea,code';
  function trocarTexto(no) {
    const v = no.nodeValue; if (!v || !regras.re.test(v)) return; regras.re.lastIndex = 0;
    const novo = v.replace(regras.re, m => regras.mapa.get(m) || m); if (novo !== v) no.nodeValue = novo;
  }
  function varrer(raiz) {
    if (!regras || !raiz) return;
    if (raiz.nodeType === 3) { const p = raiz.parentElement; if (p && !p.closest(FORA_DOM)) trocarTexto(raiz); return; }
    if (raiz.nodeType !== 1 || raiz.closest(FORA_DOM)) return;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest(FORA_DOM) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = w.nextNode())) trocarTexto(n);
    raiz.querySelectorAll('[placeholder],[title]').forEach(el => {
      if (el.closest(FORA_DOM)) return;
      ['placeholder', 'title'].forEach(a => { const v = el.getAttribute(a); if (v) { const nv = v.replace(regras.re, m => regras.mapa.get(m) || m); if (nv !== v) el.setAttribute(a, nv); } });
    });
  }
  let pend = new Set(), agendado = false;
  const obs = new MutationObserver(ms => {
    if (!regras) return;
    ms.forEach(m => { if (m.type === 'characterData') pend.add(m.target); else m.addedNodes.forEach(n => pend.add(n)); });
    if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; const lote = pend; pend = new Set(); obs.disconnect(); lote.forEach(varrer); ligarObs(); }); }
  });
  const ligarObs = () => obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  // Chamado quando o acesso da loja chega (auth.js → applyRole) e quando o admin muda o segmento da própria loja.
  window.CA_aplicarSegmento = function () {
    const seg = atual();
    document.body.dataset.segmento = seg;
    const s = SEG[seg];
    document.querySelectorAll('.slogan').forEach(el => { el.textContent = s.slogan; });
    if (seg === segRegras) return;
    if (segRegras && segRegras !== 'comercio') { location.reload(); return; } // voltar os textos originais exige recarregar
    segRegras = seg; regras = montar();
    if (regras) { varrer(document.body); ligarObs(); }
  };
})();
