# Padronizacao de Bosses e Elites (Aventura)

## Objetivo
Aplicar o mesmo padrao visual e de interacao dos bosses/elites (sprite grande, centralizado, nome acima da barra de HP, sem corte e com arrasto do dock estavel no mobile) para novas fases.

## Arquivos chave
- `js/game.js`
- `assets/css/screens/_boss-battle.css`
- `assets/css/screens/_game.css`
- `service-worker.js`

## Padrao atual (referencia)
- Fogo fase 20 (`ignis`)
- Fogo fase 15 (`pyra`)
- Fogo fase 10 (`magmor`)
- Guardiao fase 0 (`guardian` -> nome exibido `AEGON`)

## Onde configurar cada boss/elite
No `js/game.js`, funcao `getFireBossOverlayConfig()`:
- Cada boss/elite possui um bloco com:
  - `key`
  - `appClass`
  - `spriteScale`
  - `spriteOffsetY`
  - `nameOffsetX`
  - `nameOffsetY`
  - `spriteFilter` (opcional, para aura customizada)

### Exemplo de estrutura
```js
return {
  key: 'guardian_boss_0',
  appClass: 'boss-big-guardian',
  spriteScale: 1.7,
  spriteOffsetY: -20,
  nameOffsetX: -120,
  nameOffsetY: 115,
  spriteFilter: 'drop-shadow(...) drop-shadow(...) brightness(1.03)'
};
```

## Classe CSS de overlay (obrigatorio)
No `assets/css/screens/_boss-battle.css`, incluir a `appClass` nova nos grupos:
- Transform/offset do HUD (`.boss-ui-container` e `#boss-hp-hud`)
- Z-index do nome
- Z-index do HUD

Hoje as classes ativas sao:
- `boss-big-ignis`
- `boss-big-elite15`
- `boss-big-elite10`
- `boss-big-guardian`

## Nome do boss
O nome exibido vem de `js/modules/data/levels.js` no campo:
```js
boss: { id: '...', name: 'NOME_AQUI', ... }
```

## Aura/cor
- Aura padrao (fogo) e aplicada no overlay.
- Para customizar por boss, usar `spriteFilter` na config.
- Exemplo atual: Guardiao com tons de azul.

## Dock/arrasto (mobile)
Para manter arrasto estavel em boss/elite:
- `assets/css/screens/_game.css`:
  - `touch-action: none` em `.dock-slot`
  - `pointer-events: none` em `.dock-slot .draggable-piece`
- `assets/css/screens/_boss-battle.css`:
  - `#dock` com prioridade de camada em `level-type-elite`/`level-type-boss`
- `js/game.js`:
  - fallback global de toque para aventura em fases tipo `boss`

## Checklist para adicionar novo boss/elite
1. Adicionar/ajustar boss em `js/modules/data/levels.js` (id/nome/HP).
2. Incluir bloco no `getFireBossOverlayConfig()` com offsets iniciais.
3. Registrar `appClass` nova no array `overlayClasses` em `updateIgnisBossUiOverride()`.
4. Incluir a `appClass` nos grupos CSS de `_boss-battle.css`.
5. Testar em mobile:
   - sprite sem corte
   - nome na posicao correta
   - arrasto iniciando pelo slot inteiro (esquerda/centro/direita)
6. Ajuste fino:
   - tamanho: `spriteScale`
   - altura: `spriteOffsetY`
   - nome: `nameOffsetX` e `nameOffsetY`
   - aura: `spriteFilter` (se necessario)
7. Subir `CACHE_VERSION` em `service-worker.js` para forcar atualizacao no celular.

## Valores atuais de referencia rapida
- Guardiao (`AEGON`):
  - `spriteScale: 1.7`
  - `spriteOffsetY: -20`
  - `nameOffsetX: -120`
  - `nameOffsetY: 115`
  - `spriteFilter` azul
- Pyra:
  - `spriteScale: 1.8`
  - `nameOffsetX: -130`
- Magmor:
  - `spriteScale: 1.2`
  - `nameOffsetX: -104`
- Ignis:
  - `spriteScale: 2.0`
  - `nameOffsetX: -130`

## Observacoes
- Nao alterar classico/blitz ao ajustar aventura.
- Evitar mover logica de drag por frame; manter ajustes de input em `pointerdown/touchstart`.
- Se aparecer comportamento antigo em mobile, primeiro validar cache (Service Worker).
