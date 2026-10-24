/* Cliente Assistido – Instalar o app no celular (versões 1.21.0 e 1.21.4).
   Botão em destaque no topo, desde o primeiro acesso, independente do roteiro; some depois de instalado.
   Android/Chrome: usa o pedido de instalação do navegador ("Instalar agora" abre a janela do Chrome).
   Sem o pedido (iPhone ou Chrome que ainda não liberou): o botão mostra o passo a passo.
   O cartão em Mais repete as instruções para quem quiser ver de novo. */
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
  const comoTxt = () => ios()
    ? 'No iPhone, abra este endereço no <b>Safari</b>, toque em <b>Compartilhar</b> (o quadrado com a seta para cima ⬆️) e depois em <b>Adicionar à Tela de Início</b>. Depois, entre sempre pelo ícone.'
    : 'No <b>Chrome</b>, toque no menu <b>⋮</b> (três pontinhos, no alto à direita) e depois em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>. Depois, entre sempre pelo ícone.';

  function render() {
    if (standalone()) marcar();
    // No computador só aparece se o navegador oferecer a instalação.
    const mostrar = !instalado() && (celular() || !!pedido);
    const topo = $('#instalarTopo');
    if (topo) {
      topo.classList.toggle('hide', !mostrar);
      if (!mostrar || pedido) $('#instalarTopoComo').classList.add('hide');
    }
    const card = $('#instalarCard');
    if (card) {
      card.classList.toggle('hide', !mostrar);
      $('#btnInstalar').classList.toggle('hide', !pedido);
      $('#instalarComo').innerHTML = pedido ? '' : comoTxt();
    }
  }
  async function instalar() {
    if (!pedido) { // sem a janela do navegador: mostra (ou esconde) o passo a passo logo abaixo do botão
      const p = $('#instalarTopoComo'); p.innerHTML = comoTxt(); p.classList.toggle('hide'); return;
    }
    const p = pedido; pedido = null;
    p.prompt();
    try { const r = await p.userChoice; if (r && r.outcome === 'accepted') marcar(); } catch (e) {}
    render();
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedido = e; render(); });
  window.addEventListener('appinstalled', () => { pedido = null; marcar(); render(); if (window.CA_log) window.CA_log('app_instalado', {}); });
  ['#btnInstalar', '#btnInstalarTopo'].forEach(s => { const b = $(s); if (b) b.addEventListener('click', instalar); });
  const tab = document.querySelector('.tabs button[data-tab="mais"]'); if (tab) tab.addEventListener('click', render);
  window.CA_INSTALAR = { instalado, render };
  render();
})();
