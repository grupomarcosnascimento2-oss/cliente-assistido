/* Cliente Assistido – curso Cliente Encantado: partes escritas da lição adaptadas ao ramo da loja (1.67.0).
   window.CA_LICAO_RAMO[ramo] = { rotulo, licoes: { n: { ler, desafio, pergunta, opcoes, certa } } }.
   Troca só o Leia, o Faça hoje e a pergunta; a narração (áudio gravado) e o cartão continuam os mesmos para todos.
   treino.js licaoR(l) junta isto com a lição da trilha quando a loja é do ramo. */
'use strict';
window.CA_LICAO_RAMO = {
  hotelaria: {
    rotulo: 'no dia a dia do hotel',
    licoes: {
      1: {
        ler: [
          'O hóspede que não volta raramente reclama no balcão: ele some, escolhe outro hotel e conta para os outros, inclusive nas avaliações da internet.',
          'Na hora de escolher onde se hospedar de novo, o atendimento pesa tanto quanto o valor da diária.',
          'Trazer de volta quem já se hospedou custa menos do que conquistar um hóspede novo.',
          'Bom atendimento não depende de cortesia paga: depende de atenção e cuidado, da recepção à governança.'
        ],
        desafio: 'Observe um check-in ou um check-out (seu ou de um colega) e anote uma coisa que deixou o hóspede satisfeito.',
        pergunta: 'Um hóspede fez o check-out atendido com pressa e saiu sem reclamar. O que é mais provável que aconteça?',
        opcoes: ['Ele volta normalmente, já que não reclamou.', 'Ele pode escolher outro hotel na próxima viagem e ainda comentar com outras pessoas.', 'Ele vai ligar para a gerência para fazer uma reclamação formal.'],
        certa: 1
      },
      2: {
        ler: [
          'Perceba o hóspede assim que ele entrar na recepção, mesmo ao telefone: um sorriso e um "já te atendo".',
          'Cumprimente sempre: bom dia, boa tarde, seja bem-vindo ao hotel.',
          'Celular e computador de lado por um instante: olhe para a pessoa enquanto ela fala.',
          'Quem chega de viagem está cansado: ofereça um lugar para sentar e uma água enquanto espera.'
        ],
        desafio: 'Cumprimente todo hóspede em até 10 segundos depois que ele entrar na recepção, mesmo que não possa atender na hora.',
        pergunta: 'Você está fazendo um check-in e outro hóspede chega à recepção com as malas. O que fazer?',
        opcoes: ['Continuar o check-in e só falar com ele quando terminar.', 'Olhar para ele, cumprimentar e avisar que já vai atendê-lo.', 'Interromper o check-in para atender quem chegou.'],
        certa: 1
      },
      3: {
        ler: [
          'O nome está na reserva: use desde o primeiro "seja bem-vindo, seu José".',
          'Use o nome duas ou três vezes na estadia, sem exagero: no check-in, no café da manhã, na saída.',
          'Na volta do hóspede, lembre algo dele: o quarto preferido, o travesseiro, o motivo da última viagem.',
          'Esqueceu? Confira a reserva ou pergunte de novo com gentileza. Evite "amigo" e "chefe".'
        ],
        desafio: 'Chame pelo nome pelo menos 3 hóspedes hoje e registre no sistema do hotel uma preferência de cada um.',
        pergunta: 'Um hóspede que já se hospedou antes volta e você não lembra o nome dele. O que fazer?',
        opcoes: ['Chamá-lo de "amigo" para disfarçar.', 'Conferir a reserva ou perguntar com gentileza: "Me lembra o seu nome?"', 'Evitar falar o nome durante toda a estadia.'],
        certa: 1
      },
      4: {
        ler: [
          'Deixe o hóspede terminar de falar antes de sugerir quarto, passeio ou serviço.',
          'Faça pelo menos duas perguntas: é viagem a trabalho ou a passeio? Quantas pessoas vêm? Chegam a que horas?',
          'Repita o que entendeu para confirmar.',
          'Ofereça o quarto que resolve a necessidade dele, não a suíte mais cara.'
        ],
        desafio: 'Antes de oferecer qualquer quarto ou serviço, faça duas perguntas ao hóspede.',
        pergunta: 'Uma pessoa liga dizendo: "Quero reservar um quarto para o fim de semana". Qual é o melhor primeiro passo?',
        opcoes: ['Oferecer logo a suíte mais cara.', 'Perguntar quantas pessoas vêm e qual é o motivo da viagem.', 'Passar o valor da diária mais barata e encerrar a ligação.'],
        certa: 1
      },
      5: {
        ler: [
          'Ouça até o fim, sem se defender, mesmo que o problema seja da governança ou da manutenção.',
          'Peça desculpas pelo transtorno.',
          'Diga o que vai fazer e até quando ("em dez minutos te dou a resposta") e cumpra.',
          'Não discuta e não culpe colegas na frente do hóspede.'
        ],
        desafio: 'Na próxima reclamação de hóspede, siga os quatro passos: ouvir, pedir desculpas, dizer o que vai fazer e cumprir.',
        pergunta: 'O hóspede desce irritado porque o ar-condicionado do quarto não funciona. O que fazer primeiro?',
        opcoes: ['Explicar que a culpa é da manutenção, que não fez a revisão.', 'Ouvir até o fim e pedir desculpas pelo transtorno.', 'Oferecer na hora um desconto na diária para encerrar o assunto.'],
        certa: 1
      },
      6: {
        ler: [
          'Responda rápido; se precisar ver a disponibilidade, avise que já retorna.',
          'Cumprimente, use o nome e agradeça o contato.',
          'Mensagens curtas e claras: datas, número de pessoas e o que está incluído. Evite áudio longo e gíria.',
          'Termine sempre com o próximo passo: até quando o quarto fica reservado.',
          'Quem pediu para não receber promoções não recebe.'
        ],
        desafio: 'Responda toda mensagem de hóspede em até 15 minutos durante o seu turno.',
        pergunta: 'Uma pessoa pergunta pelo WhatsApp se há quarto para o próximo feriado e você precisa confirmar no sistema de reservas. O que fazer?',
        opcoes: ['Esperar ter a confirmação para só então responder.', 'Responder logo que vai verificar e retornar em instantes, e depois retornar.', 'Mandar um áudio longo explicando todos os quartos e preços do hotel.'],
        certa: 1
      },
      7: {
        ler: [
          'O relacionamento continua depois do check-out.',
          'Um "chegou bem? como foi a estadia?" depois da viagem mostra cuidado com a experiência.',
          'Parabéns no aniversário e um convite na época certa (férias, feriados, eventos da cidade) trazem o hóspede de volta.',
          'O Cliente Assistido mostra para quem mandar mensagem todo dia; o envio é sempre feito por uma pessoa.',
          'Hóspede respondeu com interesse em voltar? Avise a reserva na hora.'
        ],
        desafio: 'Mande um "como foi a estadia?" para um hóspede que fez o check-out nesta semana.',
        pergunta: 'Um casal passou o fim de semana no hotel e fez o check-out ontem. Qual é a melhor atitude?',
        opcoes: ['Esperar eles fazerem uma nova reserva.', 'Mandar uma mensagem agradecendo e perguntando como foi a estadia.', 'Mandar promoções de diárias todos os dias.'],
        certa: 1
      }
    }
  }
};
