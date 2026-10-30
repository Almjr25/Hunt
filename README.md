# HUNT

Protótipo de sobrevivência tática para navegador, com JavaScript e Canvas, sem dependências externas de execução. Requer Node.js 18+ e navegador de computador com teclado e mouse.

## Executar

```sh
npm start
```

O servidor usa a porta 3000, configurável por `PORT`. Em ambiente em nuvem, use o encaminhamento de porta da sua ferramenta. O workflow `.github/workflows/pages.yml` publica os arquivos estáticos em pushes para `main`, com GitHub Actions selecionado em Settings → Pages. Endereço esperado: https://almjr25.github.io/Hunt/.

## Controles

| Controle | Ação |
| --- | --- |
| WASD | Caminhar |
| Shift | Correr com fôlego limitado |
| E, segurado por 1s | Preparar armadilha próxima, de fora do círculo |
| E, pressionado novamente | Soltar uma pedra já preparada |
| Espaço | Fazer barulho para atrair criaturas a até 230 unidades |
| C / botão Fabricar | Abrir ou fechar a bancada de campo; o jogo pausa enquanto ela está aberta |
| Q, segurado parado por 2s e solto | Carregar e disparar uma flecha venenosa; soltar antes ou mover cancela a mira sem gastar flechas |
| Mouse, enquanto Q está pressionado | Orientar a mira |
| F | Ativar/desativar o voo, se a capa foi fabricada |
| 1 / 2 / 3 | Colocar buraco / poça inflamável / pedra suspensa do inventário |
| 4 | Colocar uma armadilha de imobilização do inventário |
| B | Colocar isca sonora, ativa por 6s em raio de 900 unidades |
| T | Restaurar uma armadilha usada próxima; precisa ser preparada novamente |
| P | Pausar/continuar |
| O / botão Controles | Configurar teclas e botões do mouse |
| R / Novo mapa | Encerrar a tentativa e abrir a transição; confirmar avança a rodada |

O arco está disponível desde o início, sem receita. É necessário fabricar a munição. Flechas viajam pelo cenário, podem errar e param ao atingir um obstáculo ou a primeira criatura. O alcance é 900 unidades. Animais comuns morrem **5 segundos de jogo** após uma flecha. O urso precisa de **duas flechas**: o primeiro acerto registra uma dose, sem iniciar morte; o segundo inicia veneno letal de **10 segundos**. A dose da primeira flecha permanece durante a rodada. Novos acertos não reiniciam o prazo. Pausa e fabricação suspendem os cronômetros.

## Espécies e rodadas

Cada rodada tem duas cobras, dois morcegos, dois lobos e dois javalis, com formas simples, cores e nomes no mapa. As rodadas **2, 4, 6…** acrescentam **um e apenas um urso**, maior e resistente a todas as armadilhas letais convencionais. A vitória exige eliminar todas as criaturas, incluindo o urso quando presente.

A rodada avança ao confirmar o próximo mapa após vitória, derrota ou abandono. Abrir/fechar a bancada ou pausar não avança a rodada. Recarregar a página mantém o número salvo e gera outra tentativa nessa mesma rodada. Zerar progresso volta à rodada 1.

| Espécie | Armadilha natural eficaz | Recursos deixados |
| --- | --- | --- |
| Cobra | Buraco | 2 presas |
| Morcego | Pedra suspensa | 2 asas |
| Lobo | Fogo | 2 couros |
| Javali | Buraco | 2 ossos |
| Urso | Nenhuma: exige flecha venenosa | 2 couros + 2 ossos |

Não existem mais moedas nem pagamentos por eliminação. Os recursos aparecem em um pacote no local da morte: passe a até 28 unidades para recolher. Só os recursos recolhidos ficam salvos após derrota ou abandono. Na vitória, todos os pacotes restantes são recolhidos automaticamente antes da tela de transição.

O urso continua perigoso enquanto envenenado: não morre no impacto. Use a imobilização para ganhar a janela de mira e acertar as duas flechas; depois fuja até completar dez segundos após a segunda. A armadilha prende o alvo por **5 segundos**, sem causar dano, inclusive em morcegos e no urso. O contato direto com qualquer criatura viva, mesmo presa, continua fatal.

## Fabricação

A bancada fica na transição e também pode ser aberta com C durante a caçada. Isso permite caçar cobras e fabricar flechas na própria rodada do urso. Cada fabricação debita os recursos indicados; receitas indisponíveis ficam desabilitadas. Recursos, munição, itens e melhorias são persistidos no navegador.

| Receita | Custo | Resultado / limite |
| --- | --- | --- |
| Flechas venenosas | 1 presa | 3 flechas; até 99 |
| Capa de voo | 2 asas | Permanente, uma unidade; F ativa/desativa |
| Imobilização | 1 couro + 1 osso | Uma armadilha portátil; até 6 |
| Reserva de fôlego | 2 couros | +20 de capacidade por nível, até 3 níveis (160 no total) |
| Passos leves | 2 ossos | +13 na caminhada por nível, até 3 níveis (179 no total) |
| Isca sonora | 1 asa | Uma unidade; até 3 |
| Kit de reposição | 1 osso | Uma unidade; até 3 |
| Buraco, poça ou pedra portátil | 2 couros + 2 ossos | Uma armadilha da categoria escolhida; até 3 por categoria |

A capa permite atravessar **somente buracos** em voo. Não protege de fogo, pedras, criaturas ou obstáculos. Desativar o voo em cima de um buraco ativo mata o jogador. O voo inicia desativado a cada rodada.

Todas as armadilhas portáteis são colocadas 85 unidades à frente, inicialmente desarmadas. É preciso espaço livre longe de obstáculos, criaturas, notas e outras armadilhas. Falhas de colocação não gastam itens. Prepare com E depois de colocar. Armadilhas utilizadas são consumidas mesmo quando a criatura resiste. A imobilização não é letal ao jogador; buraco, fogo e pedra mantêm os perigos anteriores. Itens não colocados permanecem no inventário; armadilhas colocadas pertencem à rodada atual.

## Cenário e percepção

Seis biomas visuais, em um mundo de 2.500 × 1.500 unidades com câmera móvel e minimapa. Cada mapa distribui doze armadilhas naturais (quatro de cada tipo) e até 28 obstáculos aleatórios, com corredores e pontos de nascimento livres. O minimapa mostra criaturas, notas e armadilhas. O caderno fica à direita do cenário.

Há quatro anotações (?) por rodada, uma para cada espécie comum. Podem aparecer em qualquer área livre, inclusive no território das criaturas. Passar perto recolhe e registra a pista no caderno. As pistas são reiniciadas a cada mapa; as vulnerabilidades se mantêm entre rodadas.

Audição: circular, exige movimento e atravessa obstáculos, em alcance de 107,5 andando ou 137,5 correndo. Visão: cone de 60 graus com alcance de 215 ou 275, bloqueado por obstáculos. Após detectar o jogador, as criaturas continuam perseguindo sem limite de tempo ou distância: perder apenas a visão não rompe a perseguição. É necessário atravessar lama e sair da detecção de cada perseguidor. Ao perder o rastro, a criatura patrulha perto do local onde o perdeu; não retorna ao ponto inicial. Iscas atraem criaturas que não estão perseguindo o jogador para o emissor ativo. Velocidades: caminhada inicial 140, perseguição 175, corrida 240. No nível máximo de caminhada, 179, o jogador ultrapassa as criaturas.

## Progresso e compatibilidade

O save usa `localStorage` deste navegador e endereço, sem conta ou sincronização entre dispositivos. Saves antigos preservam melhorias e suprimentos já adquiridos; moedas antigas são descontinuadas, e novos recursos começam vazios. A rodada começa em 1 se não havia contador salvo. Se o armazenamento estiver indisponível, o jogo continua com progresso apenas na sessão.

Zerar progresso, com confirmação, apaga somente o save deste jogo: recursos, rodada, melhorias, inventário e controles personalizados. Cancelar mantém o progresso. Recarregar a página ou limpar dados do site tem os efeitos usuais do armazenamento local.

## Validação

```sh
npm test
```

A suíte verifica espécies, periodicidade do urso, geração de mapas, vulnerabilidades, recursos, receitas, migração de save, colisões, percepção, capa, temporização da mira, projéteis, imobilização e veneno. Uma cadeia de integração cobre recursos → fabricação → prender urso → mirar → acertar → morte após dez segundos. Para validar a interface, execute uma partida no navegador.

## Controles personalizados e ícones

O menu **Controles** está disponível no cabeçalho, nas telas de transição e pelo atalho padrão O. Abrir o menu pausa a simulação e cancela a mira. Clique na ação e pressione uma tecla ou um botão de mouse; Esc cancela a captura e, fora da captura, fecha o menu. Um conflito troca os atalhos das duas ações, mantendo cada ação acessível. Há suporte a letras, números, pontuação, setas, modificadores, teclas de navegação, teclado numérico, teclas de função e cinco botões de mouse. Atalhos reservados pelo navegador ou sistema podem não ser interceptáveis.

Cada ação usa uma tecla ou botão; combinações de teclas não são suportadas. Movimento usa WASD por padrão; setas podem ser atribuídas pelo menu. Dicas, controles do rodapé e indicadores do inventário acompanham as mudanças. Restaurar controles padrão não afeta recursos ou melhorias. Os atalhos ficam salvos separadamente em `hunt-controls-v1`, no mesmo navegador; zerar todo o progresso também os remove.

Recursos, custos de receitas, itens e inventários usam ícones SVG locais com quantidades. Passe o mouse para ver o nome; os componentes incluem rótulos acessíveis. A bancada também mostra os recursos disponíveis com os mesmos ícones dos custos.

## Lama e perda de rastro

Cada rodada sorteia oito poços de lama, visíveis no cenário e como círculos marrons no minimapa. Os poços não são consumidos. Entrar neles **a pé** aplica o estado **enlameado por 12 segundos**, renovado enquanto permanecer dentro. Voar sobre a lama não aplica o efeito. Sair da lama inicia a contagem restante, visível no caderno e no halo marrom do jogador.

Um monstro só perde o rastro enquanto o jogador está enlameado **e** fora da visão **e** da audição daquele monstro. A lama não torna o jogador invisível nem silencioso. Cada perseguidor decide separadamente; um monstro que ainda detecta o jogador continua perseguindo. O fim do efeito não recupera automaticamente uma perseguição perdida, mas qualquer nova detecção a inicia novamente. Lama, veneno e demais cronômetros ficam parados durante os menus de pausa, fabricação e controles.
