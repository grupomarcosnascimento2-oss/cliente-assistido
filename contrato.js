/* Cliente Assistido – Contrato de licença de uso (12 meses). Fonte única do texto (versão 1.20.0):
   usado pelo app (aceite digital, ver e imprimir) e pela minuta em Word (campos em branco).
   ANTES DE LIGAR O CONTRATO DIGITAL: preencher CONTRATADA abaixo e passar o texto por advogado. */
(function (root) {
  'use strict';
  const VERSAO = '1.0';
  // Dados de quem fornece a licença. Enquanto houver colchetes, o Admin avisa que falta preencher.
  const CONTRATADA = {
    nome: '[Razão social ou nome do titular do Cliente Assistido]',
    doc: '[CNPJ ou CPF]',
    endereco: '[endereço completo]'
  };
  const LINHA = '____________________';
  const PLANOS = { basico: 'CA Essencial', premium: 'CA Premium' };
  const v = (x, vazio) => (x !== undefined && x !== null && String(x).trim() !== '') ? String(x).trim() : (vazio || LINHA);
  const dataBR = iso => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
  function maisUmAno(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    const x = new Date(y + 1, m - 1, d - 1);
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  }
  const pendente = () => /\[/.test(CONTRATADA.nome + CONTRATADA.doc + CONTRATADA.endereco);

  /* d: { loja, doc, cidade, responsavel, plano ('basico'|'premium'), acessos, inicio (AAAA-MM-DD), valor (texto livre) }
     Sem dados (minuta em Word), cada campo vira uma linha para preencher. */
  function montar(d) {
    d = d || {};
    const premium = d.plano === 'premium';
    const plano = d.plano ? PLANOS[d.plano] || d.plano : 'CA Essencial ( ) ou CA Premium ( )';
    const ini = d.inicio ? dataBR(d.inicio) : LINHA, fim = d.inicio ? dataBR(maisUmAno(d.inicio)) : LINHA;
    const clausulas = [
      { t: 'Partes', p: [
        `CONTRATADA: ${CONTRATADA.nome}, inscrita no ${CONTRATADA.doc}, com endereço em ${CONTRATADA.endereco}.`,
        `CONTRATANTE: ${v(d.loja)}, inscrita no CNPJ/CPF ${v(d.doc)}, com sede em ${v(d.cidade)}, representada por ${v(d.responsavel)}.`
      ] },
      { t: '1. Objeto', p: [
        `Licença de uso, não exclusiva e intransferível, do aplicativo Cliente Assistido (CA), no plano ${plano}, com até ${v(d.acessos, '____')} acesso(s) de usuários, para a CONTRATANTE manter o relacionamento com os próprios clientes pelo WhatsApp. Todo envio de mensagem é feito manualmente por uma pessoa.`
      ] },
      { t: '2. Prazo', p: [
        `12 (doze) meses, de ${ini} a ${fim}. A renovação por igual período depende de acordo entre as partes, que pode ser feito por aceite no próprio aplicativo.`
      ] },
      { t: '3. Preço e pagamento', p: [
        `Valor e forma de pagamento: ${v(d.valor, LINHA + LINHA)}. O atraso superior a 10 (dez) dias permite suspender o acesso até a regularização, sem apagar os dados guardados no aparelho da CONTRATANTE.`
      ] },
      { t: '4. Obrigações da CONTRATADA', p: [
        'Manter o aplicativo disponível, salvo manutenções programadas e falhas de fornecedores; prestar suporte pelo canal informado na contratação; tratar os dados conforme a Política de Privacidade e a Lei 13.709/2018 (LGPD).' +
        (premium ? ' No plano Premium, operar as campanhas por meio de operador da CONTRATADA, com envio manual, somente de campanhas aprovadas pela CONTRATANTE, mantendo sigilo sobre os clientes e as conversas.'
          : d.plano ? '' : ' Somente no plano Premium: operar as campanhas por meio de operador da CONTRATADA, com envio manual, somente de campanhas aprovadas pela CONTRATANTE, mantendo sigilo sobre os clientes e as conversas.')
      ] },
      { t: '5. Obrigações da CONTRATANTE', p: [
        'Usar o aplicativo conforme os Termos de Uso: envio manual, somente para quem já conhece a loja, sem disparo em massa e respeitando quem pedir para não receber mensagens; responder pelo conteúdo das mensagens e pela base legal dos dados dos seus clientes; manter os acessos protegidos e desativar quem deixar a equipe; pagar em dia.'
      ] },
      { t: '6. Dados pessoais', p: [
        'A CONTRATANTE é controladora dos dados dos seus clientes, e a CONTRATADA atua como operadora, apenas para prestar o serviço. Ao fim do contrato, a lista de clientes continua com a CONTRATANTE, e a cópia guardada no servidor da CONTRATADA é apagada em até 30 (trinta) dias, salvo obrigação legal.'
      ] },
      { t: '7. Responsabilidade', p: [
        'O aplicativo é uma ferramenta de apoio e não garante vendas ou resultados. Restrições aplicadas pelo WhatsApp ao número da CONTRATANTE por uso em desacordo com os Termos de Uso não são de responsabilidade da CONTRATADA, cuja responsabilidade fica limitada ao valor pago nos últimos 3 (três) meses, salvo disposição legal em contrário.'
      ] },
      { t: '8. Rescisão', p: [
        'Qualquer parte pode encerrar o contrato com aviso de 30 (trinta) dias. O descumprimento dos Termos de Uso permite a suspensão imediata do acesso. Valores de período já utilizado não são devolvidos.'
      ] },
      { t: '9. Documentos que fazem parte do contrato', p: [
        'Termos de Uso (cliente-assistido.vercel.app/termos.html) e Política de Privacidade (cliente-assistido.vercel.app/privacidade.html), nas versões vigentes.'
      ] },
      { t: '10. Assinatura e foro', p: [
        'As partes reconhecem como válidos a assinatura eletrônica e o aceite no aplicativo, que registra data, hora, usuário e aparelho (art. 10, § 2º, da Medida Provisória 2.200-2/2001). Fica eleito o foro do domicílio da CONTRATANTE.'
      ] }
    ];
    return { titulo: 'Contrato de licença de uso do aplicativo Cliente Assistido', versao: VERSAO, clausulas, inicio: ini, fim };
  }
  // Texto corrido (para guardar junto com o aceite e para imprimir).
  function texto(d) { const c = montar(d); return [c.titulo.toUpperCase()].concat(c.clausulas.map(x => x.t + '\n' + x.p.join('\n'))).join('\n\n'); }

  const API = { VERSAO, CONTRATADA, montar, texto, maisUmAno, dataBR, pendente };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CA_CONTRATO = API;
})(typeof window !== 'undefined' ? window : this);
