/* Cliente Assistido – Tema da tela (1.30.0). Mais → Aparência: Automático (segue o modo noturno do celular), Claro ou Escuro.
   Escolha guardada neste aparelho (localStorage ca_tema); o index.html aplica a classe antes de desenhar a tela, sem piscar. */
'use strict';
(function () {
  const K = 'ca_tema', root = document.documentElement;
  const ler = () => { try { return localStorage.getItem(K) || 'auto'; } catch (e) { return 'auto'; } };
  const escuroAgora = t => t === 'escuro' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  function aplicar(t) {
    root.classList.toggle('tema-escuro', t === 'escuro');
    root.classList.toggle('tema-claro', t === 'claro');
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = escuroAgora(t) ? '#0f1513' : '#0B2545';
    document.querySelectorAll('#temaOpc button').forEach(b => b.classList.toggle('on', b.dataset.tema === t));
    const i = document.getElementById('temaInfo');
    if (i) i.textContent = t === 'auto' ? 'Segue o modo noturno do celular: escurece quando o celular está no modo escuro.'
      : t === 'escuro' ? 'Tela sempre escura, mais confortável à noite e para os olhos.' : 'Tela sempre clara, mesmo com o celular no modo escuro.';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('#temaOpc [data-tema]'); if (!b) return;
    const t = b.dataset.tema; try { localStorage.setItem(K, t); } catch (x) {}
    aplicar(t);
  });
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'); const f = () => aplicar(ler()); mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener && mq.addListener(f); }
  aplicar(ler());
})();
