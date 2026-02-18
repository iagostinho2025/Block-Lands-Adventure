export function perfStart(game, label) {
    if (!game._perf || !game._perf.enabled) return 0;
    return performance.now();
}

export function perfEnd(game, label, startTime) {
    if (!startTime || !game._perf || !game._perf.enabled) return;
    const now = performance.now();
    const dt = now - startTime;
    const totals = game._perf.totals;
    const counts = game._perf.counts;
    const max = game._perf.max;

    totals[label] = (totals[label] || 0) + dt;
    counts[label] = (counts[label] || 0) + 1;
    if (!max[label] || dt > max[label]) max[label] = dt;

    if ((now - game._perf.lastReport) >= 5000) {
        game._perf.lastReport = now;
        const lines = [];
        for (const key of Object.keys(totals)) {
            const avg = totals[key] / Math.max(1, counts[key]);
            lines.push(`${key}: avg ${avg.toFixed(2)}ms (max ${max[key].toFixed(2)}ms, n=${counts[key]})`);
        }
        if (lines.length > 0) {
            console.log('[PERF]', lines.join(' | '));
        }
        game._perf.totals = Object.create(null);
        game._perf.counts = Object.create(null);
        game._perf.max = Object.create(null);
    }
}

export function initPerformanceMode(game) {
    const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;

    game._autoPerformanceProfile = (prefersReducedMotion || isMobile || lowCores || lowMemory) ? 'lite' : 'full';
    game.applyPerformancePreference();
}

export function applyPerformancePreference(game) {
    const mode = game.settings?.performanceMode || 'auto';

    if (mode === 'stable60') {
        game.performanceProfile = 'lite';
        game._runtimePerfDowngrade = false;
    } else if (mode === 'quality') {
        game.performanceProfile = 'full';
        game._runtimePerfDowngrade = false;
    } else {
        game.performanceProfile = game._autoPerformanceProfile || 'full';
    }

    if (game.effects) {
        const disableComboHud = mode === 'stable60' || (
            game._isMobileDevice &&
            mode === 'auto' &&
            game.performanceProfile === 'lite'
        );
        if (typeof game.effects.setForceQuality === 'function') {
            game.effects.setForceQuality(mode === 'stable60' ? 'low' : 'auto');
        }
        if (typeof game.effects.setDisableComboHud === 'function') {
            game.effects.setDisableComboHud(disableComboHud);
        }
    }

    game.applyPerformanceClass();
}

export function applyPerformanceClass(game) {
    const app = document.getElementById('app');
    if (!app) return;
    const useLite = game.performanceProfile === 'lite' || game._runtimePerfDowngrade;
    const perfMode = game.settings?.performanceMode || 'auto';
    const useMobileLiteHard = !!(
        game._isMobileDevice &&
        (perfMode === 'stable60' || (perfMode === 'auto' && useLite))
    );
    app.classList.toggle('perf-lite', useLite);
    app.classList.toggle('mobile-lite-hard', useMobileLiteHard);
}

export function ensurePerfIndicator(game, deps = {}) {
    const { fpsIndicatorEnabled = false } = deps;

    if (!fpsIndicatorEnabled) return null;
    if (game._perfIndicatorEl && game._perfIndicatorEl.isConnected) return game._perfIndicatorEl;
    if (!game.screenGame) return null;

    const el = document.createElement('div');
    el.id = 'perf-fps-indicator';
    el.className = 'perf-fps-indicator';
    el.setAttribute('aria-live', 'off');
    el.textContent = 'FPS --';
    game.screenGame.appendChild(el);
    game._perfIndicatorEl = el;
    return el;
}

export function updatePerfIndicator(game, fpsValue) {
    const el = game.ensurePerfIndicator();
    if (!el) return;

    const fps = Math.max(0, Math.round(fpsValue || 0));
    const tier = (game.performanceProfile === 'lite' || game._runtimePerfDowngrade) ? 'LITE' : 'FULL';
    el.textContent = `FPS ${fps} | ${tier}`;
    el.classList.remove('fps-good', 'fps-mid', 'fps-bad', 'hidden');
    if (fps >= 55) el.classList.add('fps-good');
    else if (fps >= 35) el.classList.add('fps-mid');
    else el.classList.add('fps-bad');
}

export function startFpsMonitor(game, deps = {}) {
    const {
        perfLiteFpsDowngrade = 45,
        perfLiteFpsRecover = 57,
        perfLiteDowngradeFrames = 36,
        perfLiteRecoverFrames = 120,
        fpsIndicatorEnabled = false
    } = deps;

    if (game._fpsMonitorRaf) return;
    game._fpsMonitorLastTs = performance.now();
    game._fpsLowStreak = 0;
    game._fpsHighStreak = 0;
    game._fpsSmoothed = 0;
    game._fpsUiLastUpdate = 0;
    const indicator = game.ensurePerfIndicator();
    if (indicator) indicator.classList.remove('hidden');

    const tick = (now) => {
        const dt = now - game._fpsMonitorLastTs;
        game._fpsMonitorLastTs = now;

        const fps = dt > 0 ? (1000 / dt) : 60;
        game._fpsSmoothed = game._fpsSmoothed > 0
            ? (game._fpsSmoothed * 0.88) + (fps * 0.12)
            : fps;

        const perfMode = game.settings?.performanceMode || 'auto';
        if (game.effects && typeof game.effects.setDisableComboHud === 'function') {
            const lowFpsMobile = game._isMobileDevice && perfMode === 'auto' && game._fpsSmoothed < 57;
            const forceDisableComboHud = perfMode === 'stable60' || lowFpsMobile || game._runtimePerfDowngrade;
            game.effects.setDisableComboHud(forceDisableComboHud);
        }
        if (game.effects && typeof game.effects.setRuntimeFps === 'function') {
            game.effects.setRuntimeFps(game._fpsSmoothed);
        }

        if (perfMode === 'auto') {
            if (fps < perfLiteFpsDowngrade) {
                game._fpsLowStreak++;
                game._fpsHighStreak = 0;
            } else if (fps > perfLiteFpsRecover) {
                game._fpsHighStreak++;
                game._fpsLowStreak = 0;
            }

            if (!game._runtimePerfDowngrade && game._fpsLowStreak >= perfLiteDowngradeFrames) {
                game._runtimePerfDowngrade = true;
                game.applyPerformanceClass();
            } else if (
                game._runtimePerfDowngrade &&
                game.performanceProfile !== 'lite' &&
                game._fpsHighStreak >= perfLiteRecoverFrames
            ) {
                game._runtimePerfDowngrade = false;
                game.applyPerformanceClass();
            }
        } else if (game._runtimePerfDowngrade) {
            game._runtimePerfDowngrade = false;
            game.applyPerformanceClass();
        }

        if (fpsIndicatorEnabled && now - game._fpsUiLastUpdate >= 180) {
            game._fpsUiLastUpdate = now;
            game.updatePerfIndicator(game._fpsSmoothed);
        }

        game._fpsMonitorRaf = requestAnimationFrame(tick);
    };

    game._fpsMonitorRaf = requestAnimationFrame(tick);
}

export function stopFpsMonitor(game) {
    if (game._fpsMonitorRaf) {
        cancelAnimationFrame(game._fpsMonitorRaf);
        game._fpsMonitorRaf = 0;
    }
    game._fpsLowStreak = 0;
    game._fpsHighStreak = 0;
    game._fpsSmoothed = 0;
    game._fpsUiLastUpdate = 0;
    if (game._perfIndicatorEl) {
        game._perfIndicatorEl.classList.add('hidden');
    }
}

export function restartCssAnimationClass(game, el, className) {
    if (!el || !className) return;
    if (!game._animRestartMap) game._animRestartMap = new WeakMap();

    const prev = game._animRestartMap.get(el);
    if (prev) {
        if (prev.raf1) cancelAnimationFrame(prev.raf1);
        if (prev.raf2) cancelAnimationFrame(prev.raf2);
    }

    el.classList.remove(className);
    const state = { raf1: 0, raf2: 0 };
    state.raf1 = requestAnimationFrame(() => {
        state.raf2 = requestAnimationFrame(() => {
            el.classList.add(className);
            game._animRestartMap.delete(el);
        });
    });
    game._animRestartMap.set(el, state);
}
