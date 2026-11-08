/* Cliente Assistido – Curso: "Na prática" (1.38.0). Diálogo demonstrativo entre duas pessoas, com duas vozes,
   mostrando COMO fazer o que a lição ensina. Um diálogo por lição (7 lições). Ramos: geral (todas), auto_center, otica e pet sendo completados em sequência (25/10/2026).
   REGRA (Marcos, 25/10/2026): o diálogo é SEMPRE vinculado à lição — CA_DIALOGOS[n] aparece só na lição n e demonstra na prática o tema dela
   (lição 1: o cliente que volta; 2: o primeiro minuto; 3: chamar pelo nome; 4: ouvir antes de oferecer; 5: quando algo dá errado; 6: WhatsApp; 7: depois da compra).
   Cada diálogo tem variantes por ramo da loja (o ramo vem do cadastro da loja, mesma chave de RAMO_TXT em auth.js: auto_center, otica...); sem variante para o ramo, usa a 'geral'. Ramos preparados: auto_center, otica (1.38.5), pet (1.38.6) e beleza (1.46.5, salão/barbearia; salao/clinica antigos também usam beleza). Ao criar o diálogo das lições 2 a 7, escrever também as variantes auto_center, otica e pet.
   Fala: { q: 'a' (atendente) | 'c' (cliente), t: texto, cena: emoji que aparece no balcão }.
   1.47.0: opcional d.ruim = { pessoa {nome, papel}, variantes {ramo: {rotulo, falas}}, erros [] }: exemplo de COMO NÃO FAZER, tocado antes do bom,
   com o mesmo cliente e outro atendente (Beto, fala q: 'b'); depois o narrador lê os erros e faz a ponte para o jeito certo. */
'use strict';
window.CA_DIALOGOS = {
  1: {
    titulo: 'O cliente que volta com um problema',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Comprei um sapato aqui no mês passado e ele está apertando um pouco.', cena: '👞' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por confiar na gente. Posso ver o sapato? Vamos resolver isso agora.', cena: '🤝' },
          { q: 'c', t: 'Pode, está aqui. Eu fiquei com receio de dar trabalho.', cena: '📦' },
          { q: 'a', t: 'Trabalho nenhum! Temos o mesmo modelo meio número maior. Quer experimentar?', cena: '👟' },
          { q: 'c', t: 'Quero sim.', cena: '🙂' },
          { q: 'a', t: 'E então, seu José, como ficou?', cena: '👀' },
          { q: 'c', t: 'Agora ficou perfeito! E eu nem precisei insistir.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, é só chamar a gente no WhatsApp. Volte sempre!', cena: '📱' },
          { q: 'c', t: 'Pode deixar, eu volto sim. E vou indicar vocês para a minha esposa.', cena: '💬' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Comprei estes óculos aqui na semana passada e eles estão escorregando no nariz e apertando atrás da orelha.', cena: '👓' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada pela confiança. Deixa eu ver os óculos. Isso a gente ajusta agora mesmo.', cena: '🤝' },
          { q: 'c', t: 'Que bom. Eu fiquei com receio de ter que deixar aqui e voltar outro dia.', cena: '⏱️' },
          { q: 'a', t: 'Imagina! É rapidinho. Vou ajustar as hastes e as plaquetas do nariz, e aproveito para limpar as lentes.', cena: '🛠️' },
          { q: 'c', t: 'Pode fazer, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Pronto, seu José. Coloque e me diga: como ficou?', cena: '👀' },
          { q: 'c', t: 'Agora ficou firme e não aperta mais. Que diferença!', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Sempre que precisar de um ajuste, é só passar aqui ou me chamar no WhatsApp. E perto da época do seu próximo exame de vista, a gente te avisa, combinado?', cena: '📱' },
          { q: 'c', t: 'Combinado. Vou indicar vocês para a minha filha, que também usa óculos.', cena: '💬' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Trouxe meu cachorro para banho e tosa aqui ontem, mas a tosa ficou desigual atrás das orelhas.', cena: '🐶' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome? E o nome dele?', cena: '😊' },
          { q: 'c', t: 'José. E ele é o Thor.', cena: '🐕' },
          { q: 'a', t: 'Seu José, obrigada pela confiança. Oi, Thor! Deixa eu ver. A gente acerta isso agora mesmo, sem custo nenhum.', cena: '🤝' },
          { q: 'c', t: 'Que bom. Eu fiquei com receio de ter que marcar outro horário.', cena: '⏱️' },
          { q: 'a', t: 'Imagina! O tosador já vai acertar. Enquanto isso, vou deixar uma água fresquinha para o Thor.', cena: '✂️' },
          { q: 'c', t: 'Obrigado, ele vai gostar.', cena: '💧' },
          { q: 'a', t: 'Pronto, seu José. Dá uma olhada: como ficou?', cena: '👀' },
          { q: 'c', t: 'Agora ficou certinho! E o Thor está todo feliz.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, é só me chamar no WhatsApp. E quando estiver chegando a hora do próximo banho do Thor, a gente te avisa, combinado?', cena: '📱' },
          { q: 'c', t: 'Combinado. Vou indicar vocês para a minha vizinha, que tem dois gatos.', cena: '💬' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Fiz a revisão do meu carro aqui na semana passada e apareceu um barulho na frente.', cena: '🚗' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada pela confiança. Vou pedir para o mecânico olhar agora mesmo.', cena: '🔧' },
          { q: 'c', t: 'Ah, que bom. Eu estava com receio de ter que esperar o dia todo.', cena: '⏱️' },
          { q: 'a', t: 'Imagina! Enquanto isso, aceita um café?', cena: '☕' },
          { q: 'c', t: 'Aceito, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, era só um parafuso da proteção que soltou. Já está apertado, sem custo nenhum.', cena: '🔩' },
          { q: 'c', t: 'Nossa, que atendimento! Assim dá gosto voltar.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, me chama no WhatsApp. E na hora da troca de óleo, a gente te avisa, combinado?', cena: '📱' },
          { q: 'c', t: 'Combinado. Vou indicar vocês para o meu irmão também.', cena: '💬' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Cortei o cabelo aqui ontem, mas em casa vi que a nuca ficou meio torta.', cena: '💇' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada pela confiança. Vamos acertar isso agora mesmo, sem custo nenhum.', cena: '🤝' },
          { q: 'c', t: 'Que bom. Eu fiquei com receio de dar trabalho.', cena: '😅' },
          { q: 'a', t: 'Trabalho nenhum! O cabeleireiro já vai te atender. Aceita um café enquanto isso?', cena: '☕' },
          { q: 'c', t: 'Aceito, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Pronto, seu José. Dá uma olhada no espelho: como ficou?', cena: '🪞' },
          { q: 'c', t: 'Agora ficou certinho! E nem precisei insistir.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, me chama no WhatsApp. E quando estiver chegando a hora do próximo corte, a gente te avisa, combinado?', cena: '📱' },
          { q: 'c', t: 'Combinado. Vou indicar vocês para o meu filho também.', cena: '💬' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Paguei a mensalidade aqui semana passada, mas no extrato apareceu cobrado duas vezes.', cena: '💳' },
          { q: 'a', t: 'Que bom que o senhor veio falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu ver aqui no sistema agora mesmo.', cena: '💻' },
          { q: 'c', t: 'Eu fiquei com receio de dar trabalho.', cena: '😅' },
          { q: 'a', t: 'Trabalho nenhum! Realmente passou duas vezes. Já pedi o estorno e te mando o comprovante pelo WhatsApp ainda hoje.', cena: '🧾' },
          { q: 'c', t: 'Nossa, já resolveu?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo transtorno. Aproveitando: está gostando dos treinos?', cena: '🏋️' },
          { q: 'c', t: 'Estou gostando muito! E nem precisei insistir para resolver.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, me chama no WhatsApp. Bom treino, seu José!', cena: '📱' },
          { q: 'c', t: 'Obrigado. Vou chamar meu vizinho para treinar aqui também.', cena: '💬' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Comprei este queijo aqui ontem e, quando abri em casa, ele estava estragado.', cena: '🧀' },
          { q: 'a', t: 'Que bom que o senhor voltou para avisar a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu ver a nota e o produto, rapidinho.', cena: '🧾' },
          { q: 'c', t: 'Fiquei até sem graça de voltar por causa de um queijo.', cena: '😅' },
          { q: 'a', t: 'Imagina! O senhor fez muito bem. Já peguei um novo, conferi a validade com o senhor, e está trocado.', cena: '✅' },
          { q: 'c', t: 'Nossa, foi rápido!', cena: '😮' },
          { q: 'a', t: 'E desculpe pelo transtorno. Vou avisar o setor de frios para conferir o lote todo.', cena: '🙏' },
          { q: 'c', t: 'Assim dá gosto comprar aqui.', cena: '😃' },
          { q: 'a', t: 'Qualquer coisa, me chama. Bom dia, seu José, e boas compras!', cena: '🛒' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Encomendei uma torta aqui ontem e ela veio com o recheio errado. Era de morango e veio de coco.', cena: '🍰' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu ver o seu pedido aqui agora mesmo.', cena: '📋' },
          { q: 'c', t: 'Fiquei até sem graça de voltar.', cena: '😅' },
          { q: 'a', t: 'Imagina! O erro foi nosso. Realmente estava anotado morango. Vou fazer uma nova para o senhor buscar hoje à tarde, sem custo.', cena: '✅' },
          { q: 'c', t: 'Nossa, já resolveu?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo transtorno. Às quatro horas ela está pronta, eu te aviso pelo WhatsApp.', cena: '🙏' },
          { q: 'c', t: 'Assim dá gosto encomendar aqui.', cena: '😃' },
          { q: 'a', t: 'Qualquer coisa, me chama. Até mais tarde, seu José!', cena: '📱' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Paguei o material do curso do meu neto, mas a apostila não chegou até hoje.', cena: '📚' },
          { q: 'a', t: 'Que bom que o senhor veio falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu ver o pedido aqui agora mesmo.', cena: '💻' },
          { q: 'c', t: 'Fiquei com receio de estar incomodando.', cena: '😅' },
          { q: 'a', t: 'Incômodo nenhum! A apostila chegou ontem e ficou separada aqui. Já entrego para o senhor agora.', cena: '📦' },
          { q: 'c', t: 'Nossa, já resolveu?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo atraso no aviso. Aproveitando: seu neto está gostando das aulas?', cena: '🙏' },
          { q: 'c', t: 'Está adorando! E eu nem precisei insistir.', cena: '😃' },
          { q: 'a', t: 'Fico muito feliz! Qualquer coisa, me chama no WhatsApp. Um ótimo dia, seu José!', cena: '📱' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Troquei a tela do meu celular aqui semana passada e o touch está falhando num canto.', cena: '📱' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu dar uma olhada agora mesmo.', cena: '🔍' },
          { q: 'c', t: 'Fiquei com receio de dar trabalho.', cena: '😅' },
          { q: 'a', t: 'Trabalho nenhum! O serviço tem garantia. O técnico já vai ajustar, leva uns vinte minutinhos.', cena: '🛠️' },
          { q: 'c', t: 'Nossa, já vão resolver?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo transtorno. Testei com o senhor: agora está funcionando na tela toda.', cena: '✅' },
          { q: 'c', t: 'Assim dá gosto voltar aqui.', cena: '😃' },
          { q: 'a', t: 'Qualquer coisa, me chama no WhatsApp. Um ótimo dia, seu José!', cena: '📱' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Comprei esta camisa aqui semana passada e, na primeira lavagem, a costura abriu.', cena: '👔' },
          { q: 'a', t: 'Que bom que o senhor voltou para falar com a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por avisar. Deixa eu ver a camisa e a nota, rapidinho.', cena: '🧾' },
          { q: 'c', t: 'Fiquei até sem graça de voltar.', cena: '😅' },
          { q: 'a', t: 'Imagina! O senhor fez muito bem. Tem outra igual no seu tamanho. Já separei e conferi a costura com o senhor.', cena: '✅' },
          { q: 'c', t: 'Nossa, já resolveu?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo transtorno. Vou avisar o fornecedor sobre esse lote.', cena: '🙏' },
          { q: 'c', t: 'Assim dá gosto comprar aqui.', cena: '😃' },
          { q: 'a', t: 'Qualquer coisa, me chama no WhatsApp. Um ótimo dia, seu José!', cena: '📱' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária',
        falas: [
          { q: 'a', t: 'Bom dia! Seja bem-vindo à clínica. Em que posso te ajudar?', cena: '👋' },
          { q: 'c', t: 'Bom dia. Fiz uma restauração aqui semana passada e ela está me incomodando quando eu mastigo.', cena: '🦷' },
          { q: 'a', t: 'Que bom que o senhor voltou para avisar a gente! Qual é o seu nome?', cena: '😊' },
          { q: 'c', t: 'José.', cena: '🙂' },
          { q: 'a', t: 'Seu José, obrigada por falar com a gente. Deixa eu ver a sua ficha, rapidinho.', cena: '🗂️' },
          { q: 'c', t: 'Fiquei até sem graça de voltar.', cena: '😅' },
          { q: 'a', t: 'Imagina! O senhor fez muito bem. Já falei com a doutora: ela consegue ver o senhor daqui a vinte minutos, hoje mesmo.', cena: '✅' },
          { q: 'c', t: 'Nossa, já hoje?', cena: '😮' },
          { q: 'a', t: 'Já sim. E desculpe pelo incômodo. Enquanto isso, quer uma água? Pode sentar ali, fique à vontade.', cena: '🙏' },
          { q: 'c', t: 'Assim dá gosto ser atendido.', cena: '😃' },
          { q: 'a', t: 'Depois do ajuste, qualquer coisa, me chama no WhatsApp. Um ótimo dia, seu José!', cena: '📱' }
        ]
      }
    },
    repare: [
      'Recebeu com um bom dia e um sorriso, logo que o cliente chegou.',
      'Agradeceu o cliente por ter voltado, em vez de ficar na defensiva.',
      'Perguntou o nome e passou a chamar o cliente por ele.',
      'Resolveu na hora, sem discutir e sem fazer o cliente se sentir um incômodo.',
      'Conferiu se ficou bom e deixou a porta aberta: "qualquer coisa, me chama".'
    ],
    // 1.47.0: exemplo NEGATIVO antes do positivo (contraste). Mesmo cliente, outro atendente (Beto). Desde a 1.48.0 nas 7 lições e nos 5 ramos.
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados',
          falas: [
            { q: 'c', t: 'Bom dia. Comprei um sapato aqui no mês passado e ele está apertando um pouco.', cena: '👞' },
            { q: 'b', t: 'Hum... comprou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Comprei sim. A nota está aqui.', cena: '🧾' },
            { q: 'b', t: 'Ih, mas já usou, né? Aí complica. Isso é com o gerente, e ele só chega à tarde.', cena: '🤷' },
            { q: 'c', t: 'Mas eu só queria trocar por um número maior...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta depois.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu não volto mais.', cena: '😠' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center',
          falas: [
            { q: 'c', t: 'Bom dia. Fiz a revisão do meu carro aqui na semana passada e apareceu um barulho na frente.', cena: '🚗' },
            { q: 'b', t: 'Hum... revisão aqui?', cena: '📱' },
            { q: 'c', t: 'Sim, na semana passada. Tenho a nota.', cena: '🧾' },
            { q: 'b', t: 'Barulho pode ser qualquer coisa, viu? Não é da revisão, não. Tem que deixar o carro e o mecânico vê semana que vem.', cena: '🤷' },
            { q: 'c', t: 'Semana que vem? Eu uso o carro para trabalhar...', cena: '😕' },
            { q: 'b', t: 'Aí não tem jeito. Agenda aí e volta depois.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu procuro outra oficina.', cena: '😠' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica',
          falas: [
            { q: 'c', t: 'Bom dia. Comprei estes óculos aqui na semana passada e eles estão escorregando no nariz.', cena: '👓' },
            { q: 'b', t: 'Hum... comprou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Comprei sim. A nota está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é normal, depois acostuma. Ajuste quem faz é o técnico, e ele só vem na quinta.', cena: '🤷' },
            { q: 'c', t: 'Mas está me incomodando muito para ler...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta na quinta.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu não volto mais.', cena: '😠' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop',
          falas: [
            { q: 'c', t: 'Bom dia. Trouxe meu cachorro para banho e tosa aqui ontem, mas a tosa ficou desigual atrás das orelhas.', cena: '🐶' },
            { q: 'b', t: 'Hum... foi aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Foi sim. Ontem de manhã.', cena: '🐕' },
            { q: 'b', t: 'Ah, cachorro mexe muito, né? Fica assim mesmo. Se quiser acertar, tem que marcar outro horário e pagar.', cena: '🤷' },
            { q: 'c', t: 'Pagar de novo? Mas foi a tosa que ficou errada...', cena: '😕' },
            { q: 'b', t: 'É a regra. Marca aí e volta outro dia.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu levo ele em outro lugar.', cena: '😠' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia',
          falas: [
            { q: 'c', t: 'Bom dia. Cortei o cabelo aqui ontem, mas em casa vi que a nuca ficou meio torta.', cena: '💇' },
            { q: 'b', t: 'Hum... cortou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Cortei sim. Ontem à tarde.', cena: '🙂' },
            { q: 'b', t: 'Ah, cabelo é assim, depois cresce e acerta. O cabeleireiro está com a agenda cheia hoje.', cena: '🤷' },
            { q: 'c', t: 'Mas eu tenho um compromisso amanhã...', cena: '😕' },
            { q: 'b', t: 'Aí não dá. Marca outro dia e volta.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu não volto mais.', cena: '😠' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia',
          falas: [
            { q: 'c', t: 'Bom dia. Paguei a mensalidade aqui semana passada, mas no extrato apareceu cobrado duas vezes.', cena: '💳' },
            { q: 'b', t: 'Hum... pagou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Paguei sim. O comprovante está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é com o financeiro, e ele só vem na segunda.', cena: '🤷' },
            { q: 'c', t: 'Mas é o meu dinheiro que está preso...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta na segunda.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu cancelo a matrícula.', cena: '😠' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado',
          falas: [
            { q: 'c', t: 'Bom dia. Comprei este queijo aqui ontem e, quando abri em casa, ele estava estragado.', cena: '🧀' },
            { q: 'b', t: 'Hum... comprou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Comprei sim. A nota está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é com o gerente, e ele só chega à tarde.', cena: '🤷' },
            { q: 'c', t: 'Mas eu vim só para isso...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta à tarde.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu compro em outro lugar.', cena: '😠' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria',
          falas: [
            { q: 'c', t: 'Bom dia. Encomendei uma torta aqui ontem e veio com o recheio errado. Era de morango e veio de coco.', cena: '🍰' },
            { q: 'b', t: 'Hum... encomendou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Encomendei sim. O pedido está aqui.', cena: '📋' },
            { q: 'b', t: 'Isso aí é com a confeiteira, e ela só vem amanhã.', cena: '🤷' },
            { q: 'c', t: 'Mas a festa é hoje...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta amanhã.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu encomendo em outro lugar.', cena: '😠' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos',
          falas: [
            { q: 'c', t: 'Bom dia. Paguei o material do curso do meu neto, mas a apostila não chegou até hoje.', cena: '📚' },
            { q: 'b', t: 'Hum... pagou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Paguei sim. O recibo está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é com a secretaria, e ela só vem amanhã.', cena: '🤷' },
            { q: 'c', t: 'Mas ele está sem material na aula...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta amanhã.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu tiro ele daqui.', cena: '😠' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica',
          falas: [
            { q: 'c', t: 'Bom dia. Troquei a tela do meu celular aqui semana passada e o touch está falhando num canto.', cena: '📱' },
            { q: 'b', t: 'Hum... trocou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Troquei sim. O recibo está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é com o técnico, e ele só vem amanhã.', cena: '🤷' },
            { q: 'c', t: 'Mas eu uso o celular para trabalhar...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta amanhã.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu levo em outro lugar.', cena: '😠' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas',
          falas: [
            { q: 'c', t: 'Bom dia. Comprei esta camisa aqui semana passada e, na primeira lavagem, a costura abriu.', cena: '👔' },
            { q: 'b', t: 'Hum... comprou aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Comprei sim. A nota está aqui.', cena: '🧾' },
            { q: 'b', t: 'Isso aí é com a gerente, e ela só vem amanhã.', cena: '🤷' },
            { q: 'c', t: 'Mas eu vim só para isso...', cena: '😕' },
            { q: 'b', t: 'Agora não dá, não. Volta amanhã.', cena: '📱' },
            { q: 'c', t: 'Está bem... Pode deixar que eu compro em outra loja.', cena: '😠' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária',
          falas: [
            { q: 'c', t: 'Bom dia. Fiz uma restauração aqui semana passada e ela está me incomodando quando eu mastigo.', cena: '🦷' },
            { q: 'b', t: 'Hum... foi aqui mesmo?', cena: '📱' },
            { q: 'c', t: 'Foi sim. Está na minha ficha.', cena: '🗂️' },
            { q: 'b', t: 'Isso aí é com a doutora, e a agenda dela está cheia.', cena: '🤷' },
            { q: 'c', t: 'Mas eu vim só para isso... está doendo.', cena: '😕' },
            { q: 'b', t: 'Hoje não dá, não. Liga semana que vem para marcar.', cena: '📱' },
            { q: 'c', t: 'Está bem... Vou procurar outro dentista.', cena: '😠' }
          ]
        }
      },
      erros: [
        'Não cumprimentou e não tirou os olhos do celular.',
        'Não perguntou o nome nem agradeceu o cliente por ter voltado.',
        'Empurrou o problema para outra pessoa e mandou voltar depois, em vez de resolver.'
      ]
    }
  },
  2: {
    titulo: 'O cliente que chega com a loja movimentada',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados',
        falas: [
          { q: 'c', t: 'Com licença...', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando com esta cliente e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso te ajudar?', cena: '😊' },
          { q: 'c', t: 'Estou procurando um tênis confortável para caminhar.', cena: '👟' },
          { q: 'a', t: 'Ótimo! Vou guardar o celular aqui para te dar atenção. O senhor caminha todo dia?', cena: '📵' },
          { q: 'c', t: 'Quase todo dia, de manhã cedo, umas três voltas no parque.', cena: '🌳' },
          { q: 'a', t: 'Que bom hábito! Então vou te mostrar os modelos mais leves e macios. Pode sentar aqui, fique à vontade.', cena: '🪑' },
          { q: 'c', t: 'Obrigado. Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já volto com as opções.', cena: '📦' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de passar o orçamento para este cliente e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso te ajudar?', cena: '😊' },
          { q: 'c', t: 'A luz do óleo acendeu no painel do meu carro hoje cedo.', cena: '🚗' },
          { q: 'a', t: 'Entendi. Vou guardar o celular aqui para te dar atenção. Desde quando ela está acesa?', cena: '📵' },
          { q: 'c', t: 'Acendeu hoje de manhã, quando eu saí de casa.', cena: '⏱️' },
          { q: 'a', t: 'Fez bem em vir logo. Vou pedir para o mecânico dar uma olhada agora. Enquanto isso, pode sentar aqui, tem café fresquinho.', cena: '☕' },
          { q: 'c', t: 'Obrigado. Gostei de ser atendido assim, mesmo com a oficina cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já volto com a avaliação.', cena: '🔧' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de ajustar os óculos desta cliente e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso te ajudar?', cena: '😊' },
          { q: 'c', t: 'Estou com uma receita nova do oftalmologista e quero fazer óculos.', cena: '📄' },
          { q: 'a', t: 'Que bom! Vou guardar o celular aqui para te dar atenção. Posso ver a receita?', cena: '📵' },
          { q: 'c', t: 'Claro, está aqui.', cena: '🧾' },
          { q: 'a', t: 'Obrigada. Pode sentar aqui, fique à vontade. Vou te mostrar as armações que combinam com essa receita.', cena: '🪑' },
          { q: 'c', t: 'Obrigado. Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já volto com as opções.', cena: '👓' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de atender esta cliente e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. E quem é esse aí no seu colo?', cena: '😊' },
          { q: 'c', t: 'É o Thor. Quero marcar um banho para ele.', cena: '🐶' },
          { q: 'a', t: 'Oi, Thor! Vou guardar o celular aqui para dar atenção para vocês dois. Ele já tomou banho aqui alguma vez?', cena: '📵' },
          { q: 'c', t: 'Não, é a primeira vez. Ele fica meio nervoso.', cena: '🐕' },
          { q: 'a', t: 'Pode deixar, a gente vai com calma. Sentem aqui, fiquem à vontade, e o Thor pode tomar uma água enquanto eu vejo o melhor horário.', cena: '💧' },
          { q: 'c', t: 'Obrigado. Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção, e o Thor também.', cena: '🐾' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia',
        falas: [
          { q: 'c', t: 'Com licença... boa tarde.', cena: '🚪' },
          { q: 'a', t: 'Boa tarde! Seja bem-vindo! Estou terminando de atender esta cliente e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Queria cortar o cabelo e fazer a barba. Não marquei horário.', cena: '💈' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Deixa eu ver a agenda: o próximo horário livre é em vinte minutos. Pode ser?', cena: '📵' },
          { q: 'c', t: 'Pode sim.', cena: '👍' },
          { q: 'a', t: 'Então fique à vontade, sente aqui. Aceita uma água ou um café enquanto espera?', cena: '☕' },
          { q: 'c', t: 'Um café, obrigado. Gostei de ser atendido assim, mesmo com o salão cheio.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Daqui a pouco te chamo pelo nome.', cena: '💇' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando a matrícula desta aluna e já vou te atender, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Queria conhecer a academia. Nunca treinei e estou meio sem jeito.', cena: '🏋️' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Fique tranquilo: aqui todo mundo começou do zero. Quer que eu te mostre o espaço?', cena: '📵' },
          { q: 'c', t: 'Quero sim.', cena: '👍' },
          { q: 'a', t: 'Então vamos. Antes, aceita uma água? Depois a gente senta e vê com calma o que combina com o senhor.', cena: '💧' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a recepção cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Vem comigo.', cena: '🤝' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado',
        falas: [
          { q: 'c', t: 'Bom dia... tem alguém atendendo no açougue?', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Tem sim. Estou terminando o pedido desta cliente e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. O que vai ser hoje?', cena: '😊' },
          { q: 'c', t: 'Quero dois quilos de carne moída, mas moída na hora.', cena: '🥩' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Moo agora mesmo, leva uns cinco minutinhos.', cena: '📵' },
          { q: 'c', t: 'Pode ser.', cena: '👍' },
          { q: 'a', t: 'Enquanto isso, o senhor quer sentar ali no banquinho? Eu chamo o senhor quando estiver pronta.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com o açougue cheio.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já já está pronta.', cena: '🤝' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria',
        falas: [
          { q: 'c', t: 'Bom dia... posso fazer um pedido?', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Pode sim. Estou terminando de embalar o pedido desta cliente e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. O que vai ser hoje?', cena: '😊' },
          { q: 'c', t: 'Queria um café e um pedaço de bolo para comer aqui.', cena: '☕' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. O de cenoura com chocolate acabou de sair do forno. Pode ser?', cena: '📵' },
          { q: 'c', t: 'Pode ser.', cena: '👍' },
          { q: 'a', t: 'Então fique à vontade, pode sentar naquela mesa perto da janela. Eu levo tudo para o senhor em um minutinho.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já levo o seu café.', cena: '🤝' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de atender esta mãe e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Queria saber dos cursos de informática. Nunca mexi muito no computador.', cena: '💻' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Fique tranquilo: temos turma para quem está começando do zero.', cena: '📵' },
          { q: 'c', t: 'Que bom.', cena: '👍' },
          { q: 'a', t: 'Pode sentar aqui, fique à vontade. Aceita um café? Eu te mostro os horários com calma.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a secretaria cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Vamos ver juntos.', cena: '🤝' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de entregar o aparelho desta cliente e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Minha televisão parou de ligar. Queria saber se tem conserto.', cena: '📺' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Me conta: ela apaga de vez ou fica com a luzinha acesa?', cena: '📵' },
          { q: 'c', t: 'Fica com a luzinha vermelha acesa.', cena: '👍' },
          { q: 'a', t: 'Pode sentar aqui, fique à vontade. Vou anotar tudo e já te explico como funciona o orçamento.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Vamos ver juntos.', cena: '🤝' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de atender esta cliente no provador e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Preciso de uma roupa para o casamento da minha sobrinha, no sábado.', cena: '🤵' },
          { q: 'a', t: 'Vou guardar o celular aqui para dar atenção ao senhor. Que ocasião bonita! O casamento é de dia ou à noite?', cena: '📵' },
          { q: 'c', t: 'À noite.', cena: '🌙' },
          { q: 'a', t: 'Então pode sentar aqui, fique à vontade. Vou trazer algumas opções para o senhor ver com calma.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a loja cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Já volto.', cena: '🤝' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária',
        falas: [
          { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
          { q: 'a', t: 'Bom dia! Seja bem-vindo! Estou terminando de confirmar a consulta desta paciente e já atendo o senhor, só um minutinho.', cena: '👋' },
          { q: 'c', t: 'Tudo bem, eu espero.', cena: '🙂' },
          { q: 'a', t: 'Obrigada por esperar! Agora sou toda sua. Em que posso ajudar?', cena: '😊' },
          { q: 'c', t: 'Faz tempo que eu não vou ao dentista. Queria marcar uma avaliação.', cena: '🦷' },
          { q: 'a', t: 'Vou deixar o telefone de lado um instante para dar atenção ao senhor. Que bom que o senhor decidiu cuidar disso! Prefere de manhã ou à tarde?', cena: '📵' },
          { q: 'c', t: 'De manhã, se der.', cena: '🌅' },
          { q: 'a', t: 'Então pode sentar aqui, fique à vontade. Vou ver os horários da manhã com calma para o senhor escolher.', cena: '🪑' },
          { q: 'c', t: 'Gostei de ser atendido assim, mesmo com a recepção cheia.', cena: '😃' },
          { q: 'a', t: 'Imagina! Quem chega aqui merece atenção. Só um instante.', cena: '🤝' }
        ]
      }
    },
    repare: [
      'Percebeu o cliente assim que ele entrou, mesmo ocupada com outra pessoa.',
      'Cumprimentou na hora e avisou: já vou te atender, só um minutinho.',
      'Agradeceu pela espera antes de começar o atendimento.',
      'Guardou o celular e deu atenção total, olhando para o cliente.',
      'Convidou a sentar e deixou o cliente à vontade.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Alguém pode me atender?', cena: '🙋' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá, depende. Espera aí.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu volto outra hora.', cena: '😠' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria ver um orçamento para o meu carro.', cena: '🚗' },
            { q: 'b', t: 'Peraí, que tem cliente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá, depende do mecânico. Espera aí fora.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra oficina.', cena: '😠' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria ver uns óculos.', cena: '👓' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá, depende. Espera aí.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu volto outra hora.', cena: '😠' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria marcar um banho para o meu cachorro.', cena: '🐶' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Posso deixar ele aqui enquanto espero?', cena: '🐕' },
            { q: 'b', t: 'Sei lá. Segura ele aí.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu volto outra hora.', cena: '😠' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia',
          falas: [
            { q: 'c', t: 'Com licença... boa tarde.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Boa tarde? Queria cortar o cabelo e fazer a barba.', cena: '💈' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá, depende. Fica aí de pé que já já vaga.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu volto outra hora.', cena: '😠' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria conhecer a academia.', cena: '🏋️' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Dá uma volta aí sozinho, se quiser.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra academia.', cena: '😠' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado',
          falas: [
            { q: 'c', t: 'Bom dia... tem alguém atendendo no açougue?', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria dois quilos de carne moída.', cena: '🥩' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Pega a senha aí e espera.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu compro em outro mercado.', cena: '😠' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria',
          falas: [
            { q: 'c', t: 'Bom dia... posso fazer um pedido?', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria um café e um pedaço de bolo.', cena: '☕' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Fica aí em pé que eu chamo.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu tomo café em outro lugar.', cena: '😠' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria saber dos cursos de informática.', cena: '💻' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Pega um folheto ali e lê enquanto isso.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra escola.', cena: '😠' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Minha televisão parou de ligar.', cena: '📺' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Deixa a TV aí no canto que depois eu vejo.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra assistência.', cena: '😠' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Preciso de uma roupa para um casamento.', cena: '🤵' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Dá uma olhada nas araras aí sozinho.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra loja.', cena: '😠' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária',
          falas: [
            { q: 'c', t: 'Com licença... bom dia.', cena: '🚪' },
            { q: 'b', t: '...', cena: '📱' },
            { q: 'c', t: 'Bom dia? Queria marcar uma avaliação.', cena: '🦷' },
            { q: 'b', t: 'Peraí, que tem gente na frente.', cena: '🤷' },
            { q: 'c', t: 'Tudo bem... Vou esperar quanto tempo, mais ou menos?', cena: '⏱️' },
            { q: 'b', t: 'Sei lá. Fica aí em pé que eu já vejo.', cena: '📱' },
            { q: 'c', t: 'Deixa pra lá. Eu procuro outra clínica.', cena: '😠' }
          ]
        }
      },
      erros: [
        'Viu o cliente chegar e não deu nenhum sinal de que ia atender.',
        'Continuou no celular, em vez de dar atenção.',
        'Não ofereceu lugar nem disse quanto tempo ia demorar.'
      ]
    }
  },
  3: {
    titulo: 'Chamar pelo nome e lembrar do cliente',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver de novo! E o tênis de caminhada, está aprovado?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Está ótimo, uso todo dia no parque.', cena: '👟' },
          { q: 'a', t: 'Fico feliz! E hoje, em que posso te ajudar?', cena: '🙂' },
          { q: 'c', t: 'Trouxe minha esposa. Ela também quer um tênis confortável.', cena: '👫' },
          { q: 'a', t: 'Que ótimo! Seja muito bem-vinda. Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela se chama Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! A senhora também caminha, ou usa mais no dia a dia?', cena: '🤝' },
          { q: 'c', t: 'Ela usa mais para trabalhar, fica muito tempo em pé.', cena: '🧍' },
          { q: 'a', t: 'Entendi. Então, dona Maria, vou trazer os modelos com mais amortecimento. Seu José, quer aproveitar e ver as meias de caminhada?', cena: '📦' },
          { q: 'c', t: 'Quero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver de novo! E o Onix, está rodando bem depois da revisão?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim e do carro! Está ótimo, sim.', cena: '🚗' },
          { q: 'a', t: 'Fico feliz! E hoje, em que posso te ajudar?', cena: '🙂' },
          { q: 'c', t: 'Trouxe minha esposa. O carro dela está fazendo um barulho na roda.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela se chama Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! O barulho aparece mais quando a senhora freia, ou quando faz curva?', cena: '🤝' },
          { q: 'c', t: 'Ela disse que é mais quando freia.', cena: '🛞' },
          { q: 'a', t: 'Entendi, dona Maria. Vou pedir para o mecânico olhar os freios agora. Seu José, quer aproveitar e conferir a calibragem do Onix?', cena: '🔧' },
          { q: 'c', t: 'Quero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver de novo! E os óculos de leitura, estão ajudando?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Estão ótimos, agora leio o jornal sem esforço.', cena: '📰' },
          { q: 'a', t: 'Fico feliz! E hoje, em que posso te ajudar?', cena: '🙂' },
          { q: 'c', t: 'Trouxe minha esposa. Ela quer óculos de sol com grau.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela se chama Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! A senhora vai usar mais para dirigir ou para passear?', cena: '🤝' },
          { q: 'c', t: 'Ela disse que é mais para dirigir.', cena: '🚗' },
          { q: 'a', t: 'Entendi, dona Maria. Vou trazer os modelos com lente polarizada, que ajudam no reflexo. Seu José, quer aproveitar e fazer uma limpeza nos seus?', cena: '🕶️' },
          { q: 'c', t: 'Quero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop',
        falas: [
          { q: 'a', t: 'Seu José! E o Thor! Que bom ver vocês de novo! Ele gostou do banho da semana passada?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de nós dois! Gostou sim, voltou todo cheiroso.', cena: '🐶' },
          { q: 'a', t: 'Fico feliz! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Trouxe minha esposa. Ela quer ver uma caminha para a gata dela.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome? E o da gatinha?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria, e a gata é a Mimi.', cena: '🐱' },
          { q: 'a', t: 'Prazer, dona Maria! A Mimi gosta de dormir mais encolhidinha ou esticada?', cena: '🤝' },
          { q: 'c', t: 'Ela disse que é bem encolhidinha, num cantinho.', cena: '🛏️' },
          { q: 'a', t: 'Então, dona Maria, vou te mostrar as caminhas tipo toca, que as gatas adoram. Seu José, quer aproveitar e ver o petisco que o Thor gosta?', cena: '🧺' },
          { q: 'c', t: 'Quero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver de novo! E aí, o corte de mês passado aguentou bem?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Aguentou sim, recebi até elogio.', cena: '💇' },
          { q: 'a', t: 'Fico feliz! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer fazer uma escova.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! A senhora prefere a escova mais lisa ou com um pouco de movimento nas pontas?', cena: '🤝' },
          { q: 'c', t: 'Ela disse que gosta com movimento, mais natural.', cena: '💁' },
          { q: 'a', t: 'Então, dona Maria, vou te levar para a cadeira da Bia, que faz uma escova assim lindíssima. Seu José, já quer aproveitar e fazer a barba?', cena: '✂️' },
          { q: 'c', t: 'Quero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E a caminhada na esteira, já chegou nos trinta minutos?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Cheguei sim, semana passada.', cena: '🏃' },
          { q: 'a', t: 'Que orgulho! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer começar a treinar também.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! A senhora prefere aula em grupo, tipo ginástica ou dança, ou treinar mais no seu ritmo?', cena: '🤝' },
          { q: 'c', t: 'Ela disse que gosta de aula em grupo, com música.', cena: '🎵' },
          { q: 'a', t: 'Então, dona Maria, a aula de ritmos de terça e quinta é a sua cara. Quer fazer uma aula experimental? Seu José, aproveita e treina junto hoje?', cena: '💃' },
          { q: 'c', t: 'Treino sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E o pão de queijo da semana passada, a família gostou?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Gostaram muito, acabou no mesmo dia.', cena: '🥖' },
          { q: 'a', t: 'Que bom! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer encomendar um bolo.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! O bolo é para alguma comemoração especial?', cena: '🤝' },
          { q: 'c', t: 'É o aniversário do nosso neto, no sábado.', cena: '🎂' },
          { q: 'a', t: 'Que alegria! Dona Maria, a padaria faz bolo de chocolate com morango, que as crianças adoram. Quer ver as fotos? Seu José, aproveita e já leva o pão de queijo fresquinho?', cena: '🍰' },
          { q: 'c', t: 'Levo sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E o bolo de chocolate do aniversário da sua neta, ela gostou?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Ela amou, não sobrou nem um pedaço.', cena: '🎂' },
          { q: 'a', t: 'Que alegria! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer encomendar doces.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! Os doces são para alguma festa especial?', cena: '🤝' },
          { q: 'c', t: 'É o nosso aniversário de casamento, quarenta anos.', cena: '💍' },
          { q: 'a', t: 'Que lindo, dona Maria! Parabéns aos dois! Que tal uns brigadeiros e bem-casados? Quer provar um? Seu José, aproveita e prova também?', cena: '🍬' },
          { q: 'c', t: 'Provo sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E as aulas de informática, já está mandando foto pelo WhatsApp sozinho?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Estou sim, já mando até áudio.', cena: '📱' },
          { q: 'a', t: 'Que orgulho! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer fazer um curso também.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! A senhora tem algum curso em mente, ou quer que eu conte o que temos?', cena: '🤝' },
          { q: 'c', t: 'Ela sempre quis aprender a costurar.', cena: '🧵' },
          { q: 'a', t: 'Que lindo, dona Maria! A turma de corte e costura começa no mês que vem, às terças à tarde. Quer conhecer a sala? Seu José, vem junto?', cena: '✂️' },
          { q: 'c', t: 'Vou sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E o notebook que a gente arrumou, está rápido como o senhor queria?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Está ótimo, parece novo.', cena: '💻' },
          { q: 'a', t: 'Que bom! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. O celular dela não carrega direito.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! Desde quando o celular está assim?', cena: '🤝' },
          { q: 'c', t: 'Faz uma semana. Ela tem medo de perder as fotos dos netos.', cena: '📸' },
          { q: 'a', t: 'Fica tranquila, dona Maria: antes de qualquer coisa, a gente salva as suas fotos. Geralmente é só limpar a entrada do carregador. Seu José, quer esperar com ela? Fica pronto em meia hora.', cena: '🔌' },
          { q: 'c', t: 'Espero sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E o terno do casamento da sua sobrinha, fez sucesso?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Fez sim, todo mundo elogiou.', cena: '🤵' },
          { q: 'a', t: 'Que alegria! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer um vestido.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! O vestido é para alguma ocasião especial?', cena: '🤝' },
          { q: 'c', t: 'É para a formatura da nossa neta.', cena: '🎓' },
          { q: 'a', t: 'Que orgulho, dona Maria! Chegaram uns vestidos lindos, mais confortáveis para usar a noite toda. Quer experimentar? Seu José, aproveita e senta aqui enquanto ela prova?', cena: '👗' },
          { q: 'c', t: 'Sento sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária',
        falas: [
          { q: 'a', t: 'Seu José! Que bom te ver! E a limpeza do mês passado, a sensibilidade melhorou?', cena: '😊' },
          { q: 'c', t: 'Nossa, você lembrou de mim! Melhorou sim, já tomo café quente sem problema.', cena: '☕' },
          { q: 'a', t: 'Que alegria! E hoje, em que posso ajudar?', cena: '🙂' },
          { q: 'c', t: 'Hoje eu trouxe minha esposa. Ela quer marcar uma consulta.', cena: '👫' },
          { q: 'a', t: 'Seja muito bem-vinda! Como é o seu nome?', cena: '👋' },
          { q: 'c', t: 'Ela é a Maria. Ela tem um pouco de medo de dentista.', cena: '🙂' },
          { q: 'a', t: 'Prazer, dona Maria! Fica tranquila, aqui a gente vai com calma. A primeira consulta é só uma conversa e uma avaliação com a doutora.', cena: '🤝' },
          { q: 'c', t: 'Ah, assim ela fica mais tranquila.', cena: '😌' },
          { q: 'a', t: 'Dona Maria, prefere um horário mais cedo, com a clínica vazia? Seu José, se quiser, o senhor pode entrar junto com ela.', cena: '📅' },
          { q: 'c', t: 'Pode ser sim. Aqui a gente se sente em casa!', cena: '😃' }
        ]
      }
    },
    repare: [
      'Chamou o cliente pelo nome logo que ele chegou.',
      'Lembrou da última compra e perguntou se ficou bom.',
      'Perguntou o nome de quem ela ainda não conhecia, com naturalidade.',
      'Usou os nomes durante a conversa, sem exagero.',
      'Tratou cada pessoa com carinho, sem chamar de amigo ou chefe.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Comprei aquele tênis de caminhada com vocês.', cena: '👟' },
            { q: 'b', t: 'Bom dia, chefe. Qual tênis?', cena: '🤷' },
            { q: 'c', t: 'O de caminhada... Foi você mesmo que me atendeu.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela também quer um tênis confortável.', cena: '👫' },
            { q: 'b', t: 'Os tênis estão ali naquela parede. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Fiz a revisão do meu Onix com vocês.', cena: '🚗' },
            { q: 'b', t: 'Bom dia, chefe. Qual carro?', cena: '🤷' },
            { q: 'c', t: 'O Onix prata... Foi você mesmo que me atendeu.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanto carro aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. O carro dela está fazendo um barulho na roda.', cena: '👫' },
            { q: 'b', t: 'Deixa a chave aí no balcão que alguém olha, chefe.', cena: '🔑' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Fiz meus óculos de leitura com vocês.', cena: '👓' },
            { q: 'b', t: 'Bom dia, chefe. Quais óculos?', cena: '🤷' },
            { q: 'c', t: 'Os de leitura... Foi você mesmo que me atendeu.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer óculos de sol com grau.', cena: '👫' },
            { q: 'b', t: 'Os de sol estão naquele expositor. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. O Thor tomou banho com vocês semana passada.', cena: '🐶' },
            { q: 'b', t: 'Bom dia, chefe. Quem é Thor?', cena: '🤷' },
            { q: 'c', t: 'O meu cachorro... Foi você mesmo que atendeu a gente.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanto cachorro aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer ver uma caminha para a gata dela.', cena: '👫' },
            { q: 'b', t: 'As caminhas estão lá no fundo. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia',
          falas: [
            { q: 'c', t: 'Boa tarde! Voltei aqui. Cortei o cabelo com vocês no mês passado.', cena: '💇' },
            { q: 'b', t: 'Boa tarde, chefe. Cortou com quem?', cena: '🤷' },
            { q: 'c', t: 'Com vocês... Foi você mesmo que marcou o meu horário.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer fazer uma escova.', cena: '👫' },
            { q: 'b', t: 'Senta ali e espera vagar alguém, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Já treino com vocês faz um mês.', cena: '🏃' },
            { q: 'b', t: 'Bom dia, chefe. Treina aqui?', cena: '🤷' },
            { q: 'c', t: 'Treino sim... Foi você mesmo que fez a minha matrícula.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer começar a treinar também.', cena: '👫' },
            { q: 'b', t: 'A grade das aulas está ali no mural. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Compro com vocês toda semana.', cena: '🛒' },
            { q: 'b', t: 'Bom dia, chefe. Compra aqui?', cena: '🤷' },
            { q: 'c', t: 'Compro sim... Semana passada você mesmo me atendeu na padaria.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer encomendar um bolo.', cena: '👫' },
            { q: 'b', t: 'Encomenda é ali no balcão do fundo. Vê lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Encomendo com vocês faz tempo.', cena: '🎂' },
            { q: 'b', t: 'Bom dia, chefe. Encomenda aqui?', cena: '🤷' },
            { q: 'c', t: 'Encomendo sim... Mês passado você mesmo me atendeu no bolo da minha neta.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer encomendar doces.', cena: '👫' },
            { q: 'b', t: 'O cardápio está ali na parede. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Já faço curso com vocês faz dois meses.', cena: '💻' },
            { q: 'b', t: 'Bom dia, chefe. Estuda aqui?', cena: '🤷' },
            { q: 'c', t: 'Estudo sim... Foi você mesmo que fez a minha matrícula.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer fazer um curso também.', cena: '👫' },
            { q: 'b', t: 'A lista de cursos está ali no mural. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Vocês arrumaram meu notebook mês passado.', cena: '💻' },
            { q: 'b', t: 'Bom dia, chefe. Arrumou aqui?', cena: '🤷' },
            { q: 'c', t: 'Arrumei sim... Foi você mesmo que me atendeu.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. O celular dela não carrega direito.', cena: '👫' },
            { q: 'b', t: 'Deixa aí no balcão que depois alguém olha, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Comprei um terno com vocês mês passado.', cena: '🤵' },
            { q: 'b', t: 'Bom dia, chefe. Comprou aqui?', cena: '🤷' },
            { q: 'c', t: 'Comprei sim... Foi você mesmo que me atendeu.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer um vestido.', cena: '👫' },
            { q: 'b', t: 'Os vestidos estão lá no fundo. Dá uma olhada lá, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária',
          falas: [
            { q: 'c', t: 'Bom dia! Voltei aqui. Fiz uma limpeza com vocês mês passado.', cena: '🦷' },
            { q: 'b', t: 'Bom dia, chefe. Já é paciente?', cena: '🤷' },
            { q: 'c', t: 'Sou sim... Foi você mesmo que marcou para mim.', cena: '😕' },
            { q: 'b', t: 'Ah, passa tanta gente aqui. Fala aí, o que vai ser hoje?', cena: '📱' },
            { q: 'c', t: 'Trouxe minha esposa. Ela quer marcar uma consulta, mas tem medo de dentista.', cena: '👫' },
            { q: 'b', t: 'Preenche essa ficha aí e espera chamar, chefe.', cena: '👉' },
            { q: 'c', t: 'Está bem... Vamos embora, Maria.', cena: '😠' }
          ]
        }
      },
      erros: [
        'Não lembrou do cliente nem do que ele tinha comprado.',
        'Chamou de "chefe", em vez de chamar pelo nome.',
        'Ignorou a esposa, sem perguntar o nome nem o que ela queria.'
      ]
    }
  },
  4: {
    titulo: 'Ouvir antes de oferecer',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados',
        falas: [
          { q: 'c', t: 'Bom dia. Quero um sapato social para um casamento.', cena: '👞' },
          { q: 'a', t: 'Bom dia, seu José! Que ocasião boa! Me conta um pouco: o casamento é de dia ou à noite?', cena: '💍' },
          { q: 'c', t: 'À noite. E vou ficar muitas horas em pé, porque sou padrinho.', cena: '🌙' },
          { q: 'a', t: 'Padrinho, que honra! E o senhor tem costume de usar sapato social, ou machuca o pé?', cena: '🤔' },
          { q: 'c', t: 'Quase não uso. E da última vez fiquei com o pé doendo a festa inteira.', cena: '😣' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor quer um sapato elegante, para a noite, que aguente muitas horas sem machucar. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então vou te mostrar este modelo de couro macio, com palmilha acolchoada. Não é o mais caro da loja, mas é o mais confortável para o seu caso.', cena: '👞' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'Pode experimentar com calma e dar uma volta pela loja.', cena: '🪑' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center',
        falas: [
          { q: 'c', t: 'Bom dia. Quero trocar os pneus do meu carro.', cena: '🛞' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta um pouco: o senhor roda mais na cidade ou na estrada?', cena: '🤔' },
          { q: 'c', t: 'Mais na estrada. Vou toda semana visitar minha mãe no interior.', cena: '🛣️' },
          { q: 'a', t: 'Que bom! E o que é mais importante para o senhor: durabilidade, conforto ou economia?', cena: '📝' },
          { q: 'c', t: 'Segurança, principalmente na chuva. Da última vez o carro escorregou.', cena: '🌧️' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor roda muito na estrada e quer um pneu que segure bem na chuva. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então vou te indicar este modelo, que tem ótima aderência no molhado. Não é o mais caro, mas é o mais seguro para o seu uso.', cena: '🛞' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'Vou montar o orçamento com calma e te explico cada item.', cena: '🧾' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica',
        falas: [
          { q: 'c', t: 'Bom dia. Quero trocar a armação dos meus óculos.', cena: '👓' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta um pouco: o senhor usa os óculos o dia todo ou só para ler?', cena: '🤔' },
          { q: 'c', t: 'O dia todo. Trabalho no computador e dirijo bastante.', cena: '💻' },
          { q: 'a', t: 'Entendi. E o que está incomodando na armação de agora?', cena: '📝' },
          { q: 'c', t: 'Ela é pesada e no fim do dia o nariz fica marcado.', cena: '😣' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor usa o dia inteiro e quer uma armação leve, que não marque o nariz. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então vou te mostrar estas armações leves, com plaquetas macias. Não são as mais caras, mas são as mais confortáveis para o seu dia a dia.', cena: '👓' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'Pode experimentar com calma e se olhar no espelho.', cena: '🪞' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop',
        falas: [
          { q: 'c', t: 'Bom dia. Quero uma ração para o meu cachorro.', cena: '🐶' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta um pouco: quantos anos o Thor tem?', cena: '🤔' },
          { q: 'c', t: 'Ele tem oito anos já.', cena: '🎂' },
          { q: 'a', t: 'E ele é bem agitado ou mais tranquilo hoje em dia? Tem alguma recomendação do veterinário?', cena: '📝' },
          { q: 'c', t: 'Está mais tranquilo. E o veterinário falou para cuidar do peso.', cena: '⚖️' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o Thor já é mais velhinho, está mais calmo e precisa cuidar do peso. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então vou te mostrar as rações para cães idosos com controle de peso. Não são as mais caras, mas são as indicadas para o que o veterinário pediu. Vale confirmar com ele também.', cena: '🦴' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'Pode ver com calma. Se quiser, te mostro a quantidade certa para cada dia na embalagem.', cena: '📦' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia',
        falas: [
          { q: 'c', t: 'Boa tarde. Quero mudar o corte. Estou enjoado desse.', cena: '💇' },
          { q: 'a', t: 'Boa tarde, seu José! Vamos ver isso. Me conta um pouco: quanto tempo o senhor tem de manhã para arrumar o cabelo?', cena: '🤔' },
          { q: 'c', t: 'Quase nenhum. Saio cedo para o trabalho.', cena: '⏰' },
          { q: 'a', t: 'E o que mais te incomoda nesse corte de agora?', cena: '📝' },
          { q: 'c', t: 'Ele cresce rápido e fica armado dos lados.', cena: '😕' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor quer um corte prático, que não precise arrumar muito de manhã e que não fique armado dos lados. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro um corte mais baixo dos lados e um pouco mais comprido em cima. Fica arrumado só passando a mão. E não precisa de produto nenhum, se não quiser.', cena: '✂️' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'Vou te mostrar umas fotos de como fica, e o senhor decide com calma.', cena: '📸' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia',
        falas: [
          { q: 'c', t: 'Bom dia. Quero fazer um plano aqui na academia.', cena: '🏋️' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta um pouco: qual é o seu objetivo com o treino?', cena: '🤔' },
          { q: 'c', t: 'Quero ter mais disposição. E o médico mandou eu me mexer mais.', cena: '💪' },
          { q: 'a', t: 'E quantos dias na semana o senhor consegue vir, de verdade, com o seu trabalho?', cena: '📅' },
          { q: 'c', t: 'Uns três dias. De manhã cedo.', cena: '⏰' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor quer mais disposição, pode vir três vezes por semana, de manhã. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro começar pelo plano mensal, três vezes por semana. Não é o mais caro, mas é o que cabe na sua rotina. Se pegar o ritmo, depois o senhor muda.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Ninguém nunca me perguntou isso.', cena: '😃' },
          { q: 'a', t: 'E na primeira semana o professor monta o seu treino, com calma. Pode começar amanhã!', cena: '🤝' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado',
        falas: [
          { q: 'c', t: 'Bom dia. Vou fazer um churrasco e queria levar carne.', cena: '🥩' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: é para quantas pessoas?', cena: '🤔' },
          { q: 'c', t: 'Umas quinze. É a família toda, no domingo.', cena: '👨‍👩‍👧' },
          { q: 'a', t: 'E tem criança? O pessoal prefere carne mais macia ou mais gordinha?', cena: '❓' },
          { q: 'c', t: 'Tem umas cinco crianças. E eu não quero gastar muito.', cena: '💬' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: churrasco para quinze pessoas, com crianças, gastando pouco. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro uns cinco quilos, entre fraldinha e coxa de frango, e um pouco de linguiça para as crianças. Não é a picanha, mas rende bem e agrada todo mundo.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia levar carne demais.', cena: '😃' },
          { q: 'a', t: 'E se o senhor quiser, eu já separo e tempero para o senhor buscar no domingo cedo.', cena: '🤝' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria',
        falas: [
          { q: 'c', t: 'Bom dia. Quero encomendar um bolo.', cena: '🎂' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: é para qual ocasião?', cena: '🤔' },
          { q: 'c', t: 'Aniversário da minha mãe. Ela faz oitenta anos.', cena: '👵' },
          { q: 'a', t: 'Que bênção! E quantas pessoas vão estar na festa? Ela tem alguma restrição, tipo pouco açúcar?', cena: '❓' },
          { q: 'c', t: 'Umas vinte pessoas. E ela não pode comer muito doce.', cena: '💬' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: bolo para vinte pessoas, para a sua mãe, que não pode muito doce. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro um bolo de dois quilos, de laranja com cobertura leve e menos açúcar. Não é o mais caro, mas é o que combina com ela.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia pedir o mais enfeitado.', cena: '😃' },
          { q: 'a', t: 'E se quiser, coloco uma plaquinha com o nome dela. Fica pronto no sábado às dez.', cena: '🤝' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos',
        falas: [
          { q: 'c', t: 'Bom dia. Quero matricular meu neto num curso de inglês.', cena: '🎒' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: quantos anos ele tem?', cena: '🤔' },
          { q: 'c', t: 'Doze anos. Ele estuda de manhã.', cena: '🧒' },
          { q: 'a', t: 'E ele já estudou inglês antes? Qual é o objetivo: ir melhor na escola ou conversar?', cena: '❓' },
          { q: 'c', t: 'Nunca estudou. A ideia é ele ir melhor na escola, que está com dificuldade.', cena: '💬' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: seu neto tem doze anos, nunca estudou inglês, estuda de manhã e precisa de ajuda na escola. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro a turma básica infantil, duas vezes por semana à tarde. Não é o pacote intensivo, mas é o que combina com a rotina dele.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia pegar o mais completo.', cena: '😃' },
          { q: 'a', t: 'E ele pode fazer uma aula experimental na quinta, para ver se gosta. Posso marcar?', cena: '🤝' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica',
        falas: [
          { q: 'c', t: 'Bom dia. Meu celular está muito lento. Acho que preciso de um novo.', cena: '📱' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: o que o senhor mais usa nele?', cena: '🤔' },
          { q: 'c', t: 'WhatsApp, fotos e o aplicativo do banco.', cena: '💬' },
          { q: 'a', t: 'E ele ficou lento de uma hora para outra ou foi aos poucos? A memória está cheia?', cena: '❓' },
          { q: 'c', t: 'Foi aos poucos. E aparece uma mensagem de memória cheia.', cena: '⚠️' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor usa WhatsApp, fotos e banco, ele foi ficando lento e a memória está cheia. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro uma limpeza e passar as fotos para a nuvem. Não é um celular novo, mas resolve o que o senhor precisa e sai bem mais barato.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia comprar um aparelho caro à toa.', cena: '😃' },
          { q: 'a', t: 'E se depois o senhor ainda quiser trocar, eu te ajudo a escolher. Fica pronto hoje à tarde.', cena: '🤝' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas',
        falas: [
          { q: 'c', t: 'Bom dia. Quero comprar umas calças.', cena: '👖' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: são para o dia a dia ou para o trabalho?', cena: '🤔' },
          { q: 'c', t: 'Para o trabalho. Eu fico o dia inteiro em pé, na loja.', cena: '🏪' },
          { q: 'a', t: 'E o senhor prefere tecido mais leve ou mais grosso? Alguma cor que não pode faltar?', cena: '❓' },
          { q: 'c', t: 'Mais leve, que lá é quente. E cor escura, que suja menos.', cena: '💬' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: calça para trabalhar em pé o dia todo, tecido leve e cor escura. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então eu sugiro estas duas de sarja leve, azul-marinho e cinza-escuro. Não são as de grife, mas são confortáveis e duram bastante.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia levar qualquer uma.', cena: '😃' },
          { q: 'a', t: 'E se precisar de ajuste na barra, a gente faz até amanhã. Quer provar?', cena: '🤝' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária',
        falas: [
          { q: 'c', t: 'Bom dia. Quero saber daquelas lentes de porcelana nos dentes.', cena: '🦷' },
          { q: 'a', t: 'Bom dia, seu José! Vamos ver isso. Me conta: o que está incomodando o senhor no sorriso?', cena: '🤔' },
          { q: 'c', t: 'Acho meus dentes muito amarelados. E sinto um friozinho quando tomo coisa gelada.', cena: '🥶' },
          { q: 'a', t: 'Entendi. E tem alguma ocasião especial chegando, ou é para o dia a dia mesmo?', cena: '❓' },
          { q: 'c', t: 'Minha neta casa em março. Quero sair bem nas fotos.', cena: '💍' },
          { q: 'a', t: 'Então, deixa eu ver se entendi: o senhor quer os dentes mais claros até março e sente sensibilidade com gelado. É isso?', cena: '📝' },
          { q: 'c', t: 'Isso mesmo!', cena: '👍' },
          { q: 'a', t: 'Então o primeiro passo é uma avaliação com a doutora. Ela vai ver a sensibilidade e explicar as opções. Às vezes há caminhos mais simples que as lentes, e ela mostra cada um com calma.', cena: '📋' },
          { q: 'c', t: 'Gostei de você ter perguntado antes. Eu ia pedir o mais caro sem saber.', cena: '😃' },
          { q: 'a', t: 'E como o casamento é em março, vou procurar um horário ainda este mês, para dar tempo. Pode ser?', cena: '🤝' }
        ]
      }
    },
    repare: [
      'Deixou o cliente falar até o fim, sem interromper.',
      'Fez perguntas para entender a ocasião e o que incomodava.',
      'Repetiu com as próprias palavras o que entendeu.',
      'Só depois ofereceu a solução, e a que fazia sentido para ele.',
      'Explicou o porquê, sem empurrar o produto mais caro.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados',
          falas: [
            { q: 'c', t: 'Bom dia. Quero um sapato social para um casamento. Vou ser padrinho e...', cena: '👞' },
            { q: 'b', t: 'Social? Leva esse aqui, é o melhor da loja.', cena: '💰' },
            { q: 'c', t: 'Mas eu vou ficar muitas horas em pé, e meu pé costuma...', cena: '😕' },
            { q: 'b', t: 'Esse é couro italiano, chefe. Todo mundo leva esse.', cena: '💸' },
            { q: 'c', t: 'Quanto é?', cena: '🏷️' },
            { q: 'b', t: 'Seiscentos reais. Vai levar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center',
          falas: [
            { q: 'c', t: 'Bom dia. Quero trocar os pneus do meu carro. Eu rodo bastante na estrada e...', cena: '🚗' },
            { q: 'b', t: 'Pneu? Leva esse aqui, é o melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas o que eu preciso mesmo é de algo que dure, porque eu...', cena: '😕' },
            { q: 'b', t: 'Esse é importado, chefe. Todo mundo leva esse.', cena: '💸' },
            { q: 'c', t: 'Quanto fica o jogo?', cena: '🏷️' },
            { q: 'b', t: 'Três mil e duzentos. Vai fechar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica',
          falas: [
            { q: 'c', t: 'Bom dia. Quero trocar a armação dos meus óculos. Eu uso o dia todo e...', cena: '👓' },
            { q: 'b', t: 'Armação? Leva essa aqui, é de grife.', cena: '💰' },
            { q: 'c', t: 'Mas a de agora aperta atrás da orelha, e eu queria uma que...', cena: '😕' },
            { q: 'b', t: 'Essa é a mais vendida, chefe. Todo mundo leva essa.', cena: '💸' },
            { q: 'c', t: 'Quanto é?', cena: '🏷️' },
            { q: 'b', t: 'Novecentos reais. Vai levar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop',
          falas: [
            { q: 'c', t: 'Bom dia. Quero uma ração para o meu cachorro. Ele já tem oito anos e o veterinário...', cena: '🐶' },
            { q: 'b', t: 'Ração? Leva essa aqui, é a melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas o veterinário falou para cuidar do peso dele, então eu...', cena: '😕' },
            { q: 'b', t: 'Essa é a mais cara, chefe. Se é cara, é boa.', cena: '💸' },
            { q: 'c', t: 'Quanto é o saco?', cena: '🏷️' },
            { q: 'b', t: 'Trezentos e oitenta. Vai levar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia',
          falas: [
            { q: 'c', t: 'Boa tarde. Quero mudar o corte. Estou enjoado desse e de manhã eu...', cena: '💇' },
            { q: 'b', t: 'Mudar? Faz esse aqui da foto, é o que está na moda.', cena: '💰' },
            { q: 'c', t: 'Mas eu tenho pouco tempo para arrumar o cabelo, então eu queria...', cena: '😕' },
            { q: 'b', t: 'Leva também esse kit de pomada e óleo, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica tudo?', cena: '🏷️' },
            { q: 'b', t: 'Duzentos e cinquenta com o kit. Vai fazer?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia',
          falas: [
            { q: 'c', t: 'Bom dia. Quero fazer um plano aqui. O médico mandou eu me mexer e eu...', cena: '🏋️' },
            { q: 'b', t: 'Plano? Leva o anual com personal, é o melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas eu só consigo vir uns três dias, de manhã, então eu...', cena: '😕' },
            { q: 'b', t: 'O anual sai mais em conta, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Três mil e seiscentos à vista. Vai fechar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado',
          falas: [
            { q: 'c', t: 'Bom dia. Vou fazer um churrasco e queria levar carne para...', cena: '🥩' },
            { q: 'b', t: 'Churrasco? Leva picanha, é a melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas são quinze pessoas, tem criança, e eu não quero gastar muito...', cena: '😕' },
            { q: 'b', t: 'Picanha não tem erro, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Uns quinhentos reais, para dar para todo mundo. Vai levar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria',
          falas: [
            { q: 'c', t: 'Bom dia. Quero encomendar um bolo para a minha mãe, ela faz...', cena: '🎂' },
            { q: 'b', t: 'Bolo? Leva o de três andares com flor de açúcar, é o mais bonito.', cena: '💰' },
            { q: 'c', t: 'Mas são vinte pessoas, e ela não pode comer muito doce...', cena: '😕' },
            { q: 'b', t: 'Esse não tem erro, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Seiscentos reais. Vai fechar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos',
          falas: [
            { q: 'c', t: 'Bom dia. Quero matricular meu neto no inglês. Ele tem doze anos e...', cena: '🎒' },
            { q: 'b', t: 'Inglês? Leva o intensivo com aula particular, é o melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas ele nunca estudou, e só precisa ir melhor na escola...', cena: '😕' },
            { q: 'b', t: 'O intensivo não tem erro, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Quatro mil à vista. Vai fechar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica',
          falas: [
            { q: 'c', t: 'Bom dia. Meu celular está muito lento. Acho que...', cena: '📱' },
            { q: 'b', t: 'Lento? Troca por um novo, esse aqui é o melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas eu só uso WhatsApp e fotos, e apareceu memória cheia...', cena: '😕' },
            { q: 'b', t: 'Celular novo não tem erro, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Três mil e quinhentos. Vai levar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas',
          falas: [
            { q: 'c', t: 'Bom dia. Quero comprar umas calças para o trabalho, eu fico...', cena: '👖' },
            { q: 'b', t: 'Calça? Leva essa de grife, é a melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas eu fico o dia todo em pé, no calor, e preciso de algo leve...', cena: '😕' },
            { q: 'b', t: 'De grife não tem erro, chefe. Todo mundo leva.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Seiscentos reais cada. Vai levar duas?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária',
          falas: [
            { q: 'c', t: 'Bom dia. Quero saber daquelas lentes de porcelana, porque eu sinto...', cena: '🦷' },
            { q: 'b', t: 'Lente? Faz logo o pacote completo, é o melhor que tem.', cena: '💰' },
            { q: 'c', t: 'Mas eu sinto um friozinho quando tomo gelado, e queria entender...', cena: '😕' },
            { q: 'b', t: 'Com o pacote completo não tem erro, chefe. Todo mundo faz.', cena: '💸' },
            { q: 'c', t: 'Quanto fica?', cena: '🏷️' },
            { q: 'b', t: 'Fica caro, mas parcela em vinte e quatro vezes. Vai fechar?', cena: '📱' },
            { q: 'c', t: 'Vou pensar... Obrigado.', cena: '😠' }
          ]
        }
      },
      erros: [
        'Não fez nenhuma pergunta antes de oferecer.',
        'Interrompeu o cliente no meio da frase.',
        'Empurrou o mais caro, sem saber o que ele precisava.'
      ]
    }
  },
  5: {
    titulo: 'O cliente que chega chateado',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Encomendei um sapato e me prometeram para ontem. Vim buscar e não chegou!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu precisava dele para amanhã. Já é a segunda vez que eu venho aqui à toa.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor veio até aqui duas vezes e não foi atendido como merecia.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Vou ligar agora para a entrega e te dou um retorno até as quatro da tarde, com a data certa.', cena: '📞' },
          { q: 'c', t: 'Tá bom. Vou esperar.', cena: '⏱️' },
          { q: 'a', t: 'Seu José, aqui é a Ana. Já confirmei: o sapato chega amanhã às nove. Vou separar e te aviso assim que ele estiver aqui.', cena: '📱' },
          { q: 'c', t: 'Nossa, você me deu retorno antes da hora! Assim dá para confiar.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência, seu José. Amanhã ele já vai estar separado com o seu nome.', cena: '📦' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Deixei meu carro ontem e me prometeram para hoje de manhã. Vim buscar e não está pronto!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu preciso do carro para trabalhar. Já remarquei um compromisso por causa disso.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não cumprimos o combinado.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'A peça que faltava chegou agora há pouco. Vou falar com o mecânico e te dou um retorno até as duas da tarde, com o horário certo de entrega.', cena: '🔧' },
          { q: 'c', t: 'Tá bom. Vou esperar.', cena: '⏱️' },
          { q: 'a', t: 'Seu José, aqui é a Ana. O carro ficou pronto antes do previsto! Pode buscar a partir do meio-dia.', cena: '📱' },
          { q: 'c', t: 'Nossa, você me deu retorno antes da hora! Assim dá para confiar.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência, seu José. Vou deixar a chave separada com o seu nome.', cena: '🔑' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Me prometeram meus óculos para ontem. Vim buscar e não ficaram prontos!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu estou sem óculos para trabalhar. Já é a segunda vez que eu venho aqui à toa.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor veio duas vezes e não foi atendido como merecia.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Vou ligar agora para o laboratório das lentes e te dou um retorno até as quatro da tarde, com a data certa.', cena: '📞' },
          { q: 'c', t: 'Tá bom. Vou esperar.', cena: '⏱️' },
          { q: 'a', t: 'Seu José, aqui é a Ana. Já confirmei: as lentes chegam amanhã às nove, e às dez os óculos já estão montados e ajustados para o senhor.', cena: '📱' },
          { q: 'c', t: 'Nossa, você me deu retorno antes da hora! Assim dá para confiar.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência, seu José. Amanhã eles já vão estar separados com o seu nome.', cena: '👓' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop',
        falas: [
          { q: 'c', t: 'Boa tarde. Olha, eu estou chateado. O Thor era para estar pronto às duas horas. Já são três e ainda não terminaram!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu saí do trabalho correndo para buscar. E ninguém me avisou do atraso.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não avisamos. Isso não está certo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Vou falar agora com o pessoal do banho e te digo em cinco minutos quanto tempo falta, certinho.', cena: '⏱️' },
          { q: 'c', t: 'Tá bom. Vou esperar.', cena: '🙂' },
          { q: 'a', t: 'Seu José, o Thor já está na secagem. Em dez minutos ele está prontinho. Enquanto isso, aceita um café?', cena: '☕' },
          { q: 'c', t: 'Aceito. E obrigado por me dar uma resposta de verdade.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. E da próxima vez, se houver qualquer atraso, eu mesma te aviso pelo WhatsApp.', cena: '📱' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia',
        falas: [
          { q: 'c', t: 'Boa tarde. Olha, eu estou chateado. Marquei às três horas e já são três e meia. Ninguém me chamou!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu saí do trabalho correndo para chegar no horário. E ninguém me avisou do atraso.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não avisamos. Isso não está certo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Vou ver agora com o cabeleireiro e te digo em cinco minutos quanto tempo falta, certinho.', cena: '⏱️' },
          { q: 'c', t: 'Tá bom. Vou esperar.', cena: '🙂' },
          { q: 'a', t: 'Seu José, ele termina o cliente dele em dez minutos e o próximo é o senhor. Enquanto isso, aceita um café?', cena: '☕' },
          { q: 'c', t: 'Aceito. E obrigado por me dar uma resposta de verdade.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. E da próxima vez, se houver qualquer atraso, eu mesma te aviso pelo WhatsApp.', cena: '📱' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A aula das sete foi cancelada de novo e ninguém avisou. Acordei cedo à toa!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'É a segunda vez neste mês. Eu me programo para vir antes do trabalho.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não avisamos. Isso não está certo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo o professor de musculação pode montar um treino para o senhor fazer hoje. E vou falar com a coordenação sobre a aula das sete.', cena: '🏋️' },
          { q: 'c', t: 'Tá bom. Vou treinar então.', cena: '🙂' },
          { q: 'a', t: 'Seu José, falei com a coordenação: a partir de amanhã a aula tem professor substituto garantido. E qualquer mudança, eu mesma te aviso.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Vou colocar o senhor na lista de aviso pelo WhatsApp.', cena: '📱' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. O café estava com um preço na prateleira e no caixa passou mais caro!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Não é a primeira vez. Eu confiro tudo, e sempre tem uma diferença.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O preço tinha que estar certo, e não estava.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo o senhor paga o preço da prateleira, e eu devolvo a diferença. E vou conferir as etiquetas do corredor do café até as onze horas.', cena: '🏷️' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, já conferi: três etiquetas estavam erradas e já foram trocadas. Obrigada por avisar.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Qualquer diferença, pode me chamar direto.', cena: '📱' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A encomenda de salgados era para as onze e só ficou pronta ao meio-dia. Os convidados esperando!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu me programei, avisei todo mundo do horário, e passei vergonha.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor combinou um horário e nós não cumprimos.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo eu vou devolver a taxa da encomenda. E vou ver com a cozinha o que aconteceu e te dou um retorno até as cinco horas.', cena: '🧾' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, já conversei com a cozinha: agora toda encomenda sai uma hora antes do combinado. E a taxa já foi devolvida.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Na próxima encomenda, eu mesma acompanho.', cena: '📱' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A aula do meu neto foi cancelada ontem e ninguém avisou. Fui buscar e não tinha aula!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'É a segunda vez. Eu saio do trabalho mais cedo para levar ele.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não avisamos. Isso não está certo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo eu marco a reposição dessa aula. E vou ver com a coordenação por que o aviso não saiu e te dou um retorno até as cinco horas.', cena: '📅' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, falei com a coordenação: a reposição é no sábado às nove, e agora todo cancelamento é avisado pelo WhatsApp no dia anterior.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Qualquer coisa, pode me chamar direto.', cena: '📱' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Vocês disseram que a TV ficava pronta ontem e não ficou. E ninguém me ligou!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu vim de longe só para buscar. Já é a segunda vez que adiam.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor veio de longe e nós não avisamos. Isso não está certo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo eu vou ver com o técnico em que pé está. E te dou um retorno até as três horas, com o prazo certo.', cena: '🛠️' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, a peça chegou e a TV fica pronta amanhã às dez. Como o senhor mora longe, nós vamos entregar na sua casa, sem custo.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Amanhã cedo eu te aviso quando sair para a entrega.', cena: '📱' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Deixei a calça para ajustar a barra, disseram que ficava pronta ontem, e não ficou!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu ia usar hoje numa reunião. Vim de propósito buscar.', cena: '😤' },
          { q: 'a', t: 'Sinto muito por isso, seu José. Entendo a sua chateação. O senhor se programou e nós não cumprimos o prazo.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo eu vou falar com a costureira. E te dou um retorno até as onze horas, com a calça pronta ou com uma solução.', cena: '🧵' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, a barra está pronta! E como o senhor perdeu a viagem, não vamos cobrar o ajuste.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Na próxima, eu mesma acompanho o seu ajuste.', cena: '📱' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária',
        falas: [
          { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Minha consulta era às nove e já são quase dez!', cena: '😠' },
          { q: 'a', t: 'Seu José, pode falar, eu estou ouvindo.', cena: '👂' },
          { q: 'c', t: 'Eu pedi para sair do trabalho. Não posso ficar a manhã inteira aqui.', cena: '😤' },
          { q: 'a', t: 'Sinto muito, seu José. O senhor tem toda a razão. O senhor se programou e nós não cumprimos o horário.', cena: '🙏' },
          { q: 'c', t: 'Pois é. E agora?', cena: '🤨' },
          { q: 'a', t: 'Agora mesmo eu vou ver com a doutora quanto falta. Em cinco minutos te dou a resposta. Se não der para entrar até as dez e quinze, garanto o primeiro horário de amanhã, às oito.', cena: '⏱️' },
          { q: 'c', t: 'Tá bom.', cena: '🙂' },
          { q: 'a', t: 'Seu José, a doutora atende o senhor agora, às dez em ponto. E já deixei a sua próxima consulta no primeiro horário, para não ter espera.', cena: '✅' },
          { q: 'c', t: 'Obrigado. Assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Obrigada pela paciência. Na próxima, eu mesma te aviso no WhatsApp se tiver qualquer atraso.', cena: '📱' }
        ]
      }
    },
    repare: [
      'Ouviu até o fim, sem interromper e sem se defender.',
      'Pediu desculpas pelo transtorno e mostrou que entendeu a chateação.',
      'Não culpou o fornecedor, o colega nem o cliente.',
      'Disse o que ia fazer e até que horas daria o retorno.',
      'Cumpriu, e deu o retorno antes do prometido.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Encomendei um sapato e me prometeram para ontem. Vim buscar e não chegou!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu precisava dele para amanhã. Já é a segunda vez que eu venho à toa.', cena: '😤' },
            { q: 'b', t: 'O fornecedor que atrasou. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E agora, quando chega?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Liga aí semana que vem.', cena: '📱' },
            { q: 'c', t: 'Pode cancelar. Eu compro em outro lugar.', cena: '😡' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Deixei meu carro ontem e me prometeram para hoje de manhã. Não está pronto!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu preciso do carro para trabalhar. Já remarquei um compromisso.', cena: '😤' },
            { q: 'b', t: 'A peça que atrasou. Reclama com o mecânico.', cena: '🤷' },
            { q: 'c', t: 'E agora, quando fica pronto?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Liga aí mais tarde.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu nunca mais trago o carro aqui.', cena: '😡' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Me prometeram meus óculos para ontem. Vim buscar e não ficaram prontos!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu estou sem óculos para trabalhar. Já é a segunda vez que eu venho à toa.', cena: '😤' },
            { q: 'b', t: 'O laboratório que atrasou. Reclama com eles.', cena: '🤷' },
            { q: 'c', t: 'E agora, quando ficam prontos?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Liga aí semana que vem.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu nunca mais faço óculos aqui.', cena: '😡' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop',
          falas: [
            { q: 'c', t: 'Boa tarde. Olha, eu estou chateado. O Thor era para estar pronto às duas horas. Já são três!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu saí do trabalho correndo para buscar. E ninguém me avisou.', cena: '😤' },
            { q: 'b', t: 'O tosador que está atrasado. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E agora, quanto tempo falta?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Espera aí.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu nunca mais trago o Thor aqui.', cena: '😡' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia',
          falas: [
            { q: 'c', t: 'Boa tarde. Olha, eu estou chateado. Marquei às três horas e já são três e meia. Ninguém me chamou!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu saí do trabalho correndo para chegar no horário. E ninguém me avisou.', cena: '😤' },
            { q: 'b', t: 'O cabeleireiro que atrasou. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E agora, quanto tempo falta?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Espera aí.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu nunca mais marco horário aqui.', cena: '😡' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A aula das sete foi cancelada de novo e ninguém avisou!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas é a segunda vez neste mês. Eu acordo cedo para vir.', cena: '😤' },
            { q: 'b', t: 'O professor que faltou. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E agora, vai ter aula amanhã?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Vem e vê.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu procuro outra academia.', cena: '😡' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. O café estava com um preço na prateleira e no caixa passou mais caro!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas não é a primeira vez. Sempre tem uma diferença.', cena: '😤' },
            { q: 'b', t: 'Quem coloca etiqueta é o repositor. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E a diferença, vocês devolvem?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Vê lá no caixa.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu compro em outro mercado.', cena: '😡' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A encomenda de salgados era para as onze e só ficou pronta ao meio-dia!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas os convidados ficaram esperando. Eu passei vergonha.', cena: '😤' },
            { q: 'b', t: 'Quem atrasou foi a cozinha. Reclama com eles.', cena: '🤷' },
            { q: 'c', t: 'E agora, o que vocês vão fazer?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Acontece.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu encomendo em outro lugar.', cena: '😡' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. A aula do meu neto foi cancelada ontem e ninguém avisou!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas é a segunda vez. Eu saio do trabalho mais cedo para levar ele.', cena: '😤' },
            { q: 'b', t: 'Quem faltou foi o professor. Reclama com ele.', cena: '🤷' },
            { q: 'c', t: 'E a aula perdida, vai ter reposição?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Vê lá depois.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu procuro outra escola.', cena: '😡' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Vocês disseram que a TV ficava pronta ontem e ninguém me ligou!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu vim de longe só para buscar. É a segunda vez.', cena: '😤' },
            { q: 'b', t: 'A peça não chegou. Reclama com o fornecedor.', cena: '🤷' },
            { q: 'c', t: 'E quando fica pronta?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Liga semana que vem.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu levo em outra assistência.', cena: '😡' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Deixei a calça para ajustar a barra e não ficou pronta!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu ia usar hoje. Vim de propósito buscar.', cena: '😤' },
            { q: 'b', t: 'Quem atrasou foi a costureira. Reclama com ela.', cena: '🤷' },
            { q: 'c', t: 'E quando fica pronta?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Volta semana que vem.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Eu compro em outra loja.', cena: '😡' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária',
          falas: [
            { q: 'c', t: 'Bom dia. Olha, eu estou chateado. Minha consulta era às nove e já são quase dez!', cena: '😠' },
            { q: 'b', t: 'Calma aí, chefe, não é culpa minha.', cena: '🙅' },
            { q: 'c', t: 'Mas eu pedi para sair do trabalho.', cena: '😤' },
            { q: 'b', t: 'Quem atrasou foi a doutora. Reclama com ela.', cena: '🤷' },
            { q: 'c', t: 'E quanto tempo ainda falta?', cena: '🤨' },
            { q: 'b', t: 'Não sei, não. Espera aí ou volta outro dia.', cena: '📱' },
            { q: 'c', t: 'Pode deixar. Vou procurar outro consultório.', cena: '😡' }
          ]
        }
      },
      erros: [
        'Se defendeu, em vez de ouvir até o fim.',
        'Pôs a culpa em outra pessoa e não pediu desculpas.',
        'Não disse o que ia fazer nem deu um prazo.'
      ]
    }
  },
  6: {
    titulo: 'Atendendo pelo WhatsApp',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês têm aquele tênis de caminhada no número quarenta e um?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar no estoque e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! O quarenta e um está disponível nas cores preto e azul.', cena: '👟' },
          { q: 'c', t: 'Que ótimo. Prefiro o azul.', cena: '🔵' },
          { q: 'a', t: 'Combinado! Posso separar o azul para o senhor buscar amanhã, a partir das nove?', cena: '📦' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só quando for sobre o seu pedido. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até amanhã, seu José! O tênis vai estar separado com o seu nome.', cena: '👋' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês têm horário para troca de óleo amanhã?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar a agenda e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Amanhã às oito ou às dez da manhã. Qual fica melhor?', cena: '📅' },
          { q: 'c', t: 'Às oito. E quanto fica, mais ou menos?', cena: '💰' },
          { q: 'a', t: 'Para o Onix, com óleo e filtro, já te mando o orçamento certinho aqui. Posso confirmar o horário das oito?', cena: '🛢️' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só quando for sobre o seu carro. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até amanhã às oito, seu José! O horário está reservado no seu nome.', cena: '👋' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês fazem lente com proteção para tela de computador?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou confirmar com o nosso técnico e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, fazemos sim! Para fazer certinho, precisamos da sua receita atual.', cena: '👓' },
          { q: 'c', t: 'Tenho aqui. Posso levar amanhã?', cena: '🧾' },
          { q: 'a', t: 'Pode sim! Amanhã a partir das nove a gente te atende e já mostra as opções de lente. Combinado?', cena: '📅' },
          { q: 'c', t: 'Combinado. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só quando for sobre os seus óculos. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até amanhã, seu José! Estou te esperando.', cena: '👋' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês têm horário para banho e tosa no sábado?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar a agenda e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Sábado às nove ou às onze. Qual fica melhor para o Thor?', cena: '📅' },
          { q: 'c', t: 'Às nove. Vocês buscam em casa?', cena: '🚗' },
          { q: 'a', t: 'Buscamos sim, aqui no bairro. Posso confirmar banho e tosa às nove, com busca às oito e meia?', cena: '🐶' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só quando for sobre o Thor. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até sábado, seu José! Manda um abraço para o Thor.', cena: '👋' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Tem horário para cortar o cabelo no sábado?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar a agenda e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Sábado às nove ou às onze. Qual fica melhor?', cena: '📅' },
          { q: 'c', t: 'Às nove. Dá para fazer a barba também?', cena: '🧔' },
          { q: 'a', t: 'Dá sim. Posso confirmar corte e barba no sábado às nove, com o Rafael?', cena: '💈' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para lembrar dos seus horários. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até sábado, seu José! Te mando um lembrete na sexta.', cena: '👋' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês têm aula experimental de funcional no sábado?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar a grade e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Sábado às oito ou às dez. Qual fica melhor?', cena: '📅' },
          { q: 'c', t: 'Às oito. Precisa levar alguma coisa?', cena: '🎒' },
          { q: 'a', t: 'Só roupa confortável, tênis e uma garrafinha de água. Posso confirmar o funcional no sábado às oito?', cena: '👟' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para lembrar das suas aulas. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até sábado, seu José! Te mando um lembrete na sexta.', cena: '👋' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês fazem entrega das compras aqui no meu bairro?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, fazemos sim! A entrega no seu bairro sai à tarde, entre duas e cinco horas. Quer que eu anote para amanhã?', cena: '🚚' },
          { q: 'c', t: 'Quero. Como eu mando a lista?', cena: '📝' },
          { q: 'a', t: 'Pode mandar a lista por aqui mesmo. Eu separo, confiro com o senhor e combino o horário da entrega.', cena: '🛒' },
          { q: 'c', t: 'Ótimo. Ah, e eu prefiro não receber promoção todo dia, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para combinar as suas entregas. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Fico aguardando a sua lista. Até amanhã, seu José!', cena: '👋' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês fazem bolo sem lactose?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou confirmar com a confeitaria e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, fazemos sim! Precisa encomendar com dois dias de antecedência. Para quando seria?', cena: '📅' },
          { q: 'c', t: 'Para sexta. Para umas dez pessoas.', cena: '🎂' },
          { q: 'a', t: 'Dá certinho. Bolo sem lactose de um quilo, para buscar na sexta às quatro horas. Posso confirmar?', cena: '🗓️' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para falar das suas encomendas. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até sexta, seu José! Te mando um lembrete na quinta.', cena: '👋' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Ainda tem vaga na turma de inglês de sábado?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, tem sim! Restam duas vagas, às nove da manhã. Quer que eu reserve uma?', cena: '📅' },
          { q: 'c', t: 'Quero. Precisa levar algum documento?', cena: '🎒' },
          { q: 'a', t: 'Só um documento do aluno e o comprovante de endereço. Posso reservar a vaga para o seu neto até quarta?', cena: '📄' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para falar das aulas dele. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até quarta, seu José! Te mando um lembrete na terça.', cena: '👋' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês trocam bateria de notebook?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou verificar e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, trocamos sim! Me manda uma foto da etiqueta de baixo do notebook, para eu ver o modelo da bateria?', cena: '🔋' },
          { q: 'c', t: 'Mandei a foto. Quanto tempo demora?', cena: '📷' },
          { q: 'a', t: 'Temos essa bateria aqui. A troca leva uma hora. Posso agendar para amanhã às nove?', cena: '📅' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só para falar dos seus serviços. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até amanhã às nove, seu José! Te mando um lembrete hoje à noite.', cena: '👋' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Vocês têm aquela camisa polo azul no tamanho G?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou olhar no estoque e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Uma azul e uma verde no G. Quer que eu mande uma foto das duas?', cena: '📷' },
          { q: 'c', t: 'Pode mandar. Gostei da azul. Dá para separar?', cena: '👕' },
          { q: 'a', t: 'Claro! Separo a azul no G até amanhã às seis da tarde. Pode ser?', cena: '🛍️' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só quando for sobre as suas compras. Obrigada!', cena: '✅' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até amanhã, seu José! A camisa fica aqui separada com o seu nome.', cena: '👋' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária, pelo WhatsApp',
        falas: [
          { q: 'c', t: 'Boa tarde. Tem horário para limpeza na sexta?', cena: '📱' },
          { q: 'a', t: 'Oi, seu José! Boa tarde, que bom falar com o senhor. Vou olhar a agenda e te respondo em instantes.', cena: '💬' },
          { q: 'c', t: 'Ok, obrigado.', cena: '🙂' },
          { q: 'a', t: 'Seu José, temos sim! Sexta às nove da manhã ou às três da tarde. Qual fica melhor?', cena: '🗓️' },
          { q: 'c', t: 'Às três está ótimo.', cena: '👍' },
          { q: 'a', t: 'Combinado! Limpeza na sexta, às três da tarde, com a doutora. Na quinta eu mando uma mensagem para confirmar, pode ser?', cena: '✅' },
          { q: 'c', t: 'Pode sim. Ah, e eu prefiro não receber promoção toda semana, tudo bem?', cena: '🔕' },
          { q: 'a', t: 'Claro, seu José, está anotado. Vou te chamar só sobre as suas consultas. Obrigada!', cena: '📝' },
          { q: 'c', t: 'Perfeito. Atendimento rápido assim dá gosto.', cena: '😃' },
          { q: 'a', t: 'Até sexta, seu José! O horário fica reservado com o seu nome.', cena: '👋' }
        ]
      }
    },
    repare: [
      'Respondeu rápido, mesmo sem ter a resposta pronta.',
      'Cumprimentou e usou o nome do cliente.',
      'Escreveu mensagens curtas, claras e educadas.',
      'Terminou combinando o próximo passo, com dia e hora.',
      'Respeitou o pedido de não receber promoções.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês têm aquele tênis de caminhada no número quarenta e um?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Qual tênis?', cena: '💬' },
            { q: 'c', t: 'O de caminhada, número quarenta e um.', cena: '👟' },
            { q: 'b', t: 'Tem que ver. Passa aí.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Tudo com dez por cento hoje!', cena: '📢' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês têm horário para troca de óleo amanhã?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Troca de quê?', cena: '💬' },
            { q: 'c', t: 'De óleo. Para amanhã, se der.', cena: '🛢️' },
            { q: 'b', t: 'Tem que ver. Passa aí cedo.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Alinhamento com dez por cento hoje!', cena: '📢' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês fazem lente com proteção para tela de computador?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Lente de quê?', cena: '💬' },
            { q: 'c', t: 'Com proteção para tela. Trabalho no computador.', cena: '💻' },
            { q: 'b', t: 'Tem que ver. Passa aí.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Armações com dez por cento hoje!', cena: '📢' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês têm horário para banho e tosa no sábado?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Para qual bicho?', cena: '💬' },
            { q: 'c', t: 'Para o Thor, o meu cachorro.', cena: '🐶' },
            { q: 'b', t: 'Tem que ver. Passa aí no sábado.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Ração com dez por cento hoje!', cena: '📢' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Tem horário para cortar o cabelo no sábado?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que horas?', cena: '💬' },
            { q: 'c', t: 'De manhã, se der. E a barba também.', cena: '🧔' },
            { q: 'b', t: 'Tem que ver. Passa aí no sábado.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Progressiva com dez por cento hoje!', cena: '📢' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês têm aula experimental de funcional no sábado?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Aula de quê?', cena: '💬' },
            { q: 'c', t: 'De funcional. No sábado de manhã.', cena: '👟' },
            { q: 'b', t: 'Tem que ver. Passa aí no sábado.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO RELÂMPAGO! Plano anual com dez por cento hoje!', cena: '📢' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês fazem entrega das compras aqui no meu bairro?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que bairro?', cena: '💬' },
            { q: 'c', t: 'Aqui no Centro. Queria para amanhã.', cena: '🚚' },
            { q: 'b', t: 'Tem que ver. Passa aí e pergunta.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção todo dia.', cena: '🔕' },
            { q: 'b', t: 'OFERTAS DO DIA! Carne, frios e bebidas com desconto só hoje!', cena: '📢' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês fazem bolo sem lactose?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Bolo de quê?', cena: '💬' },
            { q: 'c', t: 'Sem lactose. Para sexta, para dez pessoas.', cena: '🎂' },
            { q: 'b', t: 'Tem que ver. Passa aí e pergunta.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO! Leve 2 tortas e pague 1 só hoje!', cena: '📢' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Ainda tem vaga na turma de inglês de sábado?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Turma de quê?', cena: '💬' },
            { q: 'c', t: 'De inglês, no sábado. Para o meu neto.', cena: '🎒' },
            { q: 'b', t: 'Tem que ver. Passa aí e pergunta.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'MATRÍCULAS ABERTAS! Cinquenta por cento de desconto só hoje!', cena: '📢' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês trocam bateria de notebook?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Bateria de quê?', cena: '💬' },
            { q: 'c', t: 'De notebook. Queria trocar amanhã.', cena: '🔋' },
            { q: 'b', t: 'Tem que ver. Passa aí e traz.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO! Película e capinha pela metade do preço só hoje!', cena: '📢' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Vocês têm aquela camisa polo azul no tamanho G?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Camisa de quê?', cena: '💬' },
            { q: 'c', t: 'A polo azul, no G. Queria separar uma.', cena: '👕' },
            { q: 'b', t: 'Tem que ver. Passa aí e procura.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'LIQUIDAÇÃO! Tudo com trinta por cento de desconto só hoje!', cena: '📢' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Tem horário para limpeza na sexta?', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem faz duas horas...', cena: '⏰' },
            { q: 'b', t: 'Oi. Limpeza de quê?', cena: '💬' },
            { q: 'c', t: 'Dos dentes. Queria marcar na sexta.', cena: '🦷' },
            { q: 'b', t: 'Tem que ver. Liga aí amanhã.', cena: '🤷' },
            { q: 'c', t: 'Está bem. E, por favor, não quero receber promoção toda semana.', cena: '🔕' },
            { q: 'b', t: 'PROMOÇÃO! Clareamento com trinta por cento de desconto só hoje!', cena: '📢' }
          ]
        }
      },
      erros: [
        'Demorou horas para responder.',
        'Escreveu seco, sem cumprimentar e sem o nome do cliente.',
        'Não combinou o próximo passo e ignorou o pedido de não receber promoções.'
      ]
    }
  },
  7: {
    titulo: 'Lembrar do cliente depois da compra',
    pessoas: { a: { nome: 'Ana', papel: 'atendente' }, c: { nome: 'Seu José', papel: 'cliente' } },
    variantes: {
      geral: {
        rotulo: 'Exemplo numa loja de calçados, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da loja. Passando para saber: como ficou o sapato do casamento?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Ficou ótimo! Dancei a noite inteira e nem senti o pé.', cena: '💃' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz que deu tudo certo.', cena: '😊' },
          { q: 'c', t: 'Aliás, meu filho gostou e quer um igual para a formatura dele.', cena: '🎓' },
          { q: 'a', t: 'Que legal! Vou avisar agora o nosso responsável e separar o mesmo modelo para ele experimentar. Qual o número dele?', cena: '📦' },
          { q: 'c', t: 'Quarenta e dois.', cena: '🔢' },
          { q: 'a', t: 'Anotado! Assim que estiver separado, te mando uma mensagem.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma loja faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Um abraço, seu José!', cena: '🤝' }
        ]
      },
      auto_center: {
        rotulo: 'Exemplo num auto center, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da oficina. Passando para saber: como está o carro depois da troca dos pneus?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Está ótimo! Peguei chuva na estrada e o carro nem escorregou.', cena: '🌧️' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz que deu tudo certo.', cena: '😊' },
          { q: 'c', t: 'Aliás, o carro da minha esposa está precisando de alinhamento.', cena: '🚗' },
          { q: 'a', t: 'Que bom que lembrou! Vou avisar agora o nosso responsável para reservar um horário. Qual dia fica melhor para ela?', cena: '📅' },
          { q: 'c', t: 'Sábado de manhã.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que estiver confirmado, te mando uma mensagem. E na hora da próxima troca de óleo do Onix, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma oficina faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Um abraço, seu José!', cena: '🤝' }
        ]
      },
      otica: {
        rotulo: 'Exemplo numa ótica, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da ótica. Passando para saber: está se adaptando bem aos óculos novos?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Estou ótimo! No computador o olho não cansa mais.', cena: '💻' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz que deu tudo certo.', cena: '😊' },
          { q: 'c', t: 'Aliás, minha filha também quer fazer óculos novos.', cena: '👧' },
          { q: 'a', t: 'Que legal! Vou avisar agora o nosso responsável para separar algumas armações para ela. Ela já tem a receita?', cena: '📦' },
          { q: 'c', t: 'Tem sim, é de mês passado.', cena: '🧾' },
          { q: 'a', t: 'Ótimo! Assim que estiver tudo separado, te mando uma mensagem. E quando estiver perto do seu próximo exame de vista, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma ótica faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Um abraço, seu José!', cena: '🤝' }
        ]
      },
      pet: {
        rotulo: 'Exemplo num pet shop, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, do pet shop. Passando para saber: o Thor se adaptou bem à ração nova?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Se adaptou sim, está comendo direitinho.', cena: '🐶' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, minha esposa quer marcar um banho para a Mimi também.', cena: '🐱' },
          { q: 'a', t: 'Que legal! Vou avisar agora o nosso responsável para reservar um horário para ela. Qual dia fica melhor?', cena: '📅' },
          { q: 'c', t: 'Sexta à tarde.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que estiver confirmado, te mando uma mensagem. E quando estiver chegando a hora do próximo banho do Thor, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhum pet shop faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa, e dos bichinhos também. Um abraço, seu José!', cena: '🤝' }
        ]
      },
      beleza: {
        rotulo: 'Exemplo num salão / barbearia, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, do salão. Passando para saber: como foi a festa? O corte aguentou bem?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Foi ótima! Todo mundo elogiou o corte e a barba.', cena: '🎉' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, minha esposa quer marcar uma escova para o aniversário dela.', cena: '💁' },
          { q: 'a', t: 'Que legal! Vou avisar agora a nossa responsável para reservar um horário para ela. Qual dia fica melhor?', cena: '📅' },
          { q: 'c', t: 'Sexta à tarde.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que estiver confirmado, te mando uma mensagem. E quando estiver chegando a hora do seu próximo corte, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhum salão faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Um abraço, seu José!', cena: '🤝' }
        ]
      },
      academia: {
        rotulo: 'Exemplo numa academia, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da academia. Passando para saber: como foi o primeiro mês de treino?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Foi ótimo! Estou com muito mais disposição.', cena: '💪' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, meu filho quer começar a treinar também.', cena: '🧑' },
          { q: 'a', t: 'Que legal! Vou avisar agora o nosso responsável para agendar uma aula experimental para ele. Qual dia fica melhor?', cena: '📅' },
          { q: 'c', t: 'Segunda à noite.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que estiver confirmado, te mando uma mensagem. E no mês que vem é a sua reavaliação, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma academia faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Bom treino, seu José!', cena: '🤝' }
        ]
      },
      supermercado: {
        rotulo: 'Exemplo num supermercado, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, do supermercado. Passando para saber: deu tudo certo com o churrasco de domingo?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Foi ótimo! A carne rendeu direitinho e todo mundo elogiou.', cena: '🥩' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, mês que vem é a festa da minha filha. Queria encomendar salgados.', cena: '🎉' },
          { q: 'a', t: 'Que legal! Vou avisar agora o nosso responsável pela padaria para montar um orçamento. Para quantas pessoas, mais ou menos?', cena: '📅' },
          { q: 'c', t: 'Umas quarenta.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que o orçamento estiver pronto, te mando aqui. E obrigada por lembrar da gente.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhum mercado faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      },
      alimentacao: {
        rotulo: 'Exemplo numa confeitaria, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da confeitaria. Passando para saber: como foi o aniversário da sua mãe? Ela gostou do bolo?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Foi ótimo! Ela adorou e ainda comeu sem preocupação.', cena: '🎂' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, no Natal eu queria encomendar uma torta para a família.', cena: '🎄' },
          { q: 'a', t: 'Que legal! Vou avisar agora a nossa confeiteira para separar uma data para o senhor. Para quantas pessoas, mais ou menos?', cena: '📅' },
          { q: 'c', t: 'Umas quinze.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que o cardápio de Natal sair, te mando aqui. E obrigada por lembrar da gente.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma confeitaria faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      },
      educacao: {
        rotulo: 'Exemplo numa escola de cursos, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da escola. Passando para saber: como foi o primeiro mês do seu neto no inglês?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Foi ótimo! A nota dele na escola já melhorou.', cena: '📈' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, a irmã dele também quer fazer um curso.', cena: '👧' },
          { q: 'a', t: 'Que legal! Vou avisar agora a nossa coordenadora para marcar uma conversa e ver o curso certo para ela. Qual dia fica melhor?', cena: '📅' },
          { q: 'c', t: 'Sexta à tarde.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Assim que estiver confirmado, te mando aqui. E no fim do semestre tem a apresentação da turma, a gente te avisa.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma escola faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      },
      servicos: {
        rotulo: 'Exemplo numa assistência técnica, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da assistência. Passando para saber: a bateria nova do notebook está durando bem?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Está ótima! Agora dura a tarde inteira.', cena: '🔋' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, o computador da minha filha está desligando sozinho.', cena: '🖥️' },
          { q: 'a', t: 'Que pena! Vou avisar agora o nosso técnico para dar uma olhada. Ela pode trazer em qual dia?', cena: '📅' },
          { q: 'c', t: 'Sábado de manhã.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Já deixo reservado para sábado às nove. E daqui a seis meses eu te lembro da limpeza do notebook.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma assistência faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      },
      roupas: {
        rotulo: 'Exemplo numa loja de roupas, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da loja. Passando para saber: as calças de trabalho ficaram confortáveis?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Ficaram ótimas! Nem sinto calor.', cena: '👖' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz.', cena: '😊' },
          { q: 'c', t: 'Aliás, meu filho precisa de roupa social para uma entrevista de emprego.', cena: '👔' },
          { q: 'a', t: 'Que legal, boa sorte para ele! Vou avisar agora o nosso vendedor de moda social para separar opções no tamanho dele. Qual dia ele pode vir?', cena: '📅' },
          { q: 'c', t: 'Quinta à tarde.', cena: '🗓️' },
          { q: 'a', t: 'Anotado! Deixo tudo separado para quinta. E quando chegar a coleção de verão, eu te mostro as bermudas que o senhor gosta.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhuma loja faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      },
      odonto: {
        rotulo: 'Exemplo numa clínica dentária, pelo WhatsApp',
        falas: [
          { q: 'a', t: 'Oi, seu José! Aqui é a Ana, da clínica. Passando para saber: como o senhor está depois do tratamento de ontem?', cena: '📱' },
          { q: 'c', t: 'Oi, Ana! Estou bem! Nem precisei do remédio.', cena: '🦷' },
          { q: 'a', t: 'Que notícia boa! Fico muito feliz. Se sentir qualquer coisa, me avisa que eu falo com a doutora na hora.', cena: '😊' },
          { q: 'c', t: 'Aliás, minha esposa quer fazer uma avaliação também.', cena: '👫' },
          { q: 'a', t: 'Que bom! Vou falar agora com a doutora e já te mando dois horários para a dona Maria. Ela prefere de manhã ou à tarde?', cena: '📅' },
          { q: 'c', t: 'De manhã.', cena: '🌅' },
          { q: 'a', t: 'Anotado! Te mando os horários da manhã ainda hoje. E daqui a seis meses eu te lembro da sua revisão.', cena: '✅' },
          { q: 'c', t: 'Obrigado pela lembrança, Ana. Nenhum consultório faz isso.', cena: '😃' },
          { q: 'a', t: 'A gente gosta de cuidar de quem é da casa. Até breve, seu José!', cena: '🤝' }
        ]
      }
    },
    repare: [
      'Procurou o cliente depois da venda, sem ele pedir.',
      'Perguntou como ficou, interessada no resultado e não só na venda.',
      'Respondeu rápido e com carinho.',
      'Quando ele mostrou interesse em comprar, avisou o responsável na hora.',
      'Combinou o próximo passo e agradeceu.'
    ],
    ruim: {
      pessoa: { nome: 'Beto', papel: 'atendente' },
      variantes: {
        geral: {
          rotulo: 'Exemplo numa loja de calçados, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Comprei um sapato social aí no mês passado.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Qual sapato?', cena: '💬' },
            { q: 'c', t: 'O social preto, do casamento. Meu filho gostou e quer um igual para a formatura.', cena: '🎓' },
            { q: 'b', t: 'Não lembro, não. Passa aí e procura na loja.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vou procurar em outro lugar.', cena: '😠' }
          ]
        },
        auto_center: {
          rotulo: 'Exemplo num auto center, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Troquei os pneus do meu carro aí no mês passado.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Qual carro?', cena: '💬' },
            { q: 'c', t: 'O Onix prata. O carro da minha esposa está precisando de alinhamento.', cena: '🚗' },
            { q: 'b', t: 'Não lembro, não. Passa aí que a gente vê.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vou procurar outra oficina.', cena: '😠' }
          ]
        },
        otica: {
          rotulo: 'Exemplo numa ótica, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Fiz meus óculos aí no mês passado.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Quais óculos?', cena: '💬' },
            { q: 'c', t: 'Os de computador. Minha filha também quer fazer óculos novos.', cena: '👓' },
            { q: 'b', t: 'Não lembro, não. Manda ela passar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outra ótica.', cena: '😠' }
          ]
        },
        pet: {
          rotulo: 'Exemplo num pet shop, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Comprei a ração nova do Thor aí no mês passado.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Quem é Thor?', cena: '💬' },
            { q: 'c', t: 'O meu cachorro. Minha esposa quer marcar um banho para a Mimi, a gata dela.', cena: '🐱' },
            { q: 'b', t: 'Não lembro, não. Passa aí que a gente vê.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outro pet shop.', cena: '😠' }
          ]
        },
        beleza: {
          rotulo: 'Exemplo num salão / barbearia, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Cortei o cabelo e fiz a barba aí para uma festa.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Cortou com quem?', cena: '💬' },
            { q: 'c', t: 'Com vocês mesmo. Minha esposa quer marcar uma escova para o aniversário dela.', cena: '💁' },
            { q: 'b', t: 'Não lembro, não. Manda ela passar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outro salão.', cena: '😠' }
          ]
        },
        academia: {
          rotulo: 'Exemplo numa academia, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Faz um mês que eu treino aí.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Treina em que horário?', cena: '💬' },
            { q: 'c', t: 'De manhã. Meu filho quer começar a treinar também.', cena: '🧑' },
            { q: 'b', t: 'Não lembro, não. Manda ele passar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outra academia.', cena: '😠' }
          ]
        },
        supermercado: {
          rotulo: 'Exemplo num supermercado, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Comprei a carne do churrasco aí no domingo.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Comprou o quê?', cena: '💬' },
            { q: 'c', t: 'A carne do churrasco. Queria encomendar salgados para a festa da minha filha.', cena: '🎉' },
            { q: 'b', t: 'Não lembro, não. Passa aí e vê com a padaria.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vou encomendar em outro lugar.', cena: '😠' }
          ]
        },
        alimentacao: {
          rotulo: 'Exemplo numa confeitaria, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Encomendei o bolo do aniversário da minha mãe aí.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que bolo?', cena: '💬' },
            { q: 'c', t: 'O de laranja, de oitenta anos. Queria encomendar uma torta para o Natal.', cena: '🎄' },
            { q: 'b', t: 'Não lembro, não. Passa aí e vê o cardápio.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vou encomendar em outro lugar.', cena: '😠' }
          ]
        },
        educacao: {
          rotulo: 'Exemplo numa escola de cursos, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Meu neto estuda inglês aí faz um mês.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Qual turma?', cena: '💬' },
            { q: 'c', t: 'A de sábado. A irmã dele também quer fazer um curso.', cena: '👧' },
            { q: 'b', t: 'Não lembro, não. Manda ela passar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outra escola.', cena: '😠' }
          ]
        },
        servicos: {
          rotulo: 'Exemplo numa assistência técnica, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Troquei a bateria do notebook aí semana passada.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que notebook?', cena: '💬' },
            { q: 'c', t: 'O meu. O computador da minha filha está desligando sozinho.', cena: '🖥️' },
            { q: 'b', t: 'Não lembro, não. Manda ela trazer aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outra assistência.', cena: '😠' }
          ]
        },
        roupas: {
          rotulo: 'Exemplo numa loja de roupas, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Comprei umas calças de trabalho aí.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que calças?', cena: '💬' },
            { q: 'c', t: 'As de sarja. Meu filho precisa de roupa social para uma entrevista.', cena: '👔' },
            { q: 'b', t: 'Não lembro, não. Manda ele passar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outra loja.', cena: '😠' }
          ]
        },
        odonto: {
          rotulo: 'Exemplo numa clínica dentária, pelo WhatsApp',
          falas: [
            { q: 'c', t: 'Boa tarde. Aqui é o José. Fiz um tratamento aí ontem.', cena: '📱' },
            { q: 'c', t: 'Oi? Mandei mensagem ontem...', cena: '⏰' },
            { q: 'b', t: 'Oi. Que tratamento?', cena: '💬' },
            { q: 'c', t: 'Com a doutora. Minha esposa quer marcar uma avaliação também.', cena: '👫' },
            { q: 'b', t: 'Não lembro, não. Manda ela ligar aí.', cena: '🤷' },
            { q: 'c', t: 'Deixa pra lá. Vamos procurar outro consultório.', cena: '😠' }
          ]
        }
      },
      erros: [
        'Não procurou o cliente depois da compra para saber como ficou.',
        'Não lembrava do cliente nem do que ele tinha comprado.',
        'Diante de uma nova compra, mandou o cliente se virar, em vez de ajudar.'
      ]
    }
  }
};
