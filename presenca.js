/* Cliente Assistido – Quem está usando o app agora (1.35.0).
   1. Todo usuário que não é admin manda um "sinal de vida" (rpc presence_ping) ao abrir o app e a cada minuto com o app na tela.
      O banco registra a entrada no primeiro sinal depois de 10 min sem sinal, e a saída quando passam 10 min sem sinal
      (pg_cron, presence_sweep) ou na hora, quando a pessoa toca em Sair (presence_leave). Ir ao WhatsApp para enviar não conta como saída.
   2. A cada entrada ou saída de lojista ou funcionário, o admin recebe um aviso no celular (edge function daily-reminder, mode presenca).
   3. Admin → "🟢 Em uso agora": lojas e usuários em uso, e as entradas e saídas de hoje. */
'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SB = () => window.CA_SB, ACC = () => window.CA_ACCESS || {};
  const JANELA = 10 * 60000; // sem sinal há mais de 10 min = fora do app
  const hora = iso => { try { return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  const PAPEL = { lojista: 'dono', funcionario: 'funcionário', operador: 'operador CA' };

  /* ---------- Sinal de vida (todos menos o admin) ---------- */
  let ultimoPing = 0;
  function ping(forcar) {
    const sb = SB(), a = ACC();
    if (!sb || !a.papel || a.papel === 'admin' || document.visibilityState !== 'visible') return;
    if (!forcar && Date.now() - ultimoPing < 20000) return;
    ultimoPing = Date.now();
    sb.rpc('presence_ping').then(() => {}, () => {});
  }
  window.CA_presencaSair = async () => { try { const sb = SB(); if (sb && ACC().papel !== 'admin') await sb.rpc('presence_leave'); } catch (e) {} };
  function iniciar() {
    if (!SB() || !ACC().papel) { setTimeout(iniciar, 2000); return; }
    if (ACC().papel === 'admin') { setInterval(() => { if (document.visibilityState === 'visible' && $('#admin.on')) carregar(); }, 30000); return; }
    ping(true);
    setInterval(() => ping(true), 60000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ping(false); });
  }

  /* ---------- Painel do admin ---------- */
  async function carregar() {
    const sb = SB(), box = $('#presencaBox'); if (!sb || !box || ACC().papel !== 'admin') return;
    const ini = new Date(); ini.setHours(0, 0, 0, 0);
    const [p, e, s] = await Promise.all([
      sb.from('presence').select('*'),
      sb.from('presence_events').select('*').gte('em', ini.toISOString()).order('em', { ascending: false }).limit(30),
      sb.from('stores').select('id,name')
    ]);
    if (p.error) { box.innerHTML = '<p class="msg small">Não foi possível carregar agora: ' + esc(p.error.message) + '</p>'; return; }
    const lojas = {}; (s.data || []).forEach(x => { lojas[x.id] = x.name; });
    const agora = Date.now();
    const on = (p.data || []).filter(x => x.online && agora - new Date(x.last_seen).getTime() < JANELA);
    const porLoja = {}; on.forEach(x => { const k = x.store_id || '-'; (porLoja[k] = porLoja[k] || []).push(x); });
    const nLojas = Object.keys(porLoja).filter(k => k !== '-').length;
    const minAtras = iso => { const m = Math.round((agora - new Date(iso).getTime()) / 60000); return m <= 0 ? 'agora' : `há ${m} min`; };
    $('#presencaSub').textContent = `${nLojas} loja(s) e ${on.length} usuário(s) em uso agora`;
    box.innerHTML = `<div class="presNums"><div><b>${nLojas}</b><span>lojas em uso agora</span></div><div><b>${on.length}</b><span>usuários em uso agora</span></div></div>
      ${on.length ? Object.entries(porLoja).map(([k, us]) => `<div class="presLoja"><b>🟢 ${esc(lojas[k] || 'Sem loja')}</b>${us.map(u => `<div class="presUs"><span>${esc(u.nome || u.email)} <small class="mut">· ${esc(PAPEL[u.papel] || u.papel || '')}</small></span><small class="mut">desde ${hora(u.desde)} · ativo ${minAtras(u.last_seen)}</small></div>`).join('')}</div>`).join('')
        : '<p class="mut small">Ninguém usando o app neste momento.</p>'}
      <h4 class="presH">Entradas e saídas de hoje</h4>
      ${(e.data || []).length ? (e.data || []).map(v => `<div class="presEv"><small class="mut">${hora(v.em)}</small><span>${v.tipo === 'entrou' ? '🟢' : '⚪'} <b>${esc(v.nome || v.email)}</b>${v.loja ? ' (' + esc(v.loja) + ')' : ''} ${v.tipo === 'entrou' ? 'entrou' : 'saiu' + (v.minutos ? ` depois de ${v.minutos} min` : '')}</span></div>`).join('')
        : '<p class="mut small">Nenhuma entrada hoje ainda.</p>'}
      <p class="mut small" style="margin-top:10px">Você recebe um aviso no celular quando um dono ou funcionário entra ou sai (ative os avisos em Mais → Lembrete diário). A saída conta depois de 10 minutos sem usar o app, ou na hora, quando a pessoa toca em Sair.</p>`;
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.tabs button[data-tab="admin"]')) setTimeout(carregar, 50);
    if (e.target.id === 'presencaAtualizar') carregar();
  });
  window.CA_carregarPresenca = carregar;
  iniciar();
})();
