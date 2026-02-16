# Play Store Release Checklist

## 1. Build e Assinatura
- Gerar `AAB` de release assinado com chave definitiva.
- Guardar `keystore` e senha em cofre seguro.
- Validar instalação limpa em Android 10, 12 e 14.

## 2. Qualidade Técnica
- Testar primeira abertura sem internet.
- Testar atualização de versão com cache antigo (service worker).
- Validar restore de progresso em reabertura do app.
- Validar ausência de travamentos em 30 minutos de jogo contínuo.
- Revisar `blocklands_diag_events` após testes para erros críticos.

## 3. Performance
- Alvo de FPS em aparelho médio: >= 55 FPS estável em gameplay.
- Verificar queda de FPS em lutas boss/elite e animações de nome.
- Confirmar que `perf-lite` e `mobile-lite-hard` entram quando necessário.
- Testar consumo de bateria por 20 minutos (sem aquecimento extremo).

## 4. UX e Acessibilidade
- Confirmar layout em telas pequenas e com notch.
- Validar `prefers-reduced-motion` (classe `reduced-motion`).
- Verificar legibilidade de HUD e botões em brilho baixo.
- Validar toques (sem ghost taps, sem botões sobrepostos).

## 5. Conteúdo da Loja (Play Console)
- Ícone 512x512 final.
- Feature graphic 1024x500.
- Pelo menos 8 screenshots reais (celular).
- Vídeo curto opcional de gameplay.
- Descrição curta e completa PT-BR e EN.

## 6. Compliance
- Política de privacidade publicada e linkada na Play Console.
- Declarar coleta local de diagnóstico (`localStorage`) sem envio externo.
- Classificação indicativa preenchida corretamente.
- Verificar uso de áudio/vibração conforme políticas.

## 7. Pós-Lançamento
- Definir meta de crash-free sessions >= 99%.
- Monitorar reviews nas primeiras 72h.
- Planejar patch de hotfix (janela de 24h) para bugs críticos.
- Congelar branch de release e tag: `v1.0.0-playstore`.
