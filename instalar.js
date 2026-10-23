/* Cliente Assistido – Instalar o app no celular (versão 1.21.0).
   Android/Chrome: guarda o pedido de instalação do navegador e mostra o botão "Instalar agora".
   iPhone: o Safari não pergunta; mostramos o caminho Compartilhar → Adicionar à Tela de Início.
   Aberto pelo ícone (tela cheia) ou já instalado neste aparelho: o cartão some e o passo do roteiro fica feito. */
'use strict';
(function () {
  const $ = s => document.querySelector(s);
  let pedido = null;
  const standalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const celular = () => ios() || /android/i.test(navigator.userAgent);
  const marcado = () => { try { return localStorage.getItem('ca_instalado') === '1'; } catch (e) { return false; } };
  const marcar = () => { try { localStorage.setItem('ca_instalado', '1'); } catch (e) {} };
  const instalado = () => standalone() || marcado();

  function render() {
    const card = $('#instalarCard'); if (!card) return;
    if (standalone()) marcar();
    // No computador o cartão só aparece se o navegador oferecer a instalação.
    const mostrar = !instalado() && (celular() || !!pedido);
    card.classList.toggle('hide', !mostrar);
    if (!mostrar) return;
    $('#btnInstalar').classList.toggle('hide', !pedido);
    $('#instalarComo').innerHTML = pedido ? ''
      : ios() ? 'No iPhone, abra este endereço no <b>Safari</b>, toque em <b>Compartilhar</b> (o quadrado com a seta para cima ⬆️) e depois em <b>Adicionar à Tela de Início</b>. Depois, entre sempre pelo ícone.'
      : 'No <b>Chrome</b>, toque no menu <b>⋮</b> (três pontinhos, no alto à direita) e depois em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>. Depois, entre sempre pelo ícone.';
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedido = e; render(); atualizarRoteiro(); });
  window.addEventListener('appinstalled', () => { pedido = null; marcar(); render(); atualizarRoteiro(); if (window.CA_log) window.CA_log('app_instalado', {}); });
  const b = $('#btnInstalar');
  if (b) b.addEventListener('click', async () => {
    if (!pedido) return;
    const p = pedido; pedido = null;
    p.prompt();
    try { const r = await p.userChoice; if (r && r.outcome === 'accepted') marcar(); } catch (e) {}
    render(); atualizarRoteiro();
  });
  function atualizarRoteiro() { if (window.CA_renderImpl) window.CA_renderImpl(); }
  const tab = document.querySelector('.tabs button[data-tab="mais"]'); if (tab) tab.addEventListener('click', render);
  window.CA_INSTALAR = { instalado, render };
  render();
})();
