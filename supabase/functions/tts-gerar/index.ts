// 1.64.0: função usada UMA vez (08/11/2026) para gerar as falas das boas-vindas do curso com a voz da OpenAI
// (modelo gpt-4o-mini-tts, vozes coral, nova, shimmer, marin e sage) e gravar no Storage, bucket público curso-audio,
// em bv/<voz>/tela<1..3>.mp3. Hoje está DESLIGADA (responde 410). Para gerar de novo: publicar uma versão que receba
// {voz, texto, instr, caminho}, chame https://api.openai.com/v1/audio/speech com a chave OPENAI_API_KEY/OPEN_API_KEY
// e grave com a service role; proteger com um token próprio e desligar depois. Nunca deixar o token no repositório.
Deno.serve(() => new Response(JSON.stringify({ erro: 'desligada' }), { status: 410, headers: { 'Content-Type': 'application/json' } }));
