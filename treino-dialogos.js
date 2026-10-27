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
      }
    },
    repare: [
      'Recebeu com um bom dia e um sorriso, logo que o cliente chegou.',
      'Agradeceu o cliente por ter voltado, em vez de ficar na defensiva.',
      'Perguntou o nome e passou a chamar o cliente por ele.',
      'Resolveu na hora, sem discutir e sem fazer o cliente se sentir um incômodo.',
      'Conferiu se ficou bom e deixou a porta aberta: "qualquer coisa, me chama".'
    ],
    // 1.47.0: exemplo NEGATIVO antes do positivo (contraste). Mesmo cliente, outro atendente (Beto). Por enquanto só na lição 1, variante geral.
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
      }
    },
    repare: [
      'Percebeu o cliente assim que ele entrou, mesmo ocupada com outra pessoa.',
      'Cumprimentou na hora e avisou: já vou te atender, só um minutinho.',
      'Agradeceu pela espera antes de começar o atendimento.',
      'Guardou o celular e deu atenção total, olhando para o cliente.',
      'Convidou a sentar e deixou o cliente à vontade.'
    ]
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
      }
    },
    repare: [
      'Chamou o cliente pelo nome logo que ele chegou.',
      'Lembrou da última compra e perguntou se ficou bom.',
      'Perguntou o nome de quem ela ainda não conhecia, com naturalidade.',
      'Usou os nomes durante a conversa, sem exagero.',
      'Tratou cada pessoa com carinho, sem chamar de amigo ou chefe.'
    ]
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
      }
    },
    repare: [
      'Deixou o cliente falar até o fim, sem interromper.',
      'Fez perguntas para entender a ocasião e o que incomodava.',
      'Repetiu com as próprias palavras o que entendeu.',
      'Só depois ofereceu a solução, e a que fazia sentido para ele.',
      'Explicou o porquê, sem empurrar o produto mais caro.'
    ]
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
      }
    },
    repare: [
      'Ouviu até o fim, sem interromper e sem se defender.',
      'Pediu desculpas pelo transtorno e mostrou que entendeu a chateação.',
      'Não culpou o fornecedor, o colega nem o cliente.',
      'Disse o que ia fazer e até que horas daria o retorno.',
      'Cumpriu, e deu o retorno antes do prometido.'
    ]
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
      }
    },
    repare: [
      'Respondeu rápido, mesmo sem ter a resposta pronta.',
      'Cumprimentou e usou o nome do cliente.',
      'Escreveu mensagens curtas, claras e educadas.',
      'Terminou combinando o próximo passo, com dia e hora.',
      'Respeitou o pedido de não receber promoções.'
    ]
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
      }
    },
    repare: [
      'Procurou o cliente depois da venda, sem ele pedir.',
      'Perguntou como ficou, interessada no resultado e não só na venda.',
      'Respondeu rápido e com carinho.',
      'Quando ele mostrou interesse em comprar, avisou o responsável na hora.',
      'Combinou o próximo passo e agradeceu.'
    ]
  }
};
