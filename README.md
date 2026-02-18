# Block Lands - Adventure

> Jogo de puzzle em JavaScript Vanilla com tres modos: Classico, Aventura e Blitz.

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20Web-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## Sobre o jogo

Block Lands mistura puzzle de encaixe em grade 8x8 com progressao de campanha, bosses, economia e sistemas de conta (XP/rank, conquistas e loja).

### Modos de jogo

- Classico: foco em score, combos e sobrevivencia (sem objetivo de fase).
- Aventura: campanha por mundos com fases, bosses, obstaculos e progressao.
- Blitz: corrida contra o tempo com meta de completar a palavra "BLOCK LANDS".

---

## Mundos e fases

Os dados de campanha ficam em `js/modules/data/levels.js`.

- Mundo 0 (tutorial): 1 fase de boss (id 0).
- Mundo 1 (Fogo): fases 1-20.
- Mundo 2 (Floresta): fases 21-40.
- Mundo 3 (Montanha): fases 41-60.
- Mundo 4 (Deserto): fases 61-80.
- Mundo 5 (Castelo): fases 81-100.

Total atual: **101 fases** (1 tutorial + 100 aventura).

---

## Diferencas entre os modos

### 1) Classico

- Inicializado por `startClassicMode` em `js/modules/game/mode-starters.js`.
- Usa score por linhas em `js/modules/game/classic-mode.js`:
  - 1 linha: 100
  - 2 linhas: 300
  - 3 linhas: 600
  - 4 linhas: 1000
- Exibe HUD proprio de score/recorde.
- Fecha partida quando nao ha jogadas possiveis e mostra modal de resultado classico.

### 2) Aventura

- Inicializado por `startAdventureLevel` em `js/modules/game/mode-starters.js`.
- Cada fase carrega metas, itens, obstaculos e, quando aplicavel, boss.
- Vitoria:
  - fase normal: completar todos os objetivos (`checkVictoryConditions`);
  - fase boss: reduzir HP do boss a zero.
- Tem save/restore de partida ativa por fase (`blocklands_savestate`).
- Progressao global de fase usa `blocklands_progress_main`.

### 3) Blitz

- Inicializado por `startBlitzMode` e controlado por `BlitzModeController` (`js/modules/modes/blitz-mode.js`).
- Tempo base por ciclo: 10s.
- Cada linha limpa avanca o preenchimento da palavra "BLOCK LANDS" e adiciona bonus de tempo.
- Condicoes:
  - vitoria: completar todos os blocos da palavra;
  - derrota: timer zerar.

---

## Arquitetura tecnica

### Stack

- Frontend: HTML5 + CSS3 + JavaScript Vanilla (ES Modules).
- Renderizacao: DOM (tabuleiro, HUD e telas).
- Persistencia: localStorage.
- PWA: `service-worker.js` + `manifest.json`.

### Estrutura de codigo

```text
index.html                 # Tela unica com todas as "screens"
js/app.js                  # Bootstrap da aplicacao (Game + SW + diagnostico)
js/game.js                 # Orquestrador central (classe Game)
js/modules/
  data/levels.js           # Configuracao dos mundos e fases
  modes/blitz-mode.js      # Controlador dedicado do modo Blitz
  game/                    # Modulos de gameplay (drag, grid, goals, HUD, resultados, save)
  audio.js                 # Sistema de audio
  effects.js               # Sistema visual/efeitos
  i18n.js                  # Internacionalizacao
  achievements.js          # Conquistas
  progression.js           # XP/rank
assets/                    # CSS, imagens, inimigos, sons, icones
```

### Padrao arquitetural

- `Game` centraliza estado e chama funcoes modulares.
- Modulos em `js/modules/game` isolam responsabilidades (SRP pragmatico).
- Mudanca de tela/estado visual via classes CSS em `#app` (`screen-router`).

---

## Persistencia (localStorage)

Principais chaves atuais:

- `blocklands_settings`
- `blocklands_progress_main`
- `blocklands_savestate`
- `blocklands_crystals`
- `blocklands_player_class`
- `classic_best_score`
- `classic_missions_total`
- `classic_missions_best_streak`
- `blocklands_powerup_magnet`
- `blocklands_powerup_rotate`
- `blocklands_powerup_swap`

---

## Funcionalidades implementadas

- Modo Classico.
- Modo Aventura completo (mundos 0-5, fases 0-100).
- Modo Blitz funcional.
- Sistema de bosses e HUD de combate.
- Save/load de partida ativa da aventura.
- Economia de cristais e recompensas.
- Loja de itens/power-ups.
- Sistema de conquistas.
- Sistema de progressao (XP/rank).
- Internacionalizacao (pt-BR/en).

---

## Como executar

Use servidor local na raiz do projeto.

```bash
# Python
python -m http.server 8000

# Node
npx http-server -p 8000
```

Depois abra `http://localhost:8000`.

---

## Licenca

Copyright (c) 2025.
Todos os direitos reservados.
Software proprietario.

