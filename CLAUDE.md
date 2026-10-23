# Cliente Assistido (CA) – guia para o Claude

PWA para pequenas lojas manterem o relacionamento com clientes pelo WhatsApp.
Dono do produto: Marcos Nascimento. Documento vivo (fonte da verdade, sempre atualizar):
https://claude.ai/artifact/LGbNZ4fDHBxikGJGjMs4MF

## Regras que não mudam
- Envio SEMPRE manual, feito por uma pessoa (link "clique para conversar"). Sem robô, sem envio automático, sem contornar regras do WhatsApp. O CA respeita os termos do WhatsApp, a LGPD e as boas práticas.
- Caixas de mensagem (textarea.auto) nunca podem ficar menores que o texto: a frase inteira sempre visível.
- Sem período de teste gratuito: a loja só entra aprovada e com plano definido.
- A cada versão: subir APP_VERSION e NOVIDADES (app.js), CACHE em sw.js, linha na tabela de versões do documento vivo e seção explicando o que mudou.
- Nunca colar chaves/segredos no chat.

## Stack
- Front: HTML/CSS/JS puro, sem build. Arquivos: index.html, style.css, app.js (núcleo), auth.js (login, gate, Admin, Minha loja/equipe), sync.js (backup e atividades), gcontacts.js (Google Contatos), modelos.js (17 modelos de campanha), ramos.js (pacotes por ramo e lista de funcionalidades), sw.js (cache e push).
- Dados no aparelho: localStorage `ca_v1` (operador: `ca_v1:<loja>`). Backup opcional no Supabase (store_contacts, store_state).
- Hospedagem: Vercel, publica a cada commit na main de grupomarcosnascimento2-oss/cliente-assistido. URL: https://cliente-assistido.vercel.app
- Publicação (desde 23/10/2026): o Claude faz os commits direto na main (sem zip, sem upload manual). Um commit por versão, mensagem "vX.Y.Z: resumo".
- 591.supabase.js é um pedaço (chunk) da biblioteca do Supabase; não apagar.
- Supabase (projeto kxwwbqjleskxzfbmybvb): login Google, RLS, funções SECURITY DEFINER (my_access, approve_request, reject_request, update_store_profile, team_add, team_set_active, set_store_sync...), stores.recursos (funcionalidades desligadas por loja), access_requests, activity_log, push_subscriptions, edge function daily-reminder (Web Push), pg_cron.
- Migrações no Supabase: evitar a palavra "delete" e migrações grandes (o MCP trava); dividir.

## Planos e papéis
- CA Essencial (lojista envia) e CA Premium (operador CA opera remoto, envio manual, aprovação do lojista).
- Papéis: admin, lojista (dono), funcionario, operador.

## Situação em 23/10/2026
- No ar: 1.13.0 (cadastro de clientes, pacote automotivo com vencimentos, funcionalidades por loja).
- Nicho inicial: auto centers (3 lojas interessadas; União quer campanhas de troca de óleo e integração com o sistema dela).
- Pendências principais: termos de uso e política de privacidade (aceite no primeiro acesso), roteiro de implantação na tela Hoje, integração com o sistema da União (aguardando formato da exportação), vencimento por km, preços dos planos, mensagens por IA (adiado).

## Teste
Sem build: servir a pasta (python -m http.server) com um supabase.js de teste e usar Playwright/Chromium para conferir as telas antes de entregar.
