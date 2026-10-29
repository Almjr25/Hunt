# HUNT

Protótipo de sobrevivência tática para navegador, feito com JavaScript e Canvas, sem dependências externas. Requer Node.js 18 ou superior.

## Jogar

```sh
npm start
```

Abra `http://localhost:3000` no seu computador. No ambiente em nuvem, use o encaminhamento de porta disponibilizado pela sua ferramenta. `PORT` altera a porta (padrão: 3000).

- WASD / setas: mover; Shift: correr com fôlego limitado.
- Segure E perto de uma armadilha por um segundo para preparar. O jogador fica parado durante o preparo.
- Espaço: fazer barulho para atrair monstros próximos, inclusive atrás de obstáculos.
- Buraco e fogo: atraia um monstro para o círculo preparado.
- Pedra: depois de preparar, solte E e pressione novamente quando o monstro estiver no círculo. É possível desperdiçar a pedra.
- P: pausar; R ou “Novo mapa”: reiniciar em outro bioma.

Elimine os três monstros sem encostar neles. Armadilhas ativas também matam o jogador: buraco e fogo ao contato, pedra no momento da queda. Prepare de fora do círculo (entre 40 e 65 unidades de distância); você não pode preparar de dentro da área perigosa. Armadilhas acionadas são consumidas, mesmo quando o alvo resiste. Há três tipos de criatura, identificáveis por marcas neutras; descubra suas vulnerabilidades por tentativa e erro. Cada mapa contém um de cada tipo e duas armadilhas de cada categoria; desperdiçar recursos pode tornar a partida impossível, exigindo um novo mapa.

Audição é circular, com metade do alcance antigo (107,5 unidades andando e 137,5 correndo), e detecta movimento mesmo atrás de obstáculos. Visão usa um cone de 60 graus com o alcance antigo (215 unidades andando e 275 correndo), bloqueado pelos obstáculos. Espaço emite um chamado de 230 unidades. O desenho do cone mostra a área visível; a circunferência tracejada mostra o alcance auditivo. Após detectar, monstros perseguem por alguns segundos mesmo sem contato. Velocidades em unidades/segundo: caminhada 140, perseguição 175, corrida 240. Só a corrida permite abrir distância.

Seis biomas visuais, com posições de obstáculos parcialmente aleatórias. Mecânicas iguais entre biomas nesta versão. Interface e controles destinados a teclado e computador; sem controles de toque, áudio ou física dinâmica.

## Validar

```sh
npm test
```

Os testes cobrem alcance/estado das armadilhas, consumo contra inimigos resistentes, perigo ao jogador, audição, cone de visão, velocidades, colisões e linha de visão. Para testar jogabilidade, inicie o servidor e jogue uma partida no navegador.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica o jogo estático em pushes para `main`. Em Settings → Pages do repositório, selecione **GitHub Actions** como fonte de publicação. Se a primeira execução falhar porque Pages ainda não foi habilitado, habilite e execute novamente o workflow em Actions. O endereço esperado é `https://almjr25.github.io/Hunt/`.
