# Play Store Test Matrix

## Devices (minimum)
- 1x Android low-end (4 GB RAM)
- 1x Android mid-range (6 GB RAM)
- 1x Android high-end (8+ GB RAM)

## Scenarios
1. First launch (online)
2. First launch (offline)
3. Return launch after force close
4. Long play session (30 min)
5. World map navigation through all worlds
6. Elite/Boss battles in all worlds
7. Store purchase flow (success + insufficient crystals)
8. Language switch PT-BR <-> EN
9. Reduced motion enabled in system settings
10. App update with existing cache/service worker

## Pass Criteria
- No crash or white screen
- No blocked UI controls
- Boss/elite overlays aligned and readable
- No corrupted glyphs in gameplay HUD
- Average FPS >= 55 on mid-range device
- No critical errors in `blocklands_diag_events`

## Regression Focus
- Boss name animation to HP bar
- World backgrounds per elite/boss level
- Touch drag/drop precision on dock and board
- Pause/resume and audio unlock flow
