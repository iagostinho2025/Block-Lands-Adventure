# Checklist de Isolamento — Modo Clássico

Objetivo: garantir que qualquer alteração afete somente o modo clássico, sem regressão nos modos Aventura e Blitz.

## 1) Pontos de entrada
- Confirmar o gatilho do clássico: `btn-mode-casual` → `startClassicMode()` em `js/game.js`.
- Evitar adicionar novos gatilhos fora desse fluxo.

## 2) Guardas obrigatórias por modo
- Toda lógica nova do clássico deve estar dentro de: `if (this.currentMode === 'classic') { ... }`.
- Para funções chamadas por múltiplos modos, usar early return: `if (this.currentMode !== 'classic') return;`.

## 3) Estado isolado
- Usar apenas `this.classicState.*` para regras do clássico.
- Não reutilizar/alterar estado de aventura: `this.currentGoals`, `this.bossState`, `this.heroState`, `this.currentLevelConfig`.
- Não misturar `this.score` (genérico) com `this.classicState.score`.

## 4) Persistência isolada (localStorage)
- Usar chaves próprias do clássico (ex.: prefixo `classic_*` ou `blocklands_classic_*`).
- Não alterar chaves usadas pela aventura (ex.: `blocklands_savestate`, progresso de mundos, desbloqueios).

## 5) UI isolada
- Alterar apenas elementos do clássico:
- `#classic-stats`, `#classic-missions`, `#classic-score`, `#classic-level`, `#classic-best`.
- Não alterar HUDs da aventura:
- `#goals-area`, HUD de boss, seleção de mundos, story/campfire.
- Sempre garantir que `startAdventureLevel()` continue escondendo o HUD clássico.

## 6) Recompensas e economia
- Qualquer recompensa nova deve checar modo antes: `if (this.currentMode !== 'classic') return;`.
- Evitar alterar recompensas globais sem guarda por modo.

## 7) Missões do clássico
- Novos eventos/contadores de missão devem ser disparados somente no clássico.
- Se o gatilho estiver em função compartilhada (ex.: `checkLines`), envolver com guarda por modo.

## 8) Efeitos visuais do clássico
- Condicionar efeitos específicos ao clássico:
- `this.currentMode === 'classic' && this.classicState.visualV1`.
- Evitar mudar efeitos base usados por aventura sem guarda por modo.

## 9) Funções compartilhadas (zonas sensíveis)
- Ao mexer em funções centrais, sempre isolar o que for clássico:
- `checkLines(...)`, `renderGrid()`, `resetGame()`, handlers de drop/placement.
- Preferir adicionar blocos condicionais do clássico, em vez de reescrever fluxos inteiros.

## 10) Smoke tests mínimos (antes/depois)
- Clássico:
- Inicia, pontua, sobe nível, combo quebra após 3s, missões progridem, game over.
- Aventura:
- Entra em um nível e confirma que `#classic-stats` e `#classic-missions` não aparecem.
- Blitz:
- Abrir o modo (ou o alerta de “em breve”) e confirmar que nada mudou visualmente.

## 11) Estratégia de implementação segura
- Fazer mudanças pequenas e guardadas por modo.
- Evitar refactors amplos antes de estabilizar a alteração do clássico.
- Se precisar refatorar, primeiro extrair helpers mantendo o comportamento idêntico.
