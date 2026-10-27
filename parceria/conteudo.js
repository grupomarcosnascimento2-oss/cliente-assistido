/* Cliente Assistido – Apresentação para parceiros (/parceria), versão 1.33.0.
   Cada lição: telas do sistema (prints com dados fictícios em telas/), falas (o que a voz lê, trecho a trecho,
   e qual tela aparece em cada trecho), texto para ler, frase pronta para o lojista e ganhos.
   Quando o Marcos gravar os áudios, coloque o arquivo em audio: 'audio/licao1.mp3' (a legenda segue o áudio). */
'use strict';
window.CA_PARC = {
  contato: { whatsapp: '5561999999340', nome: 'Marcos Nascimento' }, // whatsapp só com números, com DDI e DDD (ex.: 5562999999999)
  licoes: [
    {
      n: 1, titulo: 'O propósito do CA', resumo: 'O que é o Cliente Assistido e por que ele existe',
      telas: [
        { img: 'l1_inicio', leg: 'Tela Hoje: ao abrir, a loja já vê o que fazer no dia' },
        { img: 'l6_contatos', leg: 'Contatos: a loja traz os clientes que já tem' }
      ],
      falas: [
        { tela: 0, t: 'Bem-vindo à apresentação do Cliente Assistido, o CA. Em poucos minutos, você vai entender o que o sistema faz e por que ele ajuda as lojas a venderem mais.' },
        { tela: 0, t: 'Toda loja tem uma lista de clientes que já compraram e confiam nela. O problema é que, na correria do dia a dia, esses clientes são esquecidos. E um cliente esquecido acaba comprando no concorrente.' },
        { tela: 0, t: 'O CA resolve isso. Ele organiza os contatos da loja e mostra, todos os dias, quem precisa receber uma mensagem: um parabéns, um lembrete de serviço, um convite para voltar.' },
        { tela: 0, t: 'O envio é sempre feito por uma pessoa da loja, pelo WhatsApp, com um toque. Não é robô nem disparo em massa. Por isso a mensagem chega com cara de conversa, e o número da loja fica protegido.' },
        { tela: 1, t: 'Para começar, a loja só traz os contatos que já tem: da agenda do celular, de uma planilha ou do Google Contatos.' },
        { tela: 0, t: 'O lema do CA resume tudo: quem é lembrado, vende mais.' }
      ],
      ler: [
        ['Propósito', 'Ajudar a pequena loja a manter vivo o relacionamento com quem já é cliente, pelo canal que todo mundo usa: o WhatsApp.'],
        ['Objetivo', 'Fazer o cliente voltar e comprar de novo, lembrando dele na hora certa, com uma mensagem pessoal.'],
        ['Como funciona', 'O CA organiza os contatos e monta a lista do dia. Uma pessoa da loja toca no cliente, o WhatsApp abre com a mensagem pronta e ela envia.'],
        ['O que o CA não é', 'Não é robô, não é disparo em massa e não é sistema de gestão. Ele complementa o sistema que a loja já usa e não pede controle novo.']
      ],
      frase: 'Sua loja já tem clientes. O CA ajuda você a não esquecer de nenhum deles.',
      ganhos: ['Clientes lembrados, não esquecidos', 'Mensagem com cara de conversa, feita por gente', 'Começa com os contatos que a loja já tem']
    },
    {
      n: 2, titulo: 'Hoje: a rotina do dia', resumo: 'A tela que diz quem chamar, em rodadas de 5',
      telas: [
        { img: 'l2_enviar', leg: 'Enviar hoje: rodadas de 5 clientes, mensagem pronta' },
        { img: 'l2_resp', leg: 'Quem respondeu: um toque em cada cliente' },
        { img: 'l2_venda', leg: 'Clientes interessados: o dono é avisado na hora' }
      ],
      falas: [
        { tela: 0, t: 'A tela Hoje é o coração do CA. Ao abrir o aplicativo, a pessoa da loja já vê o que fazer no dia, sem pensar e sem planilha.' },
        { tela: 0, t: 'Os clientes aparecem em rodadas de cinco. Um toque em Abrir e Enviar abre o WhatsApp com a mensagem pronta, já com o nome do cliente. É só conferir e enviar. Entre um envio e outro, o CA pede uma espera de vinte a trinta segundos, e depois de cada rodada faz uma pausa de três a cinco minutos. Os tempos mudam sempre, para o ritmo parecer natural e proteger o número da loja.' },
        { tela: 0, t: 'Existe um limite de mensagens por dia, para manter um ritmo natural e proteger o número da loja. Com poucos minutos por dia, a loja conversa com dezenas de clientes.' },
        { tela: 1, t: 'Depois, em Quem respondeu, a loja marca com um toque quem respondeu. Assim o CA separa os clientes mais próximos dos que andam sumidos.' },
        { tela: 2, t: 'E quando um cliente responde querendo comprar, o atendente registra o interesse e o dono recebe um aviso no celular. Esses clientes ficam em destaque no topo da tela, porque quem demora perde a venda.' }
      ],
      ler: [
        ['Lista do dia', 'O CA monta sozinho a lista de quem chamar hoje, de acordo com a campanha ativa, sem repetir quem já recebeu.'],
        ['Rodadas de 5', 'A lista aparece de 5 em 5, com uma barra de progresso. Entre um envio e outro, uma espera sorteada de 20 a 30 segundos; entre uma rodada e outra, uma pausa sorteada de 3 a 5 minutos. O ritmo muda sempre e protege o número da loja. Fica leve e dá para fazer nos intervalos do atendimento.'],
        ['Limite diário', 'O ritmo é controlado (padrão de 50 mensagens por dia), para o WhatsApp da loja continuar saudável.'],
        ['Respostas e vendas', 'Quem respondeu é marcado com um toque. Quem quer comprar vira um aviso para o dono e fica no topo da tela até ser atendido.']
      ],
      frase: 'Com poucos minutos por dia, sua loja conversa com dezenas de clientes, sem esquecer ninguém.',
      ganhos: ['Rotina simples, que não depende de memória', 'Constância: todo dia alguém é lembrado', 'Nenhum interesse de compra fica esquecido']
    },
    {
      n: 3, titulo: 'Aniversariantes, pós-venda e vencimentos', resumo: 'As datas que trazem o cliente de volta',
      telas: [
        { img: 'l3_niver', leg: 'Aniversariantes do dia e dos próximos 7 dias' },
        { img: 'l3_pos', leg: 'Pós-venda: agradecer e perguntar como ficou' },
        { img: 'l3_venc', leg: 'Vencimentos: troca de óleo e outros serviços' }
      ],
      falas: [
        { tela: 0, t: 'Algumas datas são ótimas para lembrar o cliente, e o CA cuida delas sozinho.' },
        { tela: 0, t: 'Aniversariantes: todo dia, a tela Hoje mostra quem faz aniversário, com a mensagem de parabéns pronta, com o nome da loja. Mostra também os próximos sete dias. Um parabéns lembrado cria carinho pela loja.' },
        { tela: 1, t: 'Pós-venda: quem comprou recebe um agradecimento no dia seguinte e, uma semana depois, a pergunta: como ficou? É uma atenção que o cliente percebe, e que traz indicações.' },
        { tela: 2, t: 'Vencimentos: em ramos como o de auto center, o CA avisa quando a troca de óleo, a revisão ou outro serviço está vencendo, com a mensagem pronta e o modelo do carro. É o cliente voltando na hora certa, em vez de ir para outra oficina.' },
        { tela: 2, t: 'A data que vem do sistema da loja sempre manda. O CA não pede controle novo: ele usa o que a loja já tem para lembrar o cliente.' }
      ],
      ler: [
        ['Aniversário', 'Parabéns com o nome do cliente e da loja, no dia certo. O CA também tem uma campanha para pedir a data de aniversário de quem ainda não informou.'],
        ['Pós-venda', 'Agradecimento no dia seguinte à compra e um "como ficou?" depois de 7 dias.'],
        ['Vencimentos', 'Para cada serviço, a loja define o prazo e com quantos dias de antecedência avisar. O CA mostra quem está vencendo, com a mensagem pronta.'],
        ['Sem trabalho extra', 'Essas mensagens entram na tela Hoje junto com as demais. O cliente recebe uma de cada vez, sem excesso.']
      ],
      frase: 'Aniversário, pós-venda e vencimento são motivos naturais para chamar o cliente, e o CA não deixa passar nenhum.',
      ganhos: ['Cliente que se sente lembrado e bem tratado', 'Serviço recorrente que volta para a loja', 'Indicações vindas de um pós-venda atencioso']
    },
    {
      n: 4, titulo: 'Campanhas', resumo: 'Modelos prontos, público certo e 5 versões de mensagem',
      telas: [
        { img: 'l4_modelos', leg: 'Modelos prontos de campanha, inclusive do ramo da loja' },
        { img: 'l4_dados', leg: 'Dados da campanha: objetivo, período e público' },
        { img: 'l4_msgs', leg: 'Até 5 versões da mensagem, alternadas entre os clientes' },
        { img: 'l4_hist', leg: 'Histórico: enviados e taxa de resposta de cada campanha' }
      ],
      falas: [
        { tela: 0, t: 'Além das datas, a loja pode fazer campanhas: uma promoção, uma data comercial, um convite para quem anda sumido.' },
        { tela: 0, t: 'O CA já vem com modelos prontos de campanha, inclusive do ramo da loja, como o da troca de óleo. Em poucos toques a campanha está criada, com público, período e mensagens.' },
        { tela: 1, t: 'A loja escolhe o público com filtros simples: novos clientes, frequentes, sumidos, quem comprou recentemente ou os aniversariantes do mês.' },
        { tela: 2, t: 'Cada campanha tem até cinco versões da mensagem, que se alternam entre os clientes. Assim os textos não ficam repetidos, e a loja descobre qual versão dá mais resposta.' },
        { tela: 3, t: 'No histórico, cada campanha mostra quantos receberam, quantos responderam e a taxa de resposta. A loja aprende com os números e melhora a próxima campanha.' }
      ],
      ler: [
        ['Modelos prontos', 'Mais de 20 modelos de relacionamento, datas comerciais e do ramo da loja, cada um com 5 versões de mensagem.'],
        ['Público', 'Filtros por grupo de clientes (novos, frequentes, sumidos), situação, compra recente, tempo sem contato e aniversário.'],
        ['Mensagens pessoais', 'O nome do cliente, o nome da loja, o Instagram e o modelo do carro entram sozinhos na mensagem.'],
        ['Resultado medido', 'Enviados, respostas e taxa de resposta por campanha e por versão de mensagem.']
      ],
      frase: 'Campanha pronta em poucos toques, com mensagens que parecem conversa e resultado medido.',
      ganhos: ['Mais vendas em datas comerciais', 'Clientes sumidos convidados a voltar', 'A loja aprende qual mensagem funciona']
    },
    {
      n: 5, titulo: 'A visão do dono', resumo: 'Painel de resultados, relatório da semana e equipe',
      telas: [
        { img: 'l5_dash', leg: 'Painel de resultados: destaques, envios e funil' },
        { img: 'l5_rel', leg: 'Relatório da semana, com texto pronto para mandar' },
        { img: 'l5_curso', leg: 'Curso Excelência no Atendimento ao Cliente para a equipe' }
      ],
      falas: [
        { tela: 0, t: 'O dono da loja precisa enxergar resultado. Na aba Mais, o painel mostra a semana: mensagens enviadas, taxa de resposta, interesses de compra e contatos novos, sempre comparando com a semana anterior.' },
        { tela: 0, t: 'O gráfico mostra os envios dos últimos trinta dias, com a linha do limite diário. E o funil mostra o caminho: quantos receberam, quantos responderam e quantos demonstraram interesse em comprar.' },
        { tela: 1, t: 'O relatório da semana traz esses números num texto pronto, que o dono pode copiar e mandar para a equipe ou para o sócio.' },
        { tela: 2, t: 'O dono também cadastra a equipe e acompanha o trabalho de cada um. E pode liberar para a equipe o Curso Excelência no Atendimento ao Cliente, com lições curtas e certificado.' },
        { tela: 0, t: 'Tudo isso sem digitação extra: os números saem do próprio uso do dia a dia.' }
      ],
      ler: [
        ['Painel de resultados', 'Destaques dos últimos 7 dias comparados com os 7 anteriores, gráfico de envios em 30 dias e funil do relacionamento.'],
        ['Relatório da semana', 'Os números da semana num texto pronto para copiar e enviar.'],
        ['Equipe', 'O dono cadastra quem usa o app com ele e acompanha as atividades.'],
        ['Curso da equipe', 'Curso Excelência no Atendimento ao Cliente, com 7 lições curtas, áudio e certificado, liberado como adicional.']
      ],
      frase: 'Você vê, em números, o que o relacionamento com os clientes está trazendo para a sua loja.',
      ganhos: ['Decisão com base em números, não em achismo', 'Equipe acompanhada e mais bem preparada', 'Resultado fácil de mostrar e comemorar']
    },
    {
      n: 6, titulo: 'Ganhos para a loja e como começar', resumo: 'Planos, implantação e o perfil da loja ideal',
      telas: [
        { img: 'l5_dash', leg: 'Resultado acompanhado de perto' },
        { img: 'l6_contatos', leg: 'Implantação: contatos importados com ajuda da equipe CA' },
        { img: 'l1_inicio', leg: 'Pronto: a loja abre o Hoje e começa' }
      ],
      falas: [
        { tela: 0, t: 'Resumindo os ganhos para a loja: mais clientes voltando, mais vendas vindas de quem já conhece a loja, e uma rotina simples, que não depende de memória.' },
        { tela: 0, t: 'Tudo dentro das regras: o envio é manual, feito por uma pessoa, respeitando os termos do WhatsApp e a Lei Geral de Proteção de Dados. E quem pede para não receber mais é respeitado.' },
        { tela: 1, t: 'São dois jeitos de usar. No CA Essencial, a própria loja envia as mensagens. No CA Premium, a equipe do CA opera pela loja, sempre com envio manual e com a aprovação do dono em cada campanha.' },
        { tela: 1, t: 'A implantação é acompanhada: a equipe do CA ajuda a trazer os contatos, configura a loja e treina quem vai usar.' },
        { tela: 2, t: 'A loja ideal tem clientes que voltam, já conversa pelo WhatsApp e não tem tempo de lembrar de todos. Começamos pelos auto centers, mas o CA serve para qualquer loja com clientes recorrentes.' },
        { tela: 2, t: 'Gostou? Fale com a gente para conhecer os valores, tirar dúvidas e agendar uma apresentação para a loja que você vai indicar.' }
      ],
      ler: [
        ['CA Essencial', 'A loja usa o app e envia as mensagens ela mesma, com tudo pronto.'],
        ['CA Premium', 'A equipe do CA prepara e envia as campanhas pela loja, sempre manualmente, e o dono aprova cada campanha antes do envio.'],
        ['Implantação', 'Ajuda para importar os contatos, configuração da loja e treinamento de quem vai usar. A loja entra com plano definido.'],
        ['Loja ideal', 'Clientes recorrentes, atendimento pelo WhatsApp e pouco tempo para relacionamento. Ex.: auto centers, oficinas, lojas de bairro, salões, pet shops.']
      ],
      frase: 'Mais clientes voltando, com uma rotina de poucos minutos por dia e sem robô.',
      ganhos: ['Mais vendas para quem já é cliente', 'Uso seguro, dentro das regras do WhatsApp e da LGPD', 'Implantação acompanhada pela equipe CA']
    }
  ]
};
