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

Elimine os três monstros sem encostar neles. Você atravessa suas próprias armadilhas sem sofrer dano. Os monstros enxergam a curta distância, têm visão bloqueada pelos obstáculos e perseguem por alguns segundos após perder contato visual. Correr aumenta a distância em que você é percebido. Andar é mais rápido que os monstros; planeje suas rotas e reserve o fôlego para emergências.

Seis biomas visuais, com posições de obstáculos parcialmente aleatórias. Mecânicas iguais entre biomas nesta versão. Interface e controles destinados a teclado e computador; sem controles de toque, áudio ou física dinâmica.

## Validar

```sh
npm test
```

Os testes cobrem alcance/estado das armadilhas, colisões e linha de visão. Para testar jogabilidade, inicie o servidor e jogue uma partida no navegador.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica o jogo estático em pushes para `main`. Em Settings → Pages do repositório, selecione **GitHub Actions** como fonte de publicação. Se a primeira execução falhar porque Pages ainda não foi habilitado, habilite e execute novamente o workflow em Actions. O endereço esperado é `https://almjr25.github.io/Hunt/`.
