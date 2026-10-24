const CACHE = 'ca-1.30.6';
const SHELL = ['/', '/index.html', '/style.css', '/modelos.js', '/ramos.js', '/app.js', '/auth.js', '/sync.js', '/gcontacts.js', '/implantacao.js', '/painel.js', '/premium.js', '/instalar.js', '/tema.js', '/dicas.js', '/treino-trilha1.js', '/treino-ilus.js', '/treino.js', '/dashboard.js', '/contrato.js', '/supabase.js', '/manifest.webmanifest', '/icon-192.png', '/termos.html', '/privacidade.html', '/legal.css'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== 'ca-data').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
  );
});

/* ---------- Lembrete diário (Web Push) ---------- */
async function resumoDoDia() {
  try { const r = await (await caches.open('ca-data')).match('/__resumo'); return r ? await r.json() : null; } catch (e) { return null; }
}
function hojeMMDD() { const t = new Date(); return String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); }
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) {}
  // Aviso pontual para o dono (campanha para aprovar, cliente com interesse de compra): o texto vem pronto do servidor.
  if (d.kind === 'aviso') {
    e.waitUntil(self.registration.showNotification(d.title || 'Cliente Assistido', {
      body: d.body || '', icon: '/icon-192.png', badge: '/icon-192.png', tag: d.tag || 'aviso', renotify: true,
      data: { url: d.url || '/?tab=hoje' }
    }));
    return;
  }
  e.waitUntil((async () => {
    const r = await resumoDoDia();
    const partes = [];
    if (r) {
      const n = Math.min(r.aguardando || 0, r.limite || 50);
      if (n > 0) partes.push(`${n} cliente(s) para contatar hoje${r.campanha ? ' em "' + r.campanha + '"' : ''}`);
      const b = (r.bdays || {})[hojeMMDD()] || 0;
      if (b > 0) partes.push(`${b} aniversariante(s) 🎂`);
      if (r.venc > 0) partes.push(`${r.venc} vencimento(s) para avisar 🔧`);
      if (r.gDue) partes.push('hora de atualizar seus contatos do Google');
      if (r.aprovar > 0) partes.push(`${r.aprovar} campanha(s) para aprovar`);
      if (r.vendas > 0) partes.push(`${r.vendas} cliente(s) interessado(s) esperando você 💰`);
      if (r.relatorio && new Date().getDay() === 1) partes.push('o relatório da semana está pronto em Mais');
    }
    let body = partes.length ? partes.join(' · ') + '.' : 'Hora do relacionamento: veja quem você pode lembrar hoje.';
    if (d.kind === 'test') body = 'Teste: o lembrete diário está funcionando. ' + body;
    await self.registration.showNotification(d.title || 'Cliente Assistido', {
      body, icon: '/icon-192.png', badge: '/icon-192.png', tag: 'lembrete-diario', renotify: true,
      data: { url: d.url || '/?tab=hoje' }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil((async () => {
    const cs = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of cs) { if ('navigate' in c) { await c.navigate(url).catch(() => {}); return c.focus(); } }
    return clients.openWindow(url);
  })());
});
