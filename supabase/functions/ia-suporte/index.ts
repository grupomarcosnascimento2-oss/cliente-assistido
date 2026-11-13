// Cliente Assistido – Suporte com IA (1.51.0). Ícone 🎧 no topo do app: a IA tira dúvidas de USO do app na hora;
// se não resolver, o app oferece falar com uma pessoa pelo WhatsApp. Cada pergunta fica em support_chats (só o admin lê)
// e em ai_usage (tipo 'suporte'). Limite IA_SUPORTE_DIA (padrão 20) por pessoa em 24 h; admin sem limite.
// Usa os mesmos segredos da IA das campanhas (AI_PROVIDER, AI_MODEL, OPENAI_API_KEY/OPEN_API_KEY ou ANTHROPIC_API_KEY).
// MANUAL abaixo: atualizar quando o app mudar de um jeito que o usuário perceba. (v20, 1.75.0: avançado pausado, vencimentos por período)
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
const falha = (e: string) => { console.log('ia-suporte erro', e); return json({ erro: e }); };
const limpa = (t: unknown, n: number) => String(t ?? '').replace(/\r/g, '').trim().slice(0, n);

const MANUAL = `MANUAL DO CLIENTE ASSISTIDO (CA)
O que é: aplicativo (PWA, abre no navegador e pode ser instalado no celular) para pequenas lojas manterem o relacionamento com os clientes pelo WhatsApp. Lema: quem é lembrado, vende mais. O envio das campanhas é SEMPRE manual: o app abre o WhatsApp com a mensagem pronta e uma pessoa da loja confere e toca em enviar. Não existe robô nem disparo em massa. A única exceção é o módulo opcional da API oficial do WhatsApp (ligado pelo suporte CA), que manda sozinho só os lembretes de vencimento e pós-venda, por mensagens aprovadas pela Meta. Isso protege o número da loja e respeita as regras do WhatsApp e a LGPD.
Abas: Gerencial (só para o dono da loja), Hoje, Contatos, Campanha e Mais (o admin também vê Admin). No topo ficam o nome, o botão de suporte 🎧 e o botão Sair (no perfil Aluno, a Ajuda é um menu do curso).

HOJE (a rotina do dia)
- Mostra o que fazer no dia: Resumo do dia, Aniversariantes 🎂, Vencimentos 🔧, Datas chegando 📅, Pós-venda 🛍️ e Enviar hoje 📤.
- Enviar hoje: os clientes da campanha ativa aparecem em rodadas de 5. Tocar em "Abrir e enviar" abre o WhatsApp com a mensagem já com o nome do cliente; a pessoa confere e envia.
- Depois de cada envio da campanha há uma espera curta e aleatória (de 5 a 10 segundos), e a cada 5 envios uma pausa maior (de 3 a 5 minutos), com um contador na tela. A contagem começa quando a pessoa volta do WhatsApp para o app. Isso é proposital, para o ritmo parecer natural e proteger o número. Basta esperar o contador zerar.
- Limite de mensagens de campanha por dia: até 30 (ajustável para menos em Campanha → Ritmo de envio). Parabéns, pós-venda e vencimentos não entram nas esperas.
- Quem respondeu: os clientes costumam responder horas ou dias depois. Quando alguém responder, vá em Contatos, ache o cliente pela busca e toque em "💬 Respondeu" (tocar de novo desmarca). Quem respondeu vai para o grupo Frequentes e entra na taxa de resposta. Na mesma linha há "🚫 Saiu" (pediu para não receber mais) e "📵 Sem WhatsApp" (o número não tem WhatsApp; para desfazer, toque em "Tem WhatsApp" no contato).
- Aniversariantes: depois de mandar os parabéns, o ✕ vermelho ao lado de "✓ Enviado" tira o cliente da lista de hoje.
- Envio automático (módulo opcional da API oficial do WhatsApp, só quando ligado pelo suporte CA para a loja): os lembretes de vencimento e de pós-venda saem sozinhos no horário da loja, por mensagens aprovadas pela Meta. Na tela Hoje aparece "⏰ automático hoje às Xh" no lugar do botão; quando o cliente responde, o contato é marcado sozinho. As campanhas continuam com envio manual.
- Quando o cliente responde com interesse em comprar, registre o interesse: o dono recebe um aviso no celular e o cliente fica em destaque.
- Respostas prontas: ao marcar em Contatos que alguém respondeu, aparecem textos prontos que abrem o WhatsApp para responder (editáveis em Campanha → Respostas prontas).

CONTATOS
- Carregar contatos: Escolher da agenda (do celular), Importar arquivo (planilha ou arquivo de contatos), Colar números, ou Google Contatos. Dá para definir o DDD padrão para números sem DDD e revisar os que vieram sem DDD antes de importar.
- Números fixos ou inválidos não entram.
- Busca e filtros para achar um contato; a lista mostra 5 por vez ("Mostrar mais 5").
- Em cada contato: 🎂 aniversário (só dia e mês), 🛍️ registrar compra (ou 💇 data do último atendimento, em salões e clínicas), grupo (Novos, Frequentes, Sumidos, Outros) e, em auto centers, o veículo.
- Grupos automáticos: quem respondeu vai para Frequentes; quem ficou mais de 90 dias sem responder ou recebeu 2 mensagens sem resposta vai para Sumidos. Escolher o grupo à mão deixa fixo.
- Quando você coloca contatos na mão (cadastrando, colando, importando ou trocando o grupo) num grupo que tem campanha em andamento dirigida a esse grupo, o app pergunta se quer incluir esses contatos na campanha. Sim (ou fechar a pergunta) = entram; Não = ficam fora só daquela campanha. Campanha para "Todos" não pergunta.
- Funcionário vê também o que é só do dono (aba Gerencial, criar ou encerrar campanha, Parabéns, Pós-venda, Respostas prontas, backup, Minha equipe, Curso da equipe, Atividades...), mas desabilitado: ao tocar, aparece o aviso "Essa funcionalidade só pode ser executada pelo dono da loja". Para usar, peça ao dono.
- Excluídos podem ser restaurados.
- Quem pediu para não receber mensagens deve ser marcado com "🚫 Saiu" em Contatos e não recebe mais.

CAMPANHA
- Criar a partir de um Modelo de campanha (mais de 20, inclusive datas comerciais e modelos do ramo da loja) ou criar uma nova.
- Campos: nome, Objetivo / contexto, período (começa em / termina em), público (grupos de clientes, situação, compra recente, tempo sem contato, aniversário) e até 5 versões da mensagem, que se alternam entre os clientes.
- Na mensagem dá para usar {nome} (primeiro nome do cliente), {loja}, {instagram} e, em auto centers, {veiculo}.
- A campanha só vale depois de tocar em Salvar campanha. Enquanto não é salva aparece "Não salva" e há o botão Cancelar.
- IA nas campanhas (quando liberada para a loja pelo suporte CA): escreva o objetivo e toque em "✨ Escrever as 5 versões com IA"; cada versão pode ser refeita com "✨ Refazer a versão com IA". Sempre revise antes de salvar. Limite de 40 usos por dia por loja.
- No CA Premium, a campanha criada pelo operador CA precisa da aprovação do dono antes de ser enviada.
- Celular que só acompanha (marcado pelo suporte CA para um usuário, por exemplo o celular particular de um funcionário): vê a mesma fila do Hoje, os contatos e as campanhas do celular da loja, mas não envia nada; no lugar de Enviar aparece "📱 Pelo celular da loja" e os contatos ficam só para consulta. O funcionário que acompanha pode criar ou mudar uma campanha: ela fica "aguardando aprovação" até um dono aprovar no cartão "Campanhas para aprovar" da tela Hoje. Campanha aguardando aprovação ou com ajuste pedido não é enviada por ninguém.
- Configurações (blocos recolhíveis): Ritmo de envio (limite por dia, descanso, qual WhatsApp abrir), Mensagem de parabéns, Mensagens de pós-venda (agradecimento no dia seguinte e "como ficou?" depois de 7 dias), Respostas prontas.
- Vencimentos (auto center): lembretes de troca de óleo, revisão, bateria, pneus etc., pelos meses e, se ligado pelo suporte, também pelos quilômetros. Em algumas lojas o suporte CA define um período de vencimentos (ex.: de 01/11 a 01/12): aí a lista mostra só quem vence nesse período, um cliente por linha; se o cliente tem mais de um serviço vencendo (ex.: troca de óleo e alinhamento e balanceamento), vai UMA mensagem só com os dois, sem duplicar.

MAIS
- Painel de resultados (últimos 7 dias comparados com os 7 anteriores, gráfico de envios em 30 dias, funil).
- Curso Cliente Encantado, atendimento que faz o cliente voltar (antes chamado Curso Excelência no Atendimento ao Cliente; quando liberado): 7 lições curtas com boas-vindas animadas na primeira vez, tela em trilha com as paradas das lições, áudio, vídeo, diálogos, pergunta e certificado; dúvidas no fim de cada lição são respondidas pela IA de suporte. O Módulo avançado (uma lição nova a cada 15 dias depois do básico) está pausado no momento e será liberado mais à frente.
- 📋 Treinamentos da loja: o dono cria uma ⚡ Orientação rápida sobre um processo ou rotina da loja (+ Criar → Orientação rápida, informa o assunto e explica do jeito dele; a IA organiza em passos e perguntas; ele revisa e publica). Inclusas 4 por mês. A equipe lê, responde as perguntas e, acertando, confirma que entendeu; o dono vê quem fez em "Quem fez". O 🎓 Treinamento completo (com narração e certificado) é um adicional, em breve.
- Aparência: tema claro, escuro ou igual ao do celular.
- 📲 Envio automático (só com o módulo da API oficial ligado): escolher o horário dos lembretes automáticos (das 6h às 21h) e ver os últimos envios (agendado, enviado, entregue, lido, respondeu, falhou).
- Relatório da semana (texto pronto para copiar e mandar), Histórico e resultados de cada campanha.
- Lembrete diário: aviso no celular, todo dia, de quem aguarda contato (precisa permitir notificações).
- Backup automático: guarda os contatos no servidor e deixa a mesma lista em todos os aparelhos da loja.
- Seus dados: cópia em arquivo, recomeçar a lista, termos e roteiro de primeiros passos.
- Contatos de outra loja do grupo (só quando o suporte CA liga, ex.: a Sede vendo a Filial): bloco em Mais com a lista da outra loja, só para consulta, com busca. As listas não se juntam; cada loja envia só para os próprios clientes, pelo próprio número.
- Minha loja (nome, cidade, WhatsApp, Instagram, ramo), Minha equipe (quem usa o app com o dono), Curso da equipe (quem fez cada lição), Atividades (o que foi feito, por quem e quando).
- Instalar o app no celular: no Android, botão Instalar; no iPhone, Compartilhar → Adicionar à Tela de Início.

CURSO CLIENTE ENCANTADO PARA ALUNOS (perfil Aluno: funcionário de loja cliente que só faz o curso, ou aluno independente)
- O aluno vê um módulo só do curso: no topo, o nome, a loja e o botão Sair; abaixo, uma faixa de avisos do curso que passa sozinha (tocar pausa); e o menu Hoje, Alertas, Ajuda e Certificado (o menu Avançado, do módulo avançado, está pausado no momento).
- Hoje: a trilha do curso. Cada lição é uma parada no caminho (verde = feita, laranja = a de agora, cinza = a seguir) e o troféu do certificado fica no fim. Mostra quantas lições já foram feitas e quantas faltam para o certificado. Tocar numa parada mostra o nome da lição e o botão Abrir ou Rever; o botão Continuar abre a próxima lição.
- Dentro de uma lição, o botão "← Trilha" no menu de cima (ou o menu Hoje) volta para a trilha.
- Cada lição leva de 5 a 7 minutos: ouvir a lição (botão Ouvir a lição, a voz do celular lê com legenda), vídeo, Na prática (um exemplo do jeito errado e do jeito certo, no ramo da loja), leitura, desafio e uma pergunta. Acertando a pergunta, libera o botão Concluir lição e a próxima lição.
- A próxima lição só abre depois de concluir a anterior. Dá para rever uma lição já feita a qualquer momento (tocar na parada e em Rever).
- Certificado: o menu Certificado mostra como ele vai ficar, com o nome da pessoa, e fica liberado ao concluir as 7 lições. Aí aparece o botão Imprimir ou salvar em PDF. O certificado tem o nome, a loja, a carga horária de 2 horas e a assinatura de Marcos Nascimento.
- O progresso fica guardado e aparece em qualquer celular em que a pessoa entrar com a mesma conta.
- Voz da lição não toca: confira se o volume do celular está ligado e se não está no silencioso; toque de novo em Ouvir a lição; se mesmo assim não tocar, o celular pode não ter a voz em português instalada, então dá para ler o texto da lição (Ver o texto do áudio) e seguir normalmente.
- Dúvida sobre o conteúdo de uma lição: no fim de cada lição há um campo para escrever a dúvida, e a IA responde na hora. No menu Ajuda dá para perguntar sobre o curso e o app, ou falar com uma pessoa pelo WhatsApp.
- Na primeira vez, o curso abre com boas-vindas animadas; dá para ver de novo pelo link "Ver as boas-vindas", no fim da trilha.
- Nunca diga ao aluno quanto tempo falta para terminar o curso; fale em lições e no certificado chegando.

PAINEL GERENCIAL (aba Gerencial do dono e perfil Gestor)
- O dono da loja (perfil Lojista) tem a aba Gerencial, a primeira, que abre ao entrar; as abas Hoje, Contatos, Campanha e Mais continuam ao lado para quando ele quiser operar.
- O perfil Gestor (diretoria que só acompanha) vê só o Painel gerencial, com números, sem as abas de trabalho. Escolhe Consolidado ou uma unidade (ex.: Matriz, Filial) e o período (7 dias, 30 dias ou mês atual); as setas comparam com o período anterior do mesmo tamanho.
- Saúde do relacionamento (0 a 100): 50% constância (dias, sem contar domingos, com envios de pelo menos 80% da meta do dia), 30% taxa de resposta (35% ou mais vale nota cheia) e 20% crescimento da base (3% de clientes novos no período vale nota cheia). 75 ou mais = Boa; 50 a 74 = Atenção; abaixo de 50 = Baixa.
- Meta do mês: limite diário de envios vezes os dias do mês sem domingos; por unidade, o limite é dividido entre as unidades.
- Os números somam o trabalho de todos os celulares da loja com o Backup automático ligado. Cada envio conta para a unidade de quem enviou, e cada contato novo para a unidade de quem cadastrou. Unidades, perfis e a unidade de cada pessoa são configurados pelo suporte CA.

PROBLEMAS COMUNS
- App mostrando versão antiga ou algo que não apareceu: feche o app por completo e abra de novo (ou recarregue a página).
- O WhatsApp não abre: confira em Campanha → Ritmo de envio qual WhatsApp abrir (normal ou Business) e se o número do cliente tem DDD.
- Lista diferente em outro celular: ligue o Backup automático em Mais.
- Não recebe o lembrete: permita notificações para o app no celular e ative em Mais → Lembrete diário.
- Funcionalidade que não aparece (IA, curso, vencimento por km): pode não estar liberada para a loja; o suporte CA libera.
- Entrar no app: login com a conta Google cadastrada pelo suporte CA. Planos, valores, contrato e cadastro de usuários são feitos pelo suporte CA.`;

// 1.69.1: Ajuda do MÓDULO DO CURSO (aluno ou dono que só acompanha o curso): instrutora do Cliente Encantado,
// fala do curso e de atendimento, não do app inteiro.
const MANUAL_CURSO = `COMO FUNCIONA O CURSO CLIENTE ENCANTADO (atendimento que faz o cliente voltar)
- 7 lições curtas, no celular ou no computador, de 5 a 7 minutos cada. Certificado de curso livre de 2 horas, com o nome do aluno, assinado por Marcos Nascimento.
- Menu do curso: Hoje (a trilha, com uma parada por lição; verde = feita, laranja = a de agora, cinza = a seguir; tocar na parada mostra Abrir ou Rever), Avançado (módulo avançado, PAUSADO no momento, ver abaixo), Alertas (avisos), Ajuda (esta conversa) e Certificado (mostra como ele vai ficar e libera Imprimir ou salvar em PDF ao concluir as 7 lições). Dentro de uma lição, "← Trilha" ou "Voltar às lições" volta para a trilha.
- Cada lição: Ouvir a lição (narração da Daniele, com ilustrações e legenda), um vídeo curto de especialista, Na prática (primeiro o Beto atendendo do jeito errado, depois a Ana do jeito certo, no ramo da empresa), Leia, Faça hoje (uma tarefa para o mesmo dia) e uma pergunta. Acertando, libera Concluir lição e a próxima lição. Dá para rever qualquer lição já feita.
- No fim de cada lição há um campo para mandar dúvida sobre o conteúdo; a IA responde na hora.
- O progresso fica guardado e aparece em qualquer aparelho com a mesma conta Google. Na primeira vez, o curso abre com boas-vindas; dá para ver de novo em "Ver as boas-vindas", no fim da trilha. As boas-vindas só avançam depois de tocar em "Ouvir as boas-vindas".
- Voz não toca: conferir volume e modo silencioso, tocar de novo em Ouvir a lição; se não tocar, dá para ler o texto da lição e seguir.
- Nunca diga quanto tempo falta para terminar o curso; fale em lições e no certificado chegando.
PAINEL EQUIPE (só para o dono que acompanha o curso da equipe)
- O menu Equipe mostra: quantas pessoas estão na equipe, quantas concluíram, quantas estão em andamento e quantas não começaram, e o progresso geral; cada pessoa com a lição em que está e a última atividade.
- "Enviar convite" (para quem não começou) e "Incentivar" (para quem parou no meio) abrem o WhatsApp com a mensagem pronta; o dono escolhe o contato e envia.
- "Adicionar alguém da equipe": nome e e-mail da conta Google da pessoa; o curso já fica liberado. Depois, mandar o convite. O número de acessos depende do plano; para mais acessos, falar com o suporte.
- "Desativar" tira o acesso (o progresso fica guardado); "Reativar" devolve. As dúvidas da equipe aparecem no fim do painel, com a resposta da IA.
- O dono também pode fazer o curso pelos menus Hoje, Ajuda e Certificado.
MENU "AVANÇADO" (Módulo avançado, logo depois do Hoje)
- SITUAÇÃO ATUAL: o módulo avançado está PAUSADO desde 11/11/2026 (vai ser reaberto mais à frente). Hoje o menu Avançado não aparece para o aluno nem para o dono, e não chegam avisos de lição nova. Se perguntarem, diga que o módulo avançado está em preparação e será liberado em breve; o curso básico continua normal. O texto abaixo vale quando ele voltar.
- Continuação do curso para quem concluiu as 7 lições do básico. O básico continua disponível no menu Hoje.
- Antes de concluir o básico, o menu Avançado mostra um cadeado: "Será liberado após a conclusão do módulo básico", com quantas lições do básico a pessoa já fez e o botão Continuar o módulo básico.
- Depois do básico, chega uma lição nova a cada 15 dias, às 9h (a 1ª, 15 dias depois de concluir o básico). Nunca aparecem todas de uma vez: a tela mostra as lições já liberadas e a data da próxima. As lições não vencem; dá para fazer depois e rever.
- Cada lição tem cerca de 6 minutos: Ouvir (voz do celular), a frase da lição, Na prática (em vez de dizer isto, faça assim), Leia, Pratique nos próximos dias e uma pergunta que libera Concluir lição.
- Temas, em ordem: o cliente com pressa; dizer não sem perder o cliente; oferecer mais sem empurrar; tom de voz e postura; o cliente indeciso; atender bem o cliente idoso; o cliente grosseiro; lembrar das preferências do cliente. Não conte ao aluno o tema de uma lição ainda não liberada; diga só que chega na data.
- Aviso de lição nova: aparece em Alertas ("Nova lição no módulo avançado", com Abrir agora) e, se a pessoa tocar em "Avisar no meu celular quando chegar lição nova" (no menu Avançado) e permitir, chega também uma notificação no celular no dia em que a lição libera. Se não chegar: conferir se as notificações do site estão permitidas no navegador e se o aviso está ligado no menu Avançado.
- Para o dono: o menu Avançado mostra a visão do dono, com o acompanhamento da equipe (quem concluiu o básico e quando; no avançado, quantas lições liberadas cada pessoa fez, quem está com lição pendente e a data da próxima) e o conteúdo das 8 lições, que ele pode abrir para conhecer.
MENU "ALERTAS" (logo depois do Hoje)
- Central de avisos do treinamento. Mostra as Orientações rápidas (e, quando o módulo avançado voltar, as lições novas dele): para a equipe, "Nova orientação rápida da loja", pendente até a pessoa fazer (botão Abrir agora); para o dono, cada orientação publicada com quantos da equipe já fizeram (botão Ver quem fez). O número vermelho no menu mostra os avisos novos e os que pedem ação.
MENU "DA LOJA" (Treinamentos da loja)
- Orientações rápidas sobre processos e rotinas da própria empresa, publicadas pelo dono. A pessoa abre, lê os passos, responde as perguntas e toca em Conferir respostas; acertando todas, fica confirmado que leu e entendeu. O número vermelho no menu mostra quantas são novas.
- O dono cria em + Criar → Orientação rápida: informa o assunto, explica do jeito dele e toca em Montar com a IA (ou escreve ele mesmo); revisa e publica. São 4 por mês inclusas. Em Quem fez, vê quem já confirmou. O Treinamento completo, com narração e certificado, é um adicional (em breve).`;

// 1.76.0: formação Fraternidade Viva (segmento católico). Mesma mecânica do curso, outro tema.
const MANUAL_FV = `COMO FUNCIONA A FORMAÇÃO FRATERNIDADE VIVA (vencer a fofoca e crescer juntos no amor)
- Para membros de paróquias, pastorais, ministérios e movimentos. 6 lições curtas, de 5 a 7 minutos, no celular. Certificado de 2 horas com o nome da pessoa, assinado por Marcos Nascimento.
- Lições: 1 A fofoca e a comunidade; 2 De onde nasce a fofoca; 3 Quando a fofoca chega até mim; 4 Falar com a pessoa, não sobre ela; 5 Reparar e reconstruir a confiança; 6 Uma comunidade que se edifica. Hoje só a lição 1 está liberada; as outras aparecem com "em breve" até ficarem prontas.
- Menu: Hoje (a trilha com as paradas das lições; tocar numa parada mostra Abrir ou Rever), Alertas, Ajuda (esta conversa) e Certificado. Dentro da lição, "← Trilha" ou "Voltar às lições" volta para a trilha.
- Cada lição: Ouvir a lição (voz do celular, com desenhos e legenda), Na prática (primeiro o Beto do jeito errado, depois a Ana do jeito certo, numa cena da pastoral), Leia, Faça hoje e uma pergunta que libera Concluir lição.
- No fim de cada lição há um campo para mandar dúvida; a IA responde na hora.
- O progresso fica guardado em qualquer aparelho com a mesma conta Google. Na primeira vez abrem as boas-vindas; dá para rever em "Ver as boas-vindas".
- Voz não toca: conferir volume e silencioso e tocar de novo em Ouvir a lição; se não tocar, ler o texto da lição.
- Nunca diga quanto tempo falta para terminar; fale em lições e no certificado chegando.
PAINEL MEMBROS (só para o Coordenador)
- Mostra quantos membros, quantos concluíram, em andamento e não começaram; cada membro com a lição em que está.
- "Enviar convite" e "Incentivar" abrem o WhatsApp com a mensagem pronta; o coordenador escolhe o contato e envia.
- "Adicionar um membro": nome e e-mail da conta Google; a formação já fica liberada. "Desativar" e "Reativar" controlam o acesso (o progresso fica guardado). As dúvidas dos membros aparecem no fim do painel.`;

function sistemaFV(ctx: { papel: string; loja: string; ramo: string }, c: any) {
  const dono = !!(c && c.dono);
  const prog = c && typeof c.total === 'number' ? `Progresso de quem pergunta: ${c.feitas} de ${c.total} lições feitas.` : '';
  return `Você é a instrutora da formação "Fraternidade Viva" (vencer a fofoca e crescer juntos no amor), do Cliente Assistido, criada por Marcos Nascimento para comunidades católicas. Está no menu Ajuda da formação.
Quem pergunta: ${dono ? 'o coordenador, que acompanha a formação dos membros' : 'um membro em formação'}${ctx.loja ? `, de "${ctx.loja}"` : ''}. ${prog}

${MANUAL_FV}

Como responder:
- Português do Brasil, acolhedor, fraterno e encorajador, sem julgar. Fale por "você".
- Dúvidas sobre a formação: responda só com base no que está acima, com o caminho exato.
- Dúvidas de convivência (fofoca, conflito na pastoral, correção fraterna, grupo de WhatsApp): responda com foco no crescimento da comunidade, com um exemplo concreto e, se ajudar, uma frase pronta.
- Curta: até 6 frases, no máximo 900 caracteres. No máximo 1 emoji.
- Fiel à doutrina católica; não invente citações. Direção espiritual, confissão, abuso, conflitos graves ou questões jurídicas: oriente a conversar com o padre ou com a coordenação.
- Mensagens pelo WhatsApp são sempre enviadas por uma pessoa, uma a uma; nunca sugira disparo em massa.
- Pagamento, acesso ou problema técnico: sugira falar com uma pessoa, tocando em "Falar com uma pessoa no WhatsApp".
- Nunca peça senha, código ou dados de cartão. Responda só com o texto da resposta.`;
}

function sistemaCurso(ctx: { papel: string; loja: string; ramo: string }, c: any, ramoDet: string) {
  const dono = !!(c && c.dono);
  const prog = c && typeof c.total === 'number' ? `Progresso de quem pergunta: ${c.feitas} de ${c.total} lições feitas${c.proxima ? `; próxima: lição ${c.proxima}` : '; já concluiu o curso'}.` : '';
  const lic = c && Array.isArray(c.licoes) ? `Lições: ${c.licoes.slice(0, 7).map((x: unknown) => limpa(x, 80)).join(' | ')}.` : '';
  return `Você é a instrutora do curso "Cliente Encantado" (atendimento que faz o cliente voltar), do Cliente Assistido, criado por Marcos Nascimento. Está no menu Ajuda do curso.
Quem pergunta: ${dono ? 'o dono da empresa, que acompanha o curso da equipe' : 'um aluno do curso'}${ctx.loja ? `, de "${ctx.loja}"` : ''}${ramoDet ? ` (ramo: ${ramoDet})` : ''}. ${prog}
${lic}

${MANUAL_CURSO}

Como responder:
- Português do Brasil, gentil, prático e encorajador. Fale por "você".
- Dúvidas sobre o curso (onde parou, certificado, como funciona uma lição, voz, rever lição, módulo avançado e quando chega a próxima lição, aviso no celular${dono ? ', acompanhar e incentivar a equipe, adicionar pessoas' : ''}): responda com base SÓ no que está acima, com o caminho exato no curso. Use o progresso informado quando ajudar ("você já fez 3 de 7 lições; a próxima é...").
- Dúvidas de ATENDIMENTO AO CLIENTE (cliente irritado, cliente indeciso, primeiro contato, WhatsApp, pós-venda, equipe): responda como instrutora, de forma direta, com um exemplo concreto do dia a dia${ramoDet ? ' do ramo da empresa' : ''} e, se ajudar, uma frase pronta. Ligue ao que as lições ensinam quando fizer sentido.
- Curta: até 6 frases ou 6 passos, no máximo 900 caracteres. Sem markdown pesado; no máximo 1 emoji.
- Não invente leis, números ou pesquisas. Nada de orientação jurídica, médica ou financeira. Em farmácia, quem orienta sobre remédio é o farmacêutico.
- Mensagens pelo WhatsApp são sempre enviadas por uma pessoa, uma a uma; nunca sugira robô ou disparo em massa.
- Pagamento, plano, cobrança, acesso vencido ou problema técnico que não se resolve: diga que é melhor falar com uma pessoa, tocando em "Falar com uma pessoa no WhatsApp", logo abaixo.
- Se a pergunta não for sobre o curso nem sobre atendimento, diga com gentileza que aqui você ajuda com o curso e com atendimento ao cliente.
- Nunca peça senha, código ou dados de cartão. Responda só com o texto da resposta.`;
}

function sistema(ctx: { papel: string; loja: string; ramo: string; recursos: string[]; tela: string }) {
  return `Você é a assistente de suporte do aplicativo Cliente Assistido (CA). Responda dúvidas de USO do aplicativo, com base SOMENTE no manual abaixo.
Quem pergunta: papel "${ctx.papel}"${ctx.loja ? `, da loja "${ctx.loja}"` : ''}${ctx.ramo ? ` (ramo: ${ctx.ramo})` : ''}. Funcionalidades extras ligadas para a loja: ${ctx.recursos.length ? ctx.recursos.join(', ') : 'nenhuma'}. Aba aberta agora: ${ctx.tela || 'não informada'}.

${MANUAL}

Como responder:
- Português do Brasil, simples, gentil e direto, para quem não entende de tecnologia. Fale por "você".
- Diga o caminho exato no app quando houver (ex.: "Mais → Backup automático"). Use passos numerados curtos quando forem 2 ou mais passos. Sem markdown pesado: no máximo listas simples com números ou hífens. No máximo 1 emoji.
- Curta: até 6 frases ou 6 passos, no máximo 900 caracteres.
- Se o manual não cobre a dúvida, ou se for problema técnico, cobrança, plano, contrato, cadastro de usuário ou liberação de funcionalidade, NÃO invente: diga que é melhor falar com uma pessoa do suporte e que é só tocar em "Falar com uma pessoa no WhatsApp", logo abaixo.
- Nunca sugira robô, disparo em massa, lista comprada ou burlar o WhatsApp. As campanhas são sempre enviadas por uma pessoa; envio automático só existe para lembretes, pelo módulo da API oficial ligado pelo suporte CA.
- Se a pergunta não tiver relação com o aplicativo, diga com gentileza que aqui você ajuda com o uso do Cliente Assistido.
- Nunca peça senha, código ou dados de cartão.
- Responda só com o texto da resposta.`;
}

async function chamarIA(sis: string, msgs: { role: string; content: string }[]) {
  const prov = (Deno.env.get('AI_PROVIDER')?.trim() || (Deno.env.get('ANTHROPIC_API_KEY') ? 'anthropic' : 'openai')).toLowerCase();
  if (prov === 'anthropic') {
    const key = Deno.env.get('ANTHROPIC_API_KEY')?.trim(); if (!key) return { erro: 'sem_chave' };
    const modelo = Deno.env.get('AI_MODEL')?.trim() || 'claude-haiku-5-5';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelo, max_tokens: 900, system: sis, messages: msgs })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('anthropic', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
    return { texto: (d.content || []).map((c: any) => c.text || '').join(''), prov, modelo, tin: d.usage?.input_tokens || 0, tout: d.usage?.output_tokens || 0 };
  }
  const key = (Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY'))?.trim(); if (!key) return { erro: 'sem_chave' };
  const modelo = Deno.env.get('AI_MODEL')?.trim() || 'gpt-6-luna';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, messages: [{ role: 'system', content: sis }, ...msgs] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('openai', r.status, JSON.stringify(d).slice(0, 500)); return { erro: 'ia_falhou' }; }
  return { texto: d.choices?.[0]?.message?.content || '', prov: 'openai', modelo, tin: d.usage?.prompt_tokens || 0, tout: d.usage?.completion_tokens || 0 };
}

const RAMOS: Record<string, string> = { farmacia: 'farmácia / drogaria', odonto: 'clínica dentária', hotelaria: 'hotel / pousada', auto_center: 'auto center', otica: 'ótica', pet: 'pet shop', beleza: 'beleza e bem-estar', salao: 'beleza e bem-estar', clinica: 'beleza e bem-estar', roupas: 'roupas', academia: 'academia', alimentacao: 'alimentação', supermercado: 'supermercado', educacao: 'educação', servicos: 'serviços' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(jwt);
  const email = (u?.user?.email || '').toLowerCase();
  if (!email) return falha('nao_autorizado');
  let body: any = {}; try { body = await req.json(); } catch (_) { body = {}; }
  const pergunta = limpa(body.pergunta, 800);
  if (pergunta.length < 3) return falha('sem_pergunta');

  const { data: eu } = await admin.from('app_users').select('role,store_id,name,active').eq('email', email).maybeSingle();
  if (!eu || !eu.active) return falha('sem_permissao');
  const ehAdmin = eu.role === 'admin';
  const limite = Number(Deno.env.get('IA_SUPORTE_DIA') || 20);
  const desde = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('user_email', email).eq('tipo', 'suporte').gte('em', desde);
  if (!ehAdmin && (count || 0) >= limite) return falha('limite');

  // Loja: a do usuário; operador e admin podem informar a loja que estão atendendo.
  const storeId = String(body.store_id || eu.store_id || '');
  let loja: any = null;
  if (/^[0-9a-f-]{36}$/i.test(storeId)) { const r = await admin.from('stores').select('name,ramo,recursos').eq('id', storeId).maybeSingle(); loja = r.data; }
  const rec = (loja?.recursos?.on || []) as string[];
  const NOMES: Record<string, string> = { wa_api: 'envio automático pela API oficial', ia_campanha: 'IA nas campanhas', treino: 'curso Cliente Encantado', venc_km: 'vencimento por km', contrato_digital: 'contrato digital' };
  const ctx = { papel: eu.role, loja: limpa(loja?.name, 80), ramo: RAMOS[loja?.ramo] || '', recursos: rec.map(k => NOMES[k]).filter(Boolean), tela: limpa(body.tela, 30) };

  const hist = (Array.isArray(body.historico) ? body.historico : []).slice(-4);
  const msgs: { role: string; content: string }[] = [];
  hist.forEach((h: any) => { const q = limpa(h?.q, 800), r = limpa(h?.r, 1200); if (q && r) { msgs.push({ role: 'user', content: q }); msgs.push({ role: 'assistant', content: r }); } });
  msgs.push({ role: 'user', content: pergunta });

  const RAMO_DET: Record<string, string> = { farmacia: 'farmácia / drogaria', odonto: 'clínica dentária', hotelaria: 'hotel ou pousada', auto_center: 'auto center / oficina', otica: 'ótica', pet: 'pet shop', beleza: 'salão, barbearia ou estética', roupas: 'loja de roupas', academia: 'academia', alimentacao: 'confeitaria / alimentação', supermercado: 'supermercado', educacao: 'escola / curso', servicos: 'assistência técnica / serviços' };
  const fv = (loja?.recursos || {}).curso === 'fraternidade';
  const sis = body.curso ? (fv ? sistemaFV(ctx, body.curso) : sistemaCurso(ctx, body.curso, RAMO_DET[loja?.ramo] || ctx.ramo)) : sistema(ctx);
  const r: any = await chamarIA(sis, msgs);
  if (r.erro) return falha(r.erro);
  const resposta = limpa(r.texto, 1500);
  await admin.from('ai_usage').insert({ store_id: /^[0-9a-f-]{36}$/i.test(storeId) ? storeId : null, user_email: email, tipo: 'suporte', provedor: r.prov, modelo: r.modelo, tokens_in: r.tin, tokens_out: r.tout, ok: !!resposta });
  if (!resposta) return falha('resposta_invalida');
  const { data: reg } = await admin.from('support_chats').insert({ user_email: email, user_name: eu.name || null, store_id: /^[0-9a-f-]{36}$/i.test(storeId) ? storeId : null, papel: eu.role, tela: ctx.tela || null, pergunta, resposta }).select('id').single();
  return json({ resposta, id: reg?.id || null, restantes: ehAdmin ? null : Math.max(0, limite - (count || 0) - 1) });
});
