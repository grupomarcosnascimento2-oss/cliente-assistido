// 1.64.0: função usada só para gerar falas do curso com a voz da OpenAI (gpt-4o-mini-tts) e gravar no Storage, bucket público curso-audio.
// Usada em 08/11/2026 (Cliente Encantado) e em 13/11/2026 (Fraternidade Viva, fv/daniele/). Hoje está DESLIGADA (responde 410).
// Para gerar de novo: publicar uma versão que receba {voz, texto, instr, caminho}, chame https://api.openai.com/v1/audio/speech com a chave
// OPENAI_API_KEY/OPEN_API_KEY e grave com a service role; proteger com um token próprio e desligar depois. Nunca deixar o token no repositório.
Deno.serve(() => new Response(JSON.stringify({ erro: 'desligada' }), { status: 410, headers: { 'Content-Type': 'application/json' } }));
