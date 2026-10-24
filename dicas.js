/* Cliente Assistido – Faixa de dicas acima das abas (versão 1.25.0).
   Uma frase por vez atravessa a faixa (entra pela direita e sai pela esquerda, para a leitura seguir a ordem das palavras)
   numa velocidade que dá para ler; ao terminar, vem a próxima. Tocar pausa e toca de novo continua.
   Cada abertura do app começa por uma dica diferente (ca_dica no aparelho). Quem pediu menos movimento no celular vê a frase parada, trocando a cada 9 segundos. */
'use strict';
(function () {
  const DICAS = [
    'Quem é lembrado, vende mais: uma mensagem simples hoje pode ser a venda de amanhã.',
    'Cliente que se sente lembrado volta mais vezes e indica a loja para os amigos.',
    'Manter quem já conhece a loja custa bem menos do que conquistar um cliente novo.',
    'Chame o cliente pelo nome: atenção pessoal vale mais do que qualquer promoção.',
    'Um parabéns no dia do aniversário é lembrado por muito tempo.',
    'Constância vence volume: poucas mensagens todo dia valem mais do que muitas de uma vez.',
    'O cliente respondeu? Responda rápido. Quem atende na hora mostra que se importa.',
    'Pergunte "como ficou?" depois da compra: o pós-venda é o começo da próxima venda.',
    'Cliente sumido não é cliente perdido: uma mensagem gentil traz muita gente de volta.',
    'Respeite quem pede para não receber mensagens: relacionamento é confiança, não insistência.',
    'Ouça o cliente: uma opinião sincera ajuda a loja a melhorar.',
    'Mensagem boa é curta, gentil e tem o nome da loja.'
  ];
  const VELOC = 55; // pixels por segundo: rápido o bastante para andar, devagar o bastante para ler
  const caixa = document.getElementById('dicas'), tx = document.getElementById('dicasTx');
  if (!caixa || !tx) return;
  // 1.25.1: cada vez que o app abre (login ou atualizar a página) começa pela dica seguinte à da última vez.
  const ler = () => { try { return parseInt(localStorage.getItem('ca_dica') || '0', 10) || 0; } catch (e) { return 0; } };
  const gravar = n => { try { localStorage.setItem('ca_dica', String(n)); } catch (e) {} };
  let i = ler() % DICAS.length, timer = null;
  gravar((i + 1) % DICAS.length);
  const parado = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrar() {
    tx.textContent = DICAS[i];
    i = (i + 1) % DICAS.length;
    gravar(i);
    tx.classList.remove('anda');
    if (parado()) { clearTimeout(timer); timer = setTimeout(mostrar, 9000); return; }
    void tx.offsetWidth; // reinicia a animação
    // percurso = largura da faixa (o recuo inicial) + largura do texto
    tx.style.animationDuration = Math.max(6, tx.scrollWidth / VELOC) + 's';
    tx.classList.add('anda');
  }
  tx.addEventListener('animationend', mostrar);
  caixa.addEventListener('click', () => caixa.classList.toggle('pausa'));
  mostrar();
})();
