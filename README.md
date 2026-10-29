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
- P: pausar; R ou “Novo mapa”: abrir a transição com a loja; confirme para ir ao próximo mapa.

Elimine os três monstros sem encostar neles. Armadilhas ativas também matam o jogador: buraco e fogo ao contato, pedra no momento da queda. Prepare de fora do círculo (entre 40 e 65 unidades de distância); você não pode preparar de dentro da área perigosa. Armadilhas acionadas são consumidas, mesmo quando o alvo resiste. Há três tipos de criatura, identificáveis por marcas neutras; descubra suas vulnerabilidades por tentativa e erro. Cada mapa contém um de cada tipo e duas armadilhas de cada categoria; desperdiçar recursos pode tornar a partida impossível, exigindo um novo mapa.

Audição é circular, com metade do alcance antigo (107,5 unidades andando e 137,5 correndo), e detecta movimento mesmo atrás de obstáculos. Visão usa um cone de 60 graus com o alcance antigo (215 unidades andando e 275 correndo), bloqueado pelos obstáculos. Espaço emite um chamado de 230 unidades. O desenho do cone mostra a área visível; a circunferência tracejada mostra o alcance auditivo. Após detectar, monstros perseguem por alguns segundos mesmo sem contato. Velocidades em unidades/segundo: caminhada 140, perseguição 175, corrida 240. Sem melhorias, só a corrida permite abrir distância; a caminhada no nível máximo chega a 179 e supera os monstros.

Seis biomas visuais, com posições de obstáculos parcialmente aleatórias. Mecânicas iguais entre biomas nesta versão. Interface e controles destinados a teclado e computador; sem controles de toque, áudio ou física dinâmica.

## Validar

```sh
npm test
```

Os testes cobrem alcance/estado das armadilhas, consumo contra inimigos resistentes, perigo ao jogador, audição, cone de visão, velocidades, colisões e linha de visão. Para testar jogabilidade, inicie o servidor e jogue uma partida no navegador.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica o jogo estático em pushes para `main`. Em Settings → Pages do repositório, selecione **GitHub Actions** como fonte de publicação. Se a primeira execução falhar porque Pages ainda não foi habilitado, habilite e execute novamente o workflow em Actions. O endereço esperado é `https://almjr25.github.io/Hunt/`.

## Anotações de campo

Cada rodada sorteia três anotações (?), uma para cada marca de criatura. Elas podem aparecer por todo o mapa, inclusive no território dos monstros, mas nunca dentro de obstáculos ou sobre armadilhas. Passe perto para recolher automaticamente: a informação fica no caderno à direita do mapa até o fim da rodada. Recolher não pausa o jogo. Um novo mapa limpa o caderno e sorteia novas posições. As vulnerabilidades continuam fixas entre rodadas, permitindo aprender também por tentativa e erro.

## Recompensas e suprimentos

Cada monstro eliminado rende **50 moedas**, creditadas imediatamente, inclusive se você perder depois. Entre rodadas (tela inicial, vitória ou derrota), compre na loja da tela de transição, junto ao botão do próximo mapa:

| Item | Preço | Efeito |
| --- | --- | --- |
| Reserva de fôlego | 75 | +20 de fôlego máximo por nível, até 3 níveis (160 no total) |
| Passos leves | 100 | +13 na caminhada por nível, até 3 níveis (179, acima dos 175 dos monstros) |
| Isca sonora | 40 | B coloca uma isca na posição atual por 6 segundos; até 3 no inventário |
| Kit de reposição | 60 | T restaura uma armadilha consumida a menos de 65 unidades; prepare novamente com E; até 3 no inventário |

Moedas, melhorias e inventário ficam salvos no `localStorage` deste navegador e endereço, sem conta ou sincronização entre dispositivos. A limpeza dos dados do site remove o progresso. Se o armazenamento estiver indisponível, o jogo continua com progresso apenas na sessão. Melhorias permanentes entram em vigor na próxima rodada. Consumíveis só são gastos ao usar; kits não são gastos se não houver armadilha usada próxima.

Iscas emitem som em um raio de 900 unidades, inclusive através de obstáculos. Monstros que detectam o jogador priorizam persegui-lo; fora desse contato, dirigem-se ao emissor enquanto ele estiver ativo. Não existe investigação de última posição conhecida.

A loja aparece somente na tela de transição (incluindo início, vitória, derrota ou abandono da rodada), junto ao botão do próximo mapa. Pausar não abre compras. O caderno permanece à direita do cenário. A cada rodada são sorteadas seis armadilhas, duas de cada tipo, com espaço livre para prepará-las e sem sobreposição com obstáculos, outras armadilhas ou os pontos de spawn.
