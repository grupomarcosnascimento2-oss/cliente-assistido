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
- Front: HTML/CSS/JS puro, sem build. Arquivos: index.html, style.css, app.js (núcleo), auth.js (login, gate, Admin, Minha loja/equipe), sync.js (backup e atividades), gcontacts.js (Google Contatos), modelos.js (19 modelos de campanha, inclusive "Siga a gente no Instagram" e "Qual é o seu aniversário?", que usa aud.semNiver), ramos.js (pacotes por ramo e lista de funcionalidades), implantacao.js (roteiro de primeiros passos na tela Hoje, estado em S.implantacao), painel.js (aba Lojas do operador CA), premium.js (respostas prontas, interesse de compra, relatório da semana), contrato.js (texto do contrato de licença, usado no app e na minuta Word), dashboard.js (painel de resultados no topo de Mais: destaques 7 dias vs anteriores via CA_calcSemana do premium.js, gráfico SVG de envios em 30 dias com S.sentLog e linha do limite, funil 30 dias; funcionário vê só o gráfico; window.CA_renderDash chamado em renderAll), instalar.js (botão "Instalar o aplicativo" no topo, #instalarTopo, independente do roteiro, e cartão em Mais: beforeinstallprompt no Android, passo a passo no iPhone; some depois de instalado, flag ca_instalado), sw.js (cache e push).
- Dados no aparelho: localStorage `ca_v1` (operador: `ca_v1:<loja>`). Backup opcional no Supabase (store_contacts, store_state).
- Campanhas: toda alteração passa por tocarCamp(c) (grava c.upd). O backup junta campanhas por id ficando com o upd mais recente (sync.js juntarCampanhas), também antes de enviar o estado. Nunca trocar S.campaigns inteiro vindo do servidor.
- Aprovação (Premium): campanha salva pelo operador fica c.aprov.st 'pendente' até o dono aprovar ('aprovada') ou pedir ajuste ('ajuste'); o operador não envia campanha não aprovada (eligible/bloqueadaParaMim). Campanha sem aprov = aprovada.
- Avisos ao dono: edge function daily-reminder com mode 'aviso' (tipo aprovacao ou venda); valida que quem chama atende a loja e monta o texto no servidor, sem nome nem telefone de cliente. App chama por window.CA_avisarDono.
- Foco do produto: relacionamento, não gestão. As lojas já têm sistema de oficina/gestão; o CA não cria controles novos nem pede digitação extra. Data vinda do sistema da loja sempre manda.
- Vencimento por km (opcional): recurso 'venc_km' começa DESLIGADO (window.CA_RECURSOS_OPT_IN; stores.recursos.on guarda o que o admin ligou). Só o admin liga; o lojista ajusta limite de km por serviço (vencCfg[k].km) e a média da loja (S.settings.kmMedia, padrão 1000 km/mês). Média do cliente vem de duas leituras de km (veic.km/kmData e veic.kmAnt). Aviso pelo que vier primeiro: meses ou km.
- Placeholders das mensagens: {nome}, {loja}, {instagram} (S.settings.instagram, sem @; vira "@perfil (instagram.com/perfil)"), {veiculo} e, nos vencimentos, {vence}. A mensagem de parabéns (S.bdayMsg) também aceita {loja}; textos padrão antigos viram o atual (bdayMsgAtual).
- Interesse de compra: c.venda = {st 'aberto'|'atendido', em, por, nota}; respostas prontas em S.respostas (viajam no store_state).
- Hospedagem: Vercel, publica a cada commit na main de grupomarcosnascimento2-oss/cliente-assistido. URL: https://cliente-assistido.vercel.app
- Publicação (desde 23/10/2026): o Claude faz os commits direto na main (sem zip, sem upload manual). Um commit por versão, mensagem "vX.Y.Z: resumo".
- 591.supabase.js é um pedaço (chunk) da biblioteca do Supabase; não apagar.
- Supabase (projeto kxwwbqjleskxzfbmybvb): login Google, RLS, funções SECURITY DEFINER (my_access, approve_request, reject_request, update_store_profile, team_add, team_set_active, set_store_sync...), stores.recursos (funcionalidades desligadas por loja), access_requests, activity_log, push_subscriptions, edge function daily-reminder (Web Push), pg_cron.
- Termos: páginas públicas termos.html e privacidade.html (legal.css). Versão dos textos na função terms_version() (hoje '1.0'); aceites na tabela terms_acceptances (função accept_terms); my_access devolve termos {versao, aceito, anterior}. Mudou o texto? Atualize a data/versão nas duas páginas e suba terms_version(): todos aceitam de novo.
- Contrato digital (opcional): recurso 'contrato_digital' começa DESLIGADO; só o admin liga, informando valor/pagamento e início (stores.recursos.contrato {id, valor, inicio, plano, acessos}). Mudar esses dados gera id novo e o dono aceita de novo. Só o lojista aceita (portão depois dos termos; função accept_contract grava em contract_acceptances com o texto aceito); my_access devolve contrato {exigido, id, aceito, aceito_em, aceito_por}. Ver/imprimir em Minha loja. O Admin não deixa ligar enquanto CONTRATADA em contrato.js tiver colchetes.
- Migrações no Supabase: evitar a palavra "delete" e migrações grandes (o MCP trava); dividir.

## Planos e papéis
- CA Essencial (lojista envia) e CA Premium (operador CA opera remoto, envio manual, aprovação do lojista).
- Papéis: admin, lojista (dono), funcionario, operador.

## Situação em 24/10/2026
- No ar: 1.23.1 (aba Mais: Relatório, Lembrete, Backup, Seus dados (#dadosCard), Minha loja, Minha equipe e Atividades recolhíveis, details.histBox; o roteiro e o link ?ver=relatorio abrem o bloco), sobre a 1.23.0 (painel de resultados em Mais: destaques, envios 30 dias e funil), sobre a 1.22.0 (Histórico e resultados, #histBox, mudou para a aba Mais abaixo do Relatório da semana; renderAll chama renderHistorico; Abrir/Reabrir levam para a aba Campanha), sobre a 1.21.9 (aba Campanha: Ritmo de envio, Parabéns, Pós-venda e Respostas prontas também recolhíveis, details.histBox; ao abrir, as textarea.auto são reajustadas pelo evento toggle), sobre a 1.21.8 (seta de abrir do Histórico e resultados maior, em círculo), sobre a 1.21.7 (grupos de clientes do público em quadro com grade alinhada, .chipGrid), sobre a 1.21.6 (opções de aniversário do público agrupadas em .ckGrupo e mutuamente exclusivas), sobre a 1.21.5 (Histórico e resultados da aba Campanha recolhível, #histBox, e cada campanha com "ver mais", details.histIt), sobre a 1.21.4 (botão Instalar o aplicativo no topo desde o primeiro acesso, fora do roteiro), sobre a 1.21.3 (versão 3 da captação de aniversário mais gentil e acolhedora; ANT_NIVER guarda os textos antigos que migram), sobre a 1.21.2 (captação de aniversário pede só dia e mês, nunca o ano), sobre a 1.21.1 (modelo "Qual é o seu aniversário?" + público "só quem não tem aniversário cadastrado"), sobre a 1.21.0 (instalar o app: ícone 512, cartão em Mais e passo no roteiro), sobre a 1.20.3 (nova campanha com as 5 versões preenchidas, DEFAULT_MSGS com {loja}; campanhas com o padrão antigo exato, OLD_MSGS, migram), sobre a 1.20.2 (loja em teste: stores.recursos.teste {ate, nota}, aviso só no Admin), a 1.20.1 (aniversário com o nome da loja) e a 1.20.0 (contrato de licença digital opcional, ligado por loja pelo admin). Minuta em Word entregue ao Marcos.
- Nicho inicial: auto centers (3 lojas interessadas; União quer campanhas de troca de óleo e integração com o sistema dela).
- União Auto Center: aderiu e pagou em 23/10/2026; treinamento feito e em produção. PENDENTE: há duas lojas "União Automotiva" (uma por e-mail; ids 75253025… e fa7469ba…), sem backup e sem contatos no servidor; juntar numa só (Marcos vai dizer quem é o dono), desativar a duplicada e ligar o backup para funcionar nos 2 celulares.
- JOTACAR AUTO CENTER (JK Automotivo): implantada em 23/10/2026, em teste por 40 dias (exceção comercial, caso de sucesso) até 02/12/2026; se positivo, adere ao CA Essencial.
- Pendências principais: dados da CONTRATADA em contrato.js (razão social, CNPJ, endereço), revisão dos termos e do contrato por advogado, integração com o sistema da União (aguardando formato da exportação), preços dos planos, mensagens por IA (adiado).

## Teste
Sem build: servir a pasta (python -m http.server) com um supabase.js de teste e usar Playwright/Chromium para conferir as telas antes de entregar.
