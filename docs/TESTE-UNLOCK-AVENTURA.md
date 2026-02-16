# Checklist de Teste: Liberar Todas as Fases (Modo Aventura)

## O que foi adicionado
- Um flag de teste no código para liberar todas as fases do modo aventura.
- Ele fica no início de `js/game.js`:
  - `DEBUG_UNLOCK_ALL_ADVENTURE`
  - `DEBUG_UNLOCK_ALL_ADVENTURE_LEVEL`

Quando esse flag está ligado, a função `loadProgress()` retorna um valor alto
para o progresso do modo aventura, liberando mundos e fases no mapa.

## Como habilitar (para teste)
1. Abra `js/game.js`.
2. Altere:
   - `const DEBUG_UNLOCK_ALL_ADVENTURE = true;`

## Como reverter (após o teste)
1. Abra `js/game.js`.
2. Altere:
   - `const DEBUG_UNLOCK_ALL_ADVENTURE = false;`

## Observações
- Esse ajuste não muda o modo clássico.
- Ele não altera o save real enquanto estiver ligado, pois `saveProgress()` lê o
  progresso "forçado" e pode deixar de gravar avanço real durante o teste.
- Ao desligar, o jogo volta a usar o progresso salvo normalmente.
