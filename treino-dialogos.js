/* Cliente Assistido – Curso: "Na prática" (1.38.0). Diálogo demonstrativo entre duas pessoas, com duas vozes,
   mostrando COMO fazer o que a lição ensina. Um diálogo por lição (por enquanto só a lição 1, para aprovação do Marcos).
   Cada diálogo tem variantes por ramo da loja (o ramo vem do cadastro da loja, mesma chave de RAMO_TXT em auth.js: auto_center, otica...); sem variante para o ramo, usa a 'geral'. Ramos preparados: auto_center e otica (1.38.5). Ao criar o diálogo das lições 2 a 7, escrever também as variantes auto_center e otica.
   Fala: { q: 'a' (atendente) | 'c' (cliente), t: texto, cena: emoji que aparece no balcão }. */
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
      }
    },
    repare: [
      'Recebeu com um bom dia e um sorriso, logo que o cliente chegou.',
      'Agradeceu o cliente por ter voltado, em vez de ficar na defensiva.',
      'Perguntou o nome e passou a chamar o cliente por ele.',
      'Resolveu na hora, sem discutir e sem fazer o cliente se sentir um incômodo.',
      'Conferiu se ficou bom e deixou a porta aberta: "qualquer coisa, me chama".'
    ]
  }
};
